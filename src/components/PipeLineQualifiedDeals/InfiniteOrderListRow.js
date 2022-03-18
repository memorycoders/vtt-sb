import React, { useState } from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';
import NoResults from '../NoResults/NoResults';
import { connect } from 'react-redux';
import css from './table.css';
import moment from 'moment';
import api from '../../lib/apiClient';
import { compose, withProps } from 'recompose';
import _l from 'lib/i18n';
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import { withRouter } from 'react-router';
import { ROUTERS } from '../../Constants';
import ViettelProductDetail from '../../components/Viettel/ViettelProductDetail';
import OrderDetail from './OrderDetail/OrderDetail';
import { getDetail } from './qualifiedDeal.actions';

const InfiniteOrderListRow = (props) => {
  const { isShowAdvancedSearch, hasDetail, history, setItemSelected, getDetail } = props;
  const [orderBy, setOrderBy] = useState('');
  const toggleSort = (value) => {
    if (value === 'actions') return;
    let newOrderBy = orderBy === value ? '' : value;
    setOrderBy(newOrderBy);
  };
  const headers = [
    { key: 'completionProgress', name: _l`Completion progress`, textAlign: 'left' },
    { key: 'companyName', name: _l`Company name`, textAlign: 'left' },
    { key: 'createDate', name: _l`Create date`, textAlign: 'left' },
    { key: 'status', name: _l`Status`, textAlign: 'left' },
    { key: 'total', name: _l`Total`, textAlign: 'left' },
    // {key: 'actions', name: '', textAlign: 'center'}
  ];
  const data = [
    {
      completionProgress: 50,
      companyName: 'Công ty ANC',
      createDate: '09/12/2019',
      status: 'Đang thực hiện',
      total: '1.999.999đ',
      uuid: '1238123-32919-23391',
      taxNumber: '239123031234',
      phone: '098773231',
      email: 'company@gmail.com',
      contactName: 'Hoàng Phong',
    },
    {
      completionProgress: 20,
      companyName: 'Viettel',
      createDate: '12/12/2019',
      status: 'Đã hoàn thành',
      total: '1.999.999đ',
      uuid: '12381ab-32919aw-23391',
      taxNumber: '239123031234',
      phone: '098773231',
      email: 'company@gmail.com',
      contactName: 'Hoàng Phong',
    },
    {
      completionProgress: 30,
      companyName: 'Viettel Hà Nội',
      createDate: '10/10/2019',
      status: 'Đã hủy',
      total: '1.999.999đ',
      uuid: '1238123-32919-23391',
      taxNumber: '239123031234',
      phone: '098773231',
      email: 'company@gmail.com',
      contactName: 'Hoàng Phong',
    },
    {
      completionProgress: 10,
      companyName: 'Công ty TNHH AHT',
      createDate: '20/12/2019',
      status: 'Đang thực hiện',
      total: '1.999.999đ',
      uuid: '1238123-32919-23391',
      taxNumber: '239123031234',
      phone: '098773231',
      email: 'company@gmail.com',
      contactName: 'Hoàng Phong',
    },
    {
      completionProgress: 40,
      companyName: 'No Comp AC',
      createDate: '20/12/2019',
      status: 'Đã hủy',
      total: '1.999.999đ',
      uuid: '1238123-32919-23391',
      taxNumber: '239123031234',
      phone: '098773231',
      email: 'company@gmail.com',
      contactName: 'Hoàng Phong',
    },
  ];

  const progressBorberColor = '#df5759';
  const gotoDetail = (e) => {
    history.push(`/${ROUTERS.PIPELINE_ORDER}/${e.uuid}`);
    getDetail(e);
  };
  return (
    <>
      <Table basic="very" className="quotation-table">
        <Table.Header className={css.table_header}>
          <Table.Row>
            {headers.map((h) => (
              <Table.HeaderCell
                key={h.key}
                width={h.key === 'companyName' || h.key === 'status' ? 4 : 2}
                textAlign={h.textAlign}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  toggleSort(h.key);
                }}
              >
                {h.name}
                {h.key === orderBy && <Icon name="angle down" />}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body className={isShowAdvancedSearch ? css.table_body_short : css.table_body_long}>
          {data.length > 0 &&
            data.map((item) => (
              <Table.Row onClick={() => gotoDetail(item)}>
                <Table.Cell width={2}>
                  <CircularProgressBar
                    color={progressBorberColor}
                    width={50}
                    height={50}
                    percentage={item.completionProgress}
                  />
                </Table.Cell>
                <Table.Cell width={4}>{item?.companyName}</Table.Cell>
                <Table.Cell width={2}>{item.createDate}</Table.Cell>
                <Table.Cell width={4}>
                  <span
                    style={{
                      color:
                        item.status === 'Đang thực hiện' ? '#F0A40F' : item.status === 'Đã hủy' ? '#C4122C' : '16D206',
                    }}
                  >
                    {item.status}
                  </span>
                </Table.Cell>
                <Table.Cell width={2}>
                  <span style={{ color: '#57A894' }}>{item.total}</span>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {data.length === 0 && (
        <div className={css.container_no_result}>
          <NoResults title="Kết quả tìm kiếm" message="Không có báo giá nào được tìm thấy" />
        </div>
      )}
    </>
  );
};

let mapStateToProps = (state) => {
  return {
    isShowAdvancedSearch: state?.search.QUOTATION.shown,
  };
};

let mapDispatchToProps = {
  getDetail
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(InfiniteOrderListRow);
