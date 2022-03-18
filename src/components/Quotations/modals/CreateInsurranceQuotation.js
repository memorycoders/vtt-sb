import React from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateInsurranceTableRowQuotation from './CreateInsurranceTableRowQuotation';
import css from '../styles/createQuotation.css';

const headers = ["Hình thức hoà mạng", "Thời gian", "Mã HTHM", "Tổng số tháng sử dụng", "Đơn giá có VAT (VNĐ)", "Số lượng", "Thành tiền(VNĐ)",""];

const CreateInsurranceQuotation = (props) => {
    const type = "servicePack"
    const { addServices, deleteServices, servicesData, handleSelectService, errors} = props;
    let servicePack = servicesData.filter(item => !item.delete);

    const handleAddServices = () => {
        addServices(type);
    }

    const handleAddTable = () => {
        addServices(type);
    }

    return (
        <div className={css.cost_table}>
            <div className={css.cost_table_title}>
                <h4>Danh sách gói cước</h4>
                {
                    servicePack.length == 0 && <Button className={css.btn_add_table} onClick={handleAddTable} >
                    <Icon name="plus" />
                    Thêm gói cước
                </Button>
                }
            </div>
            { errors?.isError && <p className={css.err_msg}>{errors.message}</p>}
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
                            servicesData.filter(item => {return (!item.delete)}).map((item,index) => {
                                return <CreateInsurranceTableRowQuotation key={item.id} type={type} index={index} data={item} deleteServices={deleteServices}
                                            onChangeSelectedService={handleSelectService}  />
                            })
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="8" className={css.table_header_footer}>
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

export default CreateInsurranceQuotation;
