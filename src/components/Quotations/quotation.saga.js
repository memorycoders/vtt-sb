import { all, takeLatest, call, put, select, fork, take } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { Endpoints, ObjectTypes } from '../../../src/Constants';
import QuotationActionType from './quotation.action';
import { requestFetchLitSuccess, fetchQuotationOfOneCustomerSuccess, setActivePage } from './quotation.action';
import AdvancedSearchActionTypes from '../AdvancedSearch/advanced-search.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import moment from 'moment'
function* fetchDataQuotation({ data }) {
  const state = yield select();
  try {
    let startDate;
    let endDate;
    let date = new Date();
    switch(data.period){
      case 'year':
        const year = moment(date).startOf('year').startOf('day');
        startDate = year.toDate().valueOf();
        endDate = moment(date).endOf('year').endOf('day').toDate().valueOf();
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3);
        startDate = new Date(date.getFullYear(), quarter * 3 + 0 * 3, 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0, 23, 59, 59);
        break;
      case 'month':
        const month = moment(date).startOf('month').startOf('day');
        startDate = month.toDate().valueOf();
        endDate = moment(date).endOf('month').endOf('day').toDate().valueOf();
        break;
      case 'week':
        const week = moment(date).startOf('isoweek').startOf('day');
        startDate = week.toDate().valueOf();
        endDate = moment(date).endOf('isoweek').endOf('day').toDate().valueOf();
        break;
      case 'day':
        const day = moment(date).add(0, 'day').startOf('day');
        startDate = day.toDate().valueOf();
        endDate = day.add(0, 'day').endOf('day').toDate().valueOf();
        break;
      case 'all':
        startDate = null;
        endDate = null;
        break;
    }
    const res = yield call(api.post, {
      resource: `quotation-v3.0/quotation`,
      query: {
        pageIndex: data.pageIndex || 0,
        pageSize: data.pageSize || 10,
        searchText: data.searchText || '',
        fromDate: data.fromDate ? moment(data.fromDate).toDate().valueOf() : startDate ? startDate : null,
        toDate: data.toDate ? moment(data.toDate).toDate().valueOf() : endDate ? endDate : null,
        sort: data.sort || null,
        order: data.order || null,
        activePage: data.activePage || null,
        // searchFieldDTOS: data.searchFieldDTOS || [],
      },
      data: {
        searchFieldDTOS: data.searchFieldDTOS || [],
        // filterValue: data.filterValue || '',
        // orderBy: data.orderBy || '',
        // searchText: data.searchText || '',
      },
    });
    if (res) {
      yield put(
        requestFetchLitSuccess({
          data: res.data,
          totalValue: res.total,
          totalPage: Math.ceil(res.total / (data.pageSize || 10)),
          searchText: data.searchText || ''
        })
      );
    }
  } catch (e) {
    console.log('======================', e);
  }
}

function* fetchSearch({ objectType }) {
  const state = yield select();
  // console.log('========================================>', objectType)
  if(objectType === ObjectTypes.Quotation) {
    const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.Quotation);
    const getStateSearch = getSearch(state, objectType);
    let filterValue = state?.entities?.quotation?.filterValue;
    let sort = state?.entities?.quotation?.sort;
    let searchText = state?.entities?.quotation?.searchText;
    let pageSize = state?.entities?.quotation?.pageSize;
    let activePage = state?.entities?.quotation?.activePage;
    let fromDate =  state.period?.QUOTATION?.startDate;
    let toDate = state.period?.QUOTATION?.endDate;
    let order = getStateSearch?.history
    const data = {
      pageIndex: 0,
      sort,
      filterValue,
      searchText,
      searchFieldDTOS: searchFieldDTOList || [],
      fromDate,
      toDate,
      order,
      pageSize,
      activePage
    };
    yield fetchDataQuotation({ data });
    yield put(setActivePage(1));
  }
}

function* fetchQuotationOfOneCustomer({ data }) {
  const state = yield select();
  try {
    const res = yield call(api.post, {
      resource: `quotation-v3.0/quotation`,
      query: {...data}
    });
    if (res) {
      yield put(
        fetchQuotationOfOneCustomerSuccess({
          data: res.data,
          totalRecord: res.total,
          order: data.order
        })
      );
    }
  } catch (e) {
    console.log('======================', e);
  }
}

export default function* sagas() {
  yield takeLatest(QuotationActionType.FETCH_QUOTATION, fetchDataQuotation);
  yield takeLatest(AdvancedSearchActionTypes.PERFORM_SEARCH, fetchSearch);
  yield takeLatest(QuotationActionType.FETCH_QUOTATION_OF_ONE_CUSTOMER, fetchQuotationOfOneCustomer)
}
