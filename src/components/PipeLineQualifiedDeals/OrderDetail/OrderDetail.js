//@flow
import * as React from 'react';
import { Popup } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';
import { ContentLoader } from 'components/Svg';
import { ObjectTypes, OverviewTypes, Colors, ROUTERS } from 'Constants';
import OrderPane from './OrderPane';
import closeIcon from '../../../../public/Add.svg';
import { OrderCard } from '../../Organisation/Cards/OrderCard';
import SubOrders from '../../Orders/OrdersOfCompany/SubOrders';

const OrderDetail = (props) => {
  const { orderDetail } = props;

  return (
    <div className={css.pane}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popup
            position="top center"
            style={{ fontSize: 11 }}
            content="Đóng"
            trigger={
              <div className={css.iconDiv}>
                <Link to={`/pipeline/orders`}>
                  <img className={`${css.closeIcon} ${css.detailIconSize}`} src={closeIcon} />
                </Link>
              </div>
            }
          />
        </div>
      <OrderPane order={orderDetail} color={Colors.Pipeline} />
      <SubOrders/>
      {/* <AccountPaneMenu route={route} account={account} /> */}
    </div>
  );
};
const mapStateToProps = (state, props) => {
  // const orderDetail = state.entities?.qualifiedDeal?.__ORDER_DETAIL
  return {
    orderDetail: state.entities?.qualifiedDeal?.__ORDER_DETAIL
  };
};
const mapDispatchToProps = {};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withGetData(({ requestFetchOrganisation, match: { params: { organisationId } } }) => () => {
    // requestFetchOrganisation(organisationId);
  })

  // branch(({ account }) => !account, renderComponent(OrderDetailPlaceHolder))
)(OrderDetail);
