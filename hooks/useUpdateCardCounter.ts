import * as React from 'react';
import { UpdateProductCounterInputInterface } from '../db/dao/product/updateProductCounter';
import { DEFAULT_COMPANY_SLUG, REQUEST_METHOD_PATCH } from '../lib/config/common';

const useUpdateCardCounter = ({
  shopProductIds,
  companySlug = DEFAULT_COMPANY_SLUG,
  citySlug,
}: UpdateProductCounterInputInterface) => {
  React.useEffect(() => {
    fetch(`/api/product/counter`, {
      method: REQUEST_METHOD_PATCH,
      body: JSON.stringify({
        shopProductIds,
        companySlug,
        citySlug,
      }),
    }).catch((e) => {
      console.log(e);
    });
    /* eslint-disable react-hooks/exhaustive-deps */
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [shopProductIds, companySlug]);
};

export default useUpdateCardCounter;
