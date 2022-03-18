import React from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateUSBTokenTableRowQuotation from './CreateUSBTokenTableRowQuotation';
import css from '../styles/createQuotation.css';

const CreateUSBTokenTableQuotation = (props) => {
    const { type, servicesData, addServices, deleteServices, handleSelectService, handleDeleteAllTable, errors, deviceType } = props;
    let usb = servicesData.filter(item => !item.delete);

    const handleAddServices = () => {
        addServices(type);
    }

    const handleAddTable = () => {
        addServices(type);
    }

    const iconstyle = {
        cursor: 'pointer',
        position: 'absolute',
        right: '10px',
        bottom: '0px'
    }

    return (
        <div className={css.usb_table}>
            <div className={css.usb_table_title}>
                <h4>I. THIẾT BỊ USB TOKEN</h4>
                { usb.length > 0 && <Icon name="trash alternate" style={iconstyle} size="large"  onClick={() => handleDeleteAllTable(type)} /> }
                {
                    usb.length == 0 && <Button className={css.btn_add_table} onClick={handleAddTable} >
                                    <Icon name="plus" />
                                    Thêm gói cước
                                </Button> 
                }
            </div>
            { errors?.isError && <p className={css.err_msg}> {errors?.message} </p> }
            {
                (usb.length > 0) && <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell rowSpan={2} textAlign="center">Hình thức hoà mạng</Table.HeaderCell>
                            <Table.HeaderCell rowSpan={2} textAlign="center">Thời gian sử dụng</Table.HeaderCell>
                            <Table.HeaderCell rowSpan={2} textAlign="center">Mã HTHM</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2} textAlign="center">Đơn giá có VAT (VNĐ)</Table.HeaderCell>
                            <Table.HeaderCell rowSpan={2} textAlign="center">Số lượng</Table.HeaderCell>
                            <Table.HeaderCell rowSpan={2} textAlign="center">Thành tiền (VNĐ)</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center" rowSpan={2}></Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Giá dịch vụ (VNĐ)</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Giá thiết bị (VNĐ)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                        servicesData.filter(item => !item.delete).map((item, index) => {
                            return <CreateUSBTokenTableRowQuotation key={item.id} index={index} type={type} deleteServices={deleteServices} deviceType={deviceType}
                                        onChangeSelectedService={handleSelectService} data={item} totalData={servicesData} />
                        })
                    }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="8" className={css.usb_table_footer}>
                                <Button className={css.btnSelectQuote} onClick={handleAddServices}>
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


export default CreateUSBTokenTableQuotation;
