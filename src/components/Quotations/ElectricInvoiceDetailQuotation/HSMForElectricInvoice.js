import React from 'react';
import { Table } from 'semantic-ui-react';
import css from '../styles/quotationDetail.css';
import _l from 'lib/i18n';
import formatNumber from '../Utils/formatNumber'

const headers = ["STT", "Hình thức hòa mạng", "Thời gian sử dụng", "Mã HTHM", "Đơn giá có VAT(VNĐ)"];

const HSMForElectricInvoice = (props) => {
    const { data, title } = props;
    const listData = data?.[0].quotationDetailDTOList;

    return (
        <div className={css.hsm_for_invoice_table}>
            <p className={css.hsm_for_invoice_table_title}>{title}</p>
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
                            return (
                                <Table.Row>
                                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.connectionType}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.monthToUse} {_l`Month`}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.hthmCode}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.price?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    )
}

export default HSMForElectricInvoice;
