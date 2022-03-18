/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import Percentage from '../CreateQualifiedForm/percentage';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import CreateQualifiedForm from '../CreateQualifiedForm';
import {
  createErros,
  createEntityFetch,
  changeTab,
  addOrder,
  clearCreateEntity,
  updateFetch,
} from '../qualifiedDeal.actions';
import { clear, create } from '../../OrderRow/order-row.actions';
import '../CreateQualifiedModal/styles.less';
import EditOrderForm from '../EditOrderForm/EditOrderForm';
import { clearDetailToEdit } from '../qualifiedDeal.actions';

addTranslations({
  'en-US': {
    save: 'Save',
    'Edit Qualified deal': 'Edit Qualified deal',
    'Contact is required': 'Contact is required',
    'Description is required': 'Description is required',
    'Progress is required': 'Progress is required',
    Order: 'Order',
  },
});

class EditOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      message: '',
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
    this.props.clearDetailToEdit();
  };

  onSave = async () => {
    this.onSaveQualified();
  };

  onSaveQualified = () => {
    const { form, types } = this.props;
    const { participantList } = form;

    if (!participantList || (participantList && participantList.length <= 0)) {
      this.props.createErros({
        participantList: _l`A responsbile is required`,
      });
    }
    if (participantList && participantList.length > 0) {
      this.props.updateFetch(this.props.overviewType);
    }
  };

  onOpen = (participantList) => {
    this.setState({ openPopup: true, participantList });
  };

  onClosePercentage = () => {
    this.setState({ openPopup: false });
  };

  render() {
    const { visible } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Update deal`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={css.editTaskModal}
          okLabel={_l`save`}
          scrolling={true}
        >
          <EditOrderForm
            formKey="__EDIT"
            onOpen={this.onOpen}
            onClosePercentage={this.onClosePercentage}
            highlightAction="edit"
          />
        </ModalCommon>
        <Percentage
          visible={this.state.openPopup}
          onClosePercentage={this.onClosePercentage}
          formKey="__EDIT"
          participantList={this.state.participantList}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'editOrder');
  return {
    form: state.entities.qualifiedDeal.__EDIT || {},
    user: state.auth.user,
    visible,
    types: state.entities.salesMethod,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  createErros,
  createEntityFetch,
  changeTab,
  addOrder,
  clearCreateEntity,
  clear,
  create,
  updateFetch,
  clearDetailToEdit,
})(EditOrderModal);
