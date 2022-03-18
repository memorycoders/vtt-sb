import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Collapsible } from 'components';
import {
 List,

} from 'semantic-ui-react';
import css from '../Cards/TasksCard.css';
import api from '../../../lib/apiClient';
import _l from 'lib/i18n';

export const AMCard = (props) => {
  const { account } = props;
  const [isFetching, setIsFetching] = useState(false);
  return (
    <>
      <Collapsible
        hasDragable
        width={308}
        title={`AM quản lý`}
      >
      <div className={css.list} style={{ padding: '10px' }}>
        <List>
            <List.Item style={{ marginLeft: '4px' }}>
              <div className={css.firstRepon}>
                {account.amName || 'Không có'}
              </div>
            </List.Item>
            <List.Item style={{ marginTop: '10px', marginLeft: '4px' }}>
              <List.Icon name="envelope" />
              <List.Content>
                <a className={css.shortInfor}
                href={`mailto:${account.amEmail || null}`}
                >
                  {account.amEmail || 'Không có'}
                </a>
              </List.Content>
            </List.Item>
        </List>
      </div>
      </Collapsible>
    </>
  );
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AMCard);

