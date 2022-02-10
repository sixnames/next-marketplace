import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { CreateBrandInputInterface } from 'db/dao/brands/createBrand';
import { CreateBrandCollectionInputInterface } from 'db/dao/brands/createBrandCollection';
import { DeleteBrandInputInterface } from 'db/dao/brands/deleteBrand';
import { DeleteBrandCollectionInputInterface } from 'db/dao/brands/deleteBrandCollection';
import { UpdateBrandInputInterface } from 'db/dao/brands/updateBrand';
import { UpdateBrandCollectionInputInterface } from 'db/dao/brands/updateBrandCollection';
import { BrandCollectionPayloadModel, BrandPayloadModel } from 'db/dbModels';
import { useMutationHandler } from 'hooks/mutations/useFetch';

const brandApiBasePath = '/api/brand';
const brandCollectionApiBasePath = '/api/brand-collections';

// brand
// create
export const useCreateBrand = () => {
  return useMutationHandler<BrandPayloadModel, CreateBrandInputInterface>({
    path: brandApiBasePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateBrand = () => {
  return useMutationHandler<BrandPayloadModel, UpdateBrandInputInterface>({
    path: brandApiBasePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteBrand = () => {
  return useMutationHandler<BrandPayloadModel, DeleteBrandInputInterface>({
    path: brandApiBasePath,
    method: REQUEST_METHOD_DELETE,
  });
};

// brand collection
// create
export const useCreateBrandCollection = () => {
  return useMutationHandler<BrandCollectionPayloadModel, CreateBrandCollectionInputInterface>({
    path: brandCollectionApiBasePath,
    method: REQUEST_METHOD_POST,
  });
};

// update
export const useUpdateBrandCollection = () => {
  return useMutationHandler<BrandCollectionPayloadModel, UpdateBrandCollectionInputInterface>({
    path: brandCollectionApiBasePath,
    method: REQUEST_METHOD_PATCH,
  });
};

// delete
export const useDeleteBrandCollection = () => {
  return useMutationHandler<BrandCollectionPayloadModel, DeleteBrandCollectionInputInterface>({
    path: brandCollectionApiBasePath,
    method: REQUEST_METHOD_DELETE,
  });
};
