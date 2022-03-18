import React from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateCostTableRowQuotation from './CreateCostTableRowQuotation';
import css from '../styles/createQuotation.css';

const headers = ["STT", "Tên sản phẩm", "Mã HTHM", "Đơn giá có VAT (VNĐ)",""];

const CreateCostTableQuotation = (props) => {
    const { type, title, addServices, deleteServices, servicesData, handleSelectService, handleDeleteAllTable, errors } = props;

    let costs = servicesData.filter(item => !item.delete);
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
        <div className={css.cost_table}>
            <div className={css.cost_table_title}>
                <h4>{title}</h4>
                { (costs.length) > 0 && <Icon name="trash alternate" style={iconstyle} size="large" onClick={() => handleDeleteAllTable(type)} /> }
                {
                    (costs.length == 0) && <Button className={css.btn_add_table} onClick={handleAddTable} >
                                    <Icon name="plus" />
                                    Thêm gói cước
                                </Button> 
                }
            </div>
            { errors?.isError && <p className={css.err_msg}>{errors?.message}</p> }
            {
                costs.length > 0 && <Table celled>
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
                            return <CreateCostTableRowQuotation key={item.id} index={index} type={type} deleteServices={deleteServices} 
                                        data={item} onChangeSelectedService={handleSelectService} />
                        })
                    }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="5" className={css.table_header_footer}>
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

export default CreateCostTableQuotation;