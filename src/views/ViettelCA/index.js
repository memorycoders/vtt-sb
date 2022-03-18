import React, { useEffect, useState, useCallback } from 'react';
import { Tab } from 'semantic-ui-react';
import { setOverviewType, setObjectType } from '../../components/Common/common.actions';
import { createEntity } from '../../components/Overview/overview.actions';
import TabBill from '../../components/Viettel/TabBill';
import TabCA from '../../components/Viettel/TabCA';
import VtTabs from '../../components/Viettel/Tabs';
import TabSocialInsurance from '../../components/Viettel/TabSocialInsurance';
import TabTraking from '../../components/Viettel/TabTracking';
import css from './style.css';
import { OverviewTypes, ObjectTypes } from '../../Constants';
import { connect } from 'react-redux';
import ViettelProductDetail from '../../components/Viettel/ViettelProductDetail';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { compose, withProps } from 'recompose';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import { AutoSizer } from 'react-virtualized';
import api from 'lib/apiClient';
import { Endpoints } from '../../Constants';
import { requestFetchTotalRecordSuccess, setOrderBy, setSearchText, setFilterValue, updateTotalRowDisplay } from '../../components/Viettel/viettel.actions';
import * as AdvancedSearchActions from '../../components/AdvancedSearch/advanced-search.actions';




const ViettelCA = ({ 
  setOverviewType, setObjectType, createEntity, 
  hasDetail, requestFetchTotalRecordSuccess, totalRecord,
  currentObjectType, setOrderBy, setFilterValue, 
  setSearchText, updateTotalRowDisplay, hideAdvancedSearch }) => {

  useEffect(() => {
    setOverviewType(OverviewTypes.VT);
    setObjectType(ObjectTypes.VT);
    fetchNumberTotalRecord();

    //reset all search params when change page
    return () => {
      setOrderBy('');
      setFilterValue('');
      setSearchText('');
      updateTotalRowDisplay(10);
      hideAdvancedSearch(currentObjectType);
    }
  }, []);

  const fetchNumberTotalRecord =  useCallback(async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Administration}/production/getTotalRecord`
      });
      requestFetchTotalRecordSuccess(res);
    } catch (error) {} 
  }, [])

  const panes = [
    {
      menuItem: `CA${totalRecord.caTotal === undefined ? '' : `(${totalRecord.caTotal})`}`,
      render: () => (
        <Tab.Pane className={css['vt-tab']} attached={false}>
          <TabCA />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `HDDT${totalRecord.hddtTotal === undefined ? '' : `(${totalRecord.hddtTotal})`}`,
      render: () => (
        <Tab.Pane className={css['vt-tab']} attached={false}>
          <TabBill />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `vBHXH${totalRecord.bhxhTotal === undefined ? '' : `(${totalRecord.bhxhTotal})`}`,
      render: () => (
        <Tab.Pane className={css['vt-tab']} attached={false}>
          <TabSocialInsurance />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `vTracking${totalRecord.vTrackingTotal === undefined ? '' : `(${totalRecord.vTrackingTotal})`}`,
      render: () => (
        <Tab.Pane className={css['vt-tab']} attached={false}>
          <TabTraking />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className={cx(css['vt-container'], css['d-flex'])} style={{ position: 'relative' }}>
        <div style={{width: !hasDetail ? '100%' : 'calc(100% - 340px)'}} >
        <AutoSizer disableHeight>
          {({ width }) => (
            <AdvancedSearch
              width={width}
              // hasTag={hasTag}
              // hasFilter={hasFilter}
              // placeholder={_l`Search`}
              objectType={ObjectTypes.VT}
              clearSearch={true}
              // searchTerm={search.term}
              // handleSearch={handleSearch}
              // loading={isNextPageLoading}
              // className={css.search}
              // hasHistory={hasHistory}
              // history={history}
              // color={color}
              // hasGenius={hasGenius}
            />
          )}
        </AutoSizer>
      <VtTabs panes={panes} className={hasDetail && css.hasDetail}  />
      </div>
      {hasDetail && <ViettelProductDetail />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  totalRecord: state.entities?.viettel?.totalRecord,
  currentObjectType: state?.common?.currentObjectType
});
const mapDispatchToProps = {
  createEntity,
  setObjectType,
  setOverviewType,
  requestFetchTotalRecordSuccess,
  setOrderBy,
  setSearchText,
  setFilterValue,
  updateTotalRowDisplay,
  hideAdvancedSearch: AdvancedSearchActions.hide
};

export default compose(
  withRouter,
  withProps(({ location }) => ({
    hasDetail: (location.pathname.match(/\//g) || []).length > 1,
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(ViettelCA);
