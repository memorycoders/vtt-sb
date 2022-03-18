/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState, useEffect }  from 'react';
import { Form, Input, Image, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import TypeDropdown from './TypeDropdown';
import IndustryDropdown from './IndustryDropdown';
import SizeDropdown from './SizeDropdown';
import { imageOnCropEnabled, update, uploadErrors } from '../organisation.actions';
import './styles.less';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import { calculatingPositionMenuDropdown, ObjectTypes } from '../../../Constants';
import cx from 'classnames';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import api from '../../../lib/apiClient';
import moment from 'moment'
class CreateAccountForm extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      listBusinessType: [],
      listMainBusiness: [],
      listSubBusiness: [],
      listProvince: [],
      listDistrict: [],
      listWard: [],
      listTown: []
    }
  }

  getListBusinessType = async () => {
    try{
      const rs = await api.get({
        resource: `organisation-v3.0/getListBusinessType`,
      });
      if (rs) {
        let options = rs.map(item => {
          return {
            key: item.value,
            value: item.value,
            text: item.name
          }
        });
        this.setState({ listBusinessType: options})
      }

    } catch(err){
      console.log('err', err)
    }
  };

  getListMainBusinessField = async () => {
    try{
      const rs = await api.get({
        resource: `organisation-v3.0/getListMainBusinessField`,
      });
      if (rs) {
        let options = rs.map(item => {
          return {
            key: item.value,
            value: item.value,
            text: item.name
          }
        });
        this.setState({ listMainBusiness: options})
      }

    } catch(err){
      console.log('err', err)
    }
  };

  getListMainBusiness = async (value) => {
    try{
      const rs = await api.get({
        resource: `organisation-v3.0/getListMainBusiness`,
        query: {
          field: value
        }
      });
      if (rs) {
        let options = rs.map(item => {
          return {
            key: item.value,
            value: item.value,
            text: item.name
          }
        });
        this.setState({ listSubBusiness: options})
      }

    } catch(err){
      console.log('err', err)
    }
  };

  getAllProvince = async() => {
    try{
      const rs = await api.get({
        resource: `organisation-v3.0/getAllProvince`,
      });
      if (rs) {
        let options = rs.map(item => {
          return {
            key: item.areaCode,
            value: item.areaCode,
            text: item.name
          }
        });
        this.setState({ listProvince: options})
      }

    } catch(err){
      console.log('err', err)
    }
  }

  getParent = async (value, listname) => {
    try{
      const rs = await api.get({
        resource: `organisation-v3.0/getAllByParentCode`,
        query: {
          parentCode: value
        }
      });
      if (rs) {
        let options = rs.map(item => {
          return {
            key: item.areaCode,
            value: item.areaCode,
            text: item.name
          }
        });
        if(listname === 'listDistrict') this.setState({ listDistrict: options})
        else if(listname === 'listWard') this.setState({ listWard: options})
        else if(listname === 'listTown') this.setState({ listTown: options})
      }
    } catch(err){
      console.log('err', err)
    }
  };

  componentDidMount() {
    this.getListBusinessType();
    this.getListMainBusinessField();
    this.getAllProvince();
  }


  createUpdateHandler = (key, value) => {
    const { formKey } = this.props;
    this.props.update(formKey, { [key]: value });
  };

  mainBusinessChange = (event, {value}) => {
    this.createUpdateHandler('mainBusiness', [value])
  }

  fieldBusinessChange = (event, {value}) => {
    this.getListMainBusiness(value);
    this.createUpdateHandler('fieldBussiness', value)
  }

  typeBusinessChange = (event, {value}) => {
    this.createUpdateHandler('businessTypeId', value)
  }

  handleChangeProvince = (event, { value }) => {
    this.getParent(value, 'listDistrict');
    this.createUpdateHandler('province', value)
  };

  handleChangeDistrict = (event, { value }) => {
    this.getParent(value, 'listWard')
    this.createUpdateHandler('district', value)
  };

  handleChangeWard = (event, { value }) => {
    this.getParent(value, 'listTown')
    this.createUpdateHandler('precinct', value)
  };

  handlChangeBlock = (event, { value }) => {
    this.createUpdateHandler('streetBlock', value)
  };

  render() {
    const { imageData, errors, form } = this.props;
    const { listBusinessType, listMainBusiness, listSubBusiness, listProvince, listTown, listDistrict, listWard } = this.state
    return (
      <div className={cssForm.containerTaskForm}>
        <div className={`position-unset account-form ${cssForm.normalForm}`}>
        <div className="account-address-type">
            <div className="fields-group-left">
              <div
                className={`address-type-item`}
              >
                <span>Thông tin doanh nghiệp</span>
              </div>
            </div>
          </div>
          <div className="account-fields-group" style={{ marginTop: '20px' }}>
            <div className="fields-group-left">
              <Form>
                  <Form.Group className="account-fields">
                    <div className={cssForm.accountFieldLabel} >
                      Tên doanh nghiệp
                      <span className={cssForm.required}>*</span>
                    </div>
                    <div className="account-field" width={2}>
                      <Input value={form.custName || ''} onChange={(e) => { this.createUpdateHandler('custName', e.target.value) }} />
                      <span className="form-errors">{errors && errors.name ? errors.name : null}</span>
                    </div>
                  </Form.Group>
                {/*)}*/}
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >
                    Mã số thuế
                    <span className={cssForm.required}>*</span>
                  </div>
                  <div className="account-field" width={2}>
                    <Input
                      error={errors && errors.name ? true : false}
                      value={form.taxCode || ''}
                      onChange={(e) => { this.createUpdateHandler('taxCode', e.target.value) }}
                    />
                    <span className="form-errors">{errors && errors.name ? errors.name : null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Số giấy phép kinh doanh
                  <span className={cssForm.required}>*</span>
                  </div>
                  <div className="account-field" width={2}>
                    <Input value={form.businessLicense || ''}
                    onChange={(e) => { this.createUpdateHandler('businessLicense', e.target.value) }} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Ngày thành lập
                  <span className={cssForm.required}>*</span></div>
                  <div className="account-field" width={2}>
                    <DatePickerInput value={form.establishedDate || null} onChange={(e) => { this.createUpdateHandler('establishedDate', moment(e).toDate().valueOf()) }}/>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Email</div>
                  <div className="account-field" width={2}>
                    <Input onChange={(e) => { this.createUpdateHandler('email', e.target.value) }} value={form.email || ''} />
                  </div>
                </Form.Group>
              </Form>
            </div>
            <div className="fields-group-right">
              <Form>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Loại doanh nghiệp
                  <span className={cssForm.required}>*</span></div>
                  <div className="account-field" width={2}>
                    <Dropdown value={form.businessTypeId || null} isFetching={true} className="type-dropdown" options={listBusinessType} onChange={this.typeBusinessChange} fluid search selection />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Lĩnh vực</div>
                  <div className="account-field" width={2}>
                    <Dropdown value={form.fieldBussiness || null} isFetching={true} className="type-dropdown" options={listMainBusiness} onChange={this.fieldBusinessChange}  fluid search selection />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Ngành nghề kinh doanh</div>
                  <div className="account-field" width={2}>
                    <Dropdown isFetching={true} className="type-dropdown" options={listSubBusiness} onChange={this.mainBusinessChange} fluid search selection />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Điện thoại liên hệ
                  <span className={cssForm.required}>*</span></div>
                  <div className="account-field" width={2}>
                    <Input value={form.phoneNumber || ''} onChange={(e) => { this.createUpdateHandler('phoneNumber', e.target.value) }} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Website</div>
                  <div className="account-field" width={2}>
                    <Input value={form.website || ''} onChange={(e) => { this.createUpdateHandler('website', e.target.value) }} />
                  </div>
                </Form.Group>
              </Form>
            </div>
          </div>
          <div className="account-address-type">
            <div className="fields-group-left">
              <div
                className={`address-type-item`}
              >
                <span>Thông tin địa chỉ</span>
              </div>
            </div>
          </div>
          <div className="account-fields-group" style={{ marginTop: '20px' }}>
            <div className="fields-group-left">
              <Form>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Tỉnh
                  <span className={cssForm.required}>*</span></div>
                  <div className="account-field" width={2}>
                    <Dropdown value={form.province || null} isFetching={true} className="type-dropdown" options={listProvince} onChange={this.handleChangeProvince} fluid search selection />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Huyện
                  <span className={cssForm.required}>*</span></div>
                  <div className="account-field" width={2}>
                    <Dropdown value={form.district || null} isFetching={true} className="type-dropdown" options={listDistrict} onChange={this.handleChangeDistrict} fluid search selection />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Phường/Xã
                  <span className={cssForm.required}>*</span></div>
                  <div className="account-field" width={2}>
                    <Dropdown value={form.precinct || null} isFetching={true} className="type-dropdown" options={listWard} onChange={this.handleChangeWard} fluid search selection />
                  </div>
                </Form.Group>
              </Form>
            </div>
            <div className="fields-group-right">
              <Form>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Tổ/Thôn</div>
                  <div className="account-field" width={2}>
                    <Dropdown onChange={this.handlChangeBlock} value={form.streetBlock || null} isFetching={true} className="type-dropdown" options={listTown} fluid search selection />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Đường
                  </div>
                  <div className="account-field" width={2}>
                    <Input onChange={(e) => { this.createUpdateHandler('streetName', e.target.value) }} value={form.streetName || ''} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Địa chỉ trụ sở chính
                  <span className={cssForm.required}>*</span>
                  </div>
                  <div className="account-field" width={2}>
                    <Input value={form.headquarters || ''} onChange={(e) => { this.createUpdateHandler('headquarters', e.target.value) }} />
                  </div>
                </Form.Group>
              </Form>
            </div>
          </div>
          <div className="account-address-type">
            <div className="fields-group-left">
              <div
                className={`address-type-item`}
              >
                <span>Thông tin chủ sở hữu</span>
              </div>
            </div>
          </div>
          <div className="account-fields-group" style={{ marginTop: '20px' }}>
            <div className="fields-group-left">
              <Form>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Tên chủ sở hữu
                  <span className={cssForm.required}>*</span>
                  </div>
                  <div className="account-field" width={2}>
                    <Input value={form.owner || ''} onChange={(e) => { this.createUpdateHandler('owner', e.target.value) }} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className={cssForm.accountFieldLabel} >Địa chỉ chủ sở hữu
                  <span className={cssForm.required}>*</span>
                  </div>
                  <div className="account-field" width={2}>
                    <Input value={form.ownerAddress || ''} onChange={(e) => { this.createUpdateHandler('ownerAddress', e.target.value) }} />
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

const mapStateProps = (state, { formKey }) => {
  const formCurrent = state.entities.organisation[formKey] || {};
  let participantsInit = formCurrent.participants;
  //init for create
  if (formKey != '__EDIT' && participantsInit==null) {
    participantsInit = [state.auth.userId];
  }
  return ({
    form: {...formCurrent, participants: participantsInit},
    imageData:
      state.entities.organisation.__UPLOAD && state.entities.organisation.__UPLOAD.dataURL
        ? state.entities.organisation.__UPLOAD.dataURL
        : null,
    errors: state.entities.organisation.__ERRORS,
  });
            };
export default connect(mapStateProps, { imageOnCropEnabled, update, uploadErrors })(CreateAccountForm);
