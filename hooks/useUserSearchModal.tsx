import * as React from 'react';
import ContentItemControls from '../components/button/ContentItemControls';
import {
  UsersSearchModalControlsInterface,
  UsersSearchModalInterface,
} from '../components/Modal/UsersSearchModal';
import { USERS_SEARCH_MODAL } from '../config/modalVariants';
import { useAppContext } from '../context/appContext';

export function useUserSearchModal() {
  const { showModal } = useAppContext();
  const showUsersSearchModal = ({
    createTitle,
    updateTitle,
    deleteTitle,
    createHandler,
    updateHandler,
    deleteHandler,
    disabled,
    isDeleteDisabled,
    isCreateDisabled,
    isUpdateDisabled,
  }: UsersSearchModalControlsInterface) => {
    showModal<UsersSearchModalInterface>({
      variant: USERS_SEARCH_MODAL,
      props: {
        controlsColumn: {
          render: ({ dataItem }) => {
            return (
              <div className='flex justify-end'>
                <ContentItemControls
                  testId={dataItem.itemId}
                  createTitle={createTitle}
                  updateTitle={updateTitle}
                  deleteTitle={deleteTitle}
                  createHandler={createHandler ? () => createHandler(dataItem) : undefined}
                  updateHandler={updateHandler ? () => updateHandler(dataItem) : undefined}
                  deleteHandler={deleteHandler ? () => deleteHandler(dataItem) : undefined}
                  disabled={disabled}
                  isDeleteDisabled={isDeleteDisabled ? isDeleteDisabled(dataItem) : undefined}
                  isCreateDisabled={isCreateDisabled ? isCreateDisabled(dataItem) : undefined}
                  isUpdateDisabled={isUpdateDisabled ? isUpdateDisabled(dataItem) : undefined}
                />
              </div>
            );
          },
        },
      },
    });
  };

  return showUsersSearchModal;
}
