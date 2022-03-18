/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, TextArea, Input, Menu, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';
import ContactDropdown from '../../Contact/ContactDropdown';
import UserDropdown from './UserDropdown';
import SalesMethodDropdown from '../../SalesMethod/SalesMethodDropdown/SalesMethodDropdown';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import { createEntity, createErros } from '../qualifiedDeal.actions';
import { remove } from '../../OrderRow/order-row.actions';
import { setActionForHighlight } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import './styles.less';
import { getListOrderRows } from '../../OrderRow/order-row.selectors';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import editBtn from '../../../../public/Edit.svg';
import { calculatingPositionMenuDropdown, ObjectTypes } from '../../../Constants';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import cx from 'classnames';
import api from '../../../lib/apiClient';
import { Endpoints } from '../../../Constants';
import { editEntity as orderRoWEditEntity } from '../../OrderRow/order-row.actions';
import generateUuid from 'uuid/v4';
import { fetchListProductByResource } from '../../Resources/resources.actions';

let charLeft = 100;
const maxChar = 100;
class CreateQualifiedForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qualified: {
        ...props.form,
        participantList:
          props.form.participantList && props.form.participantList.length > 0
            ? props.form.participantList
            : [{ uuid: props.userId, sharedPercent: 100 }],
      },
      visible: false,
    };
  }

  componentDidMount() {
    const { qualified } = this.state;
    const { participantList } = qualified;
    const newObj = { ...qualified, participantList, uuid: this.props.qualifiedId };
    if (this.props.highlightAction === 'create' || this.props.highlightAction === 'edit') {
      setTimeout(() => {
        this.props.createEntity(this.props.formKey, newObj);
      }, 1);
    } else {
      this.props.createEntity(this.props.formKey, newObj);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.setState({ qualified: this.props.form });
    }
  }

  _initParticipantList = () => {
    const { qualified } = this.state;
    const { participantList = [] } = qualified;
    if (participantList && participantList.length > 0) {
      return participantList.map((p) => {
        return { uuid: p.uuid, sharedPercent: p.sharedPercent };
      });
    }
    return [];
  };

  _initUsersValue = () => {
    const { qualified } = this.state;
    const { participantList } = qualified;
    // console.log("qualified ",qualified);
    // console.log("participantList ",participantList);
    if (participantList && participantList.length > 0) {
      return participantList.map((p) => {
        return p.uuid;
      });
    }
    return [];
  };

  sumPercent = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseInt(arr[i].sharedPercent);
    }
    return sum;
  };

  _handleUserChange = (e, { value }) => {
    let newObj;
    const { qualified } = this.state;
    const { participantList = [] } = qualified;
    const ids = [];
    value.map((id) => {
      const right = participantList.find((x) => x.uuid === id);
      if (right) {
        ids.push(right);
      } else {
        ids.push({ uuid: id, sharedPercent: 0 });
      }
    });
    const sum = this.sumPercent(ids);
    if (sum !== 100) {
      for (let i = 0; i < ids.length; i++) {
        // ids[i].sharedPercent = i === 0 ? 100 - sum : 0;
        ids[i].sharedPercent = i === 0 ? Number(100 - sum) + Number(ids[i].sharedPercent) : ids[i].sharedPercent;
      }
    }
    newObj = { ...qualified, participantList: ids };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ participantList: null });
  };

  _handleLabelClick = (e, data) => {
    this.props.onOpen(this.state.qualified.participantList);
  };

  onClosePercentage = () => {
    this.props.onClosePercentage();
  };

  _handleOrganisationChange = (e, { value }) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, organisation: { uuid: value }, sponsorList: null };
    this.props.createEntity(this.props.formKey, newObj);
  };

  _handleContactChange = (e, { value }) => {
    const { qualified } = this.state;
    const index = value.indexOf(null);
    if (index >= 0) value.splice(index, 1);
    const newObj = { ...qualified, sponsorList: value.map((value) => ({ uuid: value })) };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ sponsorList: null });
  };

  _handleNoteChange = (e, { value }) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, description: value };
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ description: null });
  };

  _handleSaleMethod = (e, { value }) => {
    const { qualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...qualified, salesMethod: null };
    } else {
      newObj = { ...qualified, salesMethod: { uuid: value } };
    }
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ salesMethod: null });
  };

  _handleProgress = (e, { value }) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, manualProgress: value <= 100 ? value : 100 };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ manualProgress: null });
  };

  _handleDateChange = (value) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, contractDate: value };
    this.props.createEntity(this.props.formKey, newObj);
  };

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  clickAddProduct = async () => {
    try {
      this.props.setActionForHighlight('ORDER_ROW', 'create');
      if (this.props.isAddDealMultiResource && this.props.itemsSelected) {
        this.props.fetchListProductByResource();
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { form } = this.props;
    const {
      manualProgress,
      organisation,
      sponsorList,
      salesMethod,
      orderRowCustomFieldDTOList = [],
      description,
    } = this.state.qualified;
    console.log('ba123', this.props)

    const users = this._initUsersValue();
    const participantOpts = this._initParticipantList();
    const contractDate = this.state.qualified.contractDate ? new Date(this.state.qualified.contractDate) : new Date();
    // console.log('Create qualified users',users);
    return (
      <div className={cssForm.containerTaskForm}>
      <div className={`position-unset account-form ${cssForm.normalForm}`}>
          <div className="account-fields-group">
              <div className="fields-group-left">
                  <Form className="position-unset">
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label>{`Khách hàng`}</label>
                          </div>
                          <div className="account-field" width={8}>
                            <Label className={cssForm.label_custom}>{form.organisation.custName}</Label>
                              {/* <span className="form-errors">{(errors && errors.firstName) || null}</span> */}
                          </div>
                      </Form.Group>
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label>{`Mã số thuế`}</label>
                          </div>
                          <div className="account-field" width={8}>
                            <Label className={cssForm.label_custom}>{form.organisation.taxCode}</Label>
                              {/* <span className="form-errors">{(errors && errors.title) || null}</span> */}
                          </div>
                      </Form.Group>
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label>{`Địa chỉ`}</label>
                          </div>
                          <div className="account-field" width={8}>
                            <Label className={cssForm.label_custom}>{form.organisation.address}</Label>                              {/* <span className="form-errors">{(errors && errors.lastName) || null}</span> */}
                          </div>
                      </Form.Group>
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label>{`Email`}</label>
                          </div>
                          <div className="account-field" width={8}>
                          <Label className={cssForm.label_custom}>{form.organisation.email}</Label>
                              {/* <span className="form-errors">{(errors && errors.lastName) || null}</span> */}
                          </div>
                      </Form.Group>
                  </Form>
              </div>
              <div className="fields-group-right">
                  <Form className="position-unset">
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label> {`Tên liên hệ`}</label>
                          </div>
                          <div className="account-field" width={8}>
                            <ContactDropdown organisationId={form.organisation.uuid} onChange={this._handleContactChange} />
                          </div>
                      </Form.Group>
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label> {`Số điện thoại `}</label>
                          </div>
                          <div className="account-field" width={8}>
                              <Label className={cssForm.label_custom}>{form.organisation.phoneNumber}</Label>
                              {/* <span className="form-errors">{(errors && errors.lastName) || null}</span> */}
                          </div>
                      </Form.Group>
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label> {`Thời hạn`}</label>
                          </div>
                          <div className="account-field" width={8}>
                          <DatePickerInput
                          //  onChange={(e) => { this.createUpdateHandler('birthdayValue', moment(e).toDate().valueOf()) }}
                           />
                          </div>
                      </Form.Group>
                      <Form.Group className="account-fields">
                          <div className="account-field-label">
                              <label> {`Mô tả `}</label>
                              <span className="required">*</span>
                          </div>
                          <div className="account-field" width={8}>
                              <TextArea value={''}/>
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
const mapStateToProps = (state, { formKey }) => {
  return {
    form: state.entities.qualifiedDeal[formKey] || {},
    userId: state.auth.userId,
    errors: state.entities.qualifiedDeal.__ERRORS,
    rows: getListOrderRows(state),
    products: state.entities.product,
    types: state.entities.salesMethod,
    isAddDealMultiResource: state.entities?.resources?.isAddDealMultiResource,
    itemsSelected: state.overview?.RESOURCE?.selected,
  };
};

export default connect(mapStateToProps, {
  createEntity,
  createErros,
  setActionForHighlight,
  remove,
  orderRoWEditEntity,
  fetchListProductByResource,
})(CreateQualifiedForm);
