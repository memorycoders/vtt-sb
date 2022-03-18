// @flow
import * as React from 'react';
import { defaultProps, withHandlers, lifecycle, compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { Dropdown, Grid, Label, Input, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { DropdownType, EventHandlerType } from 'types/semantic-ui.types';
import { SearchType } from './advanced-search.types';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import AdvancedSearchMenu from './AdvancedSearchMenu';
import SaveAdvancedSearchModal from './SaveAdvancedSearchModal';
import CopyAdvancedSearchModal from './CopyAdvancedSearchModal';
import SaveAdvancedSearchAndShareModal from './SaveAdvancedSearchAndShareModal';
import DeleteAdvancedSearchModal from './DeleteAdvancedSearchModal';
import * as AdvancedSearchActions from './advanced-search.actions';
import { getSavedSearches, getSearch } from './advanced-search.selectors';
import css from './AdvancedSearch.css';
import DatePicker from '../DatePicker/DatePicker';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import AdvancedSearchCompany from './AdvancedSearchCompany';
// import AdvancedSearchToggle from './AdvancedSearchToggle';
// import AdvancedFilterToggle from './AdvancedFilterToggle';
// import AdvancedHistoryToggle from './AdvancedHistoryToggle';
// import AdvancedGeniusToggle from './AdvancedGeniusToggle';
// import AdvancedAddToggle from './AdvancedAddToggle';

// type PropsType = {
//   search: SearchType,
//   objectType: string,
//   savedSearches: Array<DropdownType>,
//   handleSavedSearchChange: EventHandlerType,
//   handleSearch: (event: Event, { value: string }) => void,
//   handleTagChange: (event: Event, { value: string }) => void,
//   handleFilterChange: (event: Event, { value: string }) => void,
//   clearSearch: () => void,
//   loading: boolean,
//   searchTerm: string,
//   shown: boolean,
//   addGroup: () => void,
//   placeholder: string,
//   size?: string,
//   className?: string,
//   color: string,
//   hasTag: boolean,
//   hasFilter: boolean,
//   hasHistory: boolean,
//   history: boolean,
//   hasGenius: boolean,
//   hasAdd: boolean,
// };

addTranslations({
  'en-US': {
    OR: 'OR',
    'Select saved': 'Select saved',
    'No filter': 'No filter',
    'Select a filter': 'Select a filter',
    Favourites: 'Favourites',
    Recent: 'Recent',
  },
});

const domIdWrapAD = 'idWrapAD'
// const filterOptions = () => [
//   { text: _l`No filter`, icon: 'minus', value: null },
//   { text: _l`Favourites`, icon: 'star', value: 'favorite' },
//   { text: _l`Latest`, icon: 'clock', value: 'recent' },
// ];

const AdvancedSearch = ({
  addGroup,
  objectType,
  search: { groups, name, tag, selected, filter },
  shown,
  savedSearches,
  handleSavedSearchChange,
  size,
  className,
  width
}) => {
  const length = groups ? groups.length : 0;
  const lastGroup = length === 1;
  const [isFocus, setIsFocus] = React.useState(false);

  const openFocusSearch = () => {
    setIsFocus(true);
  }

  const OrderOptions = [
    {
      text: 'Mới',
      value: 1,
      key: 1
    },
    {
      text: 'Kết thúc',
      value: 3,
      key: 3
    },
    {
      text: 'Đã hủy',
      value: 4,
      key: 4
    }
  ]

  const closeFocusSearch = () => {
    setIsFocus(false);
  }

  const render = () => {
    if(shown && objectType !== 'ACCOUNT' && objectType !== 'PIPELINE_ORDER') {
      return (
        <div id="addvanceSearch" style={{ width, maxWidth: width }} className={`${className} ${css.advancedContainer} ${shown ? css.show : ''}`}>
          <Grid style={{ margin: 0 }}>
            <Grid.Column width="5" computer="5" tablet="7" mobile="16" className={css.savedSearchesContent}>
              <Dropdown
                className={css.dropdown}
                selection
                fluid
                search
                value={selected}
                onChange={handleSavedSearchChange}
                options={savedSearches}
                placeholder={_l`Select saved search`}
              />
              <AdvancedSearchMenu groups={groups} objectType={objectType} />
            </Grid.Column>
            <Grid.Column id={domIdWrapAD} className={`${css.overflow}  ${css.positionNone}`} width="11" computer="11" tablet="17" mobile="16" >

              {groups.map((groupId, index) => {
                let last = index === length - 1;
                return (
                  <React.Fragment key={groupId}>
                    <Grid className={css.marginGroup} style={{ 'display': `${index !== 0 ? 'flex' : 'none'}` }}>
                      <Grid.Column width="1" className={css._padding0}></Grid.Column>
                      <Grid.Column width="12" className={css._line}>
                        <div className={css.line} />
                        <div>{_l`Or`}</div>
                        <div className={css.line} />
                      </Grid.Column>
                      <Grid.Column width="3" className={css._padding0}>
                        {/* {last && <Button className={css.addOr} size={size} onClick={addGroup}>{_l`OR`}</Button>}
                        {!last && <span className={css.textOr}>{_l`OR`}</span>} */}
                      </Grid.Column>
                    </Grid>
                    <AdvancedSearchGroup
                      size={size}
                      domIdWrapAD={domIdWrapAD}
                      groupIndex={index}
                      addGroup={addGroup}
                      last={last}
                      lastGroup={lastGroup}
                      objectType={objectType} groupId={groupId} preGroupId={groups[index === 0 ? 0 : index - 1]}/>
                  </React.Fragment>
                );
              })}
            </Grid.Column>
          </Grid>

          <SaveAdvancedSearchModal name={name} objectType={objectType} />
          <CopyAdvancedSearchModal name={name} objectType={objectType} />
          <SaveAdvancedSearchAndShareModal name={name} objectType={objectType} />
          <DeleteAdvancedSearchModal objectType={objectType} />
        </div>
      )
    } else if (objectType === 'ACCOUNT') {
      return  <>
                <AdvancedSearchCompany width={width} className={className} savedSearches={savedSearches} handleSavedSearchChange={handleSavedSearchChange}  />
                <SaveAdvancedSearchModal name={name} objectType={objectType} />
                <DeleteAdvancedSearchModal objectType={objectType} />
              </>
    } else if (shown && objectType === 'PIPELINE_ORDER') {
      return (<div  id="addvanceSearch" style={{ width, maxWidth: width }} className={`${className} ${css.advancedContainer} ${css.show}`}>
        <Grid style={{margin: 0}}>
            <Grid.Column width="5" computer="5" tablet="7" mobile="16" >
            <Dropdown className={css.dropdown} selection fluid search value={selected} onChange={handleSavedSearchChange}
              options={savedSearches} placeholder={_l`Select saved search`} />
            </Grid.Column>
            <Grid.Column width="11" computer="11" tablet="9" mobile="16">
              <Grid>
                <Grid.Column width="7" computer="7" tablet="7" mobile="16">
                    <Grid width="16">
                      <Grid.Row stretched>
                          <Grid.Column width="5">
                            <Label basic color="black" className={css.label}>{_l`From`}(*)</Label>
                          </Grid.Column>
                          <Grid.Column width="11">
                              <DatePickerInput />
                          </Grid.Column>
                      </Grid.Row>
                      <Grid.Row stretched>
                          <Grid.Column width="5">
                            <Label basic color="black" className={css.label}>{_l`Status`}</Label>
                          </Grid.Column>
                          <Grid.Column width="11">
                              <Dropdown options={OrderOptions} placeholder={_l`Select status`} selection  fluid search />
                          </Grid.Column>
                      </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width="9" computer="9" tablet="9" mobile="16">
                    <Grid width={16}>
                        <Grid.Row stretched>
                          <Grid.Column width="5">
                            <Label basic color="black" className={css.label}>{_l`To`}(*)</Label>
                          </Grid.Column>
                          <Grid.Column width="11">
                              <DatePickerInput />
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row stretched>
                          <Grid.Column width="5">
                            <Label basic color="black" className={css.label}>{_l`Tax Identification Number`}</Label>
                          </Grid.Column>
                          <Grid.Column width="11">
                              <Input placeholder={_l`Tax Identification Number`} />
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ marginLeft: 20 }}  stretched>
                            <Button size="small" className={css.active}>{_l`Save`}</Button>
                            <Button size="small" className={css.active}>{_l`Search`}</Button>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
              </Grid>
            </Grid.Column>
        </Grid>
      </div>)
    }
     else {
      return null;
    }
  }

  // return (
  //   <div id="addvanceSearch" style={{ width, maxWidth: width }} className={`${className} ${css.advancedContainer} ${shown ? css.show : ''}`}>
  //     <Grid style={{ margin: 0 }}>
  //       <Grid.Column width="5" computer="5" tablet="7" mobile="16" className={css.savedSearchesContent}>
  //         <Dropdown
  //           className={css.dropdown}
  //           selection
  //           fluid
  //           search
  //           value={selected}
  //           onChange={handleSavedSearchChange}
  //           options={savedSearches}
  //           placeholder={_l`Select saved search`}
  //         />
  //         <AdvancedSearchMenu groups={groups} objectType={objectType} />
  //       </Grid.Column>
  //       <Grid.Column id={domIdWrapAD} className={`${css.overflow}  ${css.positionNone}`} width="11" computer="11" tablet="17" mobile="16" >

  //         {groups.map((groupId, index) => {
  //           let last = index === length - 1;
  //           return (
  //             <React.Fragment key={groupId}>
  //               <Grid className={css.marginGroup} style={{ 'display': `${index !== 0 ? 'flex' : 'none'}` }}>
  //                 <Grid.Column width="1" className={css._padding0}></Grid.Column>
  //                 <Grid.Column width="12" className={css._line}>
  //                   <div className={css.line} />
  //                   <div>{_l`Or`}</div>
  //                   <div className={css.line} />
  //                 </Grid.Column>
  //                 <Grid.Column width="3" className={css._padding0}>
  //                   {/* {last && <Button className={css.addOr} size={size} onClick={addGroup}>{_l`OR`}</Button>}
  //                   {!last && <span className={css.textOr}>{_l`OR`}</span>} */}
  //                 </Grid.Column>
  //               </Grid>
  //               <AdvancedSearchGroup
  //                 size={size}
  //                 domIdWrapAD={domIdWrapAD}
  //                 groupIndex={index}
  //                 addGroup={addGroup}
  //                 last={last}
  //                 lastGroup={lastGroup}
  //                 objectType={objectType} groupId={groupId} preGroupId={groups[index === 0 ? 0 : index - 1]}/>
  //             </React.Fragment>
  //           );
  //         })}
  //       </Grid.Column>
  //     </Grid>

  //     <SaveAdvancedSearchModal name={name} objectType={objectType} />
  //     <CopyAdvancedSearchModal name={name} objectType={objectType} />
  //     <SaveAdvancedSearchAndShareModal name={name} objectType={objectType} />
  //     <DeleteAdvancedSearchModal objectType={objectType} />
  //   </div>
  // );
  return render();
}

