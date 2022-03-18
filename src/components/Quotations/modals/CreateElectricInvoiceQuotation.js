import React from 'react';
import CreateServicePackTableQuotation from './CreateServicePackTableQuotation';
import CreateCostTableQuotation from './CreateCostTableQuotation';
import CreateHSMForElectricInvoiceTableQuotation from './CreateHSMForElectricInvoiceTableQuotation';
import { getElectricInvoiceTitle } from '../Utils/getTitle';
import { isUnique } from '../Utils/checkIsUnique';


const CreateElectricInvoiceQuotation = (props) => {
    const { addServices, deleteServices, servicesData, handleSelectService, handleDeleteAllTable, errors } = props;
    const commonProps = {
        addServices,
        deleteServices,
        handleDeleteAllTable,
        handleSelectService
    };
    
    let titleCosts = "II. CÁC LOẠI PHÍ";
    let titleHSM = "III. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT";
    return (
        <div>
               <CreateServicePackTableQuotation type="servicePack" servicesData={servicesData.servicePack}  
                                                        errors={errors.servicePack} {...commonProps} />
            
            
                <CreateCostTableQuotation type="costs" title={titleCosts} servicesData={servicesData.costs}  
                                                    errors={errors.costs} {...commonProps} />
            
            
                <CreateHSMForElectricInvoiceTableQuotation type="hsm" title={titleHSM} servicesData={servicesData.hsm}  
                                                errors={errors.hsm} {...commonProps} />
        </div>
    )
}

export default CreateElectricInvoiceQuotation;