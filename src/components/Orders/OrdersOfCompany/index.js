import React from 'react';
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { formatNumber } from '../../Quotations/Utils/formatNumber'
import css from './styles/ordersofcompany.css';

const OrdersOfCompany = (props) => {
    const { route, overviewType, orders, history } = props;
    let fakeOrders = [0,1,2]

    const showDetailOrder = (orderID) => {
        history.push(`${route}/order/${orderID}`);
    }
    
    if (!fakeOrders || fakeOrders.lenght == 0) return null;

    return (
        <div>
           <Table basic="very" className="orders-table">
                <Table.Row className={css.header_row}>
                    <Table.HeaderCell>Doanh nghiệp</Table.HeaderCell>
                    <Table.HeaderCell>Thời gian tạo</Table.HeaderCell>
                    <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                    <Table.HeaderCell>Tổng tiền</Table.HeaderCell>
                </Table.Row>
                <Table.Body>
                    {
                        fakeOrders.map(order => {
                            return (
                                <Table.Row onClick={() => showDetailOrder(order.uuid)}>
                                    <Table.Cell className={css.name_cell}>
                                        Tên doanh nghiệp
                                    </Table.Cell>
                                    <Table.Cell>
                                        29/03/2021
                                    </Table.Cell>
                                    <Table.Cell className={css.cancel_status_cell}>
                                        Đã huỷ
                                    </Table.Cell>
                                    <Table.Cell className={css.amount_cell}>
                                        { formatNumber(1826000) }
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
           </Table>
        </div>
    )
}

export default withRouter(OrdersOfCompany);