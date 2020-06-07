import React from 'react';
import { useUserContext } from '../../context/userContext';
import Spinner from '../Spinner/Spinner';
// import Modal from '../../components/Modal/Modal';
import AppNav from './AppNav';
import { useAppContext } from '../../context/appContext';
import classes from './AppLayout.module.css';
import { Outlet } from 'react-router-dom';
import { IN_DEV } from '../../config';
import SignIn from '../../routes/SignIn/SignIn';

const AppLayout: React.FC = () => {
  const { isFetching, isAuthenticated } = useUserContext();
  const { isLoading } = useAppContext();

  if (isFetching && !isAuthenticated) {
    return (
      <div className={classes.frame}>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated && !isFetching && IN_DEV) {
    return (
      <div className={classes.frame}>
        <SignIn />
      </div>
    );
  }

  return (
    <div className={classes.frame}>
      <AppNav />

      <main className={classes.content}>
        <Outlet />
      </main>

      {isLoading && <Spinner />}
      {/*{isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}*/}
    </div>
  );
};

export default AppLayout;
