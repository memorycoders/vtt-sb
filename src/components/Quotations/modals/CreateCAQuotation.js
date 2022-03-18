import React from 'react';
import CreateUSBTokenTable from './CreateUSBTokenTableQuotation';
import CreateSimHSMTableQuotation from './CreateSimHSMTableQuotation';
// import { getCATitle } from '../Utils/getTitle'; 
// import { isUnique } from '../Utils/checkIsUnique';
import { DEVICE_TYPE } from '../Constants';



const CreateCAQuotation = (props) => {
    const { servicesData, addServices, deleteServices, handleSelectService, handleDeleteAllTable, errors } = props;
    const commonProps = {
        addServices,
        deleteServices,
        handleDeleteAllTable,
        handleSelectService
    };
    let simCATitle = "II. THIẾT BỊ SIMCA";
    let hsmTitle = "III. THIẾT BỊ HSM";

    return (
        <div>
            <CreateUSBTokenTable type="usb" servicesData={servicesData?.usb} errors={errors?.usb} deviceType={DEVICE_TYPE.USB_TOKEN} {...commonProps} /> 
            
            
            <CreateSimHSMTableQuotation type="sim" title={simCATitle} errors={errors?.sim} deviceType={DEVICE_TYPE.SIM_CA} servicesData={servicesData?.sim} {...commonProps} />
            
            
            <CreateSimHSMTableQuotation type="hsm" title={hsmTitle} errors={errors?.hsm} deviceType={DEVICE_TYPE.HSM} servicesData={servicesData?.hsm} {...commonProps} />
        </div>
    )
}

export default CreateCAQuotation;