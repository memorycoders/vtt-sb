import React from 'react';

// import { TYPE_SERVICE } from './Constants';
import { Grid, GridColumn, GridRow, Button, Form, Input, Icon, Popup, Menu, Label } from 'semantic-ui-react';
// import ModalCommon from '../ModalCommon/ModalCommon';
import ModalCommon from '../../components/ModalCommon/ModalCommon';

import css from '../../components/Quotations/styles/quotationDetail.css';
import style from '../../components/Quotations/styles/quotationDetail.css';
import { FormPair } from 'components';
const UserDetail = (props) => {
    const { open, handleClose, data } = props;
    const isViewOnly = true
    // console.log('user data is coming to town =>', detail)
    const handleDone = () => { }
    return (
        <ModalCommon title="Thông tin chi tiết" noLabel="Đóng" visible={open} onClose={handleClose} onDone={handleDone} okHidden={true} >
            <div className={css.list_services}>
                <Grid>
                    <GridRow columns={2}>
                        <GridColumn>
                            <div className={style.formRow}>
                                <label>Mã cửa hàng </label>
                                <div className={style.select_template} >
                                    <Label className={style.label_custom}>{data?.shopId}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Chức danh</label>
                                <div>
                                    <Label className={style.label_custom}>{data?.title}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Mã nhân viên</label>
                                <div>
                                    <Label className={style.label_custom}>{data?.staffCode}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Tên nhân viên</label>
                                <div>
                                    <Label className={style.label_custom}>{data?.firstName + " " + data?.lastName}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Ngày sinh</label>
                                <div>
                                    <Label className={style.label_custom}>{data?.birthDay}</Label>
                                </div>
                            </div>
                        </GridColumn>
                        <GridColumn>
                            <div className={style.formRow}>
                                <label>Số giấy tờ</label>
                                <div>
                                    <Label className={style.label_custom}>{data?.idNo}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Nơi cấp </label>
                                <div>
                                    <Label className={style.label_custom}>{data?.idIssuePlace}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Ngày cấp</label>
                                <Label className={style.label_custom}>{data?.idIssueDate}</Label>
                            </div>
                            <div className={style.formRow}>
                                <label>Số điện thoại </label>
                                <div>
                                    <Label className={style.label_custom}>{data?.phone}</Label>
                                </div>
                            </div>
                            <div className={style.formRow}>
                                <label>Email</label>
                                <div>
                                    <Label className={style.label_custom}>{data?.email}</Label>
                                </div>
                            </div>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </ModalCommon>
    )
}

export default UserDetail;
