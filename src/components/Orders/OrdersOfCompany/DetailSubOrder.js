import React from 'react';
import { Grid, Input } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { TYPE_SERVICE } from '../../Quotations/Constants';
import { TYPE_USERS, STATUS_ORDER } from '../contants';
import { formatNumber } from '../../Quotations/Utils/formatNumber';
import css from '../CreateOrder/styles/createOders.css';


const DetailSubOrder = (props) => {
    const {visible, onClose, data} = props;
    const { userInfo, productInfo, contactData } = data;
    let isPersonal = userInfo.groupTypeCode === 0 ? true : false;
    let typeCustomer = isPersonal ? 'Cá nhân' : 'Doanh nghiệp';

    let serviceType = productInfo.serviceName;
    const selectDataOrder = {
        [TYPE_SERVICE.CA]: {
            label_2: 'Loại thiết bị',
            value_2: productInfo.deviceType,
            label_4: 'Số tháng sử dụng',
            value_4: `${productInfo.monthToUse} tháng`,
        },
        [TYPE_SERVICE.HDDT]: {
            label_2: 'Mã HTHM',
            value_2: productInfo.hthmCode,
            label_4: 'Số lượng hóa đơn',
            value_4: productInfo.numberOrder,
        },
        [TYPE_SERVICE.vBHXH]: {
            label_2: 'Mã HTHM',
            value_2: productInfo.hthmCode,
            label_4: 'Số tháng sử dụng',
            value_4: `${productInfo.monthToUse} tháng`,
        }
    }

    let color, textStatus;
    switch(productInfo?.status) {
        case STATUS_ORDER.INPROCESS: 
            textStatus = 'Đang thực hiện';
            color = {color: '#F0A40F'};
            break;
        case STATUS_ORDER.COMPELETED:
            textStatus = 'Đã hoàn thành';
            color = {color: '#16D206'};
            break;
        case STATUS_ORDER.CANCELED:
            textStatus='Đã huỷ';
            color = {color: '#C4122C'};
            break;
    }
    let status = {
        text: textStatus,
        style: color
    }

    const onDone = () => {}

    return (
        <ModalCommon title="Chi tiết đơn hàng con" noLabel="Đóng" onDone={onDone} onClose={onClose} visible={visible} okHidden={true} status={status}>
            <div className={css.container}>
                <div>
                    <h4>I. THÔNG TIN NGƯỜI SỬ DỤNG</h4>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            Loại khách hàng
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={typeCustomer} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { isPersonal ? 'Số giấy tờ *' : 'Mã số thuế' }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        { !isPersonal && <Input fluid disabled value={userInfo?.taxCode} className={css.input_disbaled} /> }
                                        { isPersonal && <Input fluid disabled value={userInfo?.idNo}  className={css.input_disbaled}/> }
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { isPersonal ? 'Tên khách hàng *' : 'Tên doanh nghiệp'}
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={userInfo?.name} className={css.input_disbaled} /> 
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            Địa chỉ
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                       <Input fluid disabled value={userInfo?.address} className={css.input_disbaled} /> 
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            Loại giấy tờ
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={userInfo?.idType} className={css.input_disbaled} /> 
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            Email
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={userInfo?.email} className={css.input_disbaled} /> 
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className={css.detail_suborder}>
                    <h4>II. THÔNG TIN DỊCH VỤ ĐĂNG KÝ</h4>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>Dịch vụ</label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={productInfo?.serviceName} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { selectDataOrder[serviceType]?.label_2 }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={selectDataOrder[serviceType]?.value_2} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>Hình thức</label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={productInfo.connectionType} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { selectDataOrder[serviceType]?.label_4 }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={selectDataOrder[serviceType]?.value_4} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>Tên sản phẩm</label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={productInfo?.productName} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            Tổng tiền thanh toán (VNĐ)
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={formatNumber(productInfo?.price)} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            serviceType === TYPE_SERVICE.CA && <Grid.Row columns={2}> 
                                <Grid.Column>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>
                                                Mã HTHM
                                            </label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled value={productInfo.hthmCode} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        }
                    </Grid>
                </div>
            </div>
        </ModalCommon>
    )
}

export default DetailSubOrder;

