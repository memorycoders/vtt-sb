import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Collapsible } from 'components';
import UserListRow from '../../components/UserRole/UserListRow';
import css from "../../components/Quotations/styles/quotations.css";
import { Pagination } from 'semantic-ui-react';
import api from '../../lib/apiClient';

import PeriodSelector from '../../components/PeriodSelector/PeriodSelector';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { setOverviewType, setObjectType } from '../../components/Common/common.actions';
function User(props) {
    const [contact, setContact] = useState(4)
    const { role } = props;
    const [userList, setUserList] = useState([]);
    const [total, setTotal] = useState(0)
    let headers;
    if (role === "TTDH") {
        headers = [
            { key: 'staffcode', name: `Mã nhân viên`, textAlign: 'center' },
            { key: 'name', name: `Tên nhân viên`, textAlign: 'center' },
            { key: 'shipid', name: `Mã cửa hàng`, textAlign: 'center' },
            { key: 'phoneNumer', name: `Số điện thoại`, textAlign: 'center' },
            { key: 'email', name: 'Email', textAlign: 'center' },
            { key: 'title', name: 'Chức danh', textAlign: 'center' },
        ]
    } else {
        headers = [
            { key: 'staffcode', name: `Mã nhân viên`, textAlign: 'center' },
            { key: 'name', name: `Tên nhân viên`, textAlign: 'center' },
            { key: 'shipid', name: `Mã cửa hàng`, textAlign: 'center' },
            { key: 'phoneNumer', name: `Số điện thoại`, textAlign: 'center' },
            { key: 'email', name: 'Email', textAlign: 'center' },
        ]
    }
    const fetchList = async () => {
        try {
            const rs = await api.get({
                resource: `/enterprise-v3.0/users`,
                query: {
                    pageIndex: 0,
                    pageSize: 10,
                },
            });
            if (rs) {
                setUserList(rs.data)
                setTotal(rs.total)
            }
        } catch (err) {
            console.log('=========', err)
        }
    }
    useEffect(() => {
        setOverviewType(OverviewTypes.USER);
        setObjectType(ObjectTypes.USER);
    }, [])
    useEffect(() => {
        fetchList()
    }, [])
    const onChangePageSize = (e, data) => {
        // setActivePage(data.activePage)
        // fetchDataQuotation({
        //   pageIndex: data.activePage - 1,
        //   orderBy,
        //   sort: sort,
        //   searchText: searchText,
        //   period: period,
        //   fromDate: fromDate,
        //   toDate: toDate,
        //   pageSize: pageSize,
        //   searchFieldDTOS: searchFieldDTOS
        // });
    }
    return (
        <div className={css.quotation_container}>

            <PeriodSelector overviewType={OverviewTypes.USER} objectType={ObjectTypes.USER} color={Colors.User} />
            <UserListRow headers={headers} data={userList} role={role}></UserListRow>
            <div className={css.pagination_container} >
                {userList?.length > 0 && <Pagination id="quotations-pagination" size="large"
                    onPageChange={onChangePageSize}
                    activePage={1} totalPages={total} className={css.pagination} />}
            </div>

        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        data: state.entities.quotation?.data,
        role: state.auth.user.userRole
    }
};
const mapDispatchToProps = {
    setOverviewType,
    setObjectType,

}
export default connect(mapStateToProps, mapDispatchToProps)(User);