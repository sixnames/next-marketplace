import React from 'react';
import classes from './RequestError.module.css';
import { DATA_ERROR_MESSAGE } from '../../config';

interface RequestErrorInterface {
  message?: string;
}

const RequestError: React.FC<RequestErrorInterface> = ({ message = DATA_ERROR_MESSAGE }) => {
  return <div className={classes.frame}>{message}</div>;
};

export default RequestError;
