import React, { useState }  from 'react';
import { Table, Icon } from 'semantic-ui-react';
import NoResults from '../NoResults/NoResults';
import {connect} from 'react-redux';
import css from './styles/template.css';
import TemplateView from './TemplateView';
import _l from 'lib/i18n';


const TemplateTable = (props) => {
    const {isShowAdvancedSearch, headers, data = [] } = props;
    const [orderBy, setOrderBy] = useState('nameTemplate');
    const [showDetail, setShowDetail] = useState(false);
    const [template, setTemplate] = useState(undefined);

    const toggleSort = (value) => {
        if(value === 'actions') return;
        let newOrderBy = orderBy === value ? '' : value;
        setOrderBy(newOrderBy);
    }

    const showDetailQuotation = (template) => {
        setShowDetail(true);
        setTemplate(template);
    }

    const closeDetailQuotation = () => {
        setShowDetail(false);
        setTemplate(undefined);
    }

    const getType = (value) => {
      if(value === 'Hóa đơn điện tử') return 'HDDT';
      else if(value === 'VBHXH') return 'vBHXH';
      else if(!value) return 'Chung';
      else if(value === 'CA') return 'CA'
    }

    const name = [
      {
        type: 'Báo giá dịch vụ CA',
        name: "CA_KHDN",
      },
      {
        type: 'HDDT',
        name: 'HDDT',
      },
      {
        type: 'Báo giá dịch vụ vBHXH',
        name: 'vBHXH',
      },
      {
        type: 'None',
        name: 'chung',
      }
    ]

    return (
        <>
            <Table basic="very" className="quotation-table">
                <Table.Header className={css.table_header}>
                    <Table.Row>
                        {
                            headers.map(h => (
                                <Table.HeaderCell key={h.key} width={(h.key === 'nameTemplate' || h.key === 'service') ? 4 : 4}
                                    textAlign={h.textAlign} style={{ cursor: 'pointer' }} onClick={() => {toggleSort(h.key)}}>
                                    {h.name}
                                </Table.HeaderCell>
                            ))
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body className={isShowAdvancedSearch ? css.table_body_short : css.table_body_long}>
                    {
                        (data.length > 0) && data.map(item => (
                            <Table.Row onClick={() => { showDetailQuotation(item) }}>
                                <Table.Cell width={4} style={{paddingLeft: '15px'}}>Báo giá dịch vụ theo template {name?.filter(e => e.type === item?.name)?.[0].name}</Table.Cell>
                                <Table.Cell width={4}>{getType(item.service)}</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            {
                (data.length === 0) && <div className={css.container_no_result}>
                    <NoResults title={_l`No results`} message={_l`Your search/filtering yielded no results, please try again with a different search term or filter`} />
                </div>
            }
            { showDetail && <TemplateView open={showDetail} template={template} onClose={closeDetailQuotation} /> }
        </>
    )
}

let mapStateToProps = (state) => {
    return {
        isShowAdvancedSearch: state?.search.QUOTATION.shown
    }
}

let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateTable);
