//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMutilTaskMenu } from '../task.actions';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Confirm': 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Are you sure you want to delete all ?': 'Are you sure you want to delete all ?',
    'Are you sure you want to set all as done ?': 'Are you sure you want to set all as done ?'
  },
});

const DeleteAndSetDoneMutilModal = ({ visible, hide, onSave, modalType }: PropsT) => {
  return (
    <ModalCommon title={_l`Confirm`} cancelLabel={_l`No`} okLabel={_l`Yes`} visible={visible} onDone={onSave} onClose={hide} size="tiny"
                 paddingAsHeader={true} >
      {modalType === 'delete_tasks' ? <p>{_l`Are you sure you want to delete?`}</p> : <p>{_l`Are you sure you want to mark all as done?`}</p>}
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, modalType = 'delete_tasks' }) => {
    const visible = isHighlightAction(state, overviewType, modalType);
    return {
      visible
    };
  };
  return mapStateToProps;
};
export default compose(
  connect(
    makeMapStateToProps,
    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      changeOnMutilTaskMenu: changeOnMutilTaskMenu
    }
  ),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ changeOnMutilTaskMenu, modalType = 'delete_tasks', overviewType }) => () => {
      changeOnMutilTaskMenu(modalType, null,  overviewType)
    },
  })
)(DeleteAndSetDoneMutilModal);
