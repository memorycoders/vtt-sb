import React from 'react';
import ServicePackTable from './ServicePackTable';
import CostTable from './CostTable';
import HSMForElectricInvoice from './HSMForElectricInvoice'

const getTitle = (listServicePack, costs) => {
    if(listServicePack.length > 0) {
        if(costs.length > 0) {
            return ['II. CÁC LOẠI PHÍ', 'III. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
        } else {
            return ['', 'II. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
        }

    } else {
        if(costs.length > 0) {
            return ['I. CÁC LOẠI PHÍ', 'II. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
        }

        return ['', 'I. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
    }

}

const ElectricInvoiceDetailQuotation = (props) => {
  const { data } = props
  const listServicePack = data?.filter(item => item.type === 'DATA_PACK');
  const costs = data?.filter(item => item.type === 'FEE_TYPE');
  const hsmForInvoices = data?.filter(item => item.type === 'HSM');
  let [titleCost, titleHSMForInvoice] = getTitle(listServicePack, costs);

    return <>
        { listServicePack.length > 0 && <ServicePackTable data={listServicePack} /> }
        { costs.length > 0 && <CostTable data={costs} title={titleCost} /> }
        { hsmForInvoices.length > 0 && <HSMForElectricInvoice data={hsmForInvoices} title={titleHSMForInvoice} /> }
    </>
}

export default ElectricInvoiceDetailQuotation;
