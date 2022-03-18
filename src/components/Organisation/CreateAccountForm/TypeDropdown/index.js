//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as TypeActions from 'components/Type/type.actions';
import { getTypes } from 'components/Type/type.selector';
import { compose, defaultProps, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import _l from 'lib/i18n';
import type { DropdownType } from 'types/semantic-ui.types';

type PropsT = {
  types: Array<DropdownType>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

addTranslations({
  'en-US': {
    'Select type': 'Select type',
  },
});

const TypeDropdown = ({ handleSearch, types, isFetching, options, ...other }: PropsT) => {
  return (
    <Dropdown loading={isFetching} onSearchChange={handleSearch} fluid search selection options={options} {...other} />
  );
};

export default compose(
  defaultProps({
    type: 'TYPE',
  }),
  connect(
    (state, { type }) => ({
      types: getTypes(state, type),
      isFetching: state.ui.focus.dropdownFetching,
    }),
    {
      requestFetchDropdown: TypeActions.requestFetchDropdown,
    }
  ),
  lifecycle({
    componentDidMount(){
      this.props.requestFetchDropdown();
    },
    componentWillReceiveProps(nextProps) {
      if(!this.props.types || !nextProps.types|| (this.props.types && this.props.types.length <= 1) || (nextProps.types && nextProps.types.length <= 1)) {
        // this.props.requestFetchDropdown();
      }
    }
  }),
  // withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, dispatch, ...other }) => ({
    ...other,
  }))
)(TypeDropdown);
