import React, { useEffect, useState } from 'react';
import { Icon, Input, Button, Table, Menu, Pagination, TableCell } from 'semantic-ui-react';
import api from 'lib/apiClient';
import { requestFetchList, updateUrlApi, setDetailProduct, setOrderBy, setActivePage } from './viettel.actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ROUTERS } from '../../Constants';
import { getSearchForSave } from '../AdvancedSearch/advanced-search.selectors';

const VtTable = ({
  header,
  url,
  data = [],
  totalPage = 0,
  pageIndex = 0,
  requestFetchList,
  orderBy,
  setOrderBy,
  type,
  updateUrlApi,
  history,
  setDetailProduct,
  __DETAIL,
  setActivePage,
  activePage,
  searchText,
  filterValue,
  currentObjectType,
  isShowAdvancedSearch,
  reduxState,
}) => {
  useEffect(() => {
    updateUrlApi(url);
    requestFetchList({
      url: url,
      pageIndex,
    });

    return () => {
      setActivePage(1);
    };
  }, []);

  const handleSort = (orderBy) => {
    setOrderBy(orderBy);
    setActivePage(1); //reset active page
    let searchFieldList = [];
    if (isShowAdvancedSearch) {
      const { searchFieldDTOList } = getSearchForSave(reduxState, currentObjectType);
      searchFieldList = searchFieldDTOList;
    }
    requestFetchList({
      url: url,
      pageIndex: 0,
      orderBy: orderBy,
      searchText,
      filterValue,
      searchFieldList: searchFieldList,
    });
  };

  const handlePageChange = (e, data) => {
    console.log(data);
    setActivePage(data.activePage);
    let searchFieldList = [];
    if (isShowAdvancedSearch) {
      const { searchFieldDTOList } = getSearchForSave(reduxState, currentObjectType);
      searchFieldList = searchFieldDTOList;
    }

    requestFetchList({
      url,
      pageIndex: data.activePage - 1,
      orderBy: orderBy,
      searchText: searchText,
      filterValue: filterValue,
      searchFieldList: searchFieldList,
    });
  };

  const gotoDetail = (e) => {
    history.push(`/${ROUTERS.VT}/${e.uuid}`);
    setDetailProduct({ ...e, TYPE: type });
  };

  const numberWithCommas = (x) => {
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <>
      <Table basic="very" className="vt-table" striped selectable role="grid">
        <Table.Header>
          <Table.Row>
            {header.map((e) => {
              return (
                <Table.HeaderCell
                  textAlign={e.textAlign || 'left'}
                  style={{ cursor: 'pointer' }}
                  key={e.key}
                  onClick={(event) => handleSort(e.key)}
                >
                  {e.title}
                  {orderBy === e.key && <Icon name="angle down" />}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        {type === 'ca' ? (
          <>
            <Table.Body>
              {data.map((e, index) => {
                return (
                  <Table.Row
                    key={e.uuid || index}
                    onClick={() => gotoDetail(e)}
                    className={e.uuid === __DETAIL?.uuid ? 'table-row-active' : ''}
                  >
                    {header?.map((headerElement) => {
                      if (headerElement.key === 'productDetail') {
                        return (
                          <Table.Cell textAlign={'left'}>
                            {e.productionType && `${e.productionType}`}
                            {e.productionDetail1 && `, ${e.productionDetail1}`}
                            {e.productionDetail2 && `, ${e.productionDetail2}`}
                            {/* {`${e.productionDetail1 || ''} ,${e.productionDetail2 || ''},${e.productionDetail3 || ''}`} */}
                          </Table.Cell>
                        );
                      }
                      if (headerElement?.type === 'number') {
                        return <Table.Cell textAlign="center">{numberWithCommas(e[headerElement.key])}</Table.Cell>;
                      }
                      return (
                        <Table.Cell textAlign={headerElement.textAlign || 'left'}>{e[headerElement.key]}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </>
        ) : type === 'hddt' ? (
          <>
            <Table.Body>
              {data.map((e, index) => {
                return (
                  <Table.Row
                    key={e.uuid || index}
                    onClick={() => gotoDetail(e)}
                    className={e.uuid === __DETAIL?.uuid ? 'table-row-active' : ''}
                  >
                    {header?.map((headerElement) => {
                      if (headerElement?.type === 'number') {
                        return (
                          <Table.Cell textAlign={headerElement.textAlign || 'left'}>
                            {numberWithCommas(e[headerElement.key])}
                          </Table.Cell>
                        );
                      }
                      return (
                        <Table.Cell textAlign={headerElement.textAlign || 'left'}>{e[headerElement.key]}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </>
        ) : type === 'bhxh' ? (
          <>
            <Table.Body>
              {data.map((e, index) => {
                return (
                  <Table.Row
                    key={e.uuid || index}
                    onClick={() => gotoDetail(e)}
                    className={e.uuid === __DETAIL?.uuid ? 'table-row-active' : ''}
                  >
                    {header?.map((headerElement) => {
                      if (headerElement.key === 'productionDetail1') {
                        return (
                          <Table.Cell textAlign={headerElement.textAlign || 'left'}>
                            {e.productionType && `${e.productionType}`}
                            {e.productionDetail1 && `, ${e.productionDetail1}`}
                          </Table.Cell>
                        );
                      }
                      if (headerElement?.type === 'number') {
                        return (
                          <Table.Cell textAlign={headerElement.textAlign || 'left'}>
                            {numberWithCommas(e[headerElement.key])}
                          </Table.Cell>
                        );
                      }
                      return (
                        <Table.Cell textAlign={headerElement.textAlign || 'left'}>{e[headerElement.key]}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </>
        ) : type === 'tracking' ? (
          <>
            <Table.Body>
              {data.map((e, index) => {
                return (
                  <Table.Row
                    key={e.uuid || index}
                    onClick={() => gotoDetail(e)}
                    className={e.uuid === __DETAIL?.uuid ? 'table-row-active' : ''}
                  >
                    {header?.map((headerElement) => {
                      if (headerElement?.type === 'number') {
                        return (
                          <Table.Cell textAlign={headerElement.textAlign || 'left'}>
                            {numberWithCommas(e[headerElement.key])}
                          </Table.Cell>
                        );
                      }
                      return (
                        <Table.Cell textAlign={headerElement.textAlign || 'left'}>{e[headerElement.key]}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </>
        ) : null}
      </Table>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* <Pagination
          onPageChange={handlePageChange}
          id="paging-vt-table"
          boundaryRange={0}
          ellipsisItem={null}
          // defaultActivePage={pageIndex + 1}
          siblingRange={2}
          totalPages={totalPage}
          activePage={activePage}
        /> */}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  totalPage: state.entities?.viettel?.totalPage,
  data: state.entities?.viettel?.data,
  orderBy: state.entities?.viettel?.orderBy,
  __DETAIL: state.entities?.viettel?.__DETAIL,
  activePage: state.entities?.viettel?.activePage,
  searchText: state.entities?.viettel?.searchText,
  filterValue: state.entities?.viettel?.filterValue,
  currentObjectType: state?.common?.currentObjectType,
  isShowAdvancedSearch: state?.search?.VT?.shown,
  reduxState: state,
});
const mapDispatchToProps = {
  requestFetchList,
  updateUrlApi,
  setDetailProduct,
  setOrderBy,
  setActivePage,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VtTable));
