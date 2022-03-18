import React from 'react';
import Competence from './Competence';

const CompetenceList = ({
  competences,
  conpetencesName,
  lastUsedOption,
  deleteCompetenceItem,
  updateSingleCompetence,
  resourceId,
  tab,
  levelOptions,
}) => {
  return (
    <>
      {competences?.map((item, index) => {
        return (
          <Competence
            conpetencesName={conpetencesName}
            levelOptions={levelOptions}
            item={item}
            lastUsedOption={lastUsedOption}
            index={index}
            deleteCompetenceItem={deleteCompetenceItem}
            updateSingleCompetence={updateSingleCompetence}
            resourceId={resourceId}
            tab={tab}
          />
        );
      })}
    </>
  );
};

export default CompetenceList;
