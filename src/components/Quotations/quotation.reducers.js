import createReducer, { createConsumeEntities } from 'store/createReducer';
import QuotationActionType from './quotation.action';

export const initialState = {
  orderBy: 'create_date',
  pageSize: 10,
  totalResult: 0, // total row fetch from API
  totalPage: 0,
  data: [],
  __DETAIL: {},
  activePage: 1,
  searchText: '',
  totalRecord: {},
  filterValue: '',
  sort: '',
  quotationOfCustomer: {
    order: false, // để phân biệt đang ở active hay history
    totalActive: 0,
    totalActiveOrHistory: 0,
    data: []
  }

};
const consumeEntities = createConsumeEntities('quotation');
export default createReducer(initialState, {
  default: consumeEntities,
  // [QuotationActionType.UPDATE_TOTAL_ROW_DISPLAY]: (draft, { total }) => {
  //   draft.pageSize = total;
  // },
  [QuotationActionType.REQUEST_FETCH_LIST_SUCCESS]: (draft, { data }) => {
    draft.totalResult = data.totalValue;
    draft.totalPage = data.totalPage;
    draft.data = data.data;
    draft.searchText = data.searchText
  },
  [QuotationActionType.FETCH_QUOTATION_OF_ONE_CUSTOMER_SUCCESS]: (draft, { data }) => {
    const { order, totalRecord } = data;
    draft.quotationOfCustomer.order = order;
    draft.quotationOfCustomer.data = data.data;
    draft.quotationOfCustomer.totalActiveOrHistory = totalRecord;
    if(!order) {
      draft.quotationOfCustomer.totalActive = totalRecord;
    }
  },
  [QuotationActionType.DELETE_QUOTATION_SUCCESS]: (draft, { data }) => {
    const { uuid } = data;
    let newData = draft.quotationOfCustomer.data.filter(item => item.uuid !== uuid);
    draft.quotationOfCustomer.data = [...newData];
    draft.quotationOfCustomer.totalActive = newData.length;
    draft.quotationOfCustomer.totalActiveOrHistory = newData.length;
  },
  [QuotationActionType.UPDATE_ACCEPTED_STATUS_QUOTATION_SUCCESS]: (draft, { data }) => {
    const { uuid } = data;
    let newData = draft.quotationOfCustomer.data.map(item => {
      if(item.uuid === uuid) {
        return {...item, accepted: !item.accepted}
      }

      return item;
    });
    draft.quotationOfCustomer.data = [...newData];
  },
  [QuotationActionType.UPDATE_TOTAL_ACTIVE_QUOTATION_OF_ONE_CUSTOMER]: (draft, { data }) => {
    draft.quotationOfCustomer.totalActive = draft.quotationOfCustomer.totalActive + 1;
  },
  [QuotationActionType.UPDATE_STATUS_QUOTATION_OF_ONE_CUSTOMER]: (draft, { data }) => {
    let newData = draft.quotationOfCustomer.data.map(item => {
      if(item.uuid === data.uuid) {
        return {...item, status: data.status};
      }
      return item;
    })
    draft.quotationOfCustomer.data = [...newData];
  },
  [QuotationActionType.UPDATE_TOTAL_ROW_DISPLAY]: (draft, { total }) => {
    draft.pageSize = total;
  },
  [QuotationActionType.SET_ACTIVE_PAGE]: (draft, {activePage}) => {
    draft.activePage = activePage
  },
  [QuotationActionType.SET_ORDER_BY]: (draft, {orderBy}) => {
    draft.orderBy = orderBy
  },
  [QuotationActionType.SET_SORT]: (draft, {sort}) => {
    draft.sort = sort
  },
});
