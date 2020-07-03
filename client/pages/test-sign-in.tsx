import React, { useEffect } from 'react';
import { NextPage } from 'next';
import useSignIn from '../hooks/useSignIn';
import Router, { useRouter } from 'next/router';
import Inner from '../components/Inner/Inner';

const TestSignIn: NextPage = () => {
  const router = useRouter();
  const { signInHandler, mutationData } = useSignIn();

  useEffect(() => {
    if (!mutationData.loading && mutationData.data && mutationData.data.signIn.success && router) {
      Router.replace(`${router.query.redirect}`);
    }
  }, [mutationData]);

  useEffect(() => {
    if (router && router.query.email) {
      signInHandler({
        email: `${router.query.email}`,
        password: `${router.query.password}`,
      });
    }
  }, [router]);

  return <Inner>Auth</Inner>;
};

export default TestSignIn;
