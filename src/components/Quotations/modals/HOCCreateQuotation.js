import React from 'react';
import CreateQuotation from './CreateQuotation';
import { connect } from 'react-redux';
import { isHighlightAction } from '../../../components/Overview/overview.selectors';
import { OverviewTypes } from 'Constants';



const HOCCreateQuotation = (props) => {
    const { visible } = props;
    return (
        <>
        {visible && <CreateQuotation overviewType={OverviewTypes.Pipeline.Quotation} />}
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        visible: isHighlightAction(state, OverviewTypes.Pipeline.Quotation,'create')
    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HOCCreateQuotation)