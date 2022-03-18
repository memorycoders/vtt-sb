import React from 'react';
import ModalCommon from '../../../components/ModalCommon/ModalCommon';
import { Grid, Label, Input } from 'semantic-ui-react';
import css from './detailContatct.css';
import moment from 'moment';

const DetailContact = (props) => {
    const { visible, onClose, contact } = props;

    const handleDone = () => {};

    return (
        <ModalCommon title="Chi tiết liên hệ" noLabel="Đóng" okHidden={true} visible={visible} onClose={onClose} onDone={handleDone}>
            <div className={css.detail_contact}>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid>
                                <Grid.Column width={5} >
                                    <Label basic color="black" className={css.label}>Tên liên hệ</Label>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Input fluid value={contact.name} disabled className={css.input_disabled} />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid>
                                <Grid.Column width={5} >
                                    <Label basic color="black" className={css.label}>Ngày sinh</Label>
                                </Grid.Column>
                                <Grid.Column width={11} className={css.input_disabled}>
                                    <Input fluid value={moment(contact.birthday).format('DD-MM-YYYY')} disabled />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid>
                                <Grid.Column width={5} >
                                    <Label basic color="black" className={css.label}>Chức vụ</Label>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Input fluid value={contact.position} disabled className={css.input_disabled} />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid>
                                <Grid.Column width={5} >
                                    <Label basic color="black" className={css.label}>Email</Label>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Input fluid value={contact.email} disabled className={css.input_disabled} />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid>
                                <Grid.Column width={5} >
                                    <Label basic color="black" className={css.label}>Số điện thoại</Label>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Input fluid value={contact.phoneNumber} disabled className={css.input_disabled} />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid>
                                <Grid.Column width={5}>
                                    <Label basic color="black" className={css.label}>Địa chỉ</Label>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Input fluid value={contact.address} disabled />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        </ModalCommon>
    )
}

export default DetailContact;
