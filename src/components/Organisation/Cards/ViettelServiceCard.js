import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Collapsible } from 'components';
import {
    Message,
    Loader,
    Table,
    TableHeaderCell,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
} from 'semantic-ui-react';
import css from '../Cards/TasksCard.css';
import api from 'lib/apiClient';
import DetailViettelCustomerServiceModal from './DetailViettelCustomerServiceModal';
import moment from 'moment';

export const ViettelServiceCard = (props) => {
    const { account } = props;
    const [customerServiceList, setCustomerServiceList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [dataDetailService, setDataDetailService] = useState([]);

    const viewDetailCustomerService = (list) => {
        try {
          setDataDetailService(list);
          setShowDetail(true);
        } catch (error) { }
    };

    const fetchService = async (custId) => {
      try {
          const res = await api.get({
              resource: `organisation-v3.0/getServiceUseCustomer`,
              query: {
                  id: custId,
              },
          });
          if (res) {
            setCustomerServiceList(res);
            console.log('920', res)
          }

      } catch (error) { }
    };
    useEffect(() => {
      fetchService(account?.custId)
    }, [])
    // cons
    if (customerServiceList.length === 0)
        return (
            <Collapsible count="0" width={308} padded title={`Dịch vụ`}>
                {isFetching ? (
                    <div className={isFetching && css.isFetching}>
                        <Loader active={isFetching}>Đang tải</Loader>
                    </div>
                ) : (
                        <Message active info>
                            {`Không có dịch vụ`}
                        </Message>
                    )}
            </Collapsible>
        );

    return (
        <>
            <Collapsible count={customerServiceList.length} width={308} title={`Dịch vụ`}>
                {isFetching ? (
                    <div className={isFetching && css.isFetching}>
                        <Loader active={isFetching}>Đang tải</Loader>
                    </div>
                ) : (
                        <>
                            <Table selectable basic="very" className="vt-table-customer-survice">
                                <TableHeader>
                                    <TableHeaderCell>STT</TableHeaderCell>
                                    <TableHeaderCell>Tên dịch vụ</TableHeaderCell>
                                    <TableHeaderCell>Số lượng thuê bao trên hệ thống</TableHeaderCell>
                                    <TableHeaderCell>Số lượng thuê bao thực tế</TableHeaderCell>
                                    <TableHeaderCell>Trạng thái</TableHeaderCell>
                                    <TableHeaderCell>Ghi chú</TableHeaderCell>
                                </TableHeader>
                                <TableBody>
                                    {customerServiceList.map((e, index) => {
                                        return (
                                            <TableRow
                                                key={e.uuid}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => viewDetailCustomerService(e.listServiceConnectDetailDTOS)}
                                            >
                                                <TableCell textAlign="center" width={1}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell width={2}>{e.serviceName}</TableCell>
                                                <TableCell textAlign="center" width={5}>
                                                    {e.bccsValue}
                                                </TableCell>
                                                <TableCell textAlign="center" width={4}>
                                                    {e.listServiceConnectDetailDTOS?.length}
                                                </TableCell>
                                                <TableCell width={3}>{e.statusView}</TableCell>
                                                <TableCell width={3}>{e.note}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    )}
            </Collapsible>
            <DetailViettelCustomerServiceModal
                data={dataDetailService}
                visible={showDetail}
                onClose={() => {
                    setShowDetail(false);
                    setDataDetailService([]);
                }}
                onDone={() => {
                    setShowDetail(false);
                    setDataDetailService([]);
                }}
            />
        </>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ViettelServiceCard);
