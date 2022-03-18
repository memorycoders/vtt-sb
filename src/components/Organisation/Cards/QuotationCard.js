import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Collapsible } from 'components';
import {
  Message,
  Loader,
  Table,
  TableHeaderCell,
  TableHeader,
  TableBody,
  TableCell,
  Menu,
  TableRow,
  Icon,
  Popup,
  Image,
} from 'semantic-ui-react';
import css from '../Cards/TasksCard.css';
import api from '../../../lib/apiClient';
import _l from 'lib/i18n';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { CssNames } from 'Constants';
import star from '../../../../public/star_circle_won_active.svg';
import star_blank from '../../../../public/star_circle_won.svg';
import pdf from '../../../../public/icon_pdf.png';
import email from '../../../../public/email.svg';
import add from '../../../../public/Add.svg';
import copy from '../../../../public/copy.svg';
import image from '../../../../public/square-image.png';
import historyIcon from '../../../../public/History.svg';
import cx from 'classnames';
import QuotationDetail from '../../Quotations/QuotationDetail';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';
import moment from 'moment';
import EditQuotation from '../../Quotations/modals/EditQuotation';
import DeleteQuotation from '../../Quotations/modals/DeleteQuatation';
import SendQuotationByEmail from '../../Quotations/modals/SendQuotationByEmail';
import ConfirmQuotation from '../../Quotations/modals/ConfirmQuotation';
import QuotationPreviewPDF from '../../Quotations/QuotationExport';
import { fetchQuotationOfOneCustomer } from '../../Quotations/quotation.action';
import { saveAs } from 'file-saver';
import { RequireAMRole, RequireManagerRole } from '../../Permissions';
import { USER_ROLES } from '../../Permissions/constants';
import CreateOrders from '../../Orders/CreateOrder';



