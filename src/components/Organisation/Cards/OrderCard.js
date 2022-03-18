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
import historyIcon from '../../../../public/History.svg';
import cx from 'classnames';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';
import moment from 'moment';
import OrdersOfCompany from '../../Orders/OrdersOfCompany';



export const OrderCard = (props) => {
  const { setActionForHighlight } = props;
  const [customerServiceList, setCustomerServiceList] = useState([
    {
      customerName: 'Công ty cổ phần ADE',
      service: 'CA',
      status: 'Đang thực hiện',
      total: '1.500.000'
    },
    {
      customerName: 'Công ty cổ phần HN',
      service: 'BHXH',
      status: 'Đã hủy',
      total: '1.500.000'
    },
    {
      customerName: 'Công ty cổ phần HCM',
      service: 'CA',
      status: 'Đã hoàn thành',
      total: '1.500.000'
    },
  ]);
  const [isFetching, setIsFetching] = useState(false);
  const [history, handleHistory] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [typeService, setTypeService ] = useState('');
  const [detail, setDetail] = useState([]);

  const RightMenu = () => {
    return (
      <>
        <Menu.Item
          className={cx(css.rightIcon, history && css.circleAvtive)}
          onClick={() => {
            handleHistory(!history);
          }}
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
  const showDetailQuotation = async (quotation) => {
    // try {
    //   const rs = await api.get({
    //     resource: `quotation-v3.0/quotation/${quotation.uuid}`,
    //   });
    //   if (rs) {
    //     setDetail(rs);
    //     setTypeService(rs.type);
    //   }
    // } catch (err) {
    //   console.log('Error ->', err.message)
    // }
    setShowDetail(true);
}

  const closeDetailQuotation = () => {
    setShowDetail(false);
  }
  if (customerServiceList.length === 0) {
    return (
      <Collapsible
        hasDragable
        count="0"
        width={308}
        padded
        title='Đơn hàng con'
      >
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>{_l`Loading`}</Loader>
          </div>
        ) : (
          <Message active info>
            Không có đơn hàng con
          </Message>
        )}
      </Collapsible>
    );
  }

  return (
    <>
      <Collapsible
        hasDragable
        count={customerServiceList.length}
        width={308}
        title='Đơn hàng con'
        // right={<RightMenu handleHistory={handleHistory} history={history} />}
      >
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>{_l`Loading`}</Loader>
          </div>
        ) : (
          <>
            <Table selectable basic="very" className="vt-table-customer-survice">
              <TableHeader>
                <TableHeaderCell>Khách hàng</TableHeaderCell>
                <TableHeaderCell>{_l`Service`}</TableHeaderCell>
                <TableHeaderCell>{_l`Status`}</TableHeaderCell>
                <TableHeaderCell>Tổng tiền(VNĐ)</TableHeaderCell>
              </TableHeader>
              <TableBody>
                {customerServiceList.map((e, index) => {
                  return (
                    <TableRow key={e.uuid} style={{ cursor: 'pointer' }} onClick={() => showDetailQuotation(e)}>
                      <TableCell textAlign="left" width={5}>
                        {e.customerName}
                      </TableCell>
                      <TableCell textAlign="center" width={2}>
                        {e.service ? e.service : 'BHXH'}
                      </TableCell>
                      <TableCell textAlign="left" width={2}>
                      <span
                    style={{
                      color:
                        e.status === 'Đang thực hiện' ? '#F0A40F' : e.status === 'Đã hủy' ? '#C4122C' : '16D206',
                    }}
                  >
                    {e.status}
                  </span>
                      </TableCell>
                      <TableCell textAlign="center" width={2}>
                        {e.total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </Collapsible>
      {/* <QuotationDetail detail={detail} open={showDetail} typeService={typeService} handleClose={closeDetailQuotation} /> */}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setActionForHighlight: OverviewActions.setActionForHighlight,

};

export default connect(mapStateToProps, mapDispatchToProps)(OrderCard);
