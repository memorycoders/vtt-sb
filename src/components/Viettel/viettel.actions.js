const ActionTypes = {
  // FETCH_LIST_PRODUCT_SERVICE_REQUEST: 'viettel/fetchListProductService',
  // FECTH_LIST_PRODUCT_SERVICE_SUCCESS: 'viettel/fecth'
  UPDATE_TOTAL_ROW_DISPLAY: 'viettel/updateTotalRowDisplay',
  REQUEST_FETCH_LIST: 'viettel/requestFetchList',
  REQUEST_FETCH_LIST_SUCCESS: 'viettel/requestFetchLitSuccess',
  UPDATE_URL_API: 'viettel/updateUrlApi',
  SET_DETAIL: 'viettel/setDetailProduct',
  SET_ORDER_BY: 'viettel/setOrderBy',
  SET_ACTIVE_PAGE: 'viettel/activePage',
  SET_SEARCH_TEXT: 'viettel/searchText',
  REQUEST_FETCH_TOTAL_RECORD_SUCCESS: 'viettel/requestFetchTotalRequestSuccess',
  SET_FILTER_VALUE: 'viettel/filterValue'
};

export const setOrderBy = (orderBy) => {
  return {
    type: ActionTypes.SET_ORDER_BY,
    orderBy
  }
}
export const setDetailProduct = (data) => {
  return {
    type: ActionTypes.SET_DETAIL,
    data
  }
}
export const updateTotalRowDisplay = (total) => {
  return {
    type: ActionTypes.UPDATE_TOTAL_ROW_DISPLAY,
    total,
  };
};
export const requestFetchLitSuccess = (data) => {
  return {
    type: ActionTypes.REQUEST_FETCH_LIST_SUCCESS,
    data,
  };
};
export const requestFetchList = (data) => {
  return {
    type: ActionTypes.REQUEST_FETCH_LIST,
    data,
  };
};

export const updateUrlApi = (url) => {
  return {
    type: ActionTypes.UPDATE_URL_API,
    url
  }
}

export const setActivePage = (activePage) => {
  return {
    type: ActionTypes.SET_ACTIVE_PAGE,
    activePage
  }
}

export const setSearchText = (searchText) => {
  return {
    type: ActionTypes.SET_SEARCH_TEXT,
    searchText
  }
}

export const setFilterValue = (filterValue) => {
  return {
    type: ActionTypes.SET_FILTER_VALUE,
    filterValue
  }
}

export const requestFetchTotalRecordSuccess = (totalRecord) => {
  return {
    type: ActionTypes.REQUEST_FETCH_TOTAL_RECORD_SUCCESS,
    totalRecord
  }
}

export default ActionTypes;
