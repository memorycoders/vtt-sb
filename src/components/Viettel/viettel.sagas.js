import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { Endpoints, ObjectTypes } from '../../../src/Constants';
import ViettelActionTypes from './viettel.actions';
import { requestFetchLitSuccess } from './viettel.actions';
import AdvancedSearchActionTypes from '../AdvancedSearch/advanced-search.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';

function* requestFetchList({ data }) {
  const state = yield select();
  try {
    const res = yield call(api.post, {
      resource: data.url ? data.url : state.entities.viettel.currentUrlApi,
      query: {
        size: state.entities.viettel.pageSize,
        indexPage: data.pageIndex,
      },
      data: {
        searchText: data.searchText || '',
        orderBy: data.orderBy || '',
        searchFieldList: data.searchFieldList || [],
        filterValue: data.filterValue || '',
      },
    });
    if (res) {
      const size = state.entities.viettel.pageSize || 10;
      yield put(
        requestFetchLitSuccess({
          data: res.data,
          totalValue: res.total,
          totalPage: Math.ceil(res.total / size),
        })
      );
    }
  } catch (e) {
    console.log('======================', e);
  }
}

function* fetchSearch({ objectType }) {
  const state = yield select();
  if(objectType === ObjectTypes.VT) {
    const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.VT);
    let filterValue = state?.entities?.viettel?.filterValue;
    let orderBy = state?.entities?.viettel?.orderBy;
    let searchText = state?.entities?.viettel?.searchText;
    const data = {
      pageIndex: 0,
      orderBy,
      filterValue,
      searchText,
      searchFieldList: searchFieldDTOList || [],
    };
    yield requestFetchList({ data });
  }
}

export default function* sagas() {
  yield takeLatest(ViettelActionTypes.REQUEST_FETCH_LIST, requestFetchList);
  yield takeLatest(AdvancedSearchActionTypes.PERFORM_SEARCH, fetchSearch);
}
