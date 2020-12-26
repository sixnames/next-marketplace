import React, { useMemo } from 'react';
import { ShopFragment, useUpdateShopMutation } from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import useUrlFiles from '../../hooks/useUrlFiles';
import ShopForm from '../Company/ShopForm';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateShopClientSchema } from '@yagu/shared';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { SHOP_QUERY } from '../../graphql/query/companiesQueries';
import { removeApolloFields } from '../../utils/apolloHelpers';
import { omit } from 'lodash';

interface ShopDetailsInterface {
  shop: ShopFragment;
}

const ShopDetails: React.FC<ShopDetailsInterface> = ({ shop }) => {
  const initialLogo = useMemo(() => [shop.logo], [shop.logo]);
  const initialAssets = useMemo(() => shop.assets, [shop.assets]);
  const logoFiles = useUrlFiles(initialLogo);
  const assetsFiles = useUrlFiles(initialAssets);
  const { showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks();
  const [updateShopMutation] = useUpdateShopMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShop),
    refetchQueries: [
      {
        query: SHOP_QUERY,
        variables: {
          id: shop.id,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: updateShopClientSchema,
  });

  const initialShop = removeApolloFields(omit(shop, ['itemId', 'id']));
  const initialValues = {
    ...initialShop,
    logo: logoFiles,
    assets: assetsFiles,
    city: shop.city.slug,
    contacts: {
      emails: shop.contacts.emails,
      phones: shop.contacts.phones,
    },
    address: {
      formattedAddress: shop.address.formattedAddress,
      point: {
        lat: shop.address.point.coordinates[1],
        lng: shop.address.point.coordinates[0],
      },
    },
  };

  return (
    <Inner testId={'shop-details'}>
      <ShopForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmitHandler={(values) => {
          showLoading();
          updateShopMutation({
            variables: {
              input: {
                ...values,
                shopId: shop.id,
              },
            },
          }).catch((e) => console.log(e));
        }}
      />
    </Inner>
  );
};

export default ShopDetails;
