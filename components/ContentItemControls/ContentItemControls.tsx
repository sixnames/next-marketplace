import * as React from 'react';
import Button from '../Buttons/Button';
import classes from './ContentItemControls.module.css';
import { ButtonTheme, JustifyType, SizeType } from 'types/clientTypes';

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
  testId?: string | number | undefined;
  disabled?: boolean;
  isCreateDisabled?: boolean;
  isUpdateDisabled?: boolean;
  isDeleteDisabled?: boolean;
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
  theme = 'secondary',
  testId,
  disabled,
  isCreateDisabled,
  isUpdateDisabled,
  isDeleteDisabled,
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`} style={{ justifyContent }}>
      {!!createHandler && (
        <div className={classes.item}>
          <Button
            circle
            size={size}
            icon={'plus'}
            title={createTitle}
            onClick={createHandler}
            theme={theme}
            testId={`${testId}-create`}
            disabled={disabled || isCreateDisabled}
          />
        </div>
      )}

      {!!updateHandler && (
        <div className={classes.item}>
          <Button
            circle
            size={size}
            icon={'pencil'}
            title={updateTitle}
            onClick={updateHandler}
            theme={theme}
            testId={`${testId}-update`}
            disabled={disabled || isUpdateDisabled}
          />
        </div>
      )}

      {!!deleteHandler && (
        <div className={classes.item}>
          <Button
            circle
            size={size}
            icon={'trash'}
            title={deleteTitle}
            onClick={deleteHandler}
            theme={theme}
            testId={`${testId}-delete`}
            disabled={disabled || isDeleteDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default ContentItemControls;
