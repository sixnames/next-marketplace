import React from 'react';
import { useUserContext } from '../../context/userContext';
import Spinner from '../Spinner/Spinner';
// import Modal from '../../components/Modal/Modal';
import AppNav from './AppNav';
import { useAppContext } from '../../context/appContext';
import classes from './AppLayout.module.css';
import { Link, Route, Routes } from 'react-router-dom';
import { IN_DEV } from '../../config';
import SignIn from '../../routes/SignIn/SignIn';
// import { ROUTE_SIGN_IN } from '@rg/config';

const Home: React.FC = () => {
  return (
    <div>
      Home
      <div>
        <Link to='about'>About</Link>
      </div>
    </div>
  );
};

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
        <Routes basename={'/app'}>
          <Route path={'/'} element={<Home />} />
        </Routes>
      </main>

      {isLoading && <Spinner />}
      {/*{isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}*/}
    </div>
  );
};

export default AppLayout;