const mapStateToProps = (state, { objectType }) => {
  const search = getSearch(state, objectType);
  const savedSearches = getSavedSearches(state, objectType);
  return {
    search,
    savedSearches,
  };
};

const mapDispatchToProps = {
  breakDown: AdvancedSearchActions.breakDown,
  register: AdvancedSearchActions.register,
  addGroup: AdvancedSearchActions.addGroup,
  setTag: AdvancedSearchActions.setTag,
  removeGroup: AdvancedSearchActions.removeGroup,
  selectSaved: AdvancedSearchActions.selectSaved,
  setFilter: AdvancedSearchActions.setFilter,
  hide: AdvancedSearchActions.hide,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    addGroup: ({ objectType, addGroup }) => () => {
      addGroup(objectType);
    },
    handleTagChange: ({ objectType, setTag }) => (event, { value: tag }) => {
      setTag(objectType, tag);
    },
    handleFilterChange: ({ objectType, setFilter }) => (event, { value: filter }) => {
      setFilter(objectType, filter);
    },
    handleSavedSearchChange: ({ objectType, selectSaved }) => (event, { value: selected }) => {
      selectSaved(objectType, selected);
    },
    hideAdvancedSearch: ({ objectType, hide }) => () => {
      hide(objectType);
    },
  }),
  defaultProps({
    size: 'small',
    color: 'purple',
    hasHistory: false,
    hasGenius: false,
    hasAdd: false,
  }),
  withProps(({ search }) => ({
    shown: search && search.shown,
    history: search && search.history,
  })),
  lifecycle({
    componentWillMount() {
      const { objectType, register } = this.props;
      register(objectType);
    },
    componentWillUnmount() {
      const { objectType, breakDown } = this.props;
      breakDown(objectType);
    }
  })
)(AdvancedSearch);
