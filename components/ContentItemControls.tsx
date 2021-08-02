import * as React from 'react';
import Button from 'components/Button';
import { ButtonTheme, JustifyType, SizeType } from 'types/clientTypes';

export interface ContentItemControlsInterface {
  createTitle?: string;
  copyTitle?: string;
  addAssetTitle?: string;
  updateTitle?: string;
  deleteTitle?: string;
  size?: SizeType;
  createHandler?: () => void;
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
  isCopyDisabled?: boolean;
  isUpdateDisabled?: boolean;
  isDeleteDisabled?: boolean;
  isAddAssetDisabled?: boolean;
}

const ContentItemControls: React.FC<ContentItemControlsInterface> = ({
  createTitle,
  updateTitle,
  copyTitle,
  addAssetTitle,
  deleteTitle,
  size = 'small',
  createHandler,
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
