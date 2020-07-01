import useMutationCallbacks from './useMutationCallbacks';
import { SignInInput, useSignInMutation } from '../generated/apolloComponents';
import { useUserContext } from '../context/userContext';
import { useState } from 'react';

const useSignIn = () => {
  const { setMeIn } = useUserContext();
  const [errors, setErrors] = useState<string[]>([]);

  const {
    onCompleteCallback,
    showLoading,
    hideLoading,
    hideModal,
    showErrorNotification,
  } = useMutationCallbacks({});
  const [signInHandler] = useSignInMutation({
    onCompleted: (data) => {
      if (data.signIn && data.signIn.success && data.signIn.user) {
        setMeIn(data.signIn.user);
        onCompleteCallback(data.signIn);
      } else {
        hideLoading();
        showErrorNotification({
          title: data.signIn.message,
        });
      }
    },
    onError: (e) => {
      if (e.graphQLErrors) {
        setErrors(e.graphQLErrors.map(({ message }) => message));
      }

      hideLoading();
      hideModal();
    },
  });
  // console.log(errors);
  return {
    errors,
    signInHandler: (values: SignInInput) => {
      showLoading();
      return signInHandler({
        variables: {
          input: values,
        },
      });
    },
  };
};

export default useSignIn;
