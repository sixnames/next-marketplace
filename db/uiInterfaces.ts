import {
  AddressModel,
  AttributeModel,
  AttributesGroupModel,
  AttributeViewVariantModel,
  BrandCollectionModel,
  BrandModel,
  CartModel,
  CartProductModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  ContactsModel,
  CoordinatesModel,
  FormattedPhoneModel,
  ManufacturerModel,
  MessageModel,
  MetricModel,
  NavItemModel,
  ObjectIdModel,
  OptionModel,
  OptionsGroupModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  OrderStatusModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardBreadcrumbModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  RoleModel,
  RubricAttributeModel,
  RubricAttributesGroupModel,
  RubricCatalogueTitleModel,
  RubricModel,
  RubricOptionModel,
  RubricVariantModel,
  ShopModel,
  ShopProductModel,
  TranslationModel,
  UserModel,
} from 'db/dbModels';
import { MessageSlug } from 'types/messageSlugTypes';

export interface AddressInterface extends AddressModel {
  formattedCoordinates?: CoordinatesModel;
}

export interface ContactsInterface extends ContactsModel {
  formattedPhones: {
    raw: string;
    readable: string;
  }[];
}

export interface AttributeInterface extends AttributeModel {
  name?: string | null;
}

export interface AttributesGroupInterface extends AttributesGroupModel {
  name?: string | null;
}

export interface BrandInterface extends BrandModel {
  name?: string | null;
  description?: string | null;
}

export interface BrandCollectionInterface extends BrandCollectionModel {
  name?: string | null;
  description?: string | null;
  brand?: BrandInterface | null;
}

export interface ManufacturerInterface extends ManufacturerModel {
  name?: string | null;
  description?: string | null;
}

export interface CartProductInterface extends CartProductModel {
  product?: ProductInterface;
  shopProduct?: ShopProductInterface;
  isShopless?: boolean;
  totalPrice?: string;
}

export interface CartInterface extends CartModel {
  totalPrice?: number;
  productsCount?: number;
  formattedTotalPrice?: string;
  isWithShopless?: boolean;
  cartProducts: CartProductInterface[];
}

export interface CityInterface extends CityModel {
  name?: string;
}

export interface ConfigInterface extends ConfigModel {
  value?: string[];
  singleValue?: string;
}

export interface CompanyInterface extends CompanyModel {
  shops?: ShopInterface[];
}

export interface MessageBaseInterface {
  slug: MessageSlug;
  messageI18n: TranslationModel;
}

export interface MessageInterface extends MessageModel {
  message: string | null;
}

export interface MetricInterface extends MetricModel {
  name?: string;
}

export interface NavItemInterface extends NavItemModel {
  name?: string;
  children?: NavItemInterface[];
}

export interface OptionInterface extends OptionModel {
  name?: string | null;
  options?: OptionInterface[] | null;
}

export interface OptionsGroupInterface extends OptionsGroupModel {
  name?: string | null;
}

export interface ProductConnectionItemInterface extends ProductConnectionItemModel {
  product?: ProductInterface;
  option?: OptionInterface | null;
}

export interface ProductConnectionInterface extends ProductConnectionModel {
  attribute?: AttributeInterface | null;
  connectionProducts?: ProductConnectionItemInterface[];
}

export interface ProductAttributeInterface extends ProductAttributeModel, AttributeInterface {
  readableValue?: string | null;
  index?: number | null;
  options?: OptionInterface[] | null;
}

export interface RubricAttributesGroupASTInterface {
  _id: string;
  attributes: RubricAttributeInterface[];
}

export interface ProductAttributesGroupASTInterface {
  _id: string;
  attributes: ProductAttributeInterface[];
}

export interface ProductInterface extends ProductModel {
  name?: string | null;
  description?: string | null;
  available?: boolean;
  assets?: ProductAssetsModel | null;
  connections?: ProductConnectionInterface[];
  attributes?: ProductAttributeInterface[];
  listFeatures?: ProductAttributeInterface[];
  textFeatures?: ProductAttributeInterface[];
  tagFeatures?: ProductAttributeInterface[];
  iconFeatures?: ProductAttributeInterface[];
  ratingFeatures?: ProductAttributeInterface[];
  cardShopProducts?: ShopProductInterface[];
  price?: number;
  cardBreadcrumbs?: ProductCardBreadcrumbModel[];
  shopProductIds?: ObjectIdModel[];
  shopProducts?: ShopProductInterface[];
  shopProduct?: ShopProductInterface;
  rubric?: RubricInterface;
  rubricAttributesAST?: RubricAttributesGroupASTInterface[] | null;
  stringAttributesAST?: ProductAttributesGroupASTInterface | null;
  numberAttributesAST?: ProductAttributesGroupASTInterface | null;
  multipleSelectAttributesAST?: ProductAttributesGroupASTInterface | null;
  selectAttributesAST?: ProductAttributesGroupASTInterface | null;
}

export interface RoleInterface extends RoleModel {
  name?: string | null;
  navItems?: NavItemModel[];
  appNavigation?: NavItemModel[];
  cmsNavigation?: NavItemModel[];
}

export interface RubricVariantInterface extends RubricVariantModel {
  name?: string | null;
}

export interface RubricOptionInterface extends RubricOptionModel, OptionInterface {
  options?: RubricOptionInterface[] | null;
  name?: string | null;
}

export interface RubricAttributeInterface extends RubricAttributeModel, AttributeInterface {
  options?: RubricOptionInterface[] | null;
  name?: string | null;
  metric?: MetricInterface | null;
  rubric?: RubricInterface | null;
}

export interface RubricCatalogueTitleInterface extends RubricCatalogueTitleModel {
  defaultTitle?: string | null;
  prefix?: string | null;
  keyword?: string | null;
}

export interface RubricAttributesGroupInterface extends RubricAttributesGroupModel {
  attributes?: RubricAttributeInterface[] | null;
  name?: string | null;
}

export interface RubricInterface extends RubricModel {
  name?: string | null;
  attributes?: RubricAttributeInterface[] | null;
  navItems?: RubricAttributeInterface[] | null;
  activeProductsCount?: number | null;
  productsCount?: number | null;
  variant?: RubricVariantInterface | null;
  attributesGroups?: RubricAttributesGroupInterface[] | null;
}

export interface ShopProductInterface extends ShopProductModel {
  name?: string | null;
  shop?: ShopInterface;
  product?: ProductInterface;
  products?: ProductInterface[];
  connections?: ProductConnectionInterface[];
  attributes?: ProductAttributeInterface[];
  listFeatures?: ProductAttributeInterface[];
  textFeatures?: ProductAttributeInterface[];
  tagFeatures?: ProductAttributeInterface[];
  iconFeatures?: ProductAttributeInterface[];
  ratingFeatures?: ProductAttributeInterface[];
}

export interface ShopInterface extends ShopModel {
  productsCount?: number | null;
  city?: CityModel | null;
  contacts: ContactsInterface;
  address: AddressInterface;
}

export interface UserInterface extends UserModel {
  role?: RoleInterface;
  fullName?: string;
  shortName?: string;
  companies?: CompanyInterface[];
  formattedPhone?: FormattedPhoneModel | null;
}

export interface CatalogueDataInterface {
  _id: ObjectIdModel;
  clearSlug: string;
  filter: string[];
  rubricName: string;
  rubricSlug: string;
  products: ProductInterface[];
  totalProducts: number;
  catalogueTitle: string;
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  page: number;
}

export interface CatalogueProductOptionInterface {
  _id: string;
  optionsSlugs: string[];
}

export interface CatalogueProductPricesInterface {
  _id: number;
}

export interface CatalogueProductsAggregationInterface {
  totalProducts: number;
  prices: CatalogueProductPricesInterface[];
  docs: ProductInterface[];
  rubric: RubricInterface;
}

export interface ProductsPaginationAggregationInterface {
  docs: ProductInterface[];
  totalDocs?: number | null;
  totalActiveDocs?: number | null;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface CatalogueFilterAttributeOptionInterface {
  _id: ObjectIdModel;
  slug: string;
  name: string;
  nextSlug: string;
  isSelected: boolean;
}

export interface CatalogueFilterAttributeInterface {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  clearSlug: string;
  slug: string;
  name: string;
  metric?: string | null;
  isSelected: boolean;
  options: CatalogueFilterAttributeOptionInterface[];
  viewVariant: AttributeViewVariantModel;
}

export interface ProductCardPricesAggregationInterface {
  _id: ObjectIdModel;
  minPrice: number;
  maxPrice: number;
}

export interface ProductShopsCountAggregationInterface {
  shopsCount: number;
}

export interface OrderStatusInterface extends OrderStatusModel {
  name?: string | null;
}

export interface OrderLogInterface extends OrderLogModel {
  user?: UserInterface | null;
}

export interface OrderCustomerInterface extends OrderCustomerModel {
  user?: UserInterface | null;
  fullName?: string;
  shortName?: string;
  formattedPhone?: FormattedPhoneModel | null;
}

export interface OrderProductInterface extends OrderProductModel {
  product?: ProductInterface | null;
  shopProduct?: ShopProductInterface | null;
  shop?: ShopInterface | null;
  company?: CompanyInterface | null;
  formattedPrice?: string | null;
  totalPrice?: number | null;
  formattedTotalPrice?: string | null;
  name?: string | null;
}

export interface OrderInterface extends OrderModel {
  customer?: OrderCustomerInterface | null;
  products?: OrderProductInterface[] | null;
  logs?: OrderLogInterface[] | null;
  shopsCount?: number | null;
  shops?: ShopInterface[] | null;
  status?: OrderStatusInterface | null;
  productsCount?: number | null;
  totalPrice?: number | null;
  formattedTotalPrice?: string | null;
}
