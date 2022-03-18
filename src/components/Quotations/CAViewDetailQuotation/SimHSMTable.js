import React from 'react';
import { Table } from 'semantic-ui-react';
import css from '../styles/quotationDetail.css';
import _l from 'lib/i18n';
import formatNumber from '../Utils/formatNumber'

const SimHSMTable = ({data, title}) => {
    const listData = data?.[0].quotationDetailDTOList
    return (
        <div className={css.sim_hsm_table}>
            <p className={css.sim_hsm_table_title}>{title}</p>
                <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Hình thức hòa mạng</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Thời gian sử dụng</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Mã HTHM</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Đơn giá có VAT(VNĐ)</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Số lượng</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Thành tiền (VNĐ)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            listData?.map(item => {
                                return (
                                    <Table.Row>
                                        <Table.Cell textAlign="left">{item.connectionType}</Table.Cell>
                                        <Table.Cell textAlign="center">{item.monthToUse} {_l`Month`}</Table.Cell>
                                        <Table.Cell textAlign="center">{item.hthmCode}</Table.Cell>
                                        <Table.Cell textAlign="center">{(item.price).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
                                        <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                                        <Table.Cell textAlign="center">{(item?.price * item?.quantity).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
        </div>
    )
}

export default SimHSMTable;
