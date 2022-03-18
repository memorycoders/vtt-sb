import React, { useState }  from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import exportImgIcon from './styles/images/export-img-icon.svg';
import exportPdfIcon from './styles/images/export-pdf-icon.svg';
import star from '../../../public/star_circle_won_active.svg';
import star_blank from '../../../public/star_circle_won.svg';
import NoResults from '../NoResults/NoResults';
import {connect} from 'react-redux';
import QuotationDetail from './QuotationDetail';
import css from './styles/quotations.css';
import moment from 'moment';
import api from '../../lib/apiClient';
import _l from 'lib/i18n';
import QuotationExport from './QuotationExport';
import { setOrderBy, setSort } from './quotation.action';
import { getSearchForSave, getSearch } from '../../components/AdvancedSearch/advanced-search.selectors';

const QuotationTable = (props) => {
    const {isShowAdvancedSearch, headers, data, fetchDataQuotation, setOrderBy, setSort,
      orderBy, searchText, period, fromDate, toDate, pageSize, activePage,
      searchFieldDTOS, history } = props;
    const [showDetail, setShowDetail] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [typeService, setTypeService ] = useState('');
    const [typeExport, setTypeExport ] = useState('');
    const [uuid, setUuid] = useState({});
    const [detail, setDetail] = useState([]);
    const [defaultSort, setSortType] = useState('desc');
    const toggleSort = (value) => {
        if(value === 'Status' || value === 'state' || value === 'action' || value === 'services') return;
        if(defaultSort === 'desc') { setSortType('asc')}
        else { setSortType('desc'); }
        switch(value){
          case 'name' :
            setOrderBy('name');
            setSort(`name:${defaultSort}`);
            fetchDataQuotation({
              pageIndex: activePage - 1,
              sort: `name:${defaultSort}`,
              searchText: searchText,
              period: period,
              fromDate: fromDate,
              toDate: toDate,
              pageSize: pageSize,
              searchFieldDTOS: searchFieldDTOS
            })
            break;
          case 'created_date' :
            setOrderBy('created_date');
            setSort(`created_date:${defaultSort}`);
            fetchDataQuotation({
              pageIndex: activePage - 1,
              sort: `created_date:${defaultSort}`,
              searchText: searchText,
              period: period,
              fromDate: fromDate,
              toDate: toDate,
              pageSize: pageSize,
              searchFieldDTOS: searchFieldDTOS
            })
            break;
          case 'organisationName' :
            setOrderBy('organisationName');
            setSort(`organisationName:${defaultSort}`);
            fetchDataQuotation({
              pageIndex: activePage - 1,
              sort: `organisationName:${defaultSort}`,
              searchText: searchText,
              period: period,
              fromDate: fromDate,
              toDate: toDate,
              pageSize: pageSize,
              searchFieldDTOS: searchFieldDTOS
            })
            break;
        }

    }

    const showDetailQuotation = async (quotation) => {
        try {
          const rs = await api.get({
            resource: `quotation-v3.0/quotation/${quotation.uuid}`,
          });
          if (rs) {
            setDetail(rs);
            setTypeService(rs.type);
          }
        } catch (err) {
          console.log('Error ->', err.message)
        }
        setShowDetail(true);
    }

    const closeDetailQuotation = () => {
        setShowDetail(false);
    }

    const exportPdf = (item) => {
      setShowExport(true);
      setTypeExport('pdf');
      setUuid(item);
    }

    const exportImage = (item) => {
      setShowExport(true);
      setTypeExport('image');
      setUuid(item);
    }

    const closeExport = () => {
      setShowExport(false);
      setTypeExport('');
      setUuid('');
    }

    const status =[
      {
        code: 'SENT',
        status: 'Đã gửi'
      },
      {
        code: 'UNSENT',
        status: 'Chưa gửi'
      },
      {
        code: 'COMPLETED',
        status: 'Hoàn thành'
      },
      {
        code: 'CREATED_ORDER',
        status: 'Đã tạo đơn hàng'
      },
    ]
    let array;
    if(history === false) { array = data.filter(active => active.status === 'SENT' || active.status === 'UNSENT')}
    else { array =  data.filter(active => active.status === 'CREATED_ORDER' || active.status === 'COMPLETED')}

    return (
        <>
            <Table basic="very" className="quotation-table">
                <Table.Header className={css.table_header}>
                    <Table.Row>
                        {
                            headers.map(h => (
                                <Table.HeaderCell key={h.key} width={(h.key === 'organisationName' || h.key === 'name') ? 4 : 2}
                                    textAlign={h.textAlign} style={{ cursor: 'pointer' }} onClick={() => {toggleSort(h.key)}}>
                                    {h.name}
                                    {h.key === orderBy && <Icon name='angle down' />}
                                </Table.HeaderCell>
                            ))
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body className={isShowAdvancedSearch ? css.table_body_short : css.table_body_long}>
                    {
                        (array.length > 0) && array.map(item => (
                            <Table.Row onClick={() => showDetailQuotation(item)}>
                                <Table.Cell width={4} style={{paddingLeft: '15px'}}>{item.name}</Table.Cell>
                                <Table.Cell width={2}>{moment(item?.createdAt).format('DD/MM/YYYY')}</Table.Cell>
                                <Table.Cell width={2}>{item.service ? item.service : 'BHXH'}</Table.Cell>
                                <Table.Cell width={4}>{item.customerName}</Table.Cell>
                                <Table.Cell width={2}>{status.filter(e => e.code === item?.status)[0].status}</Table.Cell>
                                <Table.Cell  width={2}>
                                    {(item.status === 'SENT' && item.accepted !== true) && <img src={star_blank} style={{ width: '15px', height: '25px' }} />}
                                    {(item.status === 'SENT' && item.accepted === true) && <img src={star} style={{ width: '15px', height: '25px' }}/>}
                                </Table.Cell>
                                <Table.Cell width={2} textAlign="center">
                                    <MoreMenu className={css.actions_menu}>
                                        <Menu.Item onClick={() => exportPdf(item)} icon>
                                            <div  className={css.action}>
                                                Xuất PDF
                                                <img src={exportPdfIcon} />
                                            </div>
                                        </Menu.Item>
                                        <Menu.Item onClick={() => exportImage(item)} icon>
                                            <div className={css.action}>
                                                Xuất ảnh
                                                <img src={exportImgIcon} />
                                            </div>
                                        </Menu.Item>
                                    </MoreMenu>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            {
                (data.length === 0) && <div className={css.container_no_result}>
                    <NoResults title="Kết quả tìm kiếm" message="Không có báo giá nào được tìm thấy" />
                </div>
            }
            <QuotationDetail open={showDetail} typeService={typeService} detail={detail} handleClose={closeDetailQuotation} />
           { showExport &&  <QuotationExport visible={showExport} onClose={closeExport} type={typeExport} quotation={uuid}/> }
        </>
    )
}

let mapStateToProps = (state) => {
    const { searchFieldDTOList } = getSearchForSave(state, "QUOTATION");
    const getStateSearch = getSearch(state, "QUOTATION");
    return {
        isShowAdvancedSearch: state?.search.QUOTATION.shown,
        data: state.entities.quotation?.data,
        totalPage: state.entities?.quotation?.totalPage,
        orderBy: state.entities.quotation?.orderBy,
        filterValue: state.entities.quotation?.filterValue,
        searchText: state.entities.quotation?.searchText,
        pageSize: state.entities.quotation?.pageSize,
        activePage: state.entities.quotation?.activePage,
        period: state.settings?.display?.quotation?.timeFilterType?.toLowerCase(),
        fromDate: state.period?.QUOTATION?.startDate,
        toDate: state.period?.QUOTATION?.endDate,
        isShowAdvancedSearch: state?.search?.QUOTATION?.shown,
        searchFieldDTOS: searchFieldDTOList,
        history: getStateSearch?.history,
      }
}

const mapDispatchToProps = {
  setOrderBy,
  setSort
}

export default connect(mapStateToProps, mapDispatchToProps)(QuotationTable);
