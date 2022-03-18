/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    // None: 'None',
    // Headquarter: 'Headquarter',
    // Subsidiary: 'Subsidiary',
    // department: 'department',
    // unit: 'unit',
    // support: 'support',
    // Switchboard: 'Switchboard',
    // mobile: 'mobile',
    // other: 'other',
  },
});


const CommunicationTypePhone = (props) => {
  let type = [
    { name: null, text: _l`None` },
    { name: 'PHONE_HEAD_QUARTER', text: _l`Headquarter` },
    { name: 'PHONE_SUBSIDIARY', text: _l`Subsidiary` },
    { name: 'PHONE_DEPARTMENT', text: _l`department` },
    { name: 'PHONE_UNIT', text: _l`Unit` },
    { name: 'PHONE_SWITCHBOARD', text: _l`Switchboard` },
    { name: 'PHONE_MOBILE', text: _l`Mobile` },
    { name: 'PHONE_OTHER', text: _l`other` },
  ];
  let options = type.map((item) => {
    return {
      key: item.name,
      value: item.name,
      text: _l`${item.text}`,
    };
  });
  return <Dropdown className="type-dropdown" fluid selection options={options} {...props} />;
};

export default CommunicationTypePhone;
