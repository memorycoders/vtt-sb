//@flow
import * as React from 'react';
import { useState } from 'react';
import DatePickerInput from '../DatePicker/DatePickerInput';
import { lifecycle, withState, withHandlers, compose, withProps, defaultProps } from 'recompose';
import { Menu, Label, Grid, Button } from 'semantic-ui-react';
import cx from 'classnames';
import css from './Collapsible.css';
import _l from 'lib/i18n';
import moment from 'moment';


// type PropsT = {
//   handleRef: (any) => void,
//   style: {},
//   open: boolean,
//   toggle: () => void,
//   children: React.Node,
//   title: string,
//   wrapperClassName: string,
//   containerClassName: string,
//   icon: React.Node,
//   onIconClick: (Event) => void,
//   statusText: string,
//   statusColor: string,
//   onClick: (Event) => void,
// };

const Collapsible = ({
  containerClassName,
  wrapperClassName,
  open,
  toggle,
  title,
  handleRef,
  style,
  children,
  icon,
  onIconClick,
  statusText,
  statusColor,
  count,
  width,
  right,
  rightClassName,
  maxHeight,
  hasDragable,
  onClick,
  isOrder,
  account,
  requestFetchOrder
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setTodate] = useState('');

  const colorCount = "#f3f4f4";
  let marginTop = isOrder ? '0px' : '14px';
  let menuStyle = {
    width,
    minWidth: width,
    position: 'relative',
    marginTop
  }
  let rowStyles = {
    paddingTop: '0px',
    paddingBottom: '0px'
  }

  const handleHeaderClick = () => {
    if(typeof onClick === 'function') {
      onClick();
    }
  }

  const handleChangeFromDate = (date) => {
    console.log("from date: ", date);
    setFromDate(date);
  }

  const hanldeChangeToDate = (date) => {
    setTodate(date);
  }

  const handleSearchOrders = () => {
    let submitParams = {
      fromCreateDate: moment(fromDate).format('YYYY-DD-MM'),
      toCreateDate: moment(toDate).format('YYYY-DD-MM'),
      status: '1',
      idNo: account?.taxCode,
      accountId: account?.uuid
    };
    requestFetchOrder(submitParams);
  }

  return (
    <React.Fragment>
      {
        isOrder && <div className={css.order_search}>
          <Grid>
            <Grid.Column width={16}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={5} verticalAlign="middle">
                      Từ ngày*
                    </Grid.Column>
                    <Grid.Column width={11} verticalAlign="middle">
                      <DatePickerInput value={fromDate} onChange={handleChangeFromDate} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid>
                <Grid.Row style={rowStyles}>
                  <Grid.Column width={5} verticalAlign="middle">
                      Đến ngày*
                  </Grid.Column>
                  <Grid.Column width={11} verticalAlign="middle">
                    <DatePickerInput value={toDate} onChange={hanldeChangeToDate} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={16} textAlign="center">
                <Button className={css.order_search_btn} onClick={handleSearchOrders}>Tìm kiếm</Button>
            </Grid.Column>
          </Grid>
        </div>
      }
      <Menu style={menuStyle} className={css.collapsibleHeader} attached="top" borderless>
        <Menu.Item style={{ width: '10.5px !important'}} header onClick={handleHeaderClick} >
          {_l`${title}`}
          {count &&
            <span className={css.count}>{count}</span>
          }
        </Menu.Item>
        {statusText && (
          <Menu.Item>
            <Label style={{ fontSize: 11, backgroundColor: statusColor, }} color={statusColor}>{statusText}</Label>
          </Menu.Item>
        )}
        {icon && (
          <Menu.Item onClick={onIconClick} icon className={right ? css.normal : css.noRightMenu}>
            {icon}
          </Menu.Item>
        )}
        {
         (!isOrder) && <Menu.Menu position="right">
            <Menu.Item className={rightClassName}>{right}</Menu.Item>
            {/* {!right && <Menu.Item icon={open ? 'chevron up' : 'chevron down'} onClick={toggle} />} */}
          </Menu.Menu>
        }
      </Menu>
      <div style={{ ...style, width, height: 'auto' }} ref={handleRef} className={containerClassName}>
        <div style={{display: open ? 'block' : 'none'}} className={`${wrapperClassName} ${css.childDescription}`}>
          {children}
          </div>
      </div>
    </React.Fragment>
  );
};

export default compose(
  defaultProps({
    open: true,
  }),
  withState('maxHeight', 'setMaxHeight', null),
  withState('open', 'setOpen', ({ open }) => open),
  withHandlers(() => {
    let container;
    return {
      toggle: ({ open, setOpen }) => () => setOpen(!open),
      handleRef: () => (ref) => (container = ref),
      setMaxHeight: ({ maxHeight, setMaxHeight }) => () => {
        if (maxHeight !== container.scrollHeight) {
          setMaxHeight(container.scrollHeight);
        }
      },
    };
  }),
  withProps(({ flex, padded, open, maxHeight, vertical }) => ({
    wrapperClassName: cx(css.wrapper, {
      [css.padded]: padded,
      [css.flex]: flex,
      [css.vertical]: vertical,
    }),
    containerClassName: cx(css.container, {
      [css.closed]: !open,
    }),
  })),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (prevProps.open !== this.props.open) {
        this.props.setOpen(this.props.open);
      }
      this.props.setMaxHeight();
    },
    componentDidMount() {
      this.props.setMaxHeight();
    },
  })
)(Collapsible);
