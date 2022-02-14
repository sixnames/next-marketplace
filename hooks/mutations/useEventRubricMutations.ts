import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { AddAttributesGroupToEventRubricInputInterface } from 'db/dao/eventRubrics/addAttributesGroupToEventRubric';
import { CreateEventRubricInputInterface } from 'db/dao/eventRubrics/createEventRubric';
import { DeleteAttributesGroupFromEventRubricInputInterface } from 'db/dao/eventRubrics/deleteAttributesGroupFromEventRubric';
import { DeleteEventRubricInputInterface } from 'db/dao/eventRubrics/deleteEventRubric';
import { ToggleAttributeInEventRubricFilterInputInterface } from 'db/dao/eventRubrics/toggleAttributeInEventRubricFilter';
import { ToggleCmsCardAttributeInEventRubricInputInterface } from 'db/dao/eventRubrics/toggleCmsCardAttributeInEventRubric';
import { UpdateEventRubricInputInterface } from 'db/dao/eventRubrics/updateEventRubric';
import { EventRubricPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/event-rubrics';

// rubric
// create
export const useCreateEventRubric = () => {
  return useMutationHandler<EventRubricPayloadModel, CreateEventRubricInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateEventRubric = () => {
  return useMutationHandler<EventRubricPayloadModel, UpdateEventRubricInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteEventRubric = () => {
  return useMutationHandler<EventRubricPayloadModel, DeleteEventRubricInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// rubric attribute groups
// add
export const useAddAttributesGroupToEventRubric = () => {
  return useMutationHandler<EventRubricPayloadModel, AddAttributesGroupToEventRubricInputInterface>(
    {
      path: `${basePath}/attributes-groups`,
      method: REQUEST_METHOD_POST,
    },
  );
};

// delete
export const useDeleteAttributesGroupFromEventRubric = () => {
  return useMutationHandler<
    EventRubricPayloadModel,
    DeleteAttributesGroupFromEventRubricInputInterface
  >({
    path: `${basePath}/attributes-groups`,
    method: REQUEST_METHOD_DELETE,
  });
};

// rubric attributes
// cms product attributes
export const useToggleCmsCardAttributeInEventRubric = () => {
  return useMutationHandler<
    EventRubricPayloadModel,
    ToggleCmsCardAttributeInEventRubricInputInterface
  >({
    path: `${basePath}/cms-product-attributes`,
    method: REQUEST_METHOD_PATCH,
  });
};

// filter attributes
export const useToggleAttributeInEventRubricFilter = () => {
  return useMutationHandler<
    EventRubricPayloadModel,
    ToggleAttributeInEventRubricFilterInputInterface
  >({
    path: `${basePath}/filter-attributes`,
    method: REQUEST_METHOD_PATCH,
  });
};
