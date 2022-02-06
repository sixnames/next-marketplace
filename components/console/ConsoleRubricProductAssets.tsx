import { REQUEST_METHOD_POST } from 'config/common';
import { getProjectLinks } from 'lib/getProjectLinks';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ProductSummaryInterface } from 'db/uiInterfaces';
import {
  useDeleteProductAsset,
  useUpdateProductAssetIndex,
} from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { alwaysArray } from 'lib/arrayUtils';
import AssetsManager from '../AssetsManager';
import WpDropZone from '../FormElements/Upload/WpDropZone';
import Inner from '../Inner';

interface ConsoleRubricProductAssetsInterface {
  summary: ProductSummaryInterface;
}

const ConsoleRubricProductAssets: React.FC<ConsoleRubricProductAssetsInterface> = ({ summary }) => {
  const router = useRouter();
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });

  const [deleteProductAssetMutation] = useDeleteProductAsset();
  const [updateProductAssetIndexMutation] = useUpdateProductAssetIndex();

  return (
    <Inner testId={'product-assets-list'}>
      <AssetsManager
        initialAssets={summary.assets}
        assetsTitle={summary.originalName}
        onRemoveHandler={(assetIndex) => {
          deleteProductAssetMutation({
            productId: `${summary._id}`,
            assetIndex,
          }).catch((e) => console.log(e));
        }}
        onReorderHandler={({ assetNewIndex, assetUrl }) => {
          updateProductAssetIndexMutation({
            productId: `${summary._id}`,
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
            formData.append('productId', `${summary._id}`);

            const links = getProjectLinks();
            fetch(links.api.product.assets.url, {
              method: REQUEST_METHOD_POST,
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
