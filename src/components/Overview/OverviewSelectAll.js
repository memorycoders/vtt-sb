// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Checkbox } from 'semantic-ui-react';
import { getOverview } from 'components/Overview/overview.selectors';
import * as OverviewActions from './overview.actions';

type PropsT = {
  selectAll: boolean,
  onChange: (Event, { checked: boolean }) => void,
};

const OverviewSelectAll = ({ selectAll, onChange, className }: PropsT) => {
  return (
    <Checkbox className={className} checked={selectAll} onChange={onChange} />
  );
};

export default compose(
  connect(
    (state, { overviewType }) => {
      const overview = getOverview(state, overviewType);
      return {
        selectAll: overview.selectAll,
      };
    },
    {
      setSelectAll: OverviewActions.setSelectAll,
    }
  ),
  withHandlers({
    onChange: ({ setSelectAll, overviewType }) => (event: Event, { checked: selectAll }) => {
      setSelectAll(overviewType, selectAll);
    },
  })
)(OverviewSelectAll);
