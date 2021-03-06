import React, {PropTypes} from 'react';
import text from 'js/languages';

const FiresBadge = (props, context) => {
  const {language} = context;
  return (
    <div className='results__fires-badge'>
      <div className='results__fires-pre'>{text[language].ANALYSIS_FIRES_PRE}</div>
      <div className='results__fires-count'>{props.count}</div>
      <div className='results__fires-active'>{text[language].ANALYSIS_FIRES_ACTIVE}</div>
      <div className='results__fires-post'>{text[language].ANALYSIS_FIRES_POST}</div>
    </div>
  );
};

FiresBadge.propTypes = {
  count: PropTypes.number.isRequired
};

FiresBadge.contextTypes = {
  language: PropTypes.string.isRequired
};

export { FiresBadge as default };
