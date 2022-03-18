import React from 'react';
import { Table } from 'semantic-ui-react';
import css from '../styles/quotationDetail.css';
import formatNumber from '../Utils/formatNumber'
const headers = ["STT", "Mã HTHM", "Số lượng hoá đơn", "Đơn giá có VAT(VNĐ)", "Số lượng gói", "Thành tiền(VNĐ)"];

const ServicePackTable = (props) => {
    const { data } = props;
    const listData = data?.[0].quotationDetailDTOList
    return (
        <div className={css.service_pack_table}>
            <p className={css.service_pack_table_title}>I. GÓI CƯỚC</p>
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
                        listData?.map((item, index) => {
                          const total = item?.price * item?.quantity
                            return (
                                <Table.Row>
                                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.hthmCode}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.numberOrder}</Table.Cell>
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

export default ServicePackTable;
