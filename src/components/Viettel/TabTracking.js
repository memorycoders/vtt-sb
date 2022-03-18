import React from 'react';
import VtTable from './Table';

const TabTraking = () => {
  const header = [
    { title: 'Chính sách', key: 'policy', textAlign: 'center' },
    { title: 'Mặt hàng', key: 'itemName' },
    { title: 'Hình thức thanh toán', key: 'paymentMethod' },
    { title: 'Thời gian sử dụng (tháng)', key: 'monthToUse', textAlign: 'center' },
    { title: 'Đối tượng', key: 'target', textAlign: 'center' },
    { title: 'Phạm vi áp dụng', key: 'scope', textAlign: 'center' },
    { title: 'Cước hàng tháng (VNĐ)', key: 'monthlyFee', textAlign: 'center', type: 'number' },
    { title: 'Tổng tiền (VNĐ)', key: 'totalPrice', textAlign: 'center', type: 'number' },
  ];
  const url = 'administration-v3.0/production/listVTracking';
  return <VtTable header={header} url={url} type="tracking" />;
};

export default TabTraking;
