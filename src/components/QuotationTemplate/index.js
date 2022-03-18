import React, { useEffect, useState } from 'react';
import { Icon, Select, Popup, Image, Pagination } from 'semantic-ui-react';
import TemplateTable from './TemplateTable';
import PeriodSelector from '../PeriodSelector/PeriodSelector';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { AutoSizer } from 'react-virtualized';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import css from './styles/template.css';
import { setObjectType, setOverviewType } from '../Common/common.actions';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import * as AdvancedSearchActions from '../../components/AdvancedSearch/advanced-search.actions';
import api from '../../lib/apiClient';

const QuotationTemplate = (props) => {
    const { hideAdvancedSearch, setOverviewType, setObjectType } = props;
    const [pageSize, setPageSize ] = useState(10);

    const headers = [
        {key: 'nameTemplate', name: _l`Template name`, textAlign: 'left'},
        {key: 'service', name: 'Loại template', textAlign: 'left'},
    ];

    const [data, setDataSource] = useState([]);

    const fetchDataTemplate = async () => {
      try {
        const rs = await api.get({
          resource: `quotation-v3.0/quotation/templates`,
        });
        if (rs) {
          setDataSource(rs);
        }
      } catch (error) {
        console.log('err', error.message)
      }
    }

    const pageSizeOptions = [
        { key: '10', value: 10, text: '10' },
        { key: '20', value: 20, text: '20' },
        { key: '50', value: 50, text: '50' },
    ];

    const onChangePageSize = (event, { value }) => {
        setPageSize(value);
    }

    useEffect(() => {
        setOverviewType(OverviewTypes.Pipeline.Quotation_template);
        setObjectType(ObjectTypes.QuotationTemplate);
        fetchDataTemplate();
        return () => {
            hideAdvancedSearch(ObjectTypes.QuotationTemplate);
        }
    }, [])

    return (
        <div className={css.quotation_container}>
            <AutoSizer disableHeight>
                {
                    ({ width }) => (
                        <AdvancedSearch width={width} objectType={ObjectTypes.QuotationTemplate} clearSearch={true}/>
                    )
                }
            </AutoSizer>
            <PeriodSelector overviewType={OverviewTypes.Pipeline.Quotation_template} objectType={ObjectTypes.QuotationTemplate} color={Colors.Pipeline} />
            <TemplateTable headers={headers} data={data} />
            {/* <div className={css.pagination_container} >
                <Pagination id="quotations-pagination" size="large" boundaryRange={0} ellipsisItem={null} siblingRange={2}
                            activePage={1} totalPages={5} className={css.pagination} />
            </div> */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {

    }
}
const mapDispatchToProps = {
    setOverviewType,
    setObjectType,
    hideAdvancedSearch: AdvancedSearchActions.hide
}
export default connect(mapStateToProps, mapDispatchToProps)(QuotationTemplate);
