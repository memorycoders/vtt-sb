import React, { useState, useEffect } from 'react';
import { Table, Icon, Dropdown, Input } from 'semantic-ui-react';
import { getUnique } from '../Utils/getUnique';
import api from '../../../lib/apiClient'; 
import { SERVICE_ID } from '../Constants';
import { formatNumber } from '../Utils/formatNumber';
import css from '../styles/createQuotation.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';



const CreateServicePackTableRowQuotation = (props) => {
    const { index, type, data, deleteServices, onChangeSelectedService, defaultHTHMCodeOptions, defaultNumberOrderOptions, notifyError } = props;
    const [hthmCodeOptions, setHTHMCodeOptions] = useState([]);
    const [numberOrderOptions, setNumberOrderOptions] = useState([]);
    const { id } = data;

    useEffect(() => {
        if(data?.hthmCode) {
            fetchNumberOrder(data.hthmCode);
        } else {
            fetchOptions();
        }
    },[])

    const fetchOptions = async () => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                        serviceId: SERVICE_ID.HDDT,
                        type: 'Mua hóa đơn'
                }
            });

            if(res) {
                let numberOrderOptions = res.map(item => {
                    return Number(item.numberOrder);
                });
                numberOrderOptions.sort((a,b) => { return (Number(a) - Number(b))});
                numberOrderOptions = getUnique(numberOrderOptions);

                let hthmCodeOptions = res.map(item => {
                    return {
                        key: item.hthmCode,
                        value: item.hthmCode,
                        text: item.hthmCode
                    }
                });

                setNumberOrderOptions(numberOrderOptions);
                setHTHMCodeOptions(hthmCodeOptions);
            } else {
                setNumberOrderOptions([]);
                setHTHMCodeOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }


    const fetchNumberOrder = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                        serviceId: SERVICE_ID.HDDT,
                        type: 'Mua hóa đơn',
                        hthmCode: value
                }
            });
            if(res) {
                let numberOrderOptions = res.map(item => item.numberOrder).sort((a,b) => {return (Number(a) - Number(b))});
                numberOrderOptions = getUnique(numberOrderOptions);
                setNumberOrderOptions(numberOrderOptions);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    useEffect(() => {
        setHTHMCodeOptions(defaultHTHMCodeOptions);
    },[defaultHTHMCodeOptions])

    useEffect(() => {
        setNumberOrderOptions(defaultNumberOrderOptions);
    },[defaultNumberOrderOptions])

    const handleDelete = () => {
        deleteServices(type, id);
    }

    //chọn mã gọi cước
    const handleSelectCode = (event, { value }) => {
        if(data?.hthmCode === value) return;
            let service = {
                hthmCode: value,
                numberOrder: data?.numberOrder,
                quantity: 1,
                price: 0,
                priceTotal: 0,
                productionServiceUUID: undefined
            };
            onChangeSelectedService(type, id, service);
            fetchProducts(value);        
    }

    const fetchProducts = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                        serviceId: SERVICE_ID.HDDT,
                        type: 'Mua hóa đơn',
                        hthmCode: value
                }
            });
            if(res) {
                let service = {
                    hthmCode: value,
                    quantity: 1,
                    numberOrder: Number(res[0]?.numberOrder),
                    price: res[0]?.price,
                    priceTotal: res[0]?.price,
                    productionServiceUUID: res[0]?.uuid
                };
                let numberOrderOptions = res.map(item => item.numberOrder).sort((a,b) => {return (Number(a) - Number(b))});
                numberOrderOptions = getUnique(numberOrderOptions);
                // setNumberOrderOptions(numberOrderOptions);
                onChangeSelectedService(type, id, service);
            } else {
                let service = {
                    hthmCode: value,
                    quantity: 1,
                    numberOrder: undefined,
                    price: 0,
                    priceTotal: 0,
                    productionServiceUUID: undefined
                };
                setNumberOrderOptions([]);
                onChangeSelectedService(type, id, service);
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn số lượng hoá đơn
    const handleSelectNumberOrder = (event, {value}) => {
        if(data?.numberOrder === value) return;
        let service = {
            numberOrder: value,
            hthmCode: undefined,
            price: 0,
            quantity: 1,
            priceTotal: 0,
            productionServiceUUID: undefined
        }
        onChangeSelectedService(type, id, service);
        fetchHTHMCode(value);
    }

    const fetchHTHMCode = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                        serviceId: SERVICE_ID.HDDT,
                        type: 'Mua hóa đơn',
                        numberOrder: value
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

    //thay đổi số lượng gói cước
    const handleChangeQuantity = (event, { value }) => {
        if(value.trim() === '') {
            onChangeSelectedService(type, id, {quantity: undefined, priceTotal: 0});
        } else {
            let newQuantityPriceTotal = {
                quantity: Number(value),
                priceTotal: value*(data?.price)
            }
            onChangeSelectedService(type, id, newQuantityPriceTotal);
        }
    }

    return (
        <Table.Row>
            <Table.Cell textAlign="center">{index + 1}</Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn mã gói cước" search selection options={hthmCodeOptions} value={data?.hthmCode} onChange={handleSelectCode} />
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn số lượng hoá đơn" search selection options={numberOrderOptions} value={data?.numberOrder} onChange={handleSelectNumberOrder} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.price) }</Table.Cell>
            <Table.Cell textAlign="center">
                <Input style={{width: '50px'}} className={css.input_align_center} type="number" value={data.quantity === undefined ? '' : data.quantity} 
                   disabled={data?.hthmCode && data?.numberOrder ? false : true} onChange={handleChangeQuantity} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateServicePackTableRowQuotation);