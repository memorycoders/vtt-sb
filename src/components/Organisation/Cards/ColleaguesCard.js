//@flow
import * as React from 'react';
import { compose, pure, branch, renderNothing, lifecycle, withState, withHandlers } from 'recompose';
import { ColleagueItem } from 'essentials';
import { Collapsible } from 'components';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import { withGetData } from 'lib/hocHelpers';
import { requestFetchContacts } from '../organisation.actions';
import { sortContactSublist } from '../organisation.actions';
import { requestFetchColleague } from '../../Contact/contact.actions';
import css from '../Cards/TasksCard.css';
import _l from 'lib/i18n';
import { ObjectTypes, OverviewTypes,PAGE_SIZE_SUBLIST } from '../../../Constants';
// import { orderBy } from 'lodash';
import {List} from "react-virtualized";
import InfiniteLoader from "react-virtualized/dist/es/InfiniteLoader";

// type PropsType = {
//   contact: {},
// };


addTranslations({
  'en-US': {
    '{0}': '{0}',
    Contacts: 'Contacts',
  },
});

const ColleaguesCard = ({
  route,
  account,
  accountInList,
  overviewType,
  objectType,
  orderBy,
  handleOrderBy,
  isFetching,
  handleFilter}) => {

  let objectMerge = account;
  if (accountInList) {
    objectMerge = {
      ...account,
      ...accountInList,
    };
  }
  const { contacts } = objectMerge;
  let overviewT = OverviewTypes.Account_Contact;
  switch (objectType) {
    case ObjectTypes.Account:
      overviewT = OverviewTypes.Account_Contact;
      break;
    default:
      break;
  }
  if (!contacts) {
    return (
      <Collapsible count="0" width={308} padded title={_l`Contacts`}>
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No contacts`}
          </Message>
        )}
      </Collapsible>
    );
  }
  //page
  let pageIndexSection = 0;
  if (objectMerge.contacts.length <= PAGE_SIZE_SUBLIST) {
    pageIndexSection = 0;
  }
  return (
    <Collapsible width={308} title={_l`Contacts`} count={account.numberContact} open={true}>
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          <ColleagueItem header orderBy={orderBy} setOrderBy={handleOrderBy} /> 
          <InfiniteLoader
            autoReload={true}
            isRowLoaded={isRowRender(objectMerge.contacts)}
            loadMoreRows={(param) => {
              const { stopIndex } = param;
              const pageIndex = Math.ceil(stopIndex / PAGE_SIZE_SUBLIST) - 1;

              if (pageIndexSection < pageIndex) {
                pageIndexSection = pageIndex;
                handleFilter(pageIndex);
              }
            }}
            threshold={1}
            rowCount={account.numberContact !== NaN ? account.numberContact : 0}
          >
            {({ onRowsRendered, registerChild }) => {
              return (
                <List
                  height={200}
                  className={css.list}
                  rowCount={objectMerge.contacts.length}
                  rowHeight={48}
                  width={308}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={getRowRender(objectMerge.contacts, overviewT,route)}
                  threshold={300}
                  data={objectMerge.contacts}
                />
              );
            }}
          </InfiniteLoader>
        </>
      )}
    </Collapsible>
  );
};

const isRowRender = (quotes) => ({ index }) => {
  return !!quotes[index];
};

const getRowRender = (quotes, overviewType,route) => ({ index, style }) => {
  const item = quotes[index];

  if (!item) {
    return null;
  }
  return (<ColleagueItem style={style} route={route} contactId={item} key={item} overviewType={overviewType} />);

};


const mapDispatchToProps = {
  requestFetchContacts,
  sortContactSublist,
  requestFetchColleague,
};

export default compose(
  connect((state, { account }) => {
    return {
      accountInList: state.entities.organisation[account.uuid],
      isFetching: false,
    };
  }, mapDispatchToProps),
  withState('orderBy', 'setOrderBy', 'contactName'),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchContacts, account } = this.props;
      if (account.uuid !== nextProps.account.uuid || account.numberContact !== nextProps.account.numberContact) {
        console.log("componentWillReceiveProps running");
        requestFetchContacts(nextProps.account.uuid, null, 0, nextProps.account.custId);
      }
    },
  }),
  withGetData(({ requestFetchContacts, account }) => () => {
    console.log("withGetData running");
    requestFetchContacts(account.uuid,null,0, account.custId);
  }),
  withHandlers({
    handleOrderBy: ({ setOrderBy, account, requestFetchContacts, objectType, requestFetchColleague }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchContacts(account.uuid, orderBy, 0, account.custId);
    },
    handleFilter: ({ requestFetchContacts, account,objectType, orderBy }) => (
      pageIndex
    ) => {
      requestFetchContacts(
        account.uuid,
        orderBy,
        pageIndex,
        account.custId
      );
    },

  })
)(ColleaguesCard);
