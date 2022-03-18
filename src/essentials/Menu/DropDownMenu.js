import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'semantic-ui-react';
import css from './styles/DropDownMenu.css';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { fetchDataQuotation, updateTotalRowDisplay } from '../../components/Quotations/quotation.action';

const DropDownMenu = ({ period, fromDate, toDate, searchText, pageSize, orderBy, updateTotalRowDisplay, fetchDataQuotation}) => {
    const defaultOptions = [
        { key: '10', value: 10, text: '10' },
        { key: '20', value: 20, text: '20' },
        { key: '50', value: 50, text: '50' },
    ];
    const handleSelect = (e, { value }) => {
      // console.log('value', value)
      updateTotalRowDisplay(value)
      fetchDataQuotation({
        pageIndex: 0,
        orderBy: orderBy,
        period: period,
        fromDate: fromDate,
        toDate: toDate,
        searchText: searchText,
        pageSize: value
      });
    }

    // const {title = _l`Show`, options = defaultOptions } = props;
    return <div className={css.dropdown_menu_container}>
        <span className={css.title}>Hiển thị</span>
        <Select
          onChange={handleSelect} value={pageSize}
          options={defaultOptions} closeOnChange className={css.dropdown_menu}/>
    </div>
}

const mapStateToProps = (state) => ({
  data: state.entities.quotation?.data,
  totalPage: state.entities?.quotation?.totalPage,
  orderBy: state.entities.quotation?.orderBy,
  filterValue: state.entities.quotation?.filterValue,
  searchText: state.entities.quotation?.searchText,
  pageSize: state.entities.quotation?.pageSize,
  period: state.settings?.display?.quotation?.timeFilterType?.toLowerCase(),
  fromDate: state.period?.QUOTATION?.startDate,
  toDate: state.period?.QUOTATION?.endDate,
  reduxState: state
});
const mapDispatchToProps = {
  fetchDataQuotation,
  updateTotalRowDisplay,
};
export default connect(mapStateToProps, mapDispatchToProps)(DropDownMenu);
