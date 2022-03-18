import * as React from 'react';
import createOverview from '../Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import { show } from '../AdvancedSearch/advanced-search.actions';
import InfiniteOrderListRow, { HeaderComponent, PlaceholderComponent } from './InfiniteOrderListRow';
import { AutoSizer } from 'react-virtualized';
import { withRouter } from 'react-router';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import css from './table.css';
import PeriodSelector from '../PeriodSelector/PeriodSelector';
import OrderDetail from './OrderDetail/OrderDetail';
// import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
const OrderOverview = (props) => {
  const {location} = props;
  const count = (location.pathname.match(/\//g) || []).length;

  return (
    <div className={css.quotation_container}>
            <AutoSizer disableHeight>
                {
                    ({ width }) => (
                        <AdvancedSearch width={width} objectType={ObjectTypes.PipelineOrder} clearSearch={true}/>
                    )
                }
            </AutoSizer>
            <PeriodSelector overviewType={OverviewTypes.Pipeline.Order} objectType={ObjectTypes.PipelineOrder} color={Colors.Pipeline} />
            <InfiniteOrderListRow />
            {/* {hasDetail === true && <OrderDetail order={itemSelected} />} */}
    </div>
  );
};
export default compose(
  connect(
    (state) => {
      return {
      };
    },
    {
      show
    }
  ),
  lifecycle({
    componentDidMount(){
      this.props.show(ObjectTypes.PipelineOrder);
    },
    componentWillReceiveProps(nextProps) {
    },
  }),
  withRouter,
)(OrderOverview);
