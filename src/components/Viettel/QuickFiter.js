import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import style from './Viettel.css';
import { requestFetchList, setOrderBy, setActivePage, setFilterValue } from './viettel.actions';
import api from 'lib/apiClient';
import { Endpoints } from '../../Constants';
import { getSearchForSave } from '../AdvancedSearch/advanced-search.selectors';





export const QuickFiter = (props) => {
  const { tabIndex, currentUrlApi, requestFetchList, 
          setOrderBy, setActivePage, searchText, 
          setFilterValue, orderBy, filterValue, 
          reduxState, currentObjectType, isShowAdvancedSearch } = props;

  const [open, setOpen] = useState(false);
  const [listFields, setListFields] = useState([])
  const urlApi =  {
    ca: 'administration-v3.0/production/listCA',
    hddt: 'administration-v3.0/production/listHDDT',
    bhxh: 'administration-v3.0/production/listBHXH',
    vTracking: 'administration-v3.0/production/listVTracking'
  }

  // const menu = [
  //   {
  //     type: 'ca',
  //     menus: [
  //       {
  //         key: '',
  //         title: 'Cấp mới',
  //         value: 'Cấp mới',
  //       },
  //       {
  //         key: '',
  //         title: 'Gia hạn',
  //         value: 'Gia hạn',
  //       },
  //       {
  //         key: '',
  //         title: 'Tất cả',
  //         value: '',
  //       }
  //     ],
  //   },
  //   {
  //     type: 'hddt',
  //     menus: [
  //       {
  //         key: '',
  //         title: 'Mua hóa đơn',
  //         value: 'Mua hóa đơn',
  //       },
  //       {
  //         key: '',
  //         title: 'Các loại phí',
  //         value: 'Các loại phí',
  //       },
  //       {
  //         key: '',
  //         title: 'Tất cả',
  //         value: '',
  //       }
  //     ],
  //   },
  //   {
  //     type: 'bhxh',
  //     menus: [
  //       {
  //         key: '',
  //         title: 'Cấp mới',
  //         value: 'Cấp mới',
  //       },
  //       {
  //         key: '',
  //         title: 'Gia hạn',
  //         value: 'Gia hạn',
  //       },
  //       {
  //         key: '',
  //         title: 'Tất cả',
  //         value: '',
  //       }
  //     ],
  //   },
  //   {
  //     type: 'tracking',
  //     menus: [
  //       {
  //         key: '',
  //         title: 'Bán lẻ thiết bị',
  //         value: 'Bán lẻ thiết bị',
  //       },
  //       {
  //         key: '',
  //         title: 'Bán đại trà',
  //         value: 'Bán đại trà',
  //       },
  //       {
  //         key: '',
  //         title: 'Tất cả',
  //         value: '',
  //       }
  //     ],
  //   },
  // ];

  useEffect(() => {
    fetchFieldFilterProduct();
  }, [currentUrlApi])

  const fetchFieldFilterProduct = useCallback(async () => {
      let type, field;
      switch(currentUrlApi) {
        case urlApi.ca:
          type = 'ca';
          field = 'connection_type'
          break;
        case urlApi.hddt:
          type = 'hddt';
          field = 'connection_type'
          break;
        case urlApi.bhxh:
          type = 'bhxh';
          field = 'connection_type'
          break;
        case urlApi.vTracking:
          type = 'vtracking';
          field = 'policy ';
          break;
        default:
      }
      try {
        let res = await api.get({
          resource: `${Endpoints.Administration}/production/getFieldProduction`,
          query: {
            type,
            field
          }
        });

        let listFields = res.productionTagItemList?.map(item => {
          return {
              ...item,
              value: item.name
          }
        })
        listFields = [{name: 'Tất cả', value: ''}, ...listFields];
        setListFields(listFields);
      } catch (error) {
        setListFields([]);
      }
  }, [currentUrlApi])

  const handleSearch = (filterValue) => {
    setActivePage(1);
    setFilterValue(filterValue);
    let searchFieldList = [];
    if(isShowAdvancedSearch) {
      const { searchFieldDTOList } = getSearchForSave(reduxState, currentObjectType);
      searchFieldList = searchFieldDTOList;
    }

    requestFetchList({
      url: currentUrlApi,
      pageIndex: 0,
      orderBy: orderBy,
      searchText: searchText,
      filterValue: filterValue,
      searchFieldList: searchFieldList
    }) 
  }

  return (
    <Popup
      style={{ padding: 0, minWidth: 200 }}
      open={open}
      onClick={() => setOpen(false)}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      content={
         <Menu fluid vertical>
          {listFields.length > 0 && listFields.map((e) => {
            return <Menu.Item className={style.menuItem} onClick={() => handleSearch(e.value)}>
              <>
                {
                  e.value === filterValue && <Icon name="check" />
                }
                {
                  e.name
                }
              </>
              </Menu.Item>;
          })}
        </Menu>
      }
      on="click"
      position="bottom right"
      closeOnDocumentClick
      size="huge"
      flowing
      trigger={
        <div className={style.divIconFilter}>
          <div className={style.t_icon_filter}></div>
        </div>
      }
    />
  );
};

const mapStateToProps = (state) => ({
  currentUrlApi: state.entities?.viettel?.currentUrlApi,
  searchText: state.entities?.viettel?.searchText,
  orderBy: state.entities?.viettel?.orderBy,
  filterValue: state.entities?.viettel?.filterValue,
  currentObjectType: state?.common?.currentObjectType,
  isShowAdvancedSearch: state?.search?.VT?.shown,
  reduxState: state
});

const mapDispatchToProps = {
  requestFetchList,
  setOrderBy,
  setActivePage,
  setFilterValue
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickFiter);
