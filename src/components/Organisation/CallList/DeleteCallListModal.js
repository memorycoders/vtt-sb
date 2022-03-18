//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { removeCallListInAccount } from '../organisation.actions';

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
        'Do you want to remove from the call list?': 'Do you want to remove from the call list?',
    },
});

const DeleteCallListModal = ({ visible, onClose, onSave }: PropsT) => {
    return (
        <ModalCommon
            title={_l`Confirm`}
            visible={visible}
            onDone={onSave}
            onClose={onClose}
            size="tiny"
            paddingAsHeader={true}
        >
            <p>{_l`Do you want to remove from the call list?`}</p>

        </ModalCommon>
    );
};

const makeMapStateToProps = () => {

    const mapStateToProps = (state, { overviewType }) => {
        const visible = isHighlightAction(state, 'CALL_LIST_ACCOUNT', 'delete_call_list');
        const highlightedId = getHighlighted(state, 'CALL_LIST_ACCOUNT');
        const __DETAIL = state.entities.organisation.__DETAIL;
        return {
            visible,
            highlightedId,
            __DETAIL
        };
    };
    return mapStateToProps;
};

export default compose(
    connect(
        makeMapStateToProps,
        {
            clearHighlightAction: OverviewActions.clearHighlightAction,
            removeCallListInAccount,
        }
    ),
    withHandlers({
        onClose: ({ clearHighlightAction, overviewType }) => () => {
            clearHighlightAction('CALL_LIST_ACCOUNT');
        },
        onSave: ({ clearHighlightAction, highlightedId, removeCallListInAccount, __DETAIL }) => () => {

            removeCallListInAccount(__DETAIL.uuid, highlightedId);
            clearHighlightAction('CALL_LIST_ACCOUNT');
        },
    })
)(DeleteCallListModal);
