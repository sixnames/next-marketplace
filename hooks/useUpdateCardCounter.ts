import { ObjectIdModel } from 'db/dbModels';
import { useUpdateProductCounterMutation } from 'generated/apolloComponents';
import { alwaysArray } from 'lib/arrayUtils';
import * as React from 'react';

interface UseUpdateCardCounterInterface {
  shopProductIds?: ObjectIdModel[] | null;
  companySlug?: string | null;
}

const useUpdateCardCounter = ({ shopProductIds, companySlug }: UseUpdateCardCounterInterface) => {
  const [updateProductCounterMutation] = useUpdateProductCounterMutation();
  React.useEffect(() => {
    updateProductCounterMutation({
      variables: {
        input: {
          shopProductIds: alwaysArray(shopProductIds),
          companySlug,
        },
      },
    }).catch((e) => console.log(e));
  }, [shopProductIds, companySlug, updateProductCounterMutation]);
};

export default useUpdateCardCounter;
