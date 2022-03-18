import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { formatNumber } from '../../Quotations/Utils/formatNumber';
import css from './styles/createOders.css';


const TableRowChildOrder = (props) => {
    const { data, onEdit, hasCreatedSubOrder } = props;
    const {quotationDetailId, productInfo, userInfo, contactData } = data;

    return (
        <Table.Row>
            { hasCreatedSubOrder && <Table.Cell textAlign="center">{ userInfo?.name }</Table.Cell> }
            <Table.Cell textAlign="center">
                { productInfo.serviceName }
            </Table.Cell>
            <Table.Cell textAlign="left">
                { productInfo.productName }
            </Table.Cell>
            <Table.Cell textAlign="center">
                { productInfo.regReasonCode }
            </Table.Cell>
            <Table.Cell textAlign="center">
                { formatNumber(productInfo.price) }
            </Table.Cell>
            <Table.Cell textAlign="right">
                <Button className={css.btn_edit_child_order} onClick={() => onEdit(quotationDetailId)}>
                    { userInfo ? 'Cập nhật đơn hàng con': 'Tạo hàng con' }
                </Button>
            </Table.Cell>
        </Table.Row>
    )
}

export default TableRowChildOrder;