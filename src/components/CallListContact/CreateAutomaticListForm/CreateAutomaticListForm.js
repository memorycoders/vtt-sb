//@flow
import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
import { compose, withHandlers, pure } from 'recompose';
import { connect } from 'react-redux';
import UnitDropdown from 'components/Unit/UnitDropdown';
import IndustryDropdown from 'components/Industry/IndustryDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';

import { FormPair } from 'components';
import { Types } from 'Constants';
import css from 'Common.css';

type PropsT = {
  handleNameChange: (Event, { value: string }) => void,
  handleUnitChange: (Event, { value: string }) => void,
  handleResponsibleChange: (Event, { value: string }) => void,
  handleDeadlineChange: (Event, { value: string }) => void,
  formKey: string,
  form: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Unit: 'Unit',
    Responsible: 'Responsible',
    Deadline: 'Deadline',
    Name: 'Name',
    Period: 'Period',
  },
});

const CreateAccountForm = ({
  handleNameChange,
  handleResponsibleChange,
  handleUnitChange,
  handleDeadlineChange,
  form,
}: PropsT) => {
  const deadline = form.deadline ? new Date(form.deadline) : new Date(Date.now() + 30 * 60 * 1000);

  return (
    <Form className={css.padded}>
      <FormPair mini required label={_l`Name`}>
        <Input required fluid value={form.name || ''} onChange={handleNameChange} />
      </FormPair>
      <FormPair mini label={_l`Unit`}>
        <UnitDropdown fluid value={form.unit} onChange={handleUnitChange} />
      </FormPair>
      <FormPair mini label={_l`Responsible`}>
        <IndustryDropdown onChange={handleResponsibleChange} value={form.responsible} />
      </FormPair>
      <FormPair mini required label={_l`Deadline`}>
        <DatePickerInput onChange={handleDeadlineChange} value={deadline} timePicker />
      </FormPair>
      <FormPair mini label={_l`Period`}>
        <IndustryDropdown onChange={handleResponsibleChange} value={form.responsible} />
      </FormPair>
    </Form>
  );
};

const mapStateProps = (state, { formKey }) => ({
  form: state.entities.organisation[formKey] || {},
});

const createUpdateHandler = (key) => ({ update, formKey }) => (event, { value }) => update(formKey, { [key]: value });

export default compose(
  connect(
    mapStateProps,
    {
      update: OrganisationActions.update,
    }
  ),
  withHandlers({
    handleNameChange: createUpdateHandler('name'),
    handleResponsibleChange: createUpdateHandler('responsible'),
    handleUnitChange: createUpdateHandler('unit'),
    handleDeadlineChange: createUpdateHandler('deadline'),
  }),
  pure
)(CreateAccountForm);
