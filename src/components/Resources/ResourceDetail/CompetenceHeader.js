import React from 'react';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import addIcon from '../../../../public/Add.svg';
import styles from './Competence.css';
import _l from 'lib/i18n';

const CompetenceHeader = ({ addCompetenceItem }) => {
  return (
    <div className="competenceHeader">
      <div className={styles.title}>
        <h4>{_l`Competences`}</h4>
        {/* <img onClick={addCompetenceItem} src={addIcon} style={{height: "15px"}}/> */}
        <img src={addIcon} onClick={addCompetenceItem} style={{ height: '24px' }} />
      </div>
      <Grid>
        <GridRow>
          <GridColumn width={2}>{_l`Level`}</GridColumn>
          <GridColumn width={6}>{_l`Competence`}</GridColumn>
          <GridColumn width={4}>{_l`Last used`}</GridColumn>
          <GridColumn width={4}></GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
};

export default CompetenceHeader;
