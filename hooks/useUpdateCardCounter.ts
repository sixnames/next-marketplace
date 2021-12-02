/* eslint-disable react-app/react-hooks/exhaustive-deps */
import { DEFAULT_COMPANY_SLUG, REQUEST_METHOD_PATCH } from 'config/common';
import { UpdateProductCounterInputInterface } from 'db/dao/product/updateProductCounter';
import * as React from 'react';

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
  }, [shopProductIds, companySlug]);
};

export default useUpdateCardCounter;
