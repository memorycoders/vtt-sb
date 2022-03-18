import React, { useState, useEffect } from 'react';
import { Table, Icon, Dropdown } from 'semantic-ui-react';
import { getUnique } from '../Utils/getUnique';
import api from '../../../lib/apiClient'; 
import { SERVICE_ID, TABLE_SERVICE_TYPE } from '../Constants';
import { formatNumber } from '../Utils/formatNumber';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';




const CreateHSMForElectricInvoiceTableRowQuotation = (props) => {
    const { index, type, data, deleteServices, onChangeSelectedService, notifyError } = props;
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
    const [ usingTimeOptions, setUsingTimeOptions] = useState([]);
    const [ hthmCodeOptions, setHTHMCodeOptions] = useState([]);
    const { id } = data;

    useEffect(() => {
        fetchConnectionType();
    },[])

    const fetchConnectionType = async () => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-type',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType: TABLE_SERVICE_TYPE.HSM,
                    hsmHDDT: true
                }
            });
            if(res) {
                let connectionTypeOptions = res.map(item => {
                    return {
                        key: item,
                        value: item,
                        text: item
                    }
                });
                setConnectionTypeOptions(connectionTypeOptions);
                if(data?.connectionType && data?.monthToUse) {
                    fetchOptions(data.connectionType, data.monthToUse);
                }
            } else {
                setConnectionTypeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const fetchOptions = async (type, monthToUse) => {
        try {
            let res_1 = await api.get({
                resource: 'quotation-v3.0/quotation/get-month-use',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType: TABLE_SERVICE_TYPE.HSM,
                    hsmHDDT: true,
                    type
                }
            });
            if(res_1) {
                let res_2 = await api.get({
                    resource: 'quotation-v3.0/quotation/get-production-services',
                    query: {
                        serviceId: SERVICE_ID.CA,
                        deviceType: TABLE_SERVICE_TYPE.HSM,
                        hsmHDDT: true,
                        type,
                        monthToUse
                    }
                });
                if(res_2) {
                    let usingTimeOptions = res_1.map(item => {
                        return {
                            key: item,
                            value: item,
                            text: `${item} tháng`
                        }
                    });
                    let monthToUseOptions = res_2.map(item => {
                        return {
                            key: item.hthmCode,
                            value: item.hthmCode,
                            text: item.hthmCode
                        }
                    });
                    setUsingTimeOptions(usingTimeOptions);
                    setHTHMCodeOptions(monthToUseOptions);
                }
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleDelete = () => {
        deleteServices(type, id);
    }

    //chọn hình thức hoà mạng
    const handleSelectConnectionType = (event, {value}) => {
        if(data?.connectionType === value) return;
        let service = {
            connectionType: value,
            monthToUse: undefined,
            hthmCode: undefined,
            price: 0,
            productionServiceUUID: undefined
        };
        onChangeSelectedService(type, id, service);
        fetchUsingTime(value);
    }

    const fetchUsingTime = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-month-use',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType: TABLE_SERVICE_TYPE.HSM,
                    hsmHDDT: true,
                    type: value
                }
            });
            if(res) {
                let usingTimeOptions = res.map(item => {
                    return {
                        key: item,
                        value: item,
                        text: `${item} tháng`
                    }
                });
                setUsingTimeOptions(usingTimeOptions);
            } else {
                setUsingTimeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    // chọn thời gian sử dụng
    const handleSelectUsingTime = (event, { value }) => {
        if(data?.monthToUse === value) return;
        let service = {
            monthToUse: value,
            hthmCode: undefined,
            price: 0,
            productionServiceUUID: undefined
        };
        onChangeSelectedService(type, id, service);
        fetchCodeService(value);
    }

    const fetchCodeService = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType: TABLE_SERVICE_TYPE.HSM,
                    hsmHDDT: true,
                    type: data?.connectionType,
                    monthToUse: value
                }
            });
            if(res) {
                let hthmCodeOptions = res.map(item => {
                    return {
                        key: item.hthmCode,
                        value: item.hthmCode,
                        text: item.hthmCode
                    }
                });
                setHTHMCodeOptions(hthmCodeOptions);
            } else {
                setHTHMCodeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn mã gói cước
    const handleSelectCode = (event, {value} ) => {
        if(data?.hthmCode === value) return;
        fetchProducts(value);
    }

    const fetchProducts = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType: TABLE_SERVICE_TYPE.HSM,
                    hsmHDDT: true,
                    type: data?.connectionType,
                    monthToUse: data?.monthToUse,
                    hthmCode: value
                }
            });
            if(res) {
                let product = res[0];
                let service = {
                    hthmCode: value,
                    price: product?.price,
                    productionServiceUUID: product?.uuid
                };
                onChangeSelectedService(type, id, service);
            } else {
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
            
        } catch(err) {
            console.log()
        }
    }

 
    return (
        <Table.Row>
            <Table.Cell textAlign="center">{index + 1}</Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn hình thức hòa mạng" search selection options={connectionTypeOptions} 
                    value={data?.connectionType} onChange={handleSelectConnectionType} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn thời gian sử dụng" search selection options={usingTimeOptions} 
                    value={data?.monthToUse} disabled={data?.connectionType ? false: true} onChange={handleSelectUsingTime} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn mã HTHM" search selection options={hthmCodeOptions} 
                    value={data?.hthmCode} disabled={data?.connectionType ? false : true} onChange={handleSelectCode} />
            </Table.Cell>
            <Table.Cell textAlign="center">{formatNumber(data?.price)}</Table.Cell>
            <Table.Cell textAlign="center">
                <Icon name="trash alternate" style={{cursor: 'pointer'}} onClick={handleDelete} />
            </Table.Cell>
        </Table.Row>
    )
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = {
    notifyError: NotificationActions.error,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateHSMForElectricInvoiceTableRowQuotation);