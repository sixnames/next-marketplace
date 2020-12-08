import React from 'react';
import classes from './ErrorBoundaryFallback.module.css';

export interface ErrorBoundaryFallbackInterface {
  statusCode?: number;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackInterface> = ({ statusCode }) => {
  return (
    <div className={classes.frame}>
      <div>
        <p>УПС! Что-то пошло не так.</p>
        <p>Лог ошибки отправлен разработчикам.</p>
        <p>Просим прощения за неудобства!</p>
        {statusCode ? <p>{`Код ошибки ${statusCode}`}</p> : null}
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
