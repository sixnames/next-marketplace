import React from 'react';
import classes from './LinkEmail.module.css';

interface LinkEmailInterface {
  value?: string | null;
}

const LinkEmail: React.FC<LinkEmailInterface> = ({ value }) => {
  if (!value) {
    return <div className={classes.frame}>Не указан</div>;
  }

  return (
    <div className={classes.frame}>
      <a href={`mailto:${value}`}>{value}</a>
    </div>
  );
};

export default LinkEmail;
