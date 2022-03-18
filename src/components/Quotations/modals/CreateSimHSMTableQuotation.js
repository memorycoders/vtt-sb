import React from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateSimHSMTableRowQuotation from './CreateSimHSMTableRowQuotation';
import css from '../styles/createQuotation.css';

const CreateSimHSMTableQuotation = (props) => {
    const { title, type, servicesData, deleteServices, addServices, handleSelectService, handleDeleteAllTable, deviceType, errors } = props;
    let simHSM = servicesData.filter(item => !item.delete);

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
        <div className={css.sim_hsm_table}>
            <div className={css.sim_hsm_table_title}>
                <h4>{title}</h4>
                { simHSM.length > 0 && <Icon name="trash alternate" style={iconstyle} size="large" onClick={() => handleDeleteAllTable(type)} /> }
                {
                    simHSM.length == 0 && <Button className={css.btn_add_table} onClick={handleAddTable} >
                                        <Icon name="plus" />
                                        Thêm gói cước
                                    </Button>
                }
            </div>
            { errors?.isError && <p className={css.err_msg}> {errors?.message} </p> }
            {
                (simHSM.length > 0) && <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Hình thức hoà mạng</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Thời gian sử dụng</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Mã HTHM</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Đơn giá có VAT (VNĐ)</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Số lượng</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Thành tiền (VNĐ)</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            servicesData.filter(item => !item.delete).map((item,index) => {
                                return <CreateSimHSMTableRowQuotation key={item.id} type={type} index={index} deleteServices={deleteServices} deviceType={deviceType}
                                                onChangeSelectedService={handleSelectService} data={item} totalData={servicesData}/>
                            })
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="8" className={css.usb_table_footer}>
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

export default CreateSimHSMTableQuotation;
