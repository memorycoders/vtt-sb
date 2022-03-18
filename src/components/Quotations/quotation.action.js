const ActionTypes = {
  FETCH_QUOTATION: 'quotation/fetchDataQuotation',
  REQUEST_FETCH_LIST_SUCCESS: 'quotation/fetchDataQuotationSuccess',
  FETCH_QUOTATION_OF_ONE_CUSTOMER: 'quotation/fetchDataQuotationOfOneCustomer',
  FETCH_QUOTATION_OF_ONE_CUSTOMER_SUCCESS: 'quotation/fetchDataQuotationOfOneCustomerSucces',
  DELETE_QUOTATION_SUCCESS: 'quotation/deleteQuotationSucess',
  UPDATE_ACCEPTED_STATUS_QUOTATION_SUCCESS: 'quotation/updateAcceptedStatusQuotationSucess',
  UPDATE_TOTAL_ACTIVE_QUOTATION_OF_ONE_CUSTOMER: 'quotation/updateTotalActiveQuotationOfCustomer',
  UPDATE_STATUS_QUOTATION_OF_ONE_CUSTOMER: 'quotation/updateSatusQuotationOfOneCustomer',
  UPDATE_TOTAL_ROW_DISPLAY: 'quotation/updateTotalRowDisplay',
  SET_ACTIVE_PAGE: 'quotation/setActivePage',
  SET_ORDER_BY: 'quotation/setOrderBy',
  SET_SORT: 'quotation/setSort'
};

export const fetchDataQuotation = (data) => {
  return {
    type: ActionTypes.FETCH_QUOTATION,
    data
  }
};

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

//lấy quotation của 1 khách hàng
export const fetchQuotationOfOneCustomer = (data) => {
  return {
    type: ActionTypes.FETCH_QUOTATION_OF_ONE_CUSTOMER,
    data
  }
}

export const fetchQuotationOfOneCustomerSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_QUOTATION_OF_ONE_CUSTOMER_SUCCESS,
    data
  }
}

export const deleteQuotationSuccess = (data) => {
  return {
    type: ActionTypes.DELETE_QUOTATION_SUCCESS,
    data
  }
}

export const updateAcceptedStatusQuotationSuccess = (data) => {
  return {
    type: ActionTypes.UPDATE_ACCEPTED_STATUS_QUOTATION_SUCCESS,
    data
  }
}

export const updateTotalActiveQuotationOfCustomer = (data) => {
  return {
    type: ActionTypes.UPDATE_TOTAL_ACTIVE_QUOTATION_OF_ONE_CUSTOMER,
    data
  }
}

export const updateStatusQuotationOfOneCustomer = (data) => {
  return {
    type: ActionTypes.UPDATE_STATUS_QUOTATION_OF_ONE_CUSTOMER,
    data
  }
}

export const setActivePage = (activePage) => {
  return {
    type: ActionTypes.SET_ACTIVE_PAGE,
    activePage
  }
}

export const setOrderBy = (orderBy) => {
  return {
    type: ActionTypes.SET_ORDER_BY,
    orderBy
  }
}

export const setSort = (sort) => {
  return {
    type: ActionTypes.SET_SORT,
    sort
  }
}



export default ActionTypes;
