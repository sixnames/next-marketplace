import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { CreatePageInputInterface } from '../../db/dao/pages/createPage';
import { CreatePagesGroupInputInterface } from '../../db/dao/pages/createPagesGroup';
import { DeletePageInputInterface } from '../../db/dao/pages/deletePage';
import { DeletePagesGroupInputInterface } from '../../db/dao/pages/deletePagesGroup';
import { UpdatePageInputInterface } from '../../db/dao/pages/updatePage';
import { UpdatePagesGroupInputInterface } from '../../db/dao/pages/updatePagesGroup';
import { PagePayloadModel, PagesGroupPayloadModel } from '../../db/dbModels';
import { useMutationHandler } from './useFetch';

const basePath = '/api/page';

// page
// create
export const useCreatePage = () => {
  return useMutationHandler<PagePayloadModel, CreatePageInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdatePage = () => {
  return useMutationHandler<PagePayloadModel, UpdatePageInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeletePage = () => {
  return useMutationHandler<PagePayloadModel, DeletePageInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// group
// create
export const useCreatePagesGroup = () => {
  return useMutationHandler<PagesGroupPayloadModel, CreatePagesGroupInputInterface>({
    path: `${basePath}/group`,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdatePagesGroup = () => {
  return useMutationHandler<PagesGroupPayloadModel, UpdatePagesGroupInputInterface>({
    path: `${basePath}/group`,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeletePagesGroup = () => {
  return useMutationHandler<PagesGroupPayloadModel, DeletePagesGroupInputInterface>({
    path: `${basePath}/group`,
    method: REQUEST_METHOD_DELETE,
  });
};
