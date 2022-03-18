import React, {useState, useEffect } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import CreateQuotation from './CreateQuotation';
import api from '../../../lib/apiClient';
// import { Loader } from 'semantic-ui-react';
import { TEMPLATES_SERVICE, TABLE_SERVICE_TYPE } from '../Constants';
import css from '../styles/createQuotation.css';


const EditQuotation = (props) => {
    const { uuid, visible, onClose, isCreate, organisationUUID } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        setIsLoading(true);
        fetchDetailQuotation();
    },[])
    
    const fetchDetailQuotation = async () => {
        try {
            let res = await api.get({
                resource: `quotation-v3.0/quotation/${uuid}`
            });
            if(res) {
                console.log("quotation detail ", res);
                let template, quotationName, customerInfo, serviceData; 
                template = {
                    name: res.type,
                    uuid: res.quotationTemplateUUID
                };
                quotationName = res.quotationName;
                const {customer, code, address, email, am} = res.organisationDTO;
                customerInfo = {
                    nameCustomer: customer,
                    taxNumber: code,
                    addressCustomer: address,
                    email,
                    nameAM: am,
                    uuid: organisationUUID 
                };
                switch(res.type) {
                    case TEMPLATES_SERVICE.GENERAL: {
                        serviceData = {
                            servicePack: res.quotationDetailTypeDTOS[0].quotationDetailDTOList.map((item,index) => {
                                if(isCreate) {
                                    return {
                                        ...item,
                                        id: index,
                                        new: true,
                                        priceTotal: item.price
                                    };
                                }
                                return {
                                    ...item,
                                    id: index,
                                    update: true,
                                    priceTotal: item.price
                                };
                            })
                        }
                        break;
                    }
                    case TEMPLATES_SERVICE.CA1: {
                        template.name = TEMPLATES_SERVICE.CA;
                        let usb = [], sim = [], hsm = [];
                        let usbIndex = res.quotationDetailTypeDTOS.findIndex(item => item.type === TABLE_SERVICE_TYPE.USB_TOKEN);
                        if(usbIndex > -1) {
                            usb = res.quotationDetailTypeDTOS[usbIndex].quotationDetailDTOList.map((item, index) => {
                                if(isCreate) {
                                    return  {
                                        ...item, 
                                        id: index, 
                                        new: true,
                                        priceTotal: (item.priceService + item.priceDevice)*item.quantity
                                    };
                                }
                                return  {
                                            ...item, 
                                            id: index, 
                                            update: true,
                                            priceTotal: (item.priceService + item.priceDevice)*item.quantity
                                        };
                            });
                        }
                        
                        let simIndex = res.quotationDetailTypeDTOS.findIndex(item => item.type === TABLE_SERVICE_TYPE.SIM_CA);
                        if(simIndex > -1) {
                            sim = res.quotationDetailTypeDTOS[simIndex].quotationDetailDTOList.map((item, index) => {
                                if(isCreate) {
                                    return  {
                                        ...item, 
                                        id: index, 
                                        new: true,
                                        priceTotal: item.price*item.quantity
                                    };
                                }
                                return  {
                                            ...item, 
                                            id: index, 
                                            update: true,
                                            priceTotal: item.price*item.quantity
                                        };
                            });
                        } 

                        let hsmIndex = res.quotationDetailTypeDTOS.findIndex(item => item.type === TABLE_SERVICE_TYPE.HSM);
                        if(hsmIndex > -1) {
                            hsm = res.quotationDetailTypeDTOS[hsmIndex].quotationDetailDTOList.map((item, index) => {
                                if(isCreate) {
                                    return  {
                                        ...item, 
                                        id: index, 
                                        new: true,
                                        priceTotal: item.price*item.quantity
                                    };
                                }
                                return  {
                                            ...item, 
                                            id: index, 
                                            update: true,
                                            priceTotal: item.price*item.quantity
                                        };
                            });
                        }
                        serviceData = {
                            usb,
                            sim,
                            hsm
                        };
                        break;
                    }
                    case TEMPLATES_SERVICE.HDDT: {
                        let servicePack = [], costs = [], hsm = [];
                        let servicePackIndex = res.quotationDetailTypeDTOS.findIndex(item => item.type === TABLE_SERVICE_TYPE.SERVICE_PACK);
                        if(servicePackIndex > -1) {
                            servicePack = res.quotationDetailTypeDTOS[servicePackIndex].quotationDetailDTOList.map((item,index) => {
                                if(isCreate) {
                                    return {
                                        ...item,
                                        id: index,
                                        new: true,
                                        priceTotal: item.price*item.quantity
                                    }
                                }
                                return {
                                    ...item,
                                    id: index,
                                    update: true,
                                    priceTotal: item.price*item.quantity
                                }
                            })
                        }
                       
                        let costsIndex = res.quotationDetailTypeDTOS.findIndex(item => item.type === TABLE_SERVICE_TYPE.COSTS);
                        if(costsIndex > -1) {
                            costs = res.quotationDetailTypeDTOS[costsIndex].quotationDetailDTOList.map((item, index) => {
                                if(isCreate) {
                                    return {
                                        ...item,
                                        id: index,
                                        new: true
                                    }
                                }
                                return {
                                    ...item,
                                    id: index,
                                    update: true
                                }
                               
                            })
                        }

                        let hsmIndex = res.quotationDetailTypeDTOS.findIndex(item => item.type === TABLE_SERVICE_TYPE.HSM);

                        if(hsmIndex > -1) {
                            hsm = res.quotationDetailTypeDTOS[hsmIndex].quotationDetailDTOList.map((item, index) => {
                                if(isCreate) {
                                    return {
                                        ...item,
                                        id: index,
                                        new: true
                                    }
                                }
                                return {
                                    ...item,
                                    id: index,
                                    update: true
                                }
                            })
                        }
                        serviceData = {
                            servicePack,
                            costs,
                            hsm
                        };
                        break;
                    }
                    case TEMPLATES_SERVICE.BHXH1: {
                        template.name = TEMPLATES_SERVICE.BHXH;
                        let servicePack = res.quotationDetailTypeDTOS[0].quotationDetailDTOList.map((item, index) => {
                            return {...item, id: index, update: true, priceTotal: item.quantity*item.price};
                          });
                        serviceData = {
                            servicePack
                        };
                        break;
                    }
                }
                
                let newData = {
                    template,
                    quotationName,
                    customerInfo,
                    serviceData
                };
                if(!isCreate) {
                    newData.uuid = uuid;
                }

                setData(newData);
                setIsLoading(false);
            }
        } catch(err) {
            console.log("err: ", err);
            setIsLoading(false);
        }
    }

    const onDone = () => {};


    //render...
    return (
        <>
            {
                isLoading && <ModalCommon title={isCreate ? "Tạo báo giá" : "Chỉnh sửa báo giá"} visible={visible} onDone={onDone} onClose={onClose} okHidden={true} noLabel="Huỷ">
                    <div className={css.loading}>
                        Loading...
                        {/* <Loader active inline='centered' >loading</Loader> */}
                    </div>
                </ModalCommon>
            }
            {
                !isLoading && <CreateQuotation data={data} onCloseEdit={onClose} isEdit={true} visibleEdit={visible} />
            }
        </>
    )

}

export default EditQuotation;