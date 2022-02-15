import { CreateEventInputInterface } from 'db/dao/events/createEvent';
import { DeleteEventInputInterface } from 'db/dao/events/deleteEvent';
import { UpdateEventInputInterface } from 'db/dao/events/updateEvent';
import { EventPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';

const basePath = '/api/events';

// event
// create
export const useCreateEvent = () => {
  return useMutationHandler<EventPayloadModel, CreateEventInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
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
export const useDeleteEvent = () => {
  return useMutationHandler<EventPayloadModel, DeleteEventInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};
