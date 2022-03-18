import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { clearHighlight } from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { Grid, Input, Dropdown, Table } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import TableRowChildOrder from './TableRowChildOrder';
import CreateSubOrder from './CreateSubOrder';
import { TYPE_SERVICES, TYPE_USERS } from '../contants';
import api from '../../../lib/apiClient';
import * as NotificationActions from 'components/Notification/notification.actions';
import { updateStatusQuotationOfOneCustomer } from '../../Quotations/quotation.action';
import { updateNumberOrder } from '../../Organisation/organisation.actions';
import { validateEmail } from '../Util';
import css from './styles/createOders.css';

const headers = [
    {
        text: 'Khách hàng',
        textAlign: 'center'
    }, 
    { 
        text: 'Loại dịch vụ',
        textAlign: 'center'
    }, 
    {
        text: 'Tên sản phẩm',
        textAlign: 'left'
    }, 
    {
        text: 'Mã HTHM',
        textAlign: 'center' 
    }, 
    { 
        text: 'Tổng tiền thanh toán', 
        textAlign: 'center'
    },
    {
        text: '',
        textAlign: 'center'
    }
]


const CreateOrders = (props) => {
    const {clearHighlight, visible, overviewType, onClose, quotationUUID, account, notifySucess, notifyError, updateStatusQuotation, updateNumberOrder } = props;
    const [companyInfo, setCompanyInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [contactOptions, setContactOptions] = useState(null);
    const [contact, setContact ] = useState({});
    const [subOrders, setSubOders] = useState([]);
    const [showCreateSubOder, setShowCreateSubOder ] = useState(false);
    const [editingSubOrder, setEditingSubOrder ] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // const onClose = () => {
    //     clearHighlight(overviewType);
    // };

    useEffect(() => {
        fetchQuotationInfo();
        fectContactInfo();
    },[])

    //get thông tin quotation
    const fetchQuotationInfo = async () => {
        try {
            let res = await api.get({
                resource: 'prospect-v3.0/order/getDataInitOrder',
                query: {
                    quotationId: quotationUUID
                }
            });
            console.log("res: ", res);
            if(res) {
                const { userInfo, listSuborder, ...others} = res;
                setCompanyInfo(others);
                setUserInfo(userInfo);
                setSubOders(listSuborder);
            }
        } catch(err) {
            console.log("error: ", err);
        }
    }

    //get thông tin liên hệ
    const fectContactInfo = async () => {
        try {
            let res = await api.get ({
                resource: 'organisation-v3.0/getListContactByCustId',
                query: {
                    custId: account.custId
                }
            });
            if(res) {
                let newContactOptions = res.map(item => ({
                    ...item,
                    key: item.contactId,
                    value: item.contactId,
                    text: item.name
                }));
                setContactOptions(newContactOptions);
                setContact(newContactOptions[0]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleChangeNameContactInfo = (event, {value, options}) => {
        let newContact = options.find(item => item.contactId === value);
        setContact(newContact);
      }
  
      const handleChangeContactInfo = (event, {name, value}) => {
          setContact({
              ...contact,
              [name]: value
          })
      }
  
    const openModalEditSubOrder = (quotationDetailId) => {
        let editingSubOrder = subOrders.find((order) => order.quotationDetailId === quotationDetailId);
        // if(editingSubOrder.user) {
        //     editingSubOrder = {
        //         ...editingSubOrder,
        //         index: numberIndex
        //     }
        // } else {
        //     editingSubOrder = {
        //         ...editingSubOrder,
        //         index: numberIndex,
        //         user: {
        //             ...customerInfo,
        //             type: TYPE_USERS.ENTERPRISE
        //         }
        //     }
        // }
        setShowCreateSubOder(true);
        setEditingSubOrder(editingSubOrder);
    }
    
    const closeModalEditSubOrder = () => {
        setShowCreateSubOder(false);
        setEditingSubOrder(null);
    } 

    const handleSaveSubOrder = (userInfo, quotationDetailId) => {
        let newSubOrder = subOrders.map((item) => {
           if(item.quotationDetailId !== quotationDetailId) return item;
           return {
               ...item,
               userInfo: {...userInfo}
           };
        });
        setSubOders(newSubOrder);
    }

    
    const checkHasCreatedSubOrder = () => {
        let createdSubOrders = subOrders.filter(item => item?.userInfo?.name);
        if(createdSubOrders.length > 0) return true;
        return false;
    }

    const onDone = () => {
        if(isSaving) return; //không xử lý khi đang save
        //reset lỗi
        setErrors({});

        //validate contact info
        const mapPropertyToMsg = {
            position: 'vị trí',
            phoneNumber: 'Số điện thoại'
        }
        let requireContactProperties = ['position', 'phoneNumber'];
        for( let i = 0; i < requireContactProperties.length; i++) {
            let property = requireContactProperties[i];
            if(!contact[property].trim()) {
                setErrors({
                    isError: true,
                    [property]: `${mapPropertyToMsg[property]} không được để trống`,
                });
                return;
            }
            //validate định dạng số điện thoại
            const regexPhone = /(0)+([0-9]{9})$/;
            if(property === 'phoneNumber' && !regexPhone.test(contact[property].trim())) {
                setErrors({
                    isError: true,
                    [property]: `${mapPropertyToMsg[property]} không đúng định dạng`
                });
                return;
            }
        }

        if(contact.email && !validateEmail(contact.email.trim())) {
            setErrors({
                isError: true,
                email: `Email không đúng định dạng`
            });
            return;
        }

        //validate tất cả các đơn hàng con đã được tạo ?
        let notCreateSubOrder = subOrders.filter(item => !item?.userInfo?.name);
        if(notCreateSubOrder.length > 0) {
            setErrors({
                isError: true,
                subOrders: 'Có đơn hàng con chưa được tạo'
            });
            return;
        }

        //pass validate
        let contactData = {
            contactCRMId: contact.contactId,
            name: contact.name,
            email: contact.email,
            contactPhone: contact.phoneNumber,
            position: contact.position
        };

        let quotationDetailList = subOrders.map(item => {
            const { userInfo } = item;
            return {
                quotationDetailId: item.quotationDetailId,
                groupType: userInfo.groupTypeCode,
                customerName: userInfo.name,
                idNo: userInfo.idNo,
                idType: userInfo.idTypeCode,
                address: userInfo.address,
                email: userInfo.contactEmail
            }
        });

        let submitData = {
            quotationId: companyInfo.quotationId,
            contactData,
            quotationDetailList
        }
        setIsSaving(true);
        handleCreateOrder(submitData);
    };

    const  handleCreateOrder = async (submitData) => {
        try {
            let res = await api.post({
                resource: 'prospect-v3.0/order/create',
                data: submitData
            });
            if(res) {
                notifySucess('Tạo đơn hàng thành công', '', 2000);
                updateStatusQuotation(companyInfo.quotationId, 'CREATED_ORDER'); //update trạng thái của báo giá
                updateNumberOrder(account?.uuid); //cập nhật số lượng order
                onClose();
            } else {
                setIsSaving(false);
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
        } catch(err) {
            setIsSaving(false);
            console.log("err: ", err);
        }
    }


    // if(companyInfo === null && contactOptions === null && subOrders.length == 0) return null; 
    let loadedInitInfo = subOrders.length > 0 && contactOptions !== null; //chưa get được thông tin khởi tạo

    return (
        <ModalCommon title="Tạo đơn hàng" okLabel="Gửi đơn hàng" okHidden={!loadedInitInfo} isLoadingDoneButton={isSaving} noLabel="Huỷ" onDone={onDone} onClose={onClose} visible={visible}>
            { !loadedInitInfo && <div className={css.container_loading}>Loading...</div> }
            {
                loadedInitInfo && <div className={css.container}>
                    <div>
                        <h4>I. THÔNG TIN DOANH NGHIỆP</h4>
                        <Grid columns={2}>
                            <Grid.Row>
                                <Grid.Column className={css.first_column}>
                                    <div className={css.column_container} >
                                        <div className={css.label}>
                                            <label>Khách hàng</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled placeholder="Tên khách hàng" value={companyInfo?.customerName} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Email</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled placeholder="Email" value={companyInfo?.email} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column className={css.first_column}>
                                    <div className={css.column_container} >
                                        <div className={css.label}>
                                            <label>Mã số thuế</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled placeholder="Mã số thuế" value={companyInfo?.idNo} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Tên người đại diện</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled placeholder="Tên người đại diện" value={companyInfo?.ownerName} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column className={css.first_column}>
                                    <div className={css.column_container} >
                                        <div className={css.label}>
                                            <label>Địa chỉ</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input disabled fluid placeholder="Địa chỉ" value={companyInfo?.address} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Địa chỉ người đại diện</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid disabled placeholder="Địa chỉ người dại diện" value={companyInfo?.ownerAddress} className={css.input_disbaled} />
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <div className={css.contact_peson}>
                        <h4>II. THÔNG TIN NGƯỜI LIÊN HỆ</h4>
                        <Grid columns={2}>
                            <Grid.Row>
                                <Grid.Column className={css.first_column}>
                                    <div className={css.column_container} >
                                        <div className={css.label}>
                                            <label>Họ tên *</label>
                                        </div>
                                        <div className={css.input}>
                                            <Dropdown search selection placeholder="Họ tên người liên hệ" options={contactOptions} value={contact?.contactId}  
                                                onChange={handleChangeNameContactInfo} />
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Email</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input placeholder="Email" fluid value={contact?.email} name="email" onChange={handleChangeContactInfo} error={!!errors.email} />
                                            { errors.email && <p className={css.err_msg}> {errors.email} </p> }
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column className={css.first_column}>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Chức vụ *</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input fluid placeholder="Chức vụ" value={contact?.position} name="position" onChange={handleChangeContactInfo} error={!!errors.position} />
                                            { errors.position && <p className={css.err_msg}> {errors.position} </p> }
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className={css.column_container}>
                                        <div className={css.label}>
                                            <label>Số điện thoại *</label>
                                        </div>
                                        <div className={css.input}>
                                            <Input placeholder="số điện thoại" fluid value={contact?.phoneNumber} name="phoneNumber" onChange={handleChangeContactInfo} error={!!errors.phoneNumber} />
                                            { errors.phoneNumber && <p className={css.err_msg}> {errors.phoneNumber} </p> }
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <div className={css.child_orders}>
                        <h4>III. DANH SÁCH ĐƠN HÀNG CON</h4>
                        { errors.subOrders && <p className={css.err_msg}> {errors.subOrders} </p> }
                        <Table basic="very">
                            <Table.Header className={css.table_header}>
                                <Table.Row>
                                    {
                                        headers.filter((header,index) => {
                                            if(checkHasCreatedSubOrder()) return true;
                                            return index > 0; 
                                        }).map((header,index) => (
                                            <Table.HeaderCell key={index} textAlign={header.textAlign} style={{backgroundColor: '#fff'}} className={css.table_header_cell}>
                                                {header.text}
                                            </Table.HeaderCell>
                                        ))
                                    }
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    subOrders.map((order, index) => {
                                        return <TableRowChildOrder key={index} data={order} index={index} onEdit={openModalEditSubOrder} 
                                                    hasCreatedSubOrder={checkHasCreatedSubOrder()} />
                                    })
                                }
                            </Table.Body>
                        </Table>
                    </div>
                    { 
                        showCreateSubOder && <CreateSubOrder visible={showCreateSubOder} data={editingSubOrder} defaultUserInfo={userInfo} 
                                                onClose={closeModalEditSubOrder} onSave={handleSaveSubOrder} /> 
                    }
                </div> 
            }
        </ModalCommon>
    )
}


const mapStateToProps = (state, { overviewType }) => {
    // const visible = isHighlightAction(state, overviewType, 'create');
    return {};
};
  
  const mapDispatchToProps = {
    clearHighlight,
    notifySucess: NotificationActions.success,
    notifyError: NotificationActions.error,
    updateStatusQuotation: updateStatusQuotationOfOneCustomer,
    updateNumberOrder: updateNumberOrder
  };

  export default connect(mapStateToProps, mapDispatchToProps)(CreateOrders);