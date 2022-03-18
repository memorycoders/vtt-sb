import React, { useState, useEffect } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Input, Grid, TextArea } from 'semantic-ui-react';
import css from '../styles/sendEmail.css'
import api from '../../../lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import { updateStatusQuotationOfOneCustomer } from '../quotation.action';
import { clientConfig } from '../../../../config';


const SendQuotationByEmail = (props) => {
    const { uuid, visible, onClose, account, userInfo, notifySucess, notifyError, updateStatusQuotation, token, userId} = props;
    const { host, protocol } = clientConfig.api;
    let bodyHeader = "Kính gửi quý công ty \nRất cảm ơn quý công ty đã tin tưởng và lựa chọn sử dụng dịch vụ của Viettel \nDựa theo nhu cầu của quý công ty, chúng tôi xin gửi bảng báo giá như sau: "
    let bodyFooter = `Lưu ý: Giá tiền đã bao gồm thuế VAT. \nNếu có bất kỳ thắc mắc nào liên quan đến sản phẩm quý công ty vui lòng liên hệ với tôi theo số điện thoại ${userInfo?.phone ? userInfo.phone : "[SĐT AM]"} và email ${userInfo?.email} \nTrân trọng cám ơn`
    const [info, setInfo] = useState({
        subject: 'BÁO GIÁ DỊCH VỤ VIETTEL',
        header: bodyHeader,
        footer: bodyFooter
    });
    const [errors, setErrors]  = useState({});
    const [file, setFile] = useState(undefined);

    useEffect(() => {
        fetchImge();
    },[])

    const fetchImge = async (quotation) => {
        try {
          let res = await api.get({
            resource: `quotation-v3.0/quotation/report/${uuid}`,
            query: {
              type: 'image'
            },
            options: {
              responseType: 'blob',
            }
          });
          if(res) {
            let reader = new FileReader();
            reader.readAsDataURL(res); 
            reader.onloadend = function() {
                let base64data = reader.result;  
                setFile(base64data);              
            }
          }
          
        } catch (err) {
          console.log('Error ->', err.message)
        }
    }

    const handleChangeInput = (event, {name, value}) => {
        setInfo({
            ...info,
            [name]: value
        })
    }

    const onDone = () => {
        //validate
        let requireProperties = ['subject', 'header', 'footer'];
        let errMsg = {
            subject: 'Tiêu đề không được để trống',
            header: 'Nội dung tiêu đề không được để trống',
            footer: 'Nội dung footer không được để trống',
        }
        for(let i = 0; i < requireProperties.length; i++) {
            let property = requireProperties[i];
            if(!info[property] && info[property].trim() === '') {
                setErrors({
                    [property]: errMsg[property]
                });
                return;
            }
        }

        //pass validate
        let subject = info.subject;
        let header = info.header.split('\n');
        header = header.map(item => `<p>${item}</p>`);
        header = header.join('');
        header = `<div class="body-header">${header}</div>`;
        let footer = info.footer.split('\n');
        footer = footer.map(item => `<p>${item}</p>`);
        footer = footer.join('');
        footer = `<div class="body-footer">${footer}</div>`;
        let image = `<img src=${protocol}://${host}quotation-v3.0/quotation/reportImage/${uuid}?userUUID=${userId} class="img" />`;
        image = `<div class="body-img">${image}</div>`;
        let body = `${header}${image}${footer}`;
        console.log("body: ", body);
        let submitData = {
            subject,
            body
        }
        handleSendEmail(submitData);
    }

    const handleSendEmail = async (data) => {
        try {
            let res = await api.post({
                resource: `quotation-v3.0/quotation/send-email/${uuid}`,
                data: {...data}
            });
            if(res) {
                notifySucess('Gửi email thành công','',2000);
                updateStatusQuotation({
                    uuid,
                    status: 'SENT'
                });
                onClose();
            } else {
                notifyError('Đã có lỗi xảy ra', '', 2000);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    return(
        <ModalCommon title="Gửi email" size="small" visible={visible} onDone={onDone} onClose={onClose} okLabel="Gửi email" noLabel="Huỷ"> 
            <div className={css.email}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} className={css.label_column}>
                            <label className={css.label}>Từ</label>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Input fluid value={userInfo?.email} disabled className={css.input_disabled}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3} className={css.label_column}>
                            <label className={css.label}>Đến</label>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Input fluid value={account?.email} disabled className={css.input_disabled} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3} className={css.label_column}>
                            <label className={css.label}>Tiêu đề</label>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Input fluid value={info.subject} placeholder="Tên báo giá" name="subject" onChange={handleChangeInput} error={errors?.subject} />
                            { errors?.subject && <p className={css.err_msg}>{errors.subject}</p> }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                { 
                  file && <>
                        <div className={css.title}>
                        <TextArea value={info.header} rows={3} className={css.textarea} spellCheck={false} name="header" onChange={handleChangeInput} />
                        { errors?.header && <p className={css.err_msg}>{errors.header}</p> }
                        </div>
                        <div>
                            <img src={file} className={css.img_quotation} />
                        </div>
                        <div className={css.note}>
                        <TextArea value={info.footer} rows={4} className={css.textarea} spellCheck={false} name="footer" onChange={handleChangeInput} />
                        { errors?.footer && <p className={css.err_msg}>{errors.footer}</p> }
                        </div>
                    </>
                }
            </div>
        </ModalCommon>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state?.auth?.user,
        token: state?.auth?.token,
        userId: state?.auth?.userId
    }
}

const mapDispatchToProps = {
    notifySucess: NotificationActions.success,
    notifyError: NotificationActions.error,
    updateStatusQuotation: updateStatusQuotationOfOneCustomer
}

export default connect(mapStateToProps, mapDispatchToProps)(SendQuotationByEmail);