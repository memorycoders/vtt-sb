import React from 'react';
import { connect } from 'react-redux';
import createOverview from 'components/Overview/createOverview';
import { ObjectTypes, OverviewTypes } from '../../Constants';

export const InfiniteViettelList = (props) => {
  const Overview = createOverview(OverviewTypes.VT, ObjectTypes.VT, null, null, null, null);

  return <Overview hasPeriodSelector hasFilter></Overview>;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InfiniteViettelList);
