import React, { useState, useEffect } from 'react';
import { Table, Icon, Dropdown, Input } from 'semantic-ui-react';
import { getUnique } from '../Utils/getUnique';
import { formatNumber } from '../Utils/formatNumber';
import api from '../../../lib/apiClient'; 
import { SERVICE_ID } from '../Constants';
import css from '../styles/createQuotation.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';



const CreateInsurranceTableRowQuotation = (props) => {
    const { type, data, deleteServices, onChangeSelectedService, notifyError } = props;
    const [connectionTypeOptions, setConnectionTypeOptions ] = useState([]);
    const [timeOptions, setTimeOptions] = useState([]);
    const [hthmCodeOptions, setHTHMCodeOptions] = useState([]);
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
                        serviceId: SERVICE_ID.BHXH
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
                if(data?.connectionType && data?.timeToUse) {
                    fetchOptions(data.connectionType, data.timeToUse);
                }
            } else {
                setConnectionTypeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const fetchOptions = async (type, time) => {
        try {
            let res_1 = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.BHXH,
                    type
                }
            });
            if(res_1) {
                let res_2 = await api.get({
                    resource: 'quotation-v3.0/quotation/get-production-services',
                    query: {
                        serviceId: SERVICE_ID.BHXH,
                        type,
                        timeToUse: time
                    }
                });
                let newTimeOptions = res_1.filter(item => {
                    if(item.timeToUse === '') return false;
                    return true;
                }).map(item => item.timeToUse);
                newTimeOptions = getUnique(newTimeOptions);
                let newHTHMCodeOptions = res_2.map(item => item.hthmCode);
                newHTHMCodeOptions = getUnique(newHTHMCodeOptions);
                setTimeOptions(newTimeOptions);
                setHTHMCodeOptions(newHTHMCodeOptions);
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
        let service = {
            connectionType: value,
            timeToUse: undefined,
            hthmCode: undefined,
            monthToUse: undefined,
            price: 0,
            quantity: 1,
            priceTotal: 0,
            productionServiceUUID: undefined
        };
        onChangeSelectedService(type, id, service);
        fetchTime(value);
    }

    const fetchTime = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.BHXH,
                    type: value,
                } 
            });
            if(res) {
                let newTimeOptions = res.filter(item => {
                    if(item.timeToUse === '') return false;
                    return true;
                }).map(item =>{return item.timeToUse});
                newTimeOptions = getUnique(newTimeOptions);
                setTimeOptions(newTimeOptions);
            } else {
                setTimeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleSelectTime = (event, {value}) => {
        if(data?.timeToUse === value) return;
        let service = {
            timeToUse: value,
            hthmCode: undefined,
            monthToUse: undefined,
            price: 0,
            quantity: 1,
            priceTotal: 0,
            productionServiceUUID: undefined
        };
        onChangeSelectedService(type, id, service);
        fetchHTHMCode(value);
    }

    const fetchHTHMCode = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.BHXH,
                    type: data?.connectionType,
                    timeToUse: value
                } 
            });
            if(res) {
                let hthmCodeOptions = res.filter(item => {
                    if(item.timeToUse === '') return false;
                    return true;
                }).map(item => {return item.hthmCode});
                hthmCodeOptions = getUnique(hthmCodeOptions);
                setHTHMCodeOptions(hthmCodeOptions);
            } else {
                setHTHMCodeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn mã gói cước
    const handleSelectCode = (event, { value }) => {
        if(data?.hthmCode === value) return;
       fetchProducts(value);
    }

    const fetchProducts = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                    serviceId: SERVICE_ID.BHXH,
                    type: data?.connectionType,
                    timeToUse: data?.timeToUse,
                    hthmCode: value
                } 
            });
            if(res && res.length > 0) {
                let product = res[0];
                let service = {
                    hthmCode: value,
                    timeToUse: product.timeToUse,
                    monthToUse: product.monthToUse,
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
            let service = {
                quantity: Number(value),
                priceTotal: Number(value)*data?.price 
            }
            onChangeSelectedService(type, id, service);
        }
    }

    return (
        <Table.Row>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn hình thức hoà mạng" search selection options={connectionTypeOptions} value={data?.connectionType} 
                        onChange={handleSelectType} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn thời gian" search selection options={timeOptions} value={data?.timeToUse}
                        disabled={data?.connectionType ? false : true} onChange={handleSelectTime} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn mã HTHM" search selection options={hthmCodeOptions} value={data?.hthmCode} 
                    disabled={data?.timeToUse ? false : true} onChange={handleSelectCode} />
            </Table.Cell>
            <Table.Cell textAlign="center">{data?.monthToUse}</Table.Cell>
            <Table.Cell textAlign="center">{formatNumber(data?.price)}</Table.Cell>
            <Table.Cell textAlign="center">
                <Input type="number" style={{width: '50px'}} className={css.input_align_center} value={data.quantity === undefined ? '' : data.quantity} 
                    disabled={data?.hthmCode ? false : true} onChange={handleChangeQuantity} />
            </Table.Cell>
            <Table.Cell textAlign="center">{formatNumber(data?.priceTotal)}</Table.Cell>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateInsurranceTableRowQuotation);