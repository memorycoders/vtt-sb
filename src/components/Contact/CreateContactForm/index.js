/* eslint-disable no-eval */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { update, imageOnCropEnabled, uploadErrors } from '../contact.actions';
import _l from 'lib/i18n';
import './styles.less';
import { Types } from 'Constants';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { calculatingPositionMenuDropdown, ObjectTypes } from '../../../Constants';
import cx from 'classnames';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import moment from 'moment'

addTranslations({
    'en-US': {
        'Contact photo': 'Contact photo',
        'First name': 'First name',
        'Last Name': 'Last Name',
        Behavior: 'Behavior',
        Phone: 'Phone',
        Email: 'Email',
        Street: 'Street',
        'Zip code': 'Zip code',
        City: 'City',
        Region: 'Region',
        Country: 'Country',
        Title: 'Title',
        Type: 'Type',
        Industry: 'Industry',
        Relation: 'Relation',
        Relationship: 'Relationship',
        Account: 'Account',
        General: 'General',
        Responsible: 'Responsible',
    },
});

class CreateContactForm extends React.PureComponent {
    createUpdateHandler = (key, value) => {
        const { formKey, organisationsDetail } = this.props;
        this.props.update(formKey, { [key]: value });
        this.props.update(formKey, { ['custId']: organisationsDetail?.custId });
    };

    render() {
        const { form, organisationsDetail, formKey } = this.props;
        return (
            <div className={cssForm.containerTaskForm}>
                <div className={`position-unset account-form ${cssForm.normalForm}`}>
                    <div className="account-fields-group">
                        <div className="fields-group-left">
                            <Form className="position-unset">
                                <Form.Group className="account-fields">
                                    <div className="account-field-label">
                                        <label>{`Tên liên hệ`}</label>
                                        <span className="required">*</span>
                                    </div>
                                    <div className="account-field" width={8}>
                                        <Input value={form.name || ''} onChange={(e) => { this.createUpdateHandler('name', e.target.value) }} />
                                        {/* <span className="form-errors">{(errors && errors.firstName) || null}</span> */}
                                    </div>
                                </Form.Group>
                                <Form.Group className="account-fields">
                                    <div className="account-field-label">
                                        <label>{`Chức vụ`}</label>
                                        <span className="required">*</span>
                                    </div>
                                    <div className="account-field" width={8}>
                                        <Input value={form.position || ''} onChange={(e) => { this.createUpdateHandler('position', e.target.value) }} />
                                        {/* <span className="form-errors">{(errors && errors.title) || null}</span> */}
                                    </div>
                                </Form.Group>
                                <Form.Group className="account-fields">
                                    <div className="account-field-label">
                                        <label>{`Số điện thoại`}</label>
                                        <span className="required">*</span>
                                    </div>
                                    <div className="account-field" width={8}>
                                        <Input value={form.phoneNumber || ''} onChange={(e) => { this.createUpdateHandler('phoneNumber', e.target.value) }} />
                                        {/* <span className="form-errors">{(errors && errors.lastName) || null}</span> */}
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="fields-group-right">
                            <Form className="position-unset">
                                <Form.Group className="account-fields">
                                    <div className="account-field-label">
                                        <label> {`Ngày sinh`}</label>
                                    </div>
                                    <div className="account-field" width={8}>
                                        <DatePickerInput value={form.birthdayValue || null}
                                        onChange={(e) => { this.createUpdateHandler('birthdayValue', moment(e).toDate().valueOf()) }} />
                                        {/* <Input value={null || ''} onChange={this.handleFirstNameChange} /> */}
                                        {/* <span className="form-errors">{(errors && errors.firstName) || null}</span> */}
                                    </div>
                                </Form.Group>
                                <Form.Group className="account-fields">
                                    <div className="account-field-label">
                                        <label> {`Email `}</label>
                                    </div>
                                    <div className="account-field" width={8}>
                                        <Input value={form.email || ''} onChange={(e) => { this.createUpdateHandler('email', e.target.value) }} />
                                        {/* <span className="form-errors">{(errors && errors.lastName) || null}</span> */}
                                    </div>
                                </Form.Group>
                                <Form.Group className="account-fields">
                                    <div className="account-field-label">
                                        <label> {`Địa chỉ`}</label>
                                    </div>
                                    <div className="account-field" width={8}>
                                        <Input value={form.address || ''} onChange={(e) => { this.createUpdateHandler('address', e.target.value) }} />
                                        {/* <span className="form-errors">{(errors && errors.lastName) || null}</span> */}
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateProps = (state, { formKey, isGlobal }) => {
    const formCurrent = state.entities.contact[formKey] || {};
    let participantsInit = formCurrent.participants;
    //init for create
    if (formKey != '__EDIT' && participantsInit == null) {
        participantsInit = [state.auth.userId];
    }
    return ({
        form: { ...formCurrent, participants: participantsInit },
        imageData: state.entities.contact.__UPLOAD ? state.entities.contact.__UPLOAD.dataURL : null,
        errors: state.entities.contact.__ERRORS,
        organisations: state.entities.organisationDropdown,
        organisationsDetail: state.entities?.organisation?.__DETAIL || {}

    });
};
export default connect(mapStateProps, { update, imageOnCropEnabled, uploadErrors })(CreateContactForm);
