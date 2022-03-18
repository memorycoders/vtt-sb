import React, { useEffect, useState } from 'react';
import { Table, Icon, Dropdown, Input } from 'semantic-ui-react';
import { formatNumber } from '../Utils/formatNumber';
import { SERVICE_ID } from '../Constants';
import api from '../../../lib/apiClient'; 
import css from '../styles/createQuotation.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';

const CreateSimHSMTableRowQuotation = (props) => {
    const { type, data, deleteServices, onChangeSelectedService, deviceType, notifyError } = props;
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
    const [usingTimeOptions, setUsingTimeOptions] = useState([]);
    const [codeServiceOptions, setCodeServiceOptions ] = useState([]);
    const { id } = data;

    useEffect(() => {
        fetchTypeService();
    },[])

    const fetchTypeService = async () => {
        try {
            let res = await api.get(
                {
                    resource: 'quotation-v3.0/quotation/get-type',
                    query: {
                        serviceId: SERVICE_ID.CA,
                        deviceType
                    }
                }
            );
            if(res) {
                let newConnectionTypeOptions = res.map(item => ({
                    key: item,
                    value: item,
                    text: item
                }));
                setConnectionTypeOptions(newConnectionTypeOptions);
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
                    deviceType,
                    type,
                }
            });
            if(res_1) {
                let res_2 = await api.get({
                    resource: 'quotation-v3.0/quotation/get-production-services',
                    query: {
                        serviceId: SERVICE_ID.CA,
                        deviceType,
                        type,
                        monthToUse
                    }
                });
                if(res_2) {
                    let newUsingTimeOptions = res_1.map(item => {
                        return {
                            key: item,
                            value: item,
                            text: `${item} tháng`
                        }
                    });
                    let newCodeOptions = res_2.map(item => {
                        return {
                            key: item.hthmCode,
                            value: item.hthmCode,
                            text: item.hthmCode
                        }
                    });
                    setUsingTimeOptions(newUsingTimeOptions);
                    setCodeServiceOptions(newCodeOptions);
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
    const handleSelectType = (event, {value}) => {
        if(data?.connectionType === value) return;
        let typeService = {
            connectionType: value,
            monthToUse: undefined,
            hthmCode: undefined,
            price: 0,
            quantity: 1,
            priceTotal: 0,
            productionServiceUUID: undefined
        }

        onChangeSelectedService(type, id, typeService);
        fetchUsingTime(value);
    }

    const fetchUsingTime = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-month-use',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType,
                    type: value,
                } 
            });
            if(res) {
                let newUsingTimeOptions = res.map(item => ({
                    key: item,
                    value: item,
                    text: `${item} tháng`
                }));
                setUsingTimeOptions(newUsingTimeOptions);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn thời gian
    const handleSelectTime = (event, {value} ) => {
        if(data?.monthToUse === value) return;
        let service = {
            monthToUse: value,
            hthmCode: undefined,
            price: 0,
            quantity: 1,
            priceTotal: 0,
            productionServiceUUID: undefined
        };

        fetchCodeService(value);
        onChangeSelectedService(type, id, service);
    }

    const fetchCodeService = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType,
                    type: data?.connectionType,
                    monthToUse: value
                }
            })
            if(res) {
                let newCodeServiceOptions = res.map(item => ({
                    key: item.hthmCode,
                    value: item.hthmCode,
                    text: item.hthmCode
                }));
                setCodeServiceOptions(newCodeServiceOptions);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn mã gọi cước
    const handleSelectCode = (event, { value }) => {
        if(data?.hthmCode === value) return;
        fetchProducts(value);
    }

    const fetchProducts = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType,
                    type: data?.connectionType,
                    monthToUse: data?.monthToUse,
                    hthmCode: value
                }
            })
            if(res && res?.length > 0) {
                let product = res[0];
                let service = {
                    hthmCode: value,
                    quantity: 1,
                    price: product.price,
                    priceTotal: product.price,
                    productionServiceUUID: product.uuid
                };
                onChangeSelectedService(type, id, service);
            } else {
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn số lượng
    const handleChangeQuantity = (event, { value }) => {
        if(value.trim() === '') {
            onChangeSelectedService(type, id, {quantity: undefined, priceTotal: 0});
        } else {
            let newQuantityPriceTotal = {
                quantity: Number(value),
                priceTotal:Number(value)*(data?.price)
            }
            onChangeSelectedService(type, id, newQuantityPriceTotal);
        }
    }

    return (
        <Table.Row>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn hình thức hòa mạng" search selection options={connectionTypeOptions} value={data?.connectionType} onChange={handleSelectType} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn thời gian sử dụng" search selection options={usingTimeOptions} disabled={data.connectionType ? false : true} value={data?.monthToUse} onChange={handleSelectTime} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn mã HTHM" search selection options={codeServiceOptions} disabled={data?.monthToUse ? false : true} value={data?.hthmCode} onChange={handleSelectCode} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.price) }</Table.Cell>
            <Table.Cell textAlign="center">
                <Input style={{width: '50px'}} className={css.input_align_center} type="number" value={data.quantity === undefined ? '' : data.quantity} 
                        disabled={data?.hthmCode ? false : true} onChange={handleChangeQuantity} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.priceTotal) }</Table.Cell>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateSimHSMTableRowQuotation);