//@flow
import { all, fork, call, put, takeLatest, select, take, takeEvery, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import uuid from 'uuid/v4';
import PeriodSelectorActions from 'components/PeriodSelector/period-selector.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import AdvancedSearchActionTypes from 'components/AdvancedSearch/advanced-search.actions';
import OverviewActionTypes, * as OverviewActions from 'components/Overview/overview.actions';
import { updateListSaleMethodUsing } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { OverviewTypes, Endpoints } from 'Constants';
import { setRemainder } from '../Appointment/appointment.actions';
import { checkMissingEmailByUser } from '../Contact/contact.actions';
import { getCurrentTimeZone } from 'lib/dateTimeService';
import { resetListOrganisation } from '../Organisation/organisation.actions';
import { isEmpty } from '../Quotations/Utils/checkIsEmpty';

const getRequestDataDefault = (requestData) => requestData;

type EndpointType = {
  list: string,
  count: string,
};

// const timezone = new Date().getTimezoneOffset() / -60;
let timeZone = getCurrentTimeZone();

const createFetchListSaga = (
  endPoint: EndpointType,
  overviewType: string,
  objectType: string,
  entityType: string,
  schema: {},
  mapRequestData: ({}) => {} = getRequestDataDefault,
  mapQuery: ({}) => {} = getRequestDataDefault
) => {
  const currentSession = {
    pageIndex: -1,
    pageSize: 25,
    sessionKey: uuid(),
  };

  return function* fetchList(clear: boolean): Generator<*, *, *> {
    const state = yield select();

    // const overview = state.overview[overviewType] || {};
    // const { lastFetch } = overview;
    // if (lastFetch && moment(lastFetch).valueOf() > moment().valueOf() - 1000){
    //   return;
    // }

    const pathName = state.router.location ? state.router.location.pathname : '';
    try {
      if (overviewType === OverviewTypes.Pipeline.Qualified) {
        const { listShow } = state.entities.qualifiedDeal.__COMMON_DATA;
        if (!listShow) {
          return;
        }
      }
      const { roleType } = state.ui.app;
      let roleValue = state.ui.app.activeRole;
      if (roleType === 'Person' && !roleValue) {
        roleValue = state.auth.userId;
      } else if (roleType === 'Company') {
        roleValue = undefined;
      }
      //bắt đầu request
      yield put(OverviewActions.startFetch(overviewType));
      if (clear) {
        currentSession.pageIndex = 0;
        currentSession.sessionKey = uuid();
      } else {
        currentSession.pageIndex++;
      }

      let search = getSearch(state, objectType);
      const period = getPeriod(state, objectType);
      const { searchFieldDTOList } = getSearchForSave(state, objectType);
      const isFilterAll = period.period === 'all';
      let requestData = mapRequestData(
        {
          startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
          endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
          isFilterAll,
          roleFilterType: roleType,
          roleFilterValue: roleValue,
          customFilter: search.filter ? search.filter : 'active',
          orderBy: search.orderBy,
          isRequiredOwner: false,
          ftsTerms: search.term,
          searchFieldDTOList: search.shown ? searchFieldDTOList : [],
          selectedMark: search.tag,
          showHistory: search.history,
        },
        search
      );

      if (overviewType === OverviewTypes.Resource) {
        requestData = {
          ...requestData,
        };
      }

      if (overviewType === OverviewTypes.RecruitmentClosed) {
        const recruitmentCaseIdsObj = state.entities.recruitment.__COMMON_DATA.currentRecruitmentCase;
        const search = getSearch(state, state?.common?.currentObjectType);
        requestData = {
          ...requestData,
          recruitmentCaseIds: recruitmentCaseIdsObj === 'ALL' ? [] : [recruitmentCaseIdsObj],
          wonLossFilter: search?.tag === 'YES' ? 'WON' : search?.tag === 'NO' ? 'LOSS' : 'ALL',
        };
        if (!recruitmentCaseIdsObj) return;
      }

      if (overviewType === OverviewTypes.Contact && clear) {
        yield put(checkMissingEmailByUser());
      }

      if (overviewType === 'PIPELINE_ORDER' || overviewType === 'PIPELINE_QUALIFIED' || overviewType === OverviewTypes.Account ||overviewType === OverviewTypes.Contact) {
        currentSession.timeZone = getCurrentTimeZone();
      }

      //định nghĩa hàm gọi api
      const getData = call(api.post, {
        data: requestData,
        query: mapQuery(currentSession, search),
        resource: pathName.includes('/activities/appointments') ? `${Endpoints.Appointment}/fts` : endPoint.list,
        schema,
      });

      if (overviewType === OverviewTypes.CallList.Account || overviewType === OverviewTypes.CallList.Contact ||overviewType === OverviewTypes.Resource) {
        console.log("case 1");
        const data = yield getData;

        if (data.entities) {
          if (data.entities[entityType]) {
            const items = Object.keys(data.entities[entityType]);
            yield put(
              OverviewActions.succeedFetch(overviewType, items, clear, data.result?.count || data.result.total || 0)
            );
          } else {
            yield put(
              OverviewActions.succeedFetch(overviewType, [], clear, data.result?.count || data.result.total || 0)
            );
          }
          yield put(OverviewActions.feedEntities(data.entities));
        }
      } else if (currentSession.pageIndex === 0) {
        console.log("case 2");
        let getRemainder;
        if (pathName === '/activities/calendar') {
          getRemainder = call(api.post, {
            resource: 'task-v3.0/listReminder',
            data: {
              startDate: requestData.startDate,
              endDate: requestData.endDate,
              isFilterAll: requestData.isFilterAll,
              roleFilterType: requestData.roleFilterType,
              roleFilterValue: requestData.roleFilterValue,
              customFilter: requestData.customFilter,
              orderBy: requestData.orderBy,
              isRequiredOwner: true,
              isDelegateTask: false,
              ftsTerms: '',
              searchFieldDTOList: [],
            },
            query: {
              sessionKey: currentSession.sessionKey,
            },
          });
        }
        const [countData, data, remainder] = yield all([
          call(api.post, {
            data: requestData,
            query: mapQuery(
              {
                sessionKey: currentSession.sessionKey,
                timeZone: getCurrentTimeZone(),
              },
              search
            ),
            resource: endPoint?.count,
          }),
          getData,
          pathName === '/activities/calendar' && getRemainder,
        ]);
        let count = countData?.count;
        // if (countData.appointmentsList){
        //   count = countData.appointmentsList.length
        // }

        if (remainder) {
          yield put(setRemainder(remainder.taskDTOList));
        }
        if (data != null && data.result != null) {
          const { companyAvgDistributionDays } = data.result;
          if (companyAvgDistributionDays) {
            yield put(OverviewActions.collectOtherParamInList(overviewType, { companyAvgDistributionDays }));
          }
          if (overviewType === OverviewTypes.Pipeline.Qualified || overviewType === OverviewTypes.Pipeline.Order) {
            const {
              totalGrossValue,
              totalNetValue,
              totalProfit,
              totalWeight,
              countProspectBySalesProcessDTOs,
            } = countData;
            yield put(
              OverviewActions.collectOtherParamInList(overviewType, {
                totalGrossValue,
                totalNetValue,
                totalProfit,
                totalWeight,
                countProspectBySalesProcessDTOs,
              })
            );
            if (overviewType === OverviewTypes.Pipeline.Qualified)
              yield put(updateListSaleMethodUsing(countProspectBySalesProcessDTOs));
          }
        }
        if (overviewType === OverviewTypes.RecruitmentClosed) {
          yield put(
            OverviewActions.succeedFetch(overviewType, data.result.recruitmentDTOList || [], true, data.result.total)
          );
        }
        if (data.entities && overviewType !== OverviewTypes.RecruitmentClosed) {
          if (data.entities[entityType]) {
            const items = Object.keys(data.entities[entityType]);
            yield put(OverviewActions.succeedFetch(overviewType, items, true, count));
          } else {
            yield put(OverviewActions.succeedFetch(overviewType, [], true, count));
          }
          yield put(OverviewActions.feedEntities(data.entities));
        }
      } else {
        console.log("case 3");
        const data = yield getData;
        if (data.entities) {
          if (overviewType === OverviewTypes.RecruitmentClosed) {
            yield put(
              OverviewActions.succeedFetch(
                overviewType,
                data?.result?.recruitmentDTOList || [],
                false,
                data?.result?.total || 0
              )
            );
          } else {
            if (data.entities[entityType]) {
              const items = Object.keys(data.entities[entityType]);
              yield put(OverviewActions.succeedFetch(overviewType, items));
            } else {
              yield put(OverviewActions.succeedFetch(overviewType, []));
            }
            yield put(OverviewActions.feedEntities(data.entities));
          }
        }
      }
      //reset select all
      yield put(OverviewActions.setSelectAll(overviewType, false))
      search = {};
    } catch (e) {
      yield put(OverviewActions.failFetch(overviewType, e.message));
    }
  };
};

//tìm kiếm công ty
const createSearchCompany = () => {
  let currentSession = {
    pageIndex: 0,
    pageSize: 25
  }
  return function* searchCompany(action) {
    let state = yield select();
    const { overviewType, clear} = action;
    const  isFocus = state?.search?.ACCOUNT.isFocus;
    let paramsSearch = state?.search?.ACCOUNT?.params;
    if(clear) {
      //reset data
      yield put(OverviewActions.resetObjectData(overviewType));
      yield put(resetListOrganisation());
    }

    if(isFocus && isEmpty(paramsSearch)) {
      return; // bỏ chọn hoặc xoá tìm kiếm đã lưu trong chương trình trọng điểm
    }

    yield put(OverviewActions.startSearchCompany({overviewType}));
    if(clear) {
      currentSession.pageIndex = 1;
    } else {
      currentSession.pageIndex = currentSession.pageIndex + 1;
    }
    try {
      let res = yield call(api.post,{
        resource: 'organisation-v3.0/getListCustomer',
        query: {
                  pageIndex: currentSession.pageIndex,
                  pageSize: currentSession.pageSize
                },
        data: {...paramsSearch}
      });
      

      if(res) {
        //fakeData cho hiệu ứng loadmore
        // let uuid = '992b5863-19e8-4884-922a-ebb01de634df';
        // let fakeUUID = '992b5863-19e8-4884-922a-ebb01de634d';
        // let company = res.filter(item => item.uuid = uuid)[0];
        // let fakeItems = [...res]

        // for(let i = 1; i < 23; i++) {
        //   let fakeCompany = {...company};
        //   fakeCompany.uuid = `${fakeUUID}${i}`
        //   fakeItems = [...fakeItems, fakeCompany];
        // }
        // let dispatchData = {
        //   overviewType,
        //   items: fakeItems.map(item => item.uuid),
        //   itemCount: 100,
        //   clear
        // };
        // let listCompany = {};
        // fakeItems.forEach(item => {
        //   listCompany[item.uuid] = {...item}
        // })
        // let dispatchData_2 = {
        //   organisation: {...listCompany}
        // }
        // yield put(OverviewActions.startSearchCompanySucess(dispatchData));
        // yield put(OverviewActions.feedEntities(dispatchData_2));

        //fakeData cho trường hợp kết tìm kiếm rỗng
        // let dispatchData = {
        //   overviewType,
        //   items: [],
        //   itemCount: 0,
        //   clear
        // }
        // let dispatchData_2 = {
        //   organisation: {}
        // }
        // yield put(OverviewActions.startSearchCompanySucess(dispatchData));
        // yield put(OverviewActions.feedEntities(dispatchData_2));

        //cho trường hợp thực tế (api chưa hoàn thiện)
        let dispatchData = {
          overviewType,
          items: res?.data.map(item => item.uuid),
          itemCount: res.total,
          clear
        }
        let listCompany = {};
        res?.data.forEach(item => {
          listCompany[item.uuid] = {...item}
        })
        let dispatchData_2 = {
          organisation: {...listCompany}
        }
        yield put(OverviewActions.startSearchCompanySucess(dispatchData));
        yield put(OverviewActions.feedEntities(dispatchData_2));
      }
    } catch(err) {
      console.log("err: ", err);
    }
  }
}


//
const createOverviewSagas = (
  endPoint: string,
  overviewType: string,
  objectType: string,
  entityType: string,
  schema: {},
  getRequestData: ({}) => {}
) => {

  const fetchList = createFetchListSaga(endPoint, overviewType, objectType, entityType, schema, getRequestData);
  const searchCompany = createSearchCompany();

  let debouncedList;

  function* debounce() {
    yield delay(1000);
    yield call(fetchList, true);
  }

  function* search(clear = true) {
    yield delay(300);

    yield call(fetchList, clear);
  }

  const createWatcher = (action) => {
    return function* watch() {
      while (true) {
        const { objectType: actionObjectType } = yield take(action);
        if (objectType === actionObjectType) {
          if (debouncedList) {
            yield cancel(debouncedList);
          }
          debouncedList = yield fork(debounce);
        }
      }
    };
  };

  function* watchTaskTermChange() {
    while (true) {
      const { objectType: actionObjectType } = yield take(AdvancedSearchActionTypes.SET_TERM);
      if (objectType === actionObjectType) {
        if (debouncedList) {
          yield cancel(debouncedList);
        }
        debouncedList = yield fork(search, true);
      }
    }
  }

  function* watchAdvancedSearchChange({ objectType: actionObjectType }) {
    const __common = yield select((state) => state.common);
    if (__common.currentObjectType === actionObjectType && actionObjectType === objectType) {
      if (debouncedList) {
        yield cancel(debouncedList);
      }
      if(objectType === 'ACCOUNT') {
        let action = {
          overviewType: 'ACCOUNTS',
          clear: true
        };
        debouncedList = yield fork(searchCompany, action);
      } else {
        debouncedList = yield fork(fetchList, true);
      }
    }
  }

  function* watchOverviewChange({ overviewType: actionOverviewType, clear }) {
    if (overviewType === actionOverviewType) {
      // if (debouncedList) {
      //   yield cancel(debouncedList);
      // }
      yield fork(fetchList, clear);
    }
  }

  function* periodWatcher({ objectType: actionOverviewType }) {
    if (objectType === actionOverviewType) {
      if (debouncedList) {
        yield cancel(debouncedList);
      }
      debouncedList = yield call(fetchList, true);
    }
  }

  function* startSearchCompany({overviewType: actionOverviewType, clear}) {
    console.log("1 2 3 ", overviewType, actionOverviewType, clear);
    let action = {overviewType, clear};

    if (overviewType === actionOverviewType) {
      yield fork(searchCompany, action);
    }
  }

  return [
    // fork(watchTaskTermChange),
    takeLatest(AdvancedSearchActionTypes.PERFORM_SEARCH, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SET_TAG, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SET_ORDERBY, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SELECT_SAVED, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.SET_FILTER, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.ENABLE_HISTORY, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.BLOCK_HISTORY, watchAdvancedSearchChange),
    takeLatest(AdvancedSearchActionTypes.HIDE, watchAdvancedSearchChange),
    takeEvery(OverviewActionTypes.FETCH_REQUEST, watchOverviewChange),
    // takeEvery(OverviewActionTypes.CURRENT_ITEM_LEVEL_1, search),
    fork(createWatcher(PeriodSelectorActions.PREV)),
    fork(createWatcher(PeriodSelectorActions.NEXT)),
    takeLatest(PeriodSelectorActions.SELECT, periodWatcher),
    takeLatest(PeriodSelectorActions.SELECT_START_DATE, periodWatcher),
    takeLatest(PeriodSelectorActions.SELECT_END_DATE, periodWatcher),
    takeLatest(OverviewActionTypes.REQUEST_SEARCH_COMPANY, startSearchCompany)
  ];
};

export default createOverviewSagas;
