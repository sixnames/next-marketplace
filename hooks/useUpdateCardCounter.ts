import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { ObjectIdModel } from 'db/dbModels';
import { useUpdateProductCounter } from 'hooks/mutations/useProductMutations';
import { alwaysArray } from 'lib/arrayUtils';
import * as React from 'react';

interface UseUpdateCardCounterInterface {
  shopProductIds?: ObjectIdModel[] | null;
  companySlug?: string | null;
}

const useUpdateCardCounter = ({
  shopProductIds,
  companySlug = DEFAULT_COMPANY_SLUG,
}: UseUpdateCardCounterInterface) => {
  const [updateProductCounterMutation] = useUpdateProductCounter();
  React.useEffect(() => {
    updateProductCounterMutation({
      shopProductIds: alwaysArray(shopProductIds),
      companySlug,
    }).catch((e) => console.log(e));
  }, [shopProductIds, companySlug, updateProductCounterMutation]);
};

export default useUpdateCardCounter;
