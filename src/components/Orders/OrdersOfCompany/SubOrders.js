import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';
import { formatNumber } from '../../Quotations/Utils/formatNumber'
import css from './styles/suborder.css';
import { STATUS_ORDER } from '../contants';
import DetailSubOrder from './DetailSubOrder';
import { SAGA_ACTION } from 'redux-saga/utils';

const fakeSubOrders = [
    {
        id: 11,
        status: 'Đang thực hiện',
        type: 'CA',
        servicePack: 'USB token',
        usingTime: '12 tháng',
        code: 'CA2_CM_1N',
        name: 'Cấp mới 1 năm CTS cho tổ chức kèm USB',
        priceService: 1826000,
        user: {
            type: 'ENTERPRISE',
            name: 'Công ty cổ phần ABC',
            taxNumber: 121221221,
            address: '167 Nguyễn Ngọc Nại, Thanh Xuân, Hà Nội',
            email: 'abc@contact.com',
            presentationPerson: 'Nguyễn Ngọc Anh',
            position: 'Giám đốc',
            kindPaper: 'TIN',
            idNumber: 187645985
        }
    },
    {
        id: 12,
        status: 'Đã hoàn thành',
        type: 'HDDT',
        numberInvoice: 300,
        code: 'HDDT300',
        name: 'Gói 300 hóa đơn giá niêm yết',
        priceService: 326000,
        user: {
            type: 'PERSONAL',
            name: 'Lê Minh Anh',
            address: '167 Nguyễn Ngọc Nại, Thanh Xuân, Hà Nội',
            email: 'abc@contact.com',
            kindPaper: 'CMND',
            idNumber: 2223333
        }
    },
    {
        id: 23,
        status: 'Đã huỷ',
        type: 'vBHXH',
        usingTime: '12 tháng',
        name: 'Gói VBH1 năm_KH không dùng CA',
        code: 'vBH1_01',
        priceService: 499000,
        user: {
            type: 'PERSONAL',
            name: 'Nguyễn Quang Huy',
            address: '167 Nguyễn Ngọc Nại, Thanh Xuân, Hà Nội',
            email: 'abc@contact.com',
            kindPaper: 'CMND',
            idNumber: 3334444
        }
    }
]



const SubOrders = (props) => {
    const { data = [] } = props;
    const [selectedSubOrder, setSelectedSubOrder ] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const handleShowModalDetail = (selectedIndex) => {
        let selectedSubOrder = data.filter((item,index) => index === selectedIndex)[0];
        setSelectedSubOrder(selectedSubOrder);
        setShowDetail(true);
    }

    const handleCloseModalDetail = () => {
        setShowDetail(false);
        setSelectedSubOrder({});
    }

    return (
        <>
            <div className={css.sub_order}>
                <div className={css.sub_order_header}>
                    <div className={css.header}>
                        <span className={css.title}>Đơn hàng con</span>
                        <span className={css.count}>{data?.length}</span>
                    </div>
                </div>
                <div>
                    <Table basic="very" className="suborders-table">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell className={css.first_header_cell}>
                                    Khách hàng
                                </Table.HeaderCell>
                                <Table.HeaderCell className={css.second_header_cell}>
                                    Dịch vụ
                                </Table.HeaderCell>
                                <Table.HeaderCell className={css.third_header_cell}>Trạng thái</Table.HeaderCell>
                                <Table.HeaderCell className={css.fourth_header_cell}>Tổng tiền</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                data.map((item,index) => {

                                    let statusStyle, statusText;
                                    switch(item?.productInfo?.status) {
                                        case STATUS_ORDER.INIT:
                                            statusStyle = css.canceled;
                                            statusText = 'Mới';
                                            break;
                                        case STATUS_ORDER.INPROCESS: 
                                            statusStyle = css.inprocess;
                                            statusText = 'Đang thực hiện'
                                            break;
                                        case STATUS_ORDER.COMPELETED:
                                            statusStyle = css.success;
                                            statusText = 'Đã hoàn thành';
                                            break;
                                        case STATUS_ORDER.CANCELED:
                                            statusStyle = css.canceled;
                                            statusText = 'Đã huỷ';
                                            break;
                                    }

                                    return (
                                        <Table.Row key={index} onClick={() => handleShowModalDetail(index)} >
                                            <Table.Cell className={css.first_cell}>{item?.userInfo?.name}</Table.Cell>
                                            <Table.Cell>{item?.productInfo?.serviceName}</Table.Cell>
                                            <Table.Cell className={statusStyle} >{statusText}</Table.Cell>
                                            <Table.Cell className={css.fourth_cell}>{formatNumber(item.productInfo?.price || 2000000)}</Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                </div>
            </div>
            { showDetail && <DetailSubOrder visible={showDetail} data={selectedSubOrder} onClose={handleCloseModalDetail} /> }
        </>
    )
}

export default SubOrders;