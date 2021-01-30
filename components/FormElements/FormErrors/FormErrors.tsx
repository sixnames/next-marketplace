import * as React from 'react';
import Icon from '../../Icon/Icon';
import { isEmpty } from 'lodash';
import classes from './FormErrors.module.css';

interface ErrorsInterface {
  [key: string]: string;
}

interface FormErrorsInterface {
  errors: ErrorsInterface;
}

const FormErrors: React.FC<FormErrorsInterface> = ({ errors }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  function toggleListHandler() {
    setIsOpen((prevState) => !prevState);
  }

  if (isEmpty(errors)) {
    return null;
  }

  function getErrorsList(errors: ErrorsInterface, initialList: string[]): string[] {
    return [
      ...initialList,
      ...Object.keys(errors).reduce((acc: string[], key: string) => {
        const error = errors[key];
        if (typeof error === 'object') {
          return getErrorsList(error, acc);
        }
        if (error) {
          return [...acc, error];
        }
        return acc;
      }, []),
    ];
  }

  const errorsList = getErrorsList(errors, []);
  const errorsCounter = errorsList.length;

  return (
    <div className={`${classes.frame}`}>
      <div onClick={toggleListHandler} className={`${classes.trigger}`}>
        <Icon name={'exclamation'} />
        Ошибки формы {errorsCounter} шт.
      </div>
      <div className={`${classes.content} ${isOpen ? classes.contentActive : ''}`}>
        <div className={classes.list}>
          <ul className={classes.listHolder}>
            {errorsList.map((error) => {
              return (
                <li className={classes.listItem} key={error}>
                  {error}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormErrors;
