import { useRouter } from 'next/router';
import * as React from 'react';
import { ProductSummaryInterface } from '../../db/uiInterfaces';
import {
  useDeleteProductAsset,
  useUpdateProductAssetIndex,
} from '../../hooks/mutations/useProductMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { alwaysArray } from '../../lib/arrayUtils';
import AssetsManager from '../AssetsManager';
import WpDropZone from '../FormElements/Upload/WpDropZone';
import Inner from '../Inner';

interface ConsoleRubricProductAssetsInterface {
  product: ProductSummaryInterface;
}

const ConsoleRubricProductAssets: React.FC<ConsoleRubricProductAssetsInterface> = ({ product }) => {
  const router = useRouter();
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });

  const [deleteProductAssetMutation] = useDeleteProductAsset();
  const [updateProductAssetIndexMutation] = useUpdateProductAssetIndex();

  return (
    <Inner testId={'product-assets-list'}>
      <AssetsManager
        initialAssets={product.assets}
        assetsTitle={product.originalName}
        onRemoveHandler={(assetIndex) => {
          deleteProductAssetMutation({
            productId: `${product._id}`,
            assetIndex,
          }).catch((e) => console.log(e));
        }}
        onReorderHandler={({ assetNewIndex, assetUrl }) => {
          updateProductAssetIndexMutation({
            productId: `${product._id}`,
            assetNewIndex,
            assetUrl,
          }).catch((e) => console.log(e));
        }}
      />

      <WpDropZone
        testId={'product-images'}
        label={'Добавить изображения'}
        onDropHandler={(acceptedFiles) => {
          if (acceptedFiles) {
            showLoading();
            const formData = new FormData();
            alwaysArray(acceptedFiles).forEach((file, index) => {
              formData.append(`assets[${index}]`, file);
            });
            formData.append('productId', `${product._id}`);

            fetch('/api/product/add-product-asset', {
              method: 'POST',
              body: formData,
            })
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                if (json.success) {
                  router.reload();
                  return;
                }
                hideLoading();
                showErrorNotification({ title: json.message });
              })
              .catch(() => {
                hideLoading();
                showErrorNotification({ title: 'error' });
              });
          }
        }}
      />
    </Inner>
  );
};

export default ConsoleRubricProductAssets;
