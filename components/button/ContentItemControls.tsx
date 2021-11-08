import * as React from 'react';
import Button from 'components/button/Button';
import { ButtonTheme, JustifyType, SizeType } from 'types/clientTypes';

export interface ContentItemControlsInterface {
  createTitle?: string;
  moveTitle?: string;
  copyTitle?: string;
  addAssetTitle?: string;
  updateTitle?: string;
  deleteTitle?: string;
  size?: SizeType;
  createHandler?: () => void;
  moveHandler?: () => void;
  copyHandler?: () => void;
  addAssetHandler?: () => void;
  updateHandler?: () => void;
  deleteHandler?: () => void;
  className?: string;
  justifyContent?: JustifyType;
  theme?: ButtonTheme;
  testId?: string | number | undefined;
  disabled?: boolean;
  isCreateDisabled?: boolean;
  isMoveDisabled?: boolean;
  isCopyDisabled?: boolean;
  isUpdateDisabled?: boolean;
  isDeleteDisabled?: boolean;
  isAddAssetDisabled?: boolean;
}

const ContentItemControls: React.FC<ContentItemControlsInterface> = ({
  createTitle,
  moveTitle,
  updateTitle,
  copyTitle,
  addAssetTitle,
  deleteTitle,
  size = 'small',
  createHandler,
  moveHandler,
  updateHandler,
  copyHandler,
  addAssetHandler,
  deleteHandler,
  className,
  justifyContent = 'flex-start',
  theme = 'secondary',
  testId,
  disabled,
  isCreateDisabled,
  isMoveDisabled,
  isUpdateDisabled,
  isAddAssetDisabled,
  isCopyDisabled,
  isDeleteDisabled,
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${className ? className : ''}`}
      style={{ justifyContent }}
    >
      {createHandler ? (
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
      ) : null}

      {moveHandler ? (
        <Button
          circle
          size={size}
          icon={'move'}
          title={moveTitle}
          onClick={moveHandler}
          theme={theme}
          testId={`${testId}-move`}
          disabled={disabled || isMoveDisabled}
        />
      ) : null}

      {addAssetHandler ? (
        <Button
          circle
          size={size}
          icon={'image'}
          title={addAssetTitle}
          onClick={addAssetHandler}
          theme={theme}
          testId={`${testId}-add-asset`}
          disabled={disabled || isAddAssetDisabled}
        />
      ) : null}

      {updateHandler ? (
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
      ) : null}

      {copyHandler ? (
        <Button
          circle
          size={size}
          icon={'copy'}
          title={copyTitle}
          onClick={copyHandler}
          theme={theme}
          testId={`${testId}-copy`}
          disabled={disabled || isCopyDisabled}
        />
      ) : null}
      {deleteHandler ? (
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
      ) : null}
    </div>
  );
};

export default ContentItemControls;
