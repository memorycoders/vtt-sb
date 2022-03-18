import React from 'react';
import { Table } from 'semantic-ui-react';
import css from '../styles/quotationDetail.css'
import _l from 'lib/i18n';
import formatNumber from '../Utils/formatNumber'
const USBTokenTable = ({data}) => {
    const listData = data?.[0].quotationDetailDTOList
    return (
        <div className={css.usb_table}>
            <p className={css.usb_table_title}>I. THIẾT BỊ USB TOKEN</p>
            <Table celled structured>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell rowSpan={2} textAlign="center">Hình thức hòa mạng</Table.HeaderCell>
                        <Table.HeaderCell rowSpan={2} textAlign="center">Thời gian sử dụng</Table.HeaderCell>
                        <Table.HeaderCell rowSpan={2} textAlign="center">Mã HTHM</Table.HeaderCell>
                        <Table.HeaderCell colSpan={2} textAlign="center">Đơn giá có VAT (VNĐ)</Table.HeaderCell>
                        <Table.HeaderCell rowSpan={2} textAlign="center">Số lượng</Table.HeaderCell>
                        <Table.HeaderCell rowSpan={2} textAlign="center">Thành tiền (VNĐ)</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell textAlign="center">Giá dịch vụ (VNĐ)</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Giá thiết bị (VNĐ)</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        listData?.map(item => {
                          const total = (item?.priceService + item?.priceDevice) * item?.quantity
                            return (
                                <Table.Row>
                                    <Table.Cell textAlign="left">{item.connectionType}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.monthToUse} {_l`Month`}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.hthmCode}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.priceService?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.priceDevice?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Table.Cell>
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


export default USBTokenTable;
