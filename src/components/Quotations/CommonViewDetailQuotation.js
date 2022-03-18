import React, { useState, useEffect }  from 'react';
import { Table } from 'semantic-ui-react';
import css from './styles/quotationDetail.css';
import { formatNumber } from './Utils/formatNumber';
import api from '../../lib/apiClient';
const headers = [
  { key: '0', name: 'STT', textAlign: 'center' },
  { key: '1', name: 'Dịch vụ', textAlign: 'center' },
  { key: '6', name: 'Hình thức hòa mạng', textAlign: 'center' },
  { key: '2', name: 'Tên sản phẩm', textAlign: 'center' },
  { key: '3', name: 'Mã HTHM', textAlign: 'center' },
  { key: '4', name: 'Số lượng', textAlign: 'center' },
  { key: '5', name: 'Đơn giá có VAT(VNĐ)', textAlign: 'center' },
  { key: '7', name: 'Thành tiền (VNĐ)', textAlign: 'center' },
];

const CommonViewDetailTable = (props) => {
  const [service, setService] = useState([]);
  const { data } = props;
  let priceTotal = 0;
  const fetchService = async () => {
    try {
      const rs = await api.get({
        resource: `quotation-v3.0/quotation/services`,
      });
      if (rs) {
        setService(rs);
      }
    } catch(err){
      console.log('==========', err.message)
    }
  };
  useEffect(() => {
    fetchService();
  }, [])
  return (
    <>
      <p className={css.common_title_table}>Danh sách gói cước</p>
      <Table celled structured>
        <Table.Header>
          <Table.Row>
            {headers.map((h) => {
              return (
                <Table.HeaderCell
                  k={h.key}
                  textAlign={h.textAlign}
                  rowSpan={h.key === '5' ? 1 : 2}
                  colSpan={h.key === '5' ? 2 : 1}
                >
                  {h.name}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell textAlign="center"> Giá dịch vụ (VNĐ)</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> Giá thiết bị (VNĐ)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data[0]?.quotationDetailDTOList?.map((item, index) => {
            const total = (item?.priceService + item?.priceDevice)*item?.quantity
            priceTotal += (item?.priceService + item?.priceDevice)*item?.quantity
            const serviceName = service.filter(e => e.serviceId === item.serviceId);
            return (
              <Table.Row>
                <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                <Table.Cell textAlign="left">{serviceName[0] ? serviceName[0]?.serviceName : ''}</Table.Cell>
                <Table.Cell textAlign="left">{item?.connectionType}</Table.Cell>
                <Table.Cell textAlign="left">{item?.productionName}</Table.Cell>
                <Table.Cell textAlign="center">{item?.hthmCode}</Table.Cell>
                <Table.Cell textAlign="center">{item?.quantity}</Table.Cell>
                <Table.Cell textAlign="center">{formatNumber(item?.priceService)}</Table.Cell>
                <Table.Cell textAlign="center">{formatNumber(item?.priceDevice)}</Table.Cell>
                <Table.Cell textAlign="center">{formatNumber(total)}</Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell colSpan={8} textAlign="right" className={css.total_price_text}>
              Tổng giá trị đơn hàng
            </Table.Cell>
            <Table.Cell textAlign="center" className={css.total_price_number}>
              {formatNumber(priceTotal)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default CommonViewDetailTable;
