import React, { useState, useEffect } from 'react';
import { Grid, Dropdown, Input } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { TYPE_SERVICES, TYPE_USERS } from '../contants';
import api from '../../../lib/apiClient';
import { validateEmail } from '../Util';
import css from './styles/createOders.css';



const CreateSubOrder = (props) => {
    const {visible, onClose, onSave, data, defaultUserInfo} = props;
    const { quotationDetailId, productInfo, userInfo, contactInfo  } = data;

    let serviceType = productInfo.serviceType;
    let defaultUser;
    if(serviceType === TYPE_SERVICES.BHXH || serviceType === TYPE_SERVICES.HDDT) {
        defaultUser = userInfo ? userInfo : defaultUserInfo;
    } else if (serviceType === TYPE_SERVICES.CA) {
        const { groupType, groupTypeCode, ...others} = defaultUserInfo;
        defaultUser = {...others};
    } else {
        defaultUser = {};
    }

    const [user, setUser] = useState(defaultUser);
    const [groupTypeOptions, setGroupTypeOptions] = useState([]);
    const [idTypeOptions, setIdTypeOptions] = useState([]);
    const [errors, setErrors] = useState({});

    let enableEditUser = serviceType === TYPE_SERVICES.BHXH || serviceType === TYPE_SERVICES.HDDT ? false : true;


    useEffect(() => {
        if(serviceType === TYPE_SERVICES.CA) {
            fetchGroupType();
        }
    }, [])

    //lấy option loại khách hàng
    const fetchGroupType = async () => {
        try {
            let res = await api.get({
                resource: 'prospect-v3.0/order/getAllGroupType'
            });
            if(res) {
                let newGroupTypeOption = res.map(item => ({
                    ...item,
                    key: item.groupType,
                    value: item.groupType,
                    text: item.groupTypeName
                }));
                const { groupType, groupTypeCode, ...others} = defaultUserInfo;
                setGroupTypeOptions(newGroupTypeOption);
                setUser({
                    ...user,
                    groupType,
                    groupTypeCode
                })
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleChangeTypeUser = (event, {value, options}) => {
        if(value === TYPE_USERS.ENTERPRISE) {
            setUser(defaultUserInfo);
            setIdTypeOptions([]);            
        } else if( value === TYPE_USERS.PERSONAL) {
            let groupTypeName = options.find(item => item.groupType === value).groupTypeName;
            setUser({
                ...user,
                groupType: groupTypeName,
                groupTypeCode: value
            });
            fetchIdTypeOptions();
        }
    }

    //lấy option loại giấy tờ
    const fetchIdTypeOptions = async () => {
        try {
            let res = await api.get({
                resource: 'prospect-v3.0/order/getAllIdType'
            });
            if(res) {
                let newIdTypeOptions = res.map(item => ({
                    ...item,
                    key: item.idType,
                    value: item.idType,
                    text: item.idTypeName
                }));
                setIdTypeOptions(newIdTypeOptions);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleChangeIdType = (event, {value, options}) => {
        let idTypeName = options.find(item => item.idType === value).idTypeName;
        setUser({
            ...user,
            idType: idTypeName,
            idTypeCode: value,
            idNo: ''
        });
    }

    const handleChangeUserInfo = (event, {name, value}) => {
        setUser({
            ...user,
            [name]: value
        })
    }

    const validate = () => {
        const mapPropetyToText = {
            idNo: 'Số giấy tờ',
            customerName: 'Tên khách hàng',
            address: 'Địa chỉ',
            contactEmail: 'Email'
        }
        let requireProperty = ['idNo', 'customerName', 'address', 'contactEmail'];
        for(let i = 0; i < requireProperty.length; i++) {
            let property = requireProperty[i];
            console.log("property: ", property);
            if(!user[property]?.trim()) {
                return {
                    isError: true,
                    [property] : `${mapPropetyToText[property]} không được để trống`
                }
            }

            if(property === 'contactEmail' && !validateEmail(user[property].trim())) {
                return {
                    isError: true,
                    [property] : `${mapPropetyToText[property]} không đúng định dạng`
                }
            }
        }

        return {
            isError: false
        }
    }

    const onDone = () => {
        if (user.groupTypeCode === TYPE_USERS.ENTERPRISE) {
            onSave(user, quotationDetailId);
            onClose();
        } else {
            setErrors({});
            let resultValidate = validate();
            if(resultValidate.isError) {
                setErrors({...resultValidate});
            } else {
                onSave(user, quotationDetailId);
                onClose();
            }
        }
    }

    const selectDataOrder = {
        [TYPE_SERVICES.CA]: {
            label_2: 'Loại thiết bị',
            value_2: productInfo.deviceType,
            label_4: 'Số tháng sử dụng',
            value_4: `${productInfo.monthToUse} tháng`,
        },
        [TYPE_SERVICES.HDDT]: {
            label_2: 'Mã HTHM',
            value_2: productInfo.regReasonCode,
            label_4: 'Số lượng hoá đơn',
            value_4: productInfo.numberOrder,
        },
        [TYPE_SERVICES.BHXH]: {
            label_2: 'Mã HTHM',
            value_2: productInfo.regReasonCode,
            label_4: 'Thời gian sử dụng',
            value_4: `${productInfo.monthToUse} tháng`,
        }
    }

    return (
        <ModalCommon title="Tạo đơn hàng con" okLabel="Lưu lại" noLabel="Huỷ" onDone={onDone} onClose={onClose} visible={visible}>
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
                                        {
                                            enableEditUser ? <Dropdown search selection placeholder="Loại khách hàng" options={groupTypeOptions} 
                                                                    value={user?.groupTypeCode} onChange={handleChangeTypeUser} /> : 
                                            <Input fluid placeholder="Loại khách hàng" disabled value={user?.groupType} className={css.input_disbaled} />
                                        }
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? 'Số giấy tờ *' : 'Mã số thuế' }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        { 
                                            enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? (
                                                <>
                                                    <Input fluid placeholder="Số giấy tờ" name="idNo" onChange={handleChangeUserInfo} value={user?.idNo} error={!!errors.idNo} />
                                                    { errors.idNo && <p className={css.err_msg}>{ errors.idNo }</p> }
                                                </>
                                                 ) :
                                                <Input fluid placeholder="Mã số thuế" disabled value={user?.idNo} className={css.input_disbaled} /> 
                                        }
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? 'Tên khách hàng *' : 'Tên doanh nghiệp' }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        { 
                                            enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? (
                                                <>
                                                    <Input fluid placeholder="Tên khách hàng" name="customerName" onChange={handleChangeUserInfo} value={user?.customerName} error={!!errors.customerName} />
                                                    { errors.customerName && <p className={css.err_msg}>{ errors.customerName }</p> }
                                                </> ) :
                                                <Input fluid disabled value={user?.name} className={css.input_disbaled} /> 
                                        }
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? 'Địa chỉ *' : 'Địa chỉ'}
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        { 
                                            enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? (
                                                <>
                                                    <Input fluid placeholder="Địa chỉ" name="address" onChange={handleChangeUserInfo} value={user?.address} error={errors.address} />
                                                    { errors.address && <p className={css.err_msg}>{ errors.address }</p> }
                                                </>) :
                                                <Input fluid disabled value={user?.address} className={css.input_disbaled} />
                                        }
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className={css.first_column}>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? 'Loại giấy tờ *' : 'Loại giấy tờ' }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        {
                                            enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? (
                                                <Dropdown search selection placeholder="Loại giấy tờ" options={idTypeOptions} 
                                                        name="idTypeCode" value={user?.idTypeCode} onChange={handleChangeIdType} />) :
                                                <Input fluid disabled className={css.input_disbaled} value={user?.idType} />
                                        }
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? 'Email *' : 'Email' }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        { 
                                            enableEditUser && (user.groupTypeCode === TYPE_USERS.PERSONAL) ? (
                                                <>
                                                    <Input fluid name="contactEmail" type="email" placeholder="Email" onChange={handleChangeUserInfo} value={user?.contactEmail} error={!!errors.contactEmail} />
                                                    { errors.contactEmail && <p className={css.err_msg}>{ errors.contactEmail }</p> }
                                                </>) :
                                                    <Input fluid disabled value={user?.contactEmail} className={css.input_disbaled} />
                                        }
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
                                        <Input fluid disabled value={productInfo.serviceName} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { selectDataOrder[serviceType].label_2 }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={selectDataOrder[serviceType].value_2} className={css.input_disbaled} />
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
                                        <Input fluid disabled value={productInfo?.connectionType} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className={css.column_container}>
                                    <div className={css.label}>
                                        <label>
                                            { selectDataOrder[serviceType].label_4 }
                                        </label>
                                    </div>
                                    <div className={css.input}>
                                        <Input fluid disabled value={selectDataOrder[serviceType].value_4} className={css.input_disbaled} />
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
                                        <Input fluid disabled value={productInfo?.price} className={css.input_disbaled} />
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            serviceType === TYPE_SERVICES.CA && <Grid.Row columns={2}>
                                <Grid.Column className={css.first_column}>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Mã HTHM</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled value={productInfo?.regReasonCode} className={css.input_disbaled} />
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

export default CreateSubOrder;