import React, { useEffect, useState, useRef } from 'react';
import { Pagination } from 'semantic-ui-react';
import QuotationTable from './QuotationTable';
import historyIcon from './styles/images/history-icon.svg';
import PeriodSelector from '../PeriodSelector/PeriodSelector';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { AutoSizer } from 'react-virtualized';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import css from './styles/quotations.css';
import { setObjectType, setOverviewType } from '../Common/common.actions';
import { fetchDataQuotation, setActivePage } from './quotation.action';
import { connect } from 'react-redux';
import * as AdvancedSearchActions from '../../components/AdvancedSearch/advanced-search.actions';
import api from '../../lib/apiClient';
import _l from 'lib/i18n';
import { getSearchForSave } from '../../components/AdvancedSearch/advanced-search.selectors';


const Quotations = (props) => {
  const { hideAdvancedSearch, activePage, setOverviewType, setObjectType, fetchDataQuotation, data, getSearchForSave,
    totalPage, orderBy, searchText, period, fromDate, toDate, pageSize, setActivePage, isShowAdvancedSearch, sort,
    searchFieldDTOS } = props;
  const headers = [
    { key: 'name', name: _l`Quotation name`, textAlign: 'left' },
    { key: 'created_date', name: _l`Create date`, textAlign: 'left' },
    { key: 'services', name: _l`Service`, textAlign: 'left' },
    { key: 'organisationName', name: _l`Customer`, textAlign: 'left' },
    { key: 'Status', name: 'Trạng thái', textAlign: 'left' },
    { key: 'state', name: '', textAlign: 'center' },
    { key: 'actions', name: '', textAlign: 'center' }
  ];
  const onChangePageSize = (e, data) => {
    setActivePage(data.activePage)
    fetchDataQuotation({
      pageIndex: data.activePage - 1,
      orderBy,
      sort: sort,
      searchText: searchText,
      period: period,
      fromDate: fromDate,
      toDate: toDate,
      pageSize: pageSize,
      searchFieldDTOS: searchFieldDTOS
    });
  }

  useEffect(() => {
    hideAdvancedSearch('QUOTATION');
  }, [])

  useEffect(() => {
    setOverviewType(OverviewTypes.Pipeline.Quotation);
    setObjectType(ObjectTypes.Quotation);
    // if(isShowAdvancedSearch) return;
    setActivePage(1);
    fetchDataQuotation({
      pageIndex: 0,
      orderBy,
      period: period,
      fromDate: fromDate,
      toDate: toDate,
      pageSize: pageSize,
      activePage: 1
    });
  }, [isShowAdvancedSearch])
  return (
    <div className={css.quotation_container}>
      <AutoSizer disableHeight>
        {
          ({ width }) => (
            <AdvancedSearch width={width} objectType={ObjectTypes.Quotation} clearSearch={true} />
          )
        }
      </AutoSizer>
      <PeriodSelector overviewType={OverviewTypes.Pipeline.Quotation} objectType={ObjectTypes.Quotation} color={Colors.Pipeline} />
      {/* <div><h2>{activePage || 'Không có'}</h2></div> */}
      <QuotationTable headers={headers} data={data} fetchDataQuotation={fetchDataQuotation} />
      <div className={css.pagination_container} >
        {data?.length > 0 && <Pagination id="quotations-pagination" size="large"
          onPageChange={onChangePageSize}
          activePage={activePage} totalPages={totalPage || 10} className={css.pagination} />}
      </div>
    </div>
  )
}
const mapStateToProps = (state, { objectType, overviewType }) => {
  const { searchFieldDTOList } = getSearchForSave(state, "QUOTATION");
  return {
    data: state.entities.quotation?.data,
    totalPage: state.entities?.quotation?.totalPage,
    orderBy: state.entities.quotation?.orderBy,
    sort: state.entities.quotation?.sort,
    filterValue: state.entities.quotation?.filterValue,
    searchText: state.entities.quotation?.searchText,
    pageSize: state.entities.quotation?.pageSize,
    activePage: state.entities.quotation?.activePage,
    period: state.settings?.display?.quotation?.timeFilterType?.toLowerCase(),
    fromDate: state.period?.QUOTATION?.startDate,
    toDate: state.period?.QUOTATION?.endDate,
    isShowAdvancedSearch: state?.search?.QUOTATION?.shown,
    searchFieldDTOS: searchFieldDTOList
  }
};
const mapDispatchToProps = {
  setOverviewType,
  setObjectType,
  fetchDataQuotation,
  setActivePage,
  hideAdvancedSearch: AdvancedSearchActions.hide,
}
export default connect(mapStateToProps, mapDispatchToProps)(Quotations);
