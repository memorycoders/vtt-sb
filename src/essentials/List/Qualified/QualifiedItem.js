// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Avatar from '../../../components/Avatar/Avatar';
import { Icon, Popup, Button } from 'semantic-ui-react';
import ContactPopup from '../../../components/Contact/ContactPopup';
import CreatorPane from '../../../components/User/CreatorPane/CreatorPane';
import * as OverviewActions from 'components/Overview/overview.actions';
// import * as contactActions from 'components/Contact/contact.actions';
import cx from 'classnames';
import css from './QualifiedItem.css';
import overviewCss from 'components/Overview/Overview.css';
import Moment from 'react-moment';
import { checkBorder } from '../../../components/PipeLineQualifiedDeals/TaskSteps/CardStep';
import moment from 'moment';
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import QualifiedDealActionMenu from '../../Menu/QualifiedDealActionMenu';
import starWonActive from '../../../../public/star_circle_won_active.svg';
import starLostActive from '../../../../public/star_circle_lost_active.svg';
import { withRouter } from 'react-router';
import _l from 'lib/i18n';
import DescriptionPopup from './DescriptionPopup';
import { fetchQualifiedDetailSuccess } from '../../../components/PipeLineQualifiedDeals/qualifiedDeal.actions'

addTranslations({
  'en-US': {
    Value: 'Value',
    What: 'What',
    'Resp.': 'Resp.',
  },
});

const QualifiedListHeader = ({ objectType, isOrder, orderBy, setOrderBy }) => {
  return (
    <div className={cx(css.listItem, css.header)}>
      <div className={isOrder? css.name : css.dealine} onClick={() => setOrderBy('dateAndTime')}>
      { 
        isOrder ? 'Doanh nghiệp' : <span className={css.dflex}>
            {_l`Deadline` }
            {
              (!isOrder) && <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
              </span>
            }
        </span>
      }
      </div>
      { (!isOrder) && <div className={css.who}></div> }
      <div className={isOrder ? css.created_date : css.description} onClick={() => setOrderBy('description')}>
        {
          isOrder ? "Thời gian tạo" : <span>
            {_l`What`}
            <span className={orderBy === 'description' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        }
      </div>
      <div className={ isOrder ? css.status : css.info} onClick={() => setOrderBy('value')}>
        {
          isOrder ? 'Trạng thái' : <span>
          {_l`Value`}
            <span className={orderBy === 'value' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        }
      </div>
      <div className={isOrder ? css.amount : css.resp} onClick={() => setOrderBy('owner')}>
        {
          isOrder ? 'Tổng tiền' : <span style={{ marginLeft: 6 }}>
            {_l`Resp.`}
            <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        }
      </div>
    </div>
  );
};

const QualifiedItem = (props) => {
  const { route ,history, qualifiedDeal, overviewType, isOrder, setSelectedOrder } = props;
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const handleDate = (value) => {
    return new Date(value).getTime() < new Date().getTime() && new Date(value).getDate() < new Date().getDate();
  };

  const renderActionSpinder = () => {
    return (
      <div className={css.responsibleRow}>
        <CreatorPane
          styleCircle={{ marginRight: 6 }}
          size={30}
          creator={{ avatar: qualifiedDeal.ownerAvatar }}
          avatar={true}
        />
        <div className={css.rightMenu}>
          <div className={css.reponsibleIconSize}>
            <QualifiedDealActionMenu
              qualifiedDeal={qualifiedDeal}
              className={css.bgMore}
              overviewType={overviewType}
              hideWonLost={true}
            />
          </div>
        </div>
      </div>
    );
  };

  const contactName =
    qualifiedDeal.sponsorList &&
    qualifiedDeal.sponsorList.lenght > 0 &&
    qualifiedDeal.sponsorList[0].firstName &&
    qualifiedDeal.sponsorList[0].lastName
      ? qualifiedDeal.sponsorList[0].firstName + ' ' + qualifiedDeal.sponsorList[0].lastName
      : '';
  const borderColorCheck = checkBorder(qualifiedDeal);
  const progressBorberColor =
    borderColorCheck === 'GREEN' ? '#aacd40' : borderColorCheck === 'GREEN' ? '#f4b24e' : '#df5759';

  const listCn = cx(css.listItem);

  const gotoDetail = () => {
    setSelectedOrder({...qualifiedDeal, isOrder: true});
    if(route) {
      history.push(`${route}/${isOrder ? 'order' : 'qualified'}/${qualifiedDeal.uuid}`)
    }
  }
  //render order body
  return (
    <div onClick={gotoDetail} className={listCn}>
      {
        isOrder ? <div className={css.name}>{qualifiedDeal?.customerName}</div> : <div className={css.dealine}>
          {qualifiedDeal.won !== true && qualifiedDeal.won !== false && (
            <div className={cx(css.when, handleDate(qualifiedDeal.contractDate) && css.redColor)}>
              {qualifiedDeal.contractDate ? moment(qualifiedDeal.contractDate).format('DD MMM YYYY') : ''}
            </div>
          )}
          {(qualifiedDeal.won === false || qualifiedDeal.won) === true && (
            <div className={cx(css.when)}>
              {qualifiedDeal.wonLostDate ? moment(qualifiedDeal.wonLostDate).format('DD MMM YYYY') : ''}
            </div>
          )}
        </div>
      }
      {
        (!isOrder) && (
        <div className={css.who}>
            <CircularProgressBar
              color={progressBorberColor}
              width={40}
              height={40}
              percentage={qualifiedDeal.realProspectProgress}
            />
        </div>)
      }
      {
        isOrder ? <div className={css.created_date}>{moment(qualifiedDeal?.createDate).format('DD MM YYYY')}</div> : <div className={css.description}>
          {
            qualifiedDeal.description.length < 40 ? <div>{qualifiedDeal.description}</div> : <DescriptionPopup description={qualifiedDeal.description} />
          }
        </div>
      }
      { isOrder && <div className={css.status}>{qualifiedDeal.statusDesc}</div> }
      { 
        isOrder ? <div className={css.amount}>{numberWithCommas(qualifiedDeal?.totalPrice || 2000000)}</div> : <div className={css.info}>{numberWithCommas(Math.ceil(qualifiedDeal.grossValue))}</div>
      }
      {(!isOrder) && <div className={css.resp}>{renderActionSpinder()}</div>}
    </div>
  );
};

const mapDispatchToProps = {
  highlight: OverviewActions.highlight,
  setSelectedOrder: fetchQualifiedDetailSuccess
};

export default compose(
  withRouter,
  branch(({ header }) => header, renderComponent(QualifiedListHeader)),
  connect(null, mapDispatchToProps),
  withHandlers({
    acceptedDelegate: ({ overviewType, highlight, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, qualifiedDeal.uuid, 'acceptedDelegate');
    },
    declineDelegate: ({ overviewType, highlight, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, qualifiedDeal.uuid, 'declineDelegate');
    },

    setTask: ({ overviewType, highlight, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, qualifiedDeal.uuid, 'set');
    },
  })
)(QualifiedItem);
