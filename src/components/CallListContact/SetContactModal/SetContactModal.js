//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ConfirmationDialog from 'components/ConfirmationDialog/ConfirmationDialog';
import ModalCommon from '../../ModalCommon/ModalCommon';
// import { makeGetTask } from '../task.selector';
import { withRouter } from 'react-router';
import * as CallListContactActions from '../../CallListContact/callListContact.actions';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
  },
});

const SetContactModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to set this as done ?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId }) => {
    const visible = isHighlightAction(state, overviewType, 'set');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      callListContact: highlightedId,
    };
  };
  return mapStateToProps;
};
export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    setContact: CallListContactActions.setContact,
  }),
  withHandlers({
    onClose: ({ clearHighlight, overviewType, account }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ callListContact, overviewType, setContact, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/call-lists/contact'.length + 1);
      setContact(overviewType, callListContact);
      if (uuid === callListContact) {
        history.push(`/call-lists/contact`);
      }
    },
  })
)(SetContactModal);
