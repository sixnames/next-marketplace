import React from 'react';
import { CmsProductFragment } from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import Button from '../../components/Buttons/Button';
import { useAppContext } from '../../context/appContext';
import { CreateConnectionModalInterface } from '../../components/Modal/CreateConnectionModal/CreateConnectionModal';
import { CREATE_CONNECTION_MODAL } from '../../config/modals';
// import classes from './ProductConnections.module.css';

interface ProductConnectionsInterface {
  product: CmsProductFragment;
}

const ProductConnections: React.FC<ProductConnectionsInterface> = ({ product }) => {
  const { showModal } = useAppContext();
  return (
    <Inner>
      <Button
        size={'small'}
        testId={`create-connection`}
        onClick={() =>
          showModal<CreateConnectionModalInterface>({
            type: CREATE_CONNECTION_MODAL,
            props: {
              product,
            },
          })
        }
      >
        Создать связь
      </Button>
    </Inner>
  );
};

export default ProductConnections;
