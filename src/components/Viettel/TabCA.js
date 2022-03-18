import React from 'react';
import VtTable from './Table';

const TabCA = () => {
  const header = [
    { title: 'Hình thức hoà mạng', key: 'connectionType', textAlign: 'center' },
    { title: 'Loại khách hàng', key: 'customerType' },
    { title: 'Loại thiết bị', key: 'deviceType' },
    { title: 'Chi tiết sản phẩm', key: 'productDetail', textAlign: 'center' },
    { title: 'Thời gian sử dụng (tháng)', key: 'monthToUse', textAlign: 'center' },
    { title: 'Đơn giá có VAT (VNĐ)', key: 'vatIncluded', textAlign: 'center', type:'number' },
  ];
  const url = 'administration-v3.0/production/listCA';
  return <VtTable header={header} url={url} type="ca"/>;
};

export default TabCA;
