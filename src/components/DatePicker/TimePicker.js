// @flow
import * as React from 'react';
import cx from 'classnames';
import { compose, withHandlers, withProps } from 'recompose';
import { Dropdown, Icon } from 'semantic-ui-react';
import css from './DatePicker.css';

type PropsT = {
  value: Date,
};

const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour) => ({
  value: hour,
  key: hour,
  text: hour,
}));
// const minutes = [0, 10, 20, 30, 40, 50].map((minute) => ({
const minutes = [0, 15, 30, 45].map((minute) => ({
  value: minute,
  key: minute,
  text: minute,
}));

const hoursMinutes = [
  '00:00',
  '00:15',
  '00:30',
  '00:45',
  '01:00',
  '01:15',
  '01:30',
  '01:45',
  '02:00',
  '02:15',
  '02:30',
  '02:45',
  '03:00',
  '03:15',
  '03:30',
  '03:45',
  '04:00',
  '04:15',
  '04:30',
  '04:45',
  '05:00',
  '05:15',
  '05:30',
  '05:45',
  '06:00',
  '06:15',
  '06:30',
  '06:45',
  '07:00',
  '07:15',
  '07:30',
  '07:45',
  '08:00',
  '08:15',
  '08:30',
  '08:45',
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
  '16:00',
  '16:15',
  '16:30',
  '16:45',
  '17:00',
  '17:15',
  '17:30',
  '17:45',
  '18:00',
  '18:15',
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '19:30',
  '19:45',
  '20:00',
  '20:15',
  '20:30',
  '20:45',
  '21:00',
  '21:15',
  '21:30',
  '21:45',
  '22:00',
  '22:15',
  '22:30',
  '22:45',
  '23:00',
  '23:15',
  '23:30',
  '23:45',
].map((hour) => ({
  value: hour,
  key: hour,
  text: hour,
}));
const TimePicker = ({ hour, minute, onSelectHours, onSelectMinutes }: PropsT) => {
  return (
    <div className={css.timePicker}>
      <div className={css.label}>
        <Icon name="clock" size="large" />
      </div>
      <div className={css.hour}>
        <Dropdown fluid selection options={hoursMinutes} value={hour} onChange={onSelectHours} />
      </div>
      {/* <div className={css.minute}>
        <Dropdown fluid selection options={minutes} value={minute} onChange={onSelectMinutes} />
      </div> */}
    </div>
  );
};

export default compose(
  withHandlers({
    onSelectHours: ({ value, onChange }) => (event, { value: hours }) => {
      console.log('----------', hours);
      console.log('====>>>', hours.split(':'));
      let array = hours.split(':');

      const date = new Date(value);
      date.setHours(parseInt(array[0]), parseInt(array[1]), 0);
      onChange(date);
    },
    onSelectMinutes: ({ value, onChange }) => (event, { value: minutes }) => {
      const date = new Date(value);
      date.setHours(date.getHours(), minutes, 0);
      onChange(date);
    },
  }),
  withProps(({ value }) => {
    if (!value) {
      return {
        hour: 0,
        minute: 0,
      };
    }
    const date = new Date(value);
    const hour = date.getHours();
    // const minute = Math.round(date.getMinutes() / 10) * 10;
    const minute = Math.round(date.getMinutes() / 15) * 15;
    return { hour: `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`, minute };
  })
)(TimePicker);
