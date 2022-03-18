import React, {useEffect, useState} from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateServicePackTableRowQuotation from './CreateServicePackTableRowQuotaion';
import api from '../../../lib/apiClient';
import { SERVICE_ID } from '../Constants';
import { getUnique } from '../Utils/getUnique';
import css from '../styles/createQuotation.css';

const headers = ["STT", "Mã HTHM", "Số lượng hoá đơn", "Đơn giá có VAT (VNĐ)", "Số lượng gói", "Thành tiền(VNĐ)", ""];

const CreateServicePackTableQuotation = (props) => {
    const { type, addServices, deleteServices, servicesData, handleSelectService, handleDeleteAllTable, errors } = props;
    const [hthmCodeOptions, setHTHMCodeOptions] = useState([]);
    const [numberOrderOptions, setNumberOrderOptions] = useState([]);
    let servicePack = servicesData.filter(item => !item.delete);

    const iconstyle = {
        cursor: 'pointer',
        position: 'absolute',
        right: '10px',
        bottom: '0px'
    }

    useEffect(() => {
        fetchProducts();
    },[])

    const fetchProducts = async () => {
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

    const handleAddServices = () => {
        addServices(type);
    }

    const handleAddTable = () => {
        addServices(type);
        fetchProducts();
    }

    return (
        <div className={css.service_pack_table}>
            <div className={css.service_pack_table_title}>
                <h4>I. GÓI CƯỚC</h4>
                { (servicePack.length > 0) && <Icon name="trash alternate" style={iconstyle} size="large" onClick={() => handleDeleteAllTable(type)} /> }
                {
                    (servicePack.length == 0) && <Button className={css.btn_add_table} onClick={handleAddTable} >
                                    <Icon name="plus" />
                                    Thêm gói cước
                                </Button> 
                }
            </div>
            { errors?.isError && <p className={css.err_msg}>{errors?.message}</p> }
            {
                servicePack.length > 0 && <Table celled>
                    <Table.Header>
                        <Table.Row>
                            {
                                headers.map((h, index) => <Table.HeaderCell key={index} textAlign="center">{h}</Table.HeaderCell>)
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            servicesData.filter(item => { return (!item.delete)}).map((item,index) => {
                                return <CreateServicePackTableRowQuotation key={item.id} index={index} type={type} deleteServices={deleteServices}
                                            data={item} onChangeSelectedService={handleSelectService}
                                            defaultHTHMCodeOptions={hthmCodeOptions} defaultNumberOrderOptions={numberOrderOptions}  />
                            })
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="7" className={css.table_header_footer}>
                                <Button className={css.btnSelectQuote} onClick={handleAddServices} >
                                    <Icon name="plus" />
                                    Thêm gói cước
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            }
        </div>
    )
}

export default CreateServicePackTableQuotation;
