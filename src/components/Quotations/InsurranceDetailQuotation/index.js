import React from 'react';
import { Table, Message } from 'semantic-ui-react';
import css from '../styles/quotationDetail.css';
import _l from 'lib/i18n';
import NoResults from '../../NoResults/NoResults';

const headers = ["Hình thức hòa mạng", "Thời gian", "Mã HTHM", 'Tổng số tháng sử dụng' ,"Đơn giá có VAT(VNĐ)", "Số lượng", "Thành tiền(VNĐ)"];

const InsurranceDetailQuotation = (props) => {
    const { data } = props;
    return (
        <div className={css.insurrance_table}>
            <p className={css.insurrance_table_title}>Danh sách gói cước</p>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        {
                            headers.map((h, index) => <Table.HeaderCell key={index} textAlign="center">{h}</Table.HeaderCell>)
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                      data[0]?.quotationDetailDTOList?.map((item) => {
                        const total = item.price * item.quantity || 0
                            return (
                                <Table.Row>
                                    <Table.Cell textAlign="center">{item.connectionType}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.timeToUse}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.hthmCode}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.monthToUse} {_l`Month`}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.price?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                                    <Table.Cell textAlign="center">{total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    )
}

export default InsurranceDetailQuotation;
