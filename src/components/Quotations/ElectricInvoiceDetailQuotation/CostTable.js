import React from 'react';
import { Table } from 'semantic-ui-react';
import css from '../styles/quotationDetail.css';
import formatNumber from '../Utils/formatNumber'
const headers = ["STT", "Tên sản phẩm", "Mã HTHM", "Đơn giá có VAT(VNĐ)"];

const CostTable = (props) => {
    const { data, title } = props;
    const listData = data?.[0].quotationDetailDTOList
    return (
        <div className={css.cost_table}>
            <p className={css.cost_table_title}>{title}</p>
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
                                    <Table.Cell textAlign="center">{item.productionName}</Table.Cell>
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

export default CostTable;
