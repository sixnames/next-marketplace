import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { AddAttributesGroupToRubricInputInterface } from 'db/dao/rubrics/addAttributesGroupToRubric';
import { CreateRubricInputInterface } from 'db/dao/rubrics/createRubric';
import { DeleteAttributesGroupFromRubricInputInterface } from 'db/dao/rubrics/deleteAttributesGroupFromRubric';
import { DeleteRubricInputInterface } from 'db/dao/rubrics/deleteRubric';
import { ToggleAttributeInRubricFilterInputInterface } from 'db/dao/rubrics/toggleAttributeInRubricFilter';
import { ToggleCmsCardAttributeInRubricInputInterface } from 'db/dao/rubrics/toggleCmsCardAttributeInRubric';
import { UpdateRubricInputInterface } from 'db/dao/rubrics/updateRubric';
import { RubricPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const basePath = '/api/rubrics';

// rubric
// create
export const useCreateRubric = () => {
  return useMutationHandler<RubricPayloadModel, CreateRubricInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateRubric = () => {
  return useMutationHandler<RubricPayloadModel, UpdateRubricInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteRubric = () => {
  return useMutationHandler<RubricPayloadModel, DeleteRubricInputInterface>({
    path: basePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// rubric attribute groups
// add
export const useAddAttributesGroupToRubric = () => {
  return useMutationHandler<RubricPayloadModel, AddAttributesGroupToRubricInputInterface>({
    path: `${basePath}/attributes-group`,
    method: REQUEST_METHOD_POST,
  });
};

// delete
export const useDeleteAttributesGroupFromRubric = () => {
  return useMutationHandler<RubricPayloadModel, DeleteAttributesGroupFromRubricInputInterface>({
    path: `${basePath}/attributes-group`,
    method: REQUEST_METHOD_DELETE,
  });
};

// rubric attributes
// cms product attributes
export const useToggleCmsCardAttributeInRubric = () => {
  return useMutationHandler<RubricPayloadModel, ToggleCmsCardAttributeInRubricInputInterface>({
    path: `${basePath}/cms-product-attributes`,
    method: REQUEST_METHOD_PATCH,
  });
};

// filter attributes
export const useToggleAttributeInRubricFilter = () => {
  return useMutationHandler<RubricPayloadModel, ToggleAttributeInRubricFilterInputInterface>({
    path: `${basePath}/filter-attributes`,
    method: REQUEST_METHOD_PATCH,
  });
};
