import React from 'react';
import { useUserContext } from '../../context/userContext';
import Spinner from '../Spinner/Spinner';
// import Modal from '../../components/Modal/Modal';
import AppNav from './AppNav';
import { useAppContext } from '../../context/appContext';
import classes from './AppLayout.module.css';
// import { ROUTE_SIGN_IN } from '@rg/config';

const AppLayout: React.FC = () => {
  const { isFetching, isAuthenticated } = useUserContext();
  const { isLoading } = useAppContext();
  console.log({ isFetching, isAuthenticated });
  /*useEffect(() => {
    if (!isAuthenticated && !isFetching) {
      Router.replace(ROUTE_SIGN_IN);
    }
  }, [isAuthenticated, isFetching]);*/

  /*if (isFetching || !isAuthenticated) {
    return <Spinner />;
  }*/

  return (
    <div className={classes.frame}>
      <AppNav />

      <main className={classes.content}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias asperiores, cumque delectus,
        et eveniet expedita facere illum inventore labore maiores nam qui quod reiciendis. Dolore,
        iste, porro? Adipisci, ratione, soluta.
      </main>

      {isLoading && <Spinner />}
      {/*{isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}*/}
    </div>
  );
};

export default AppLayout;
