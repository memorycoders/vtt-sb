import createReducer, { createConsumeEntities } from 'store/createReducer';
import ViettelActionTypes from '../Viettel/viettel.actions';

const urlApi =  {
  ca: 'administration-v3.0/production/listCA',
  hddt: 'administration-v3.0/production/listHDDT',
  bhxh: 'administration-v3.0/production/listBHXH',
  vTracking: 'administration-v3.0/production/listVTracking'
}

export const initialState = {
  orderBy: '',
  pageSize: 10,
  totalResult: 0, // total row fetch from API
  totalPage: 0,
  data: [],
  currentUrlApi: 'administration-v3.0/production/listCA',
  __DETAIL: {},
  activePage: 1,
  searchText: '',
  totalRecord: {},
  filterValue: ''
};
const consumeEntities = createConsumeEntities('resources');
export default createReducer(initialState, {
  default: consumeEntities,
  [ViettelActionTypes.UPDATE_TOTAL_ROW_DISPLAY]: (draft, { total }) => {
    draft.pageSize = total;
  },
  [ViettelActionTypes.REQUEST_FETCH_LIST_SUCCESS]: (draft, { data }) => {
    draft.totalResult = data.totalValue;
    draft.totalPage = data.totalPage;
    draft.data = data.data;
    switch(draft.currentUrlApi) {
      case urlApi.ca:
        draft.totalRecord.caTotal = data.totalValue;
        break;
      case urlApi.hddt: 
        draft.totalRecord.hddtTotal = data.totalValue;
        break;
      case urlApi.bhxh: 
        draft.totalRecord.bhxhTotal = data.totalValue;
        break;
      case urlApi.vTracking: 
        draft.totalRecord.vTrackingTotal = data.totalValue;
        break;
      default:
    }
  },
  [ViettelActionTypes.UPDATE_URL_API] : (draft, {url}) => {
    draft.currentUrlApi = url;
  },
  [ViettelActionTypes.SET_DETAIL]: (draft, {data}) => {
    draft.__DETAIL = data;
  },
  [ViettelActionTypes.SET_ORDER_BY]: (draft, {orderBy}) => {
    draft.orderBy = orderBy
  },
  [ViettelActionTypes.SET_ACTIVE_PAGE]: (draft, {activePage}) => {
    draft.activePage = activePage
  },
  [ViettelActionTypes.SET_SEARCH_TEXT]: (draft, {searchText}) => {
    draft.searchText = searchText
  },
  [ViettelActionTypes.SET_FILTER_VALUE]: (draft, {filterValue}) => {
    draft.filterValue = filterValue
  },
  [ViettelActionTypes.REQUEST_FETCH_TOTAL_RECORD_SUCCESS]: (draft, {totalRecord}) => {
    draft.totalRecord = totalRecord
  }
});
