import React, { useState, useEffect } from 'react';
import { Table, Icon, Dropdown } from 'semantic-ui-react';
import { getUnique } from '../Utils/getUnique';
import api from '../../../lib/apiClient'; 
import { SERVICE_ID } from '../Constants';
import { formatNumber } from '../Utils/formatNumber';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';



const CreateCostTableRowQuotation = (props) => {
    const { index, type, data, deleteServices, onChangeSelectedService, notifyError } = props;
    const [productNameOptions, setProductNameOptions] = useState([]);
    const { id } = data;

    useEffect(() => {
        fetchProductNameOptions();
    }, [])

    const fetchProductNameOptions = async () => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                        serviceId: SERVICE_ID.HDDT,
                        type: 'Các loại phí'
                }
            });
    
            if(res) {
             let productNameOptions = res.map(item => ({
                 key: item.productionName,
                 value: item.productionName,
                 text: item.productionName
             }));
             setProductNameOptions(productNameOptions);
            } else {
                setProductNameOptions([]);
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleDelete = () => {
        deleteServices(type, id);
    }

    //chọn tên sản phẩm
    const handleSelectNameService = (event, { value }) => {
        if(data?.productionName === value) return;
        let service = {
            productionName: value,
            hthmCode: undefined,
            price: 0,
            productionServiceUUID: undefined
        }
        onChangeSelectedService(type, id, service);
        fetchProducts(value);
    }

    const fetchProducts = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                query: {
                        serviceId: SERVICE_ID.HDDT,
                        type: 'Các loại phí',
                        productionName: value
                }
            });
    
            if(res) {
                let service = {
                    productionName: value,
                    hthmCode: res[0].hthmCode,
                    price: res[0].price,
                    productionServiceUUID: res[0].uuid
                };
                onChangeSelectedService(type, id, service);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

 
    return (
        <Table.Row>
            <Table.Cell textAlign="center">{index + 1}</Table.Cell>
            <Table.Cell textAlign="center">
                <Dropdown placeholder="Chọn sản phẩm" search selection options={productNameOptions} value={data?.productionName} onChange={handleSelectNameService} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ data?.hthmCode }</Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.price) }</Table.Cell>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateCostTableRowQuotation);