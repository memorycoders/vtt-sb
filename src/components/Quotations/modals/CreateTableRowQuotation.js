import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Input, Icon } from 'semantic-ui-react';
import { formatNumber } from '../Utils/formatNumber';
import api from '../../../lib/apiClient';
import css from '../styles/createQuotation.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';




const CreateTableRowQuotation = (props) => {
    const {index, type, deleteServices, onChangeSelectedService, data, notifyError} = props;
    const [connectionTypeOptions, setConnectionTypeOptions] = useState([]);
    const [productionNameOptions, setProductionNameOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);
    const { id } = data;

    useEffect(() => {
        fetchServices();
    },[])

    //get kiểu dịch vụ
  const fetchServices = async () => {
    try {
      let res = await api.get({resource: 'quotation-v3.0/quotation/services'});
      if(res) {
        let serviceOptions = res.map(item => {
          return {
            key: item.serviceId,
            value: item.serviceId,
            text: item.serviceName
          }
        });
        setServiceOptions(serviceOptions);
        //cho trường hợp có gói cước mẫu
        if(data?.serviceId && data?.connectionType) {
            fetchOptions(data.serviceId, data.connectionType);
        }
      } else {
        setServiceOptions([]);
      }
    } catch(err) {
      console.log("err: ", err);
    }
  }

    const fetchOptions = async (id, type) => {
        try {
                let res_1 = await api.get({
                    resource: 'quotation-v3.0/quotation/get-type',
                    query: {
                        serviceId: id
                    }
                });
                if(res_1) {
                    let res_2 = await api.get({
                        resource: 'quotation-v3.0/quotation/get-production-services',
                        query: {
                            serviceId: id,
                            type: type
                        }
                    });
                    if(res_2) {
                        let newConnectionTypeOptions = res_1.map(item => ({
                            key: item,
                            value: item,
                            text: item
                        }));
                        let newProductionNameOptions = res_2.map(item => ({
                            key: item.uuid,
                            value: item.uuid,
                            text: item.productionName
                        }))
                        setProductionNameOptions(newProductionNameOptions);
                        setConnectionTypeOptions(newConnectionTypeOptions);
                    }
                }
        } catch(err) {
            console.log("err: ", err);
        }
    } 

    //xoá dòng
    const handleDelete = () => {
        deleteServices(type, id);
    }

    //chọn dịch vụ
    const handleSelectService = (event, {value}) => {
        if(data?.serviceId === value) return;
        let service = {
            serviceId: value,
            productionServiceUUID: undefined,
            connectionType: undefined,
            productionName: undefined,
            hthmCode: undefined,
            quantity: 1,
            priceService: 0,
            priceDevice: 0,
            priceTotal: 0,
            productionServiceUUID: undefined
        };
        onChangeSelectedService(type, id, service);
        fetchTypeService(value);
    }

    const fetchTypeService = async (value) => {
        try {
            let res = await api.get(
                {
                    resource: 'quotation-v3.0/quotation/get-type',
                    query: {
                        serviceId: value
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
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //chọn hình thức
    const handleSelectTypeService = (event,  { value }) => {
        if(data?.connectionType === value) return;
        let service = {
            connectionType: value,
            productionServiceUUID: undefined,
            productionName: undefined,
            hthmCode: undefined,
            quantity: 1,
            priceService: 0,
            priceDevice: 0,
            priceTotal: 0,
            productionServiceUUID: undefined
        };
        onChangeSelectedService(type, id, service);
        fetchProductionNames(value);
    }

    const fetchProductionNames = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                    query: {
                        serviceId: data.serviceId,
                        type: value
                    }
            });
            
            if(res) {
                let newProductionNameOptions = res.map(item => ({
                    key: item.uuid,
                    value: item.uuid,
                    text: item.productionName
                }))
                setProductionNameOptions(newProductionNameOptions);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    } 

    //chọn gói cước
    const handleSelectProduction = (event, {value, options}) => {
        let selectedOption = options.filter(op => op.value === value)[0];
        if(data?.productionName === selectedOption?.text) return;
        fetchProducts(selectedOption?.text);
    }

    //lấy 1 gói cước duy nhất
    const fetchProducts = async (value) => {
        try {
            let res = await api.get({
                resource: 'quotation-v3.0/quotation/get-production-services',
                    query: {
                        serviceId: data.serviceId,
                        type: data.connectionType,
                        productionName: value
                    }
            });
            
            if(res && res?.length > 0) {
               let product = res[0];
               let service = {
                    productionName: value,
                    productionServiceUUID: product?.uuid,
                    hthmCode: product?.hthmCode,
                    priceService: product?.priceService,
                    priceDevice: product?.priceDevice,
                    quantity: 1,
                    priceTotal: product?.price,
                };
                onChangeSelectedService(type, id, service);
            } else {
                //lỗi
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //thay đổi số lượng
    const handleChangeQuantity = (event, { value }) => {
        if(value.trim() === '') {
            onChangeSelectedService(type, id, {quantity: undefined, priceTotal: 0});
        } else {
            let newQuantityPriceTotal = {
                quantity: Number(value),
                priceTotal: value*(data?.priceService + data?.priceDevice)
            }
            onChangeSelectedService(type, id, newQuantityPriceTotal);
        }
    } 

    return (
        <Table.Row>
            <Table.Cell textAlign="center">{ index + 1 }</Table.Cell>
            <Table.Cell>
              <Dropdown placeholder="Chọn dịch vụ" search selection options={serviceOptions} value={data?.serviceId} onChange={handleSelectService} />
            </Table.Cell>
            <Table.Cell>
              <Dropdown placeholder="Chọn hình thức hòa mạng" search selection disabled={data?.serviceId ? false : true} value={data?.connectionType} 
                options={connectionTypeOptions} onChange={handleSelectTypeService} />
            </Table.Cell>
            <Table.Cell>
              <Dropdown placeholder="Chọn tên sản phẩm" search selection disabled={data?.connectionType ? false : true} value={data?.productionServiceUUID} 
                options={productionNameOptions} onChange={handleSelectProduction} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ data?.hthmCode }</Table.Cell>
            <Table.Cell>
              <Input style={{ width: 50 }} className={css.input_align_center} type="number" disabled={data?.productionName ? false : true} 
                value={ data.quantity === undefined ? '' : data.quantity } onChange={handleChangeQuantity} />
            </Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.priceService) }</Table.Cell>
            <Table.Cell textAlign="center">{ formatNumber(data?.priceDevice) }</Table.Cell>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTableRowQuotation);