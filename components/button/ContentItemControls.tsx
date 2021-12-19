import * as React from 'react';
import { ButtonTheme, JustifyType, SizeType } from '../../types/clientTypes';
import WpButton from './WpButton';

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
      className={`flex items-center gap-3 ${className ? className : ''}`}
      style={{ justifyContent }}
    >
      {createHandler ? (
        <WpButton
          circle
          size={size}
          icon={'plus'}
          title={createTitle}
          onClick={createHandler}
          theme={theme}
          testId={`${testId}-create`}
          disabled={disabled || isCreateDisabled}
          frameClassName='w-auto'
        />
      ) : null}

      {moveHandler ? (
        <WpButton
          circle
          size={size}
          icon={'move'}
          title={moveTitle}
          onClick={moveHandler}
          theme={theme}
          testId={`${testId}-move`}
          disabled={disabled || isMoveDisabled}
          frameClassName='w-auto'
        />
      ) : null}

      {addAssetHandler ? (
        <WpButton
          circle
          size={size}
          icon={'image'}
          title={addAssetTitle}
          onClick={addAssetHandler}
          theme={theme}
          testId={`${testId}-add-asset`}
          disabled={disabled || isAddAssetDisabled}
          frameClassName='w-auto'
        />
      ) : null}

      {updateHandler ? (
        <WpButton
          circle
          size={size}
          icon={'pencil'}
          title={updateTitle}
          onClick={updateHandler}
          theme={theme}
          testId={`${testId}-update`}
          disabled={disabled || isUpdateDisabled}
          frameClassName='w-auto'
        />
      ) : null}

      {copyHandler ? (
        <WpButton
          circle
          size={size}
          icon={'copy'}
          title={copyTitle}
          onClick={copyHandler}
          theme={theme}
          testId={`${testId}-copy`}
          disabled={disabled || isCopyDisabled}
          frameClassName='w-auto'
        />
      ) : null}
      {deleteHandler ? (
        <WpButton
          circle
          size={size}
          icon={'trash'}
          title={deleteTitle}
          onClick={deleteHandler}
          theme={theme}
          testId={`${testId}-delete`}
          disabled={disabled || isDeleteDisabled}
          frameClassName='w-auto'
        />
      ) : null}
    </div>
  );
};

export default ContentItemControls;
