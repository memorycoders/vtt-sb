import React, { useState, useEffect} from 'react';
import css from './AdvancedSearch.css';
import { Dropdown, Grid, Label, Input, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { setAction } from './advanced-search.actions';
import { ObjectTypes, OverviewTypes } from 'constants';
import { connect } from 'react-redux';
import  api  from '../../lib/apiClient';
import { requestSearchCompany, resetObjectData } from '../Overview/overview.actions';
import { setupSearchParams, getSearchInfo, selectSaved, setupSelected, setName, setupIsFocus } from './advanced-search.actions';
import { resetListOrganisation } from '../Organisation/organisation.actions';
import AdvancedSearchActionMenu from '../../essentials/Menu/AdvancedSearchActionMenu';

const ACCOUNT = 'ACCOUNT';

const  AdvancedSearchCompany = (props) => {
    const { width, className, selected, setAction, requestSearchCompany, setupSearchParams, paramsSearch, 
            resetListOrganisation, resetObjectData, getSearchInfo, savedAdvancedSearch, selectSaved, 
            setupSelected, setName, isFocus, setupIsFocus } = props;

    const [ focusProgramOptions, setFocusProgramOptions] = useState([]); //chương trình trọng điểm
    const [ typeCompanyOptions, setTypeCompanyOptions ] = useState([]);
    const [ typeBusinessOptions, setTypeBusinessOptions ] = useState([]);
    const [ typeServiceOptions, setTypeServiceOptions ] = useState([]);
       
    const programId = paramsSearch?.programId;//id chương trình trọng điểm
    const taxBusCust = paramsSearch?.taxBusCust || '' ;//mã số thuế doanh nghiệp
    const businessTypeId = paramsSearch?.businessTypeId;//id loại doanh nghiệp
    const mainBusiness = paramsSearch?.mainBusiness || [];//id ngành nghề kinh doanh
    const serviceType = paramsSearch?.serviceType//id dịch vụ

    //phân biệt tìm kiếm đã lưu của chương trình trọng điểm và tìm kiếm thông thường
    let savedAdvancedSearchOption = savedAdvancedSearch.filter(item => {
        if(isFocus) {
            return item.objectSearch?.programId
        } else {
            return !item.objectSearch?.programId
        }
    }).map(item => ({
        ...item,
        key: item.uuid,
        value: item.uuid,
        text: item.name
    }))
    savedAdvancedSearchOption = [
        {
            key: null,
            value: null,
            text: 'Bỏ chọn'
        },
        ...savedAdvancedSearchOption
    ];

    //logic enable button lưu và tìm kiếm
    let enableSearchBtn;
    if(isFocus) {
        enableSearchBtn = selected || programId;
    } else {
        enableSearchBtn = selected || taxBusCust || businessTypeId || (mainBusiness.length > 0) || serviceType;
    }

    useEffect(() => {
        fetchTypeCompany();
        fecthTypeBusiness();
        fetchTypeServices();
        fetchSavedAdvancedSearch();
        setupIsFocus(ACCOUNT,false);
        return () => {
            setupIsFocus(ACCOUNT,false);
            resetResultAndSearchParams();
        }
    },[])

    const resetResultAndSearchParams = () => {
        let params = {
            programId: undefined,
            taxBusCust: undefined,
            serviceType: undefined,
            businessTypeId: undefined,
            mainBusiness: undefined
        };
        setName(ACCOUNT, '');//reset name
        setupSelected(ACCOUNT, null); //reset selected
        setupSearchParams(ACCOUNT, params); //reset các tham số tìm kiếm
        resetListOrganisation(); //xoá state.entities.organisation.uuid (list company)
        resetObjectData(OverviewTypes.Account); //xoá state.overview.ACCOUNTS
    }

    const fetchTypeCompany = async () => {
        try {
            let res = await api.get({
                resource: 'organisation-v3.0/getListBusinessType'
            });
            if(res) {
                let newTypeCompanyOptions = res.map(item => ({
                    key: Number(item.value),
                    value: Number(item.value),
                    text: item.name
                }));
                setTypeCompanyOptions(newTypeCompanyOptions);
            } else {
                setTypeCompanyOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const fecthTypeBusiness = async () => {
        try {
            let res = await api.get({
                resource: 'organisation-v3.0/getAllMainBusiness'
            });
            if(res) {
                let newTypeBusinessOptions = res.map(item => ({
                    key: item.value,
                    value: item.value,
                    text: item.name
                }));
                setTypeBusinessOptions(newTypeBusinessOptions);
            } else {
                setTypeBusinessOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const fetchTypeServices = async () => {
        try {
            let res = await api.get({
                resource: 'organisation-v3.0/getAllServiceActive'
            });
            if(res) {
                let newTypeServiceOptions = res.map(item => ({
                    key: item.serviceId,
                    value: item.serviceId,
                    text: item.serviceName
                }));
                setTypeServiceOptions(newTypeServiceOptions);
            } else {
                setTypeServiceOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const fetchFocusProgram = async () => {
        try {
            let res = await api.get({
                resource: 'organisation-v3.0/getProgramsSME'
            });
            if(res) {
                let newFocusProgramOptions = res.map(item => ({
                    key: item.programId,
                    value: item.programId,
                    text: item.programName
                }));
                setFocusProgramOptions(newFocusProgramOptions);
            } else {
                setFocusProgramOptions([]);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    //get các tìm kiếm đã lưu
    const fetchSavedAdvancedSearch = async () => {
        try {
            let res = await api.get({
                resource: 'advance-search-v3.0/listAdvanceSearchVt',
                query: {
                    type: ACCOUNT
                }
            }); 
            if(res) {
                getSearchInfo(ACCOUNT, [], res.advanceSearchDTOList);
            }
        } catch(err) {
            console.log("err: ", err);
        }
    }

    const handleSearch =  async () => {
         let overviewType = 'ACCOUNTS';
         let clear = true;
        requestSearchCompany(overviewType, clear);
    }

    const selectSavedAdvancedSearch = (event, { value }) => {
        selectSaved(ACCOUNT, value);
    }

    const onChangeFocusProgram = (event, { value }) => {
        let params = {
            programId: value
        };
        setupSearchParams(ACCOUNT,params);
    }

    const onChangeTaxCode = (event, {value}) => {
        let params = {
            taxBusCust: value
        };
        setupSearchParams(ACCOUNT,params);
    }

    const onChangeTypeService = (event, { value }) => {
        let params = {
            serviceType: value
        };
        setupSearchParams(ACCOUNT, params);
    }

    const onChangeTypeCompany = (event, {value}) => {
        let params = {
            businessTypeId: value
        };
        setupSearchParams(ACCOUNT,params);
    }

    const onChangeTypeBusiness = (event, {value}) => {
        let params = {
            mainBusiness: value
        };
        setupSearchParams(ACCOUNT,params);
    }

    const openFocusSearch = () => {
        setupIsFocus(ACCOUNT, true);
        resetResultAndSearchParams();
        fetchFocusProgram();
    }

    const closeFocusSearch = () => {
        setupIsFocus(ACCOUNT, false);
        resetResultAndSearchParams();
    }

    const openSaveSearch = () => {
        setAction(ObjectTypes.Account, 'save');
    }

return (
<div  id="addvanceSearch" style={{ width, maxWidth: width }} className={`${className} ${css.advancedContainer} ${css.show}`}>
    <Grid style={{margin: 0}}>
        <Grid.Column width="4">
            <Grid>
                <Grid.Column width={selected ? 13: 16}>
                    <Dropdown className={css.dropdown} selection fluid search placeholder={_l`Select saved search`}
                        options={savedAdvancedSearchOption} value={selected} onChange={selectSavedAdvancedSearch}  />
                </Grid.Column>
                {
                    selected && <Grid.Column width={3} className={css.more_action_wrapper}>
                        <AdvancedSearchActionMenu objectType={ACCOUNT} className={css.bgMore} />
                    </Grid.Column>
                }
            </Grid>
        </Grid.Column>
        <Grid.Column width="12">
            <Grid columns={2}>
                <Grid.Row stretched>
                    <Grid.Column>
                    <Grid>
                        <Grid.Column width={5}>
                            <Label basic color="black" className={css.label}>{isFocus ? 'Chương trình trọng điểm(*)' : 'Mã số thuế'}</Label>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            { isFocus ? <Dropdown placeholder={'Tất cả'} selection fluid search options={focusProgramOptions} value={programId} onChange={onChangeFocusProgram} /> : <Input placeholder="Mã số thuế" fluid onChange={onChangeTaxCode} value={taxBusCust} /> }
                        </Grid.Column>
                    </Grid>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid>
                        <Grid.Column width={5}>
                            <Label basic color="black" className={css.label}>Loại doanh nghiệp</Label>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Dropdown placeholder={'Tất cả'} selection  fluid search options={typeCompanyOptions} value={businessTypeId} onChange={onChangeTypeCompany} />
                        </Grid.Column>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row stretched>
                    <Grid.Column>
                    <Grid>
                        <Grid.Column width={5}>
                            <Label basic color="black" className={css.label}>{isFocus ? 'Mã số thuế' : 'Dịch vụ'}</Label>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            { isFocus ? <Input placeholder="Mã số thuế" fluid value={taxBusCust} onChange={onChangeTaxCode} /> : <Dropdown placeholder={'Tất cả'} selection fluid search options={typeServiceOptions} onChange={onChangeTypeService} value={serviceType} /> }
                        </Grid.Column>
                    </Grid>
                    </Grid.Column>
                    <Grid.Column>
                    <Grid>
                        <Grid.Column width={5}>
                            <Label basic color="black" className={css.label}>Ngành nghề kinh doanh</Label>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Dropdown placeholder={'Tất cả'} selection fluid search multiple options={typeBusinessOptions} value={mainBusiness} onChange={onChangeTypeBusiness} />
                        </Grid.Column>
                    </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {
                            isFocus && <Grid>
                                <Grid.Column width={5}>
                                    <Label basic color="black" className={css.label}>Dịch vụ</Label>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Dropdown placeholder={'Tất cả'} selection  fluid search options={typeServiceOptions} value={serviceType} onChange={onChangeTypeService} />
                                </Grid.Column>
                            </Grid>
                        }
                    </Grid.Column>
                    <Grid.Column textAlign="center">
                        <Button size="small" disabled={!enableSearchBtn} className={ enableSearchBtn ? css.account_btn_active : css.account_btn_disabled } onClick={openSaveSearch}>
                            {_l`Save`}
                        </Button>
                        <Button size="small" disabled={!enableSearchBtn} className={ enableSearchBtn ? css.account_btn_active : css.account_btn_disabled } onClick={handleSearch} >
                            {_l`Search`}
                        </Button>
                        {
                            isFocus ? <Button size="small" className={css.account_btn_active} onClick={closeFocusSearch}>Đóng</Button> : 
                                    <Button size="small" className={css.account_btn_active} onClick={openFocusSearch}>Tìm kiếm theo CT trọng điểm</Button>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    </Grid>
</div>
)}

const mapStateToProps = (state) => {
    return {
        isFocus: state?.search?.ACCOUNT?.isFocus,
        paramsSearch: state?.search?.ACCOUNT?.params,
        savedAdvancedSearch: state?.search?.ACCOUNT?.saved,
        selected: state?.search?.ACCOUNT?.selected
    }
}

const mapDispatchToProps = {
    setAction: setAction,
    requestSearchCompany: requestSearchCompany,
    setupSearchParams: setupSearchParams,
    resetListOrganisation: resetListOrganisation,
    resetObjectData: resetObjectData,
    getSearchInfo: getSearchInfo,
    selectSaved: selectSaved,
    setupSelected: setupSelected,
    setName: setName,
    setupIsFocus: setupIsFocus
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchCompany);
