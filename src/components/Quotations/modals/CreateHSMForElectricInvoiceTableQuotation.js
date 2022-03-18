import React, {useState, useEffect } from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateHSMForElectricInvoiceTableRowQuotation from './CreateHSMForElectricInvoiceTableRowQuotation';
import api from '../../../lib/apiClient'; 
import { SERVICE_ID, TABLE_SERVICE_TYPE } from '../Constants';
import { formatNumber } from '../Utils/formatNumber';
import css from '../styles/createQuotation.css';

const headers = ["STT", "Hình thức hòa mạng", "Thời gian sử dụng", "Mã HTHM", "Đơn giá có VAT(VNĐ)",""];

const CreateHSMForElectricInvoiceTableQuotation = (props) => {
    const { type, title, addServices, deleteServices, servicesData, handleSelectService, handleDeleteAllTable, errors} = props;
    let hsm = servicesData.filter(item => !item.delete);

    const iconstyle = {
        cursor: 'pointer',
        position: 'absolute',
        right: '10px',
        bottom: '0px'
    }

    const handleAddServices = () => {
        addServices(type);
    }

    const handleAddTable = () => {
        addServices(type);
    }

    return (
        <div className={css.hsm_invoice_table}>
            <div className={css.hsm_invoice_table_title}>
                <h4>{title}</h4>
                { hsm.length > 0 && <Icon name="trash alternate" style={iconstyle} size="large" onClick={() => handleDeleteAllTable(type)} /> }
                {
                    (hsm.length == 0) && <Button className={css.btn_add_table} onClick={handleAddTable} >
                                    <Icon name="plus" />
                                    Thêm gói cước
                                </Button> 
                }
            </div>
            { errors?.isError && <p className={css.err_msg}>{errors?.message}</p> }
            {
                (hsm.length > 0) && <Table celled>
                    <Table.Header>
                        <Table.Row>
                            {
                                headers.map((h, index) => <Table.HeaderCell key={index} textAlign="center">{h}</Table.HeaderCell>)
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                        servicesData.filter(item => {return (!item.delete)}).map((item,index) => {
                            return <CreateHSMForElectricInvoiceTableRowQuotation key={item.id} index={index} type={type} 
                                            deleteServices={deleteServices} data={item} onChangeSelectedService={handleSelectService} />
                        })
                    }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="6" className={css.table_header_footer}>
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

export default CreateHSMForElectricInvoiceTableQuotation;