import React, { useEffect, useState } from 'react';
import VtTable from './Table';

const TabBill = () => {
  const header = [
    { title: 'Hình thức hoà mạng', key: 'connectionType', textAlign: 'center' },
    { title: 'Loại sản phẩm', key: 'productionType' },
    { title: 'Số lượng hoá đơn', key: 'numberOrder', textAlign: 'left', type:'number' },
    { title: 'Giá (VNĐ)', key: 'vatIncluded', textAlign: 'left', type:'number' },
  ];

  const url = 'administration-v3.0/production/listHDDT';
  return <VtTable header={header} url={url} type="hddt" />;
};

export default TabBill;
