import { EventSummaryInterface } from 'db/uiInterfaces';
import { useDeleteEventAsset, useUpdateEventAssetIndex } from 'hooks/mutations/useEventMutations';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { REQUEST_METHOD_POST } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { useRouter } from 'next/router';
import * as React from 'react';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import AssetsManager from '../AssetsManager';
import WpDropZone from '../FormElements/Upload/WpDropZone';
import Inner from '../Inner';

interface EventAssetsInterface {
  summary: EventSummaryInterface;
}

const EventAssets: React.FC<EventAssetsInterface> = ({ summary }) => {
  const router = useRouter();
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });

  const [deleteEventAssetMutation] = useDeleteEventAsset();
  const [updateEventAssetIndexMutation] = useUpdateEventAssetIndex();
  return (
    <Inner testId={'event-assets-list'}>
      <AssetsManager
        initialAssets={summary.assets}
        assetsTitle={`${summary.name}`}
        onRemoveHandler={(assetIndex) => {
          deleteEventAssetMutation({
            taskId: alwaysString(router.query.taskId),
            eventId: `${summary._id}`,
            assetIndex,
          }).catch(console.log);
        }}
        onReorderHandler={({ assetNewIndex, assetUrl }) => {
          updateEventAssetIndexMutation({
            taskId: alwaysString(router.query.taskId),
            eventId: `${summary._id}`,
            assetNewIndex,
            assetUrl,
          }).catch(console.log);
        }}
      />

      <WpDropZone
        testId={'event-images'}
        label={'Добавить изображения'}
        onDropHandler={(acceptedFiles) => {
          if (acceptedFiles) {
            showLoading();
            const formData = new FormData();
            alwaysArray(acceptedFiles).forEach((file, index) => {
              formData.append(`assets[${index}]`, file);
            });
            formData.append('eventId', `${summary._id}`);
            if (router.query.taskId) {
              formData.append('taskId', `${router.query.taskId}`);
            }

            const links = getProjectLinks();
            fetch(links.api.events.assets.add.url, {
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

export default EventAssets;
