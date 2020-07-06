import { useSignOutMutation } from '../generated/apolloComponents';
import useMutationCallbacks from './useMutationCallbacks';
import { useUserContext } from '../context/userContext';

const useSignOut = () => {
  const { setMeOut } = useUserContext();
  const { onCompleteCallback, showLoading } = useMutationCallbacks({});
  const [signOutMutation] = useSignOutMutation({
    onCompleted: (data) => {
      if (data.signOut && data.signOut.success) {
        onCompleteCallback(data.signOut);
        setMeOut();
      }
    },
  });

  return () => {
    showLoading();
    return signOutMutation();
  };
};

export default useSignOut;