export const QuotationCard = (props) => {
  const { setActionForHighlight, account, fetchQuotation, customerServiceList, totalRecord, userRole} = props;
  const [isFetching, setIsFetching] = useState(false);
  const [isFilterHistory, setIsFilterHistory] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [typeService, setTypeService ] = useState('');
  const [detail, setDetail] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [quotationEditing, setQuotationEditing] = useState(undefined);
  const [quotationDelete, setDelete] = useState(false);
  const [uuid, setUuid] = useState('');
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [isConfirmStatus, setIsConfirmStatus] = useState(false);
  const [isPreviewPDF, setIsPreviewPDF] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const statusText = {
    UNSENT: 'Chưa gửi',
    SENT: 'Đã gửi',
    CREATED_ORDER: 'Đã tạo đơn hàng',
    COMPLETED: 'Hoàn thành'
  }

  const handleFilterHistory = () => {
    console.log("handleFilterHistory running");
    setIsFilterHistory(!isFilterHistory);
    fetchQuotation({
      organisationId: account.uuid,
      pageSize: 999,
      order: !isFilterHistory
    })
  }

  const openDelete = async (quotation) => {
    setDelete(true);
    setUuid(quotation.uuid);
  }

  const closeDelete = async () => {
    setDelete(false);
    setUuid('');
  }

  useEffect(() => {
    fetchQuotation({
      organisationId: account.uuid,
      pageSize: 999,
      order: false
    })
  }, [])

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

  const addOrder = () => {
    setActionForHighlight(OverviewTypes.Activity.Quotation_Create, 'create');
  }

  const openEditQuotation = (quotation) => {
    setShowEdit(true);
    setQuotationEditing(quotation.uuid)
  }

  const closeEditQuotation = () => {
    setShowEdit(false);
    setIsCreate(false);
    setQuotationEditing(undefined);
  }

  const openDuplicateQuotation = (quotation) => {
    setShowEdit(true);
    setIsCreate(true);
    setQuotationEditing(quotation.uuid);
  }

  // const handleSave = () => {
  //   fetchDataQuotation();
  // }

  const openSendEmail = (quotation) => {
    setShowSendEmail(true);
    setUuid(quotation.uuid);
  }

  const closeSendEmail = () => {
    setShowSendEmail(false);
    setUuid('');
  }

  const openConfirmStatus = (event, quotation) => {
    if(userRole !== USER_ROLES.AM) return; 
    event.stopPropagation();
    setIsConfirmStatus(true);
    setQuotationEditing(quotation);
  }

  const closeConfirmStatus = () => {
    setIsConfirmStatus(false);
    setQuotationEditing(undefined);
  }

  const openPreviewPDF = (quotation) => {
    setIsPreviewPDF(true);
    setQuotationEditing(quotation)
  }

  const  closePreviewPDF = () => {
    setIsPreviewPDF(false);
    setQuotationEditing(undefined);
  }

  const exportImge = async (quotation) => {
    try {
      let res = await api.get({
        resource: `quotation-v3.0/quotation/report/${quotation.uuid}`,
        query: {
          type: 'image'
        },
        options: {
          responseType: 'blob',
        }
      });
      if(res) {
        saveAs(res,`${quotation.name}.png`);
      }
    } catch (err) {
      console.log('Error ->', err.message)
    }
  }

  const openCreateOrder = (quotation) => {
    console.log("openCreateOrder ", quotation);
    setShowCreateOrder(true);
    setUuid(quotation.uuid);
  }

  const closeCreateOrder = () => {
    setShowCreateOrder(false);
    setUuid('');
  }

  const RightMenu = () => {
    return (
      <>
        <Menu.Item
          className={cx(css.rightIcon, isFilterHistory && css.circleAvtive)}
          onClick={handleFilterHistory}
        >
          <Popup hoverable position="top right" trigger={<Image className={css.historyIcon} src={historyIcon} />}>
            <Popup.Content>
              <p>{_l`History`}</p>
            </Popup.Content>
          </Popup>
        </Menu.Item>
      </>
    );
  };

  const ActionMenu = (e, props) => {
    return (
      <>
        <MoreMenu id="mutil_action" color={CssNames.Task}>
          <RequireAMRole>
            {
              (e.e.status === 'SENT' && e.e.accepted) && <Menu.Item icon onClick={() => openCreateOrder(e.e)}>
              <div className={css.actionIcon}>
                {_l`Add order`}
                <img style={{ height: '11px', width: '15px' }} src={add} />
              </div>
              </Menu.Item>
            }
          </RequireAMRole>
          <RequireAMRole>
            {
              e.e.status === 'UNSENT' && <Menu.Item icon onClick={() => openEditQuotation(e.e)}>
              <div className={css.actionIcon}>
                {_l`Edit`}
                <img style={{ height: '11px', width: '15px' }} src={add} />
              </div>
              </Menu.Item>
            }
          </RequireAMRole>
          <RequireAMRole>
            {
              e.e.status !== 'COMPLETED' && <Menu.Item icon onClick={() => openSendEmail(e.e)}>
                <div className={css.actionIcon}>
                  {_l`Send email`}
                  <img style={{ height: '11px', width: '15px' }} src={email} />
                </div>
              </Menu.Item>
            }
          </RequireAMRole>
          <RequireAMRole>
            {
              e.e.status !== 'COMPLETED' && <Menu.Item icon onClick={() => openDuplicateQuotation(e.e)}>
                <div className={css.actionIcon}>
                  {_l`Copy`}
                  <img style={{ height: '11px', width: '15px' }} src={copy} />
                </div>
              </Menu.Item>
            }
          </RequireAMRole>
          <Menu.Item icon onClick={() => openPreviewPDF(e.e)}>
            <div className={css.actionIcon}>
              {_l`Export to PDF`}
              <img style={{ height: '11px', width: '15px' }} src={pdf} />
            </div>
          </Menu.Item>
          <Menu.Item icon onClick={() => exportImge(e.e)}>
            <div className={css.actionIcon}>
              {_l`Export to image`}
              <img style={{ height: '11px', width: '15px' }} src={image} />
            </div>
          </Menu.Item>
          <RequireAMRole>
            {
              e.e.status === 'UNSENT' && <Menu.Item icon>
                <div onClick={() => openDelete(e.e)} className={css.actionIcon}>
                  {_l`Delete`}
                  <Icon name="trash alternate" color="grey" />
                </div>
              </Menu.Item>
            }
          </RequireAMRole>
        </MoreMenu>
      </>
    );
  };

  if (customerServiceList.length === 0) {
    return (
      <Collapsible
        hasDragable
        count="0"
        width={308}
        padded
        title={_l`Quotations`}
        right={<RightMenu />}
      >
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>{_l`Loading`}</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No qoutations`}
          </Message>
        )}
      </Collapsible>
    );
  }

  return (
    <>
      <Collapsible
        hasDragable
        count={totalRecord}
        width={308}
        title={_l`Quotations`}
        right={<RightMenu />}
      >
            <Table selectable basic="very" className="vt-table-customer-survice">
              <TableHeader>
                <TableHeaderCell>Tên báo giá</TableHeaderCell>
                <TableHeaderCell>Dịch vụ</TableHeaderCell>
                <TableHeaderCell>Ngày tạo</TableHeaderCell>
                <TableHeaderCell>Trạng thái</TableHeaderCell>
                {!isFilterHistory && <TableHeaderCell></TableHeaderCell>}
                <TableHeaderCell></TableHeaderCell>
              </TableHeader>
              <TableBody>
                {customerServiceList && customerServiceList.map((e, index) => {
                  return (
                    <TableRow key={e.uuid} style={{ cursor: 'pointer' }} onClick={() => showDetailQuotation(e)}>
                      <TableCell textAlign="left" width={5} className={css.cell_name}>
                        {e.name}
                      </TableCell>
                      <TableCell textAlign="center" width={2}>
                          {e.service}
                      </TableCell>
                      <TableCell textAlign="left" width={2}>
                        {moment(e?.createdAt).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell textAlign="center" width={2}>
                        { statusText[e.status] }
                      </TableCell>
                      {
                        !isFilterHistory && <TableCell textAlign="left" width={1}>
                          {(e.status === 'SENT' && !e.accepted) && <img src={star_blank} style={{ width: '15px', height: '25px' }} onClick={(event) => {openConfirmStatus(event, e)}} />}
                          {(e.status === 'SENT' && e.accepted) && <img src={star} style={{ width: '15px', height: '25px' }} onClick={(event) => {openConfirmStatus(event, e)}} />}
                        </TableCell>
                      }
                      <TableCell textAlign="left" width={1}>
                        <ActionMenu e={e} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
      </Collapsible>
      <QuotationDetail detail={detail} open={showDetail} typeService={typeService} handleClose={closeDetailQuotation} />
      { showEdit && <EditQuotation visible={showEdit} uuid={quotationEditing} isCreate={isCreate}
                      onClose={closeEditQuotation} organisationUUID={account?.uuid} /> }
      { quotationDelete && <DeleteQuotation visible={quotationDelete} uuid={uuid} onClose={closeDelete} /> }
      { showSendEmail && <SendQuotationByEmail uuid={uuid} visible={showSendEmail} account={account} onClose={closeSendEmail} /> }
      { isConfirmStatus && <ConfirmQuotation quotation={quotationEditing} visible={isConfirmStatus} onClose={closeConfirmStatus} />}
      { isPreviewPDF && <QuotationPreviewPDF visible={isPreviewPDF} quotation={quotationEditing} onClose={closePreviewPDF}  />}
      { showCreateOrder && <CreateOrders visible={showCreateOrder} quotationUUID={uuid} onClose={closeCreateOrder} account={account} /> }
    </>
  );
};

const mapStateToProps = (state) => ({
  customerServiceList: state?.entities?.quotation?.quotationOfCustomer?.data,
  totalRecord: state?.entities?.quotation?.quotationOfCustomer?.totalActiveOrHistory,
  userRole: state?.auth?.user?.userRole
});

const mapDispatchToProps = {
  setActionForHighlight: OverviewActions.setActionForHighlight,
  fetchQuotation: fetchQuotationOfOneCustomer
};

export default connect(mapStateToProps, mapDispatchToProps)(QuotationCard);

