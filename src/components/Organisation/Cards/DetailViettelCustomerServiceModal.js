import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import moment from 'moment';

export const DetailViettelCustomerServiceModal = ({ visible, onDone, onClose, data }) => {
  return (
    <ModalCommon
      visible={visible}
      size="large"
      cancelLabel="Đóng"
      title="Thông tin thuê bao đầu nối"
      // cancelHidden={true}
      okHidden={true}
      onDone={onDone}
      onClose={onClose}
    >
      <div style={{ overflow: 'overlay' }}>
        <Table celled className="table-detail-customer-service-viettel">
          <TableHeader>
            <TableHeaderCell>STT</TableHeaderCell>
            <TableHeaderCell singleLine>Dịch vụ đầu nối</TableHeaderCell>
            <TableHeaderCell singleLine>Thời gian đầu nối</TableHeaderCell>
            <TableHeaderCell singleLine>Số thuê bao</TableHeaderCell>
            <TableHeaderCell singleLine>Mã gói cước của thuê bao dịch vụ</TableHeaderCell>
            <TableHeaderCell singleLine>Thời gian sử dụng</TableHeaderCell>
            <TableHeaderCell singleLine>Hình thức hoà mạng</TableHeaderCell>
            <TableHeaderCell singleLine>Mã khuyến mại</TableHeaderCell>
            <TableHeaderCell singleLine>Ngày gia hạn gần nhất</TableHeaderCell>
            <TableHeaderCell singleLine>Nhân viên phát triển</TableHeaderCell>
            <TableHeaderCell singleLine>Địa chỉ thông báo cước</TableHeaderCell>
            <TableHeaderCell singleLine>Người đại diện</TableHeaderCell>
            <TableHeaderCell singleLine>Địa chỉ người đại diện</TableHeaderCell>
            <TableHeaderCell singleLine>Số SERIAL USB TOKEN</TableHeaderCell>
            <TableHeaderCell singleLine>SERIAL chứng từ số</TableHeaderCell>
            <TableHeaderCell singleLine>Trạng thái chặn cắt</TableHeaderCell>
            <TableHeaderCell singleLine>User đầu nối</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {data?.map((e, index) => {
              return (
                <TableRow key={e.uuid}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{e.serviceName}</TableCell>
                  <TableCell>{e.connectDate}</TableCell>
                  <TableCell>{e.isdn}</TableCell>
                  <TableCell>{e.productCode}</TableCell>
                  <TableCell>{e.subAge}</TableCell>
                  <TableCell>{e.reasonCode}</TableCell>
                  <TableCell>{e.promotionCode}</TableCell>
                  <TableCell>{e.lastExtendDatetime}</TableCell>
                  <TableCell>{e.devStaffCode}</TableCell>
                  <TableCell>{e.billingAddress}</TableCell>
                  <TableCell>{e.repName}</TableCell>
                  <TableCell>{e.repAddress}</TableCell>
                  <TableCell>{e.tokenSerial}</TableCell>
                  <TableCell>{e.ctsSerial}</TableCell>
                  <TableCell>{e.status}</TableCell>
                  <TableCell>{e.connectUser}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DetailViettelCustomerServiceModal);
