import React, { Suspense } from 'react';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import Spinner from '../Spinner/Spinner';
import Backdrop from '../Backdrop/Backdrop';
import { useAppContext } from '../../context/appContext';
import classes from './Modal.module.css';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL, UPDATE_NAME_MODAL } from '../../config/modals';
import ConfirmModal from './ConfirmModal/ConfirmModal';

// const UserExistsModal = React.lazy(() => import('./UserExistsModal/UserExistsModal'));

// const ConfirmModal = React.lazy(() => import('./ConfirmModal/ConfirmModal'));
const UpdateNameModal = React.lazy(() => import('./UpdateNameModal/UpdateNameModal'));
const OptionInGroupModal = React.lazy(() => import('./OptionInGroupModal/OptionInGroupModal'));
// const CreateRubricModal = React.lazy(() => import('./CreateRubricModal/CreateRubricModal'));
/*const AddAttributesGroupToRubricModal = React.lazy(() =>
  import('./AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal'),
);*/
/*const AttributeInGroupModal = React.lazy(() =>
  import('./AttributeInGroupModal/AttributeInGroupModal'),
);*/
/*const CreateNewProductModal = React.lazy(() =>
  import('./CreateNewProductModal/CreateNewProductModal'),
);*/
/*const AddProductToRubricModal = React.lazy(() =>
  import('./AddProductToRubricModal/AddProductToRubricModal'),
);*/

interface ModalInterface {
  modalType: string;
  modalProps?: any;
}

const Modal: React.FC<ModalInterface> = ({ modalType, modalProps = {} }) => {
  const { hideModal } = useAppContext();

  return (
    <AnimateOpacity className={classes.frame}>
      <div className={classes.scroll}>
        <Suspense fallback={<Spinner />}>
          {/*{modalType === USER_EXISTS_MODAL && <UserExistsModal {...modalProps} />}*/}

          {modalType === CONFIRM_MODAL && <ConfirmModal {...modalProps} />}

          {modalType === UPDATE_NAME_MODAL && <UpdateNameModal {...modalProps} />}

          {modalType === OPTION_IN_GROUP_MODAL && <OptionInGroupModal {...modalProps} />}

          {/*{modalType === ATTRIBUTE_IN_GROUP_MODAL && <AttributeInGroupModal {...modalProps} />}*/}

          {/*{modalType === CREATE_RUBRIC_MODAL && <CreateRubricModal {...modalProps} />}*/}

          {/*{modalType === ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL && (
            <AddAttributesGroupToRubricModal {...modalProps} />
          )}*/}

          {/*{modalType === ADD_PRODUCT_TO_RUBRIC_MODAL && <AddProductToRubricModal {...modalProps} />}*/}

          {/*{modalType === CREATE_NEW_PRODUCT_MODAL && <CreateNewProductModal {...modalProps} />}*/}
        </Suspense>
      </div>

      <Backdrop onClick={hideModal} className={classes.backdrop} />
    </AnimateOpacity>
  );
};

export default Modal;
