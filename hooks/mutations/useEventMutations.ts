import { CreateEventInputInterface } from 'db/dao/events/createEvent';
import { DeleteEventInputInterface } from 'db/dao/events/deleteEvent';
import { DeleteEventAssetInputInterface } from 'db/dao/events/deleteEventAsset';
import { UpdateEventInputInterface } from 'db/dao/events/updateEvent';
import { UpdateEventAssetIndexInputInterface } from 'db/dao/events/updateEventAssetIndex';
import { UpdateEventCardContentInputInterface } from 'db/dao/events/updateEventCardContent';
import { UpdateEventNumberAttributeInputInterface } from 'db/dao/events/updateEventNumberAttribute';
import { UpdateEventSelectAttributeInputInterface } from 'db/dao/events/updateEventSelectAttribute';
import { UpdateEventTextAttributeInputInterface } from 'db/dao/events/updateEventTextAttribute';
import { EventPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';
import { useBasePath } from 'hooks/useBasePath';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import { useRouter } from 'next/router';

const basePath = '/api/events';

// event
// create
export const useCreateEvent = () => {
  const routeBasePath = useBasePath('companyId');
  const router = useRouter();

  return useMutationHandler<EventPayloadModel, CreateEventInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
    reload: false,
    onSuccess: (payload) => {
      if (payload.success && payload.payload) {
        const links = getConsoleCompanyLinks({
          basePath: routeBasePath,
          companyId: payload.payload.companyId,
          rubricSlug: payload.payload.rubricSlug,
          eventId: payload.payload._id,
        });
        router.push(links.eventRubrics.rubricSlug.events.event.eventId.url).catch(console.log);
      }
    },
  });
};

// update
export const useUpdateEvent = () => {
  return useMutationHandler<EventPayloadModel, UpdateEventInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
interface UseDeleteEventPropsInterface {
  reload?: boolean;
  redirectUrl?: string;
}
export const useDeleteEvent = (props?: UseDeleteEventPropsInterface | undefined) => {
  const mutationProps = props || {};
  return useMutationHandler<EventPayloadModel, DeleteEventInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
    ...mutationProps,
  });
};

// attributes
export const useUpdateEventNumberAttribute = () => {
  return useMutationHandler<EventPayloadModel, UpdateEventNumberAttributeInputInterface>({
    path: `${basePath}/attributes/number`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateEventSelectAttribute = () => {
  return useMutationHandler<EventPayloadModel, UpdateEventSelectAttributeInputInterface>({
    path: `${basePath}/attributes/select`,
    method: REQUEST_METHOD_PATCH,
  });
};

export const useUpdateEventTextAttribute = () => {
  return useMutationHandler<EventPayloadModel, UpdateEventTextAttributeInputInterface>({
    path: `${basePath}/attributes/text`,
    method: REQUEST_METHOD_PATCH,
  });
};

// update asset index
export const useUpdateEventAssetIndex = () => {
  return useMutationHandler<EventPayloadModel, UpdateEventAssetIndexInputInterface>({
    path: `${basePath}/assets`,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete asset
export const useDeleteEventAsset = () => {
  return useMutationHandler<EventPayloadModel, DeleteEventAssetInputInterface>({
    path: `${basePath}/assets`,
    method: REQUEST_METHOD_DELETE,
  });
};

// update card content
export const useUpdateEventCardContent = () => {
  return useMutationHandler<EventPayloadModel, UpdateEventCardContentInputInterface>({
    path: `${basePath}/card-content`,
    method: REQUEST_METHOD_PATCH,
  });
};
