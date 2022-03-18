import React, { useState, useEffect } from 'react';
import { Table, Icon, Dropdown, Input } from 'semantic-ui-react';
import { getUnique } from '../Utils/getUnique';
import { formatNumber } from '../Utils/formatNumber';
import { SERVICE_ID } from '../Constants';
import api from '../../../lib/apiClient'; 
import css from '../styles/createQuotation.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';



const CreateUSBTokenTableRowQuotation = (props) => {
    const { type, data, deleteServices, onChangeSelectedService, deviceType, totalData, notifyError } = props;
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
    const [usingTimeOptions, setUsingTimeOptions] = useState([]);
    const [codeServiceOptions, setCodeServiceOptions ] = useState([]);
    const {id} = data;

    const handleDelete = () => {
        deleteServices(type, id);
    }

    useEffect(() => {
        // if(data?.connectionType && data?.monthToUse) {
        //     fetchOptions(data.connectionType, data.monthToUse);
        // }
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
                //cho chỉnh sửa copy
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

    //fetch default Options
    const fetchOptions = async (type, monthToUse) => {
        try {
            let res_1 = await api.get({
                resource: 'quotation-v3.0/quotation/get-month-use',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType,
                    type
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
                    let newUsingTimeOptions = res_1.map(item => ({
                        key: item,
                        value: item,
                        text: `${item} tháng`
                    }));
                    let newCodeServiceOptions = res_2.map(item => ({
                        key: item.hthmCode,
                        value: item.hthmCode,
                        text: item.hthmCode
                    }));
                    setCodeServiceOptions(newCodeServiceOptions);
                    setUsingTimeOptions(newUsingTimeOptions);
                }
            }
        } catch(err) {

        }
    }

    //chọn hình thức hoà mạng
    const handleSelectConnectionType = (event, {value}) => {
        if(data?.connectionType === value) return; 
        let service = {
            connectionType: value,
            monthToUse: undefined,
            hthmCode: undefined,
            priceService: 0,
            priceDevice: 0,
            quantity: 1,
            priceTotal: 0,
            productionServiceUUID: undefined
        }
        onChangeSelectedService(type, id, service);
        fetchUsingTime(value);
    }

    const fetchUsingTime = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-month-use',
                query: {
                    serviceId: SERVICE_ID.CA,
                    deviceType,
                    type: value
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

    //chọn thời gian sử dụng
    const handleSelectTime = (event, {value} ) => {
        if(data?.monthToUse === value) return;
        let service = {
            monthToUse: value,
            hthmCode: undefined,
            priceService: 0,
            priceDevice: 0,
            quantity: 1,
            priceTotal: 0,
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
        fetchProduct(value);
    }

    const fetchProduct = async (value) => {
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
            if(res && res.length > 0) {
                let product = res[0];
                let service = {
                    hthmCode: value,
                    quantity: 1,
                    priceService: product.priceService,
                    priceDevice: product.priceDevice,
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
                priceTotal: Number(value)*(data?.priceService + data?.priceDevice)
            }
            onChangeSelectedService(type, id, newQuantityPriceTotal);
        }
    }

    

    return (
        <Table.Row>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn hình thức hoà mạng" search selection options={connectionTypeOptions} value={data?.connectionType} 
                    onChange={handleSelectConnectionType}/>
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn thời gian sử dụng" search selection disabled={data?.connectionType ? false : true} 
                    value={data?.monthToUse} options={usingTimeOptions} onChange={handleSelectTime} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn mã HTHM" search selection disabled={data.monthToUse ? false : true} 
                    value={data?.hthmCode} options={codeServiceOptions} onChange={handleSelectCode} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.priceService) }</Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.priceDevice) }</Table.Cell>
            <Table.Cell textAlign="center">
                <Input style={{width: '50px'}} className={css.input_align_center} type="number" disabled={data?.hthmCode ? false : true} 
                    value={ data.quantity === undefined ? '' : data.quantity } onChange={handleChangeQuantity} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUSBTokenTableRowQuotation);