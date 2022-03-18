/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import api from 'lib/apiClient';
import { isValidPhone, isEmail } from 'lib';
import ModalCommon from '../../ModalCommon/ModalCommon';
import CreateContactForm from '../CreateContactForm/index';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import CropPhotoModal from '../../Organisation/CreateAccountForm/CropPhotoModal';
import css from '../../Organisation/CreateAccountModal/CreateAccountModal.css';
import { uploadErrors, requestCreate, succeedCreate } from '../contact.actions';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';

addTranslations({
  'en-US': {
    save: 'Save',
    'Add Contact': 'Add Contact',
    'First name is required': 'First name is required',
    Confirm: 'Confirm',
  },
});

class CreateContactModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      message: '',
      closeOnDimmerClick: true,
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType, '');
    this.props.succeedCreate();
  };

  hideEditConfirm = () => {
    this.setState({ showModal: false, message: '' });
  };

  onSave = async () => {
    try {
      const { form } = this.props;
      const res = await api.post({
        resource: `organisation-v3.0/insertCustContact`,
        data: {
          address: form.address,
          birthdayValue: form.birthdayValue,
          custId: form.custId,
          email: form.email,
          name: form.name,
          phoneNumber: form.phoneNumber,
          position: form.position
        },
      });
      console.log('On my way 🚲🛴🚲', res)
    } catch(err){
      console.log('🦼🦽🦽', error)
    }
  };

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  uploadAvatar = async (fileData) => {
    if (!fileData) return null;
    try {
      const formData = new FormData();
      formData.append('avatar', this.dataURLtoFile(this.props.dataURL, fileData.name));
      const res = await api.post({
        resource: `document-v3.0/photo/uploadAvatar`,
        data: formData,
        options: {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      });
      if (res) {
        return res.avatar;
      }
    } catch (error) {}
  };

  getDetailsFromEmail = async (emails) => {
    return Promise.all(
      emails.map((email) => {
        return api.get({
          resource: 'contact-v3.0/getDetailsFromEmail',
          query: {
            languageCode: 'en',
            email: email,
          },
        });
      })
    ).then((results) => {
      return results;
    });
  };

  checkEmailExist = (rs) => {
    for (let i = 0; i < rs.length; i++) {
      if (rs[i] && rs[i].uuid) {
        return rs[i];
      }
    }
    return null;
  };

  onSaveConfirm = async () => {
    this.setState({ showModal: false, message: '' });
    const { form, fileData } = this.props;
    let avatar = form.avatar || null;
    if (fileData) {
      avatar = await this.uploadAvatar(fileData);
    }
    this.props.requestCreate(this.props.overviewType, avatar);
  };
  changeCloseOnDimmerClick = (closeOnDimmerClick) => {
    this.setState({ closeOnDimmerClick });
  };
  render() {
    const { visible, customField } = this.props;
    const { closeOnDimmerClick } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          closeOnDimmerClick={closeOnDimmerClick}
          title={_l`Add contact`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={true}
          className={customField.length > 0 ? css.modalCustomField :css.modal}
          paddingAsHeader
        >
          <CreateContactForm
            changeCloseOnDimmerClickParent={this.changeCloseOnDimmerClick}
            formKey="__CREATE"
            overview={this.props.overviewType}
          />
        </ModalCommon>
        <CropPhotoModal type="contact" />

        <ModalCommon
          closeOnDimmerClick={closeOnDimmerClick}
          title={_l`Confirm`}
          visible={this.state.showModal}
          onDone={this.onSaveConfirm}
          onClose={this.hideEditConfirm}
          okLabel={_l`save`}
          scrolling={true}
          className={css.confirmModal}
          paddingAsHeader
        >
          <p>{this.state.message}</p>
        </ModalCommon>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  const customField = getCustomFieldsObject(state);
  return {
    visible,
    customField,
    form: state.entities.contact.__CREATE || {},
    fileData: state.entities.contact.__UPLOAD ? state.entities.contact.__UPLOAD.fileData : null,
    dataURL: state.entities.contact.__UPLOAD ? state.entities.contact.__UPLOAD.dataURL : null,
    errors: state.entities.contact.__ERRORS,
    highlightAction: state.overview[overviewType] ? state.overview[overviewType].highlightAction : null,
  };
};
export default connect(mapStateToProps, {
  isHighlightAction,
  clearHighlight,
  uploadErrors,
  requestCreate,
  succeedCreate,
})(CreateContactModal);
