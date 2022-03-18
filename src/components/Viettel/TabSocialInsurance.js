import React from 'react';
import VtTable from './Table';

const TabSocialInsurance = () => {
  const header = [
    { title: 'Hình thức hoà mạng', key: 'connectionType', textAlign: 'center' },
    { title: 'Đối tượng', key: 'customerType' },
    { title: 'Chi tiết', key: 'productionDetail1' },
    { title: 'Thời gian', key: 'timeToUse', textAlign: 'center' },
    { title: 'Đơn giá VAT (VNĐ)', key: 'vatIncluded', textAlign: 'center', type: 'number' },
  ];

  const url = 'administration-v3.0/production/listBHXH';
  return <VtTable header={header} url={url} type="bhxh" />;
};

export default TabSocialInsurance;
