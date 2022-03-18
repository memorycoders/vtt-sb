// @flow
import React, { useState } from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Avatar } from 'components';
import ReactCardFlip from 'react-card-flip';
import { Icon, Popup, Button } from 'semantic-ui-react';

import ContactPopup from 'components/Contact/ContactPopup';

import { ContactActionMenu } from 'essentials';
import FocusRelationship from '../../../components/Focus/FocusRelationship';
import * as contactActions from 'components/Contact/contact.actions';

import { makeGetContact } from 'components/Contact/contact.selector';

import cx from 'classnames';
import css from './ColleagueItem.css';
import starSvg from '../../../../public/myStar.svg';
import starActiveSvg from '../../../../public/myStar_active.png';

import qualifiedSvg from '../../../../public/Qualified_deals.svg';
import appointmentAdd from '../../../../public/Appointments.svg';
import taskAdd from '../../../../public/Tasks.svg';
import DetailContact from './DetailContact'

import _l from 'lib/i18n';
import { withRouter } from 'react-router';
addTranslations({
  'en-US': {
    Responsible: 'Responsible',
    Reminders: 'Reminders',
    Qualified: 'Qualified',
    name: 'Name',
    'Resp.': 'Resp.',
  },
});

//header of list contact
const ColleagueListHeader = ({ orderBy, setOrderBy }) => {
  return (
    <div className={cx(css.listItem, css.header)}>
      <div className={css.name} >Tên liên hệ</div>
      <div className={css.position}>Chức vụ</div>
      <div className={css.phone} >Số điện thoại</div>
    </div>
  );
};

const FavoriteIcon = <Icon name="star" color="yellow" />;
const NotFavoriteIcon = <Icon name="star outline" />;

const ColleagueItem = ({ contact, handleToggleFavorite, overviewType, history, route, style }) => {
  const favoriteIton = contact.favorite ? FavoriteIcon : NotFavoriteIcon;
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);

  let relationshipAccountColor = contact.relationship;

  let disc = '';
  let discDesc = '';
  if (contact.discProfile === 'NONE') {
    disc = '#ADADAD';
    discDesc = 'Behaviour not defined';
  } else if (contact.discProfile === 'BLUE') {
    disc = '#2F83EB';
    discDesc = 'Likes facts, quality and accuracy';
  } else if (contact.discProfile === 'RED') {
    disc = '#ed684e';
    discDesc = 'Likes to take quick decisions, to act and take lead';
  } else if (contact.discProfile === 'GREEN') {
    disc = '#A9D231';
    discDesc = 'Likes socialising, collaboration and security';
  } else if (contact.discProfile === 'YELLOW') {
    disc = '#F5B342';
    discDesc = 'Likes to convince, influence and inspire others';
  }

  const gotoDetailContact = () => {
    if (route) {
      history.push(`${route}/contact/${contact.uuid}`);
    }
  }

  const showDetailContact = () => {
      setIsShowDetail(true);
  }

  const closeDetailContact = () => {
    setIsShowDetail(false);
  }

  return (
    <>
      <div style={style} className={css.listItem} onClick={showDetailContact} >
        <div className={css.contact_name}>
          { contact?.name }
        </div>
        <div className={css.contact_position}>
            { contact?.position}
        </div>
        <div className={css.contact_phone}>
            {contact?.phoneNumber}
        </div>
      </div>
      { isShowDetail && <DetailContact visible={isShowDetail} contact={contact} onClose={closeDetailContact} /> }
    </>
  );
};

const makeMapStateToProps = () => {
  const getContact = makeGetContact();
  const mapStateToProps = (state, { contactId }) => ({
    contact: getContact(state, contactId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  toggleFavoriteRequest: contactActions.toggleFavoriteRequest,
};

export default compose(
  withRouter,
  branch(({ header }) => header, renderComponent(ColleagueListHeader)),
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    handleToggleFavorite: ({ toggleFavoriteRequest, contact }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(contact.uuid, !contact.favorite);
    },
  })
)(ColleagueItem);
