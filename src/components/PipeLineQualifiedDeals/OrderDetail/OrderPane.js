//@flow
import * as React from 'react';
import { useState, useRef } from 'react'
import ReactCardFlip from 'react-card-flip';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure, defaultProps, withHandlers } from 'recompose';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import Avatar from '../../Avatar/Avatar';
import css from './OrderPane.css';
import { Popup } from 'semantic-ui-react';
import accountAvatar from '../../../../public/Accounts.svg'
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import { STATUS_ORDER } from '../../Orders/contants';
import { formatNumber } from '../../Quotations/Utils/formatNumber';

const OrderPane = (props)  => {
  const { order } = props;

  return (
    <div className={css.contactContainer}>
      <div style={{ cursor: 'pointer'}} className={cx(css.header)}>
        <div className={css.heading}>{order?.customerName}</div>
        <div className={css.contentAccount}>
          <div className={css.subHeading}>
            {order?.idNo || 123456}
          </div>
        </div>
        <div className={css.contactDetails}>
          <div className={css.qualifiedContractDetails}>
            <div className={css.qualifiedContractLeft}>
              <ul>
                <li>
                  <span className={css.weight400}>{_l`Status`}:&nbsp;</span>
                  <span className={css.weight500}>
                    {order?.statusDesc}
                  </span>
                </li>
                <li>
                  <span className={css.weight400}>Tổng tiền (VNĐ):&nbsp;</span>
                  <span className={css.weight500}>
                    {formatNumber(order?.totalPrice)}
                  </span>
                </li>
              </ul>
            </div>
            <div className={css.qualifiedContractRight}>
              <ul style={{ padding: '10px 4px 0px 4px' }}>
                <li>
                  <span className={css.weight400}>{_l`Contact name`}: &nbsp;</span> 
                  <span className={css.weight500}>{order?.contactName}</span>
                </li>
                <li>
                  <span className={css.weight400}>{_l`Phone`}: &nbsp;</span> 
                  <span className={css.weight500}>{order?.phoneNumber}</span>
                </li>
                <li>
                  <span className={css.weight400}>{_l`Email`}: &nbsp;</span>
                  <span className={css.weight500}>{order?.email} </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {
        (
          <div style={{ backgroundColor: "#fff" }} className={css.centerImage} flipDirection="horizontal">
            <CircularProgressBar
              color={'#df5759'}
              width={100}
              height={100}
              percentage={order?.successPercent}
            />
          </div>

        )

      }
    </div>
  );
};

export default compose(
  // branch(({ order }) => !order, renderNothing),
  pure
)(OrderPane);
