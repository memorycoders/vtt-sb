import React, { useState, useRef, useEffect } from 'react';
import { Select, Tab, Pagination } from 'semantic-ui-react';
import style from './Viettel.css';
import { connect } from 'react-redux';
import { updateTotalRowDisplay, requestFetchList, setOrderBy, setSearchText, setFilterValue, setActivePage } from './viettel.actions';
import QuickFiter from './QuickFiter';
import * as AdvancedSearchActions from '../AdvancedSearch/advanced-search.actions';
import { getSearchForSave } from '../AdvancedSearch/advanced-search.selectors';
import _l from 'lib/i18n';




const VtTabs = ({ panes, pageSize, updateTotalRowDisplay, requestFetchList,
                  width, setOrderBy, setSearchText, setFilterValue,
                  orderBy, searchText, filterValue, setActivePage,
                  isShowAdvancedSearch, showAdvancedSearch, hideAdvancedSearch,
                  currentObjectType, reduxState, activePage, totalPage }) => {
  console.log('totalll', totalPage, activePage)
  const ref = useRef(null);
  const isMounted = useRef(false);
  const [tabIndex, setTabIndex] = useState(0);
  const options = [
    { key: '10', value: 10, text: '10' },
    { key: '20', value: 20, text: '20' },
    { key: '50', value: 50, text: '50' },
  ];


  useEffect(() => {
    if(isMounted.current) {
      if(isShowAdvancedSearch) return;
      let activeIndex = ref.current?.state.activeIndex;
      let url = getAPIUrl(activeIndex);
      setActivePage(1);
      requestFetchList({
        url: url,
        pageIndex: 0,
        orderBy,
        searchText,
        filterValue,
      });
    } else {
      isMounted.current = true;
    }
  }, [isShowAdvancedSearch])

  const onChaneTotalDisplay = (e, { value }) => {
    updateTotalRowDisplay(value);
    let activeIndex = ref.current?.state.activeIndex;
    let url = getAPIUrl(activeIndex);
    setActivePage(1);
    let searchFieldList = [];
    if(isShowAdvancedSearch) {
      const { searchFieldDTOList } = getSearchForSave(reduxState, currentObjectType);
      searchFieldList = searchFieldDTOList;
    }

    requestFetchList({
      url: url,
      pageIndex: 0,
      orderBy,
      searchText,
      filterValue,
      searchFieldList: searchFieldList
    });
  };

  const getAPIUrl = (index) => {
    switch (index) {
      case 0:
        return 'administration-v3.0/production/listCA';
      case 1:
        return 'administration-v3.0/production/listHDDT';
      case 2:
        return 'administration-v3.0/production/listBHXH';
      case 3:
        return 'administration-v3.0/production/listVTracking';
      default:
        return '';
    }
  }

  const handleOnTabChange = (e, data) => {
    setOrderBy(''); //reset orderBy when change tabs
    setSearchText(''); //reset SearchText when change tabs
    setFilterValue(''); //reset filterValue when change tabs
    setTabIndex(data.activeIndex);
    //reset advanced search
    if(isShowAdvancedSearch) {
      hideAdvancedSearch(currentObjectType);
      // showAdvancedSearch(currentObjectType);
    }
  };

  const handleChangePage = (e, data) => {
    let activeIndex = ref.current?.state.activeIndex;
    let url = getAPIUrl(activeIndex);
    setActivePage(data.activePage);
    let searchFieldList = [];
    if(isShowAdvancedSearch) {
      const { searchFieldDTOList } = getSearchForSave(reduxState, currentObjectType);
      searchFieldList = searchFieldDTOList;
    }

    requestFetchList({
      url,
      pageIndex: data.activePage - 1,
      orderBy: orderBy,
      searchText: searchText,
      filterValue: filterValue,
      searchFieldList: searchFieldList
    });
  };

  return (
    <div className="vt_tab" style={{ width: width, position: 'relative' }}>
      <div className={style.t_right_content}>
        <QuickFiter tabIndex={tabIndex} />
        <div className={style.t_text}>{_l`Show`}</div>
        <Select
          closeOnChange
          className={style.pageStyle}
          value={pageSize}
          options={options}
          onChange={onChaneTotalDisplay}
        />
      </div>
      <Tab
        onTabChange={handleOnTabChange}
        ref={ref}
        id={isShowAdvancedSearch ? "Tab-Viettel-Product-active" : "Tab-Viettel-Product"}
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
      <div className={style.pagination_container} >
        <Pagination id="paging-vt-table" size="large" boundaryRange={0} ellipsisItem={null} siblingRange={2}
                    activePage={activePage} totalPages={totalPage} onPageChange={handleChangePage} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  pageSize: state.entities.viettel?.pageSize,
  orderBy: state.entities.viettel?.orderBy,
  filterValue: state.entities.viettel?.filterValue,
  searchText: state.entities.viettel?.searchText,
  isShowAdvancedSearch: state?.search?.VT?.shown,
  currentObjectType: state?.common?.currentObjectType,
  activePage: state.entities?.viettel?.activePage,
  totalPage: state.entities?.viettel?.totalPage,
  reduxState: state
});
const mapDispatchToProps = {
  requestFetchList,
  updateTotalRowDisplay,
  setOrderBy,
  setSearchText,
  setFilterValue,
  setActivePage,
  showAdvancedSearch: AdvancedSearchActions.show,
  hideAdvancedSearch: AdvancedSearchActions.hide
};
export default connect(mapStateToProps, mapDispatchToProps)(VtTabs);
