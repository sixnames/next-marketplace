import React from 'react';
import Button from '../Buttons/Button';
import { ButtonTheme, JustifyType, SizeType } from '../../types';
import classes from './ContentItemControls.module.css';

export interface ContentItemControlsInterface {
  createTitle?: string;
  updateTitle?: string;
  deleteTitle?: string;
  size?: SizeType;
  createHandler?: () => void;
  updateHandler?: () => void;
  deleteHandler?: () => void;
  className?: string;
  justifyContent?: JustifyType;
  theme?: ButtonTheme;
  testId?: string;
  disabled?: boolean;
}

const ContentItemControls: React.FC<ContentItemControlsInterface> = ({
  createTitle,
  updateTitle,
  deleteTitle,
  size = 'small',
  createHandler,
  updateHandler,
  deleteHandler,
  className,
  justifyContent = 'flex-start',
  theme = 'gray',
  testId,
  disabled,
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`} style={{ justifyContent }}>
      {!!createHandler && (
        <div className={classes.item}>
          <Button
            circle
            size={size}
            icon={'Add'}
            title={createTitle}
            onClick={createHandler}
            theme={theme}
            testId={`${testId}-create`}
            disabled={disabled}
          />
        </div>
      )}

      {!!updateHandler && (
        <div className={classes.item}>
          <Button
            circle
            size={size}
            icon={'Edit'}
            title={updateTitle}
            onClick={updateHandler}
            theme={theme}
            testId={`${testId}-update`}
            disabled={disabled}
          />
        </div>
      )}

      {!!deleteHandler && (
        <div className={classes.item}>
          <Button
            circle
            size={size}
            icon={'Delete'}
            title={deleteTitle}
            onClick={deleteHandler}
            theme={theme}
            testId={`${testId}-delete`}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default ContentItemControls;