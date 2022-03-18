import React, { useState } from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';
// import css from './styles/quotations.css';
import { connect } from 'react-redux';
import moment from 'moment';
import _l from 'lib/i18n';
import css from "../../components/Quotations/styles/quotations.css";
import UserDetail from './UserDetail';
import NoResults from '../NoResults/NoResults';
import api from '../../lib/apiClient';
const UserListRow = (props) => {
    const { data, headers, role } = props;
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState({})
    const showDetailUser = async (value) => {
        try {
            const rs = await api.get({
                resource: `enterprise-v3.0/user/${value.uuid}`,
            });
            if (rs) {
                setDetail(rs);
            }
        } catch (err) {
            console.log('Error ->', err.message)
        }
        setShowDetail(true)
    }

    const closeDetailUser = () => {
        setShowDetail(false)
    }
    return (
        <>
            <Table basic="very" className="quotation-table">
                <Table.Header >
                    <Table.Row>
                        {
                            headers?.map(h => (
                                <Table.HeaderCell key={h.key} width={(h.key === 'organisationName' || h.key === 'name') ? 2 : 2}
                                    textAlign={h.textAlign} style={{ cursor: 'pointer' }} >
                                    {h.name}
                                    {/* {h.key === orderBy && <Icon name='angle down' />} */}
                                </Table.HeaderCell>
                            ))
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body >
                    {
                        data?.map(item => {
                            return (
                                <Table.Row onClick={() => showDetailUser(item)}>
                                    <Table.Cell width={2} style={{ paddingLeft: '15px', textAlign: "center" }}>{item.staffCode}</Table.Cell>
                                    <Table.Cell width={2} style={{ paddingLeft: '15px', textAlign: "center" }}>{item.fullName}</Table.Cell>
                                    <Table.Cell width={2} style={{ textAlign: "center" }}>{item.shopId}</Table.Cell>
                                    <Table.Cell width={2} style={{ textAlign: "center" }}>{item.phoneNumber}</Table.Cell>
                                    <Table.Cell width={4} style={{ textAlign: "center" }}>{item.email}</Table.Cell>
                                    {
                                        role === "TTDH" ? <Table.Cell width={2} style={{ textAlign: "center" }}>{item.title}</Table.Cell> : null
                                    }
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
            {
                (data.length === 0) && <div className={css.container_no_result}>
                    <NoResults title="Kết quả tìm kiếm" message="Không có báo giá nào được tìm thấy" />
                </div>
            }
            <UserDetail open={showDetail} data={detail} handleClose={closeDetailUser}></UserDetail>
        </>

    )
}

export default UserListRow;