import { ObjectId } from 'mongodb';
import { IconType } from 'types/iconTypes';
import { ReadStream } from 'fs';
import { MessageSlug } from 'types/messageSlugTypes';

export interface UploadModel {
  filename: string;
  mimetype: string;
  encoding: string;
  ext: string;
  createReadStream: () => ReadStream;
}

export type DateModel = Date;
export type JSONObjectModel = Record<string, any>;
export type ObjectIdModel = ObjectId;
export type EmailAddressModel = string;
export type PhoneNumberModel = string;
export type URLModel = string;

// Gender enum
export enum GenderModel {
  she = 'she',
  he = 'he',
  it = 'it',
}

export interface SelectOptionModel {
  _id: string;
  name: string;
  icon?: string;
}

export interface PayloadModel {
  success: boolean;
  message: string;
  type?: any;
}

export interface PayloadType<TModel> extends PayloadModel {
  payload?: TModel | null;
}

export interface IdCounterModel {
  collection: string;
  counter: number;
}

export interface BaseModel {
  _id: ObjectIdModel;
  itemId: string;
  type?: any;
}

export interface TimestampModel {
  createdAt: DateModel;
  updatedAt: DateModel;
  type?: any;
}

export interface FormattedPhoneModel {
  raw: PhoneNumberModel;
  readable: PhoneNumberModel;
}

export interface PointGeoJSONModel {
  // Field that specifies the GeoJSON object type.
  type: 'Point';

  // Coordinates that specifies the object’s coordinates.
  // If specifying latitude and longitude coordinates,
  // list the longitude first and then latitude.
  coordinates: number[];
}

export interface CoordinatesModel {
  lat: number;
  lng: number;
}

export interface AddressModel {
  formattedAddress: string;
  point: PointGeoJSONModel;

  // types for ui
  formattedCoordinates?: CoordinatesModel;
}

export interface ContactsModel {
  emails: EmailAddressModel[];
  phones: PhoneNumberModel[];

  // types for ui
  formattedPhones?: FormattedPhoneModel[];
}

export interface AssetModel {
  url: string;
  index: number;
}

// Sort direction
export enum SortDirectionModel {
  ASC = 1,
  DESC = -1,
}

// Pagination
export interface PaginationInputModel {
  search?: string | null;
  sortBy?: string | null;
  sortDir?: number | null;
  page?: number | null;
  limit?: number | null;
}

export interface ProductsPaginationInputModel extends PaginationInputModel {
  rubricId?: ObjectIdModel | null;
  attributesIds?: ObjectIdModel[] | null;
  excludedRubricsIds?: ObjectIdModel[] | null;
  excludedProductsIds?: ObjectIdModel[] | null;
  isWithoutRubrics?: boolean | null;
}

export interface PaginationPayloadModel {
  sortBy: string;
  sortDir: SortDirectionModel;
  totalDocs: number;
  totalActiveDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  type?: any;
}

export interface AlphabetListModel {
  letter: string;
  type?: any;
}

export interface AlphabetListModelType<TModel> extends AlphabetListModel {
  docs: TModel[];
}

export interface PaginationPayloadType<TModel> extends PaginationPayloadModel {
  docs: TModel[];
}

// Attribute variant
export enum AttributeVariantModel {
  select = 'select',
  multipleSelect = 'multipleSelect',
  string = 'string',
  number = 'number',
}

// Attribute positioning in catalogue title
export enum AttributePositionInTitleModel {
  begin = 'begin',
  end = 'end',
  beforeKeyword = 'beforeKeyword',
  afterKeyword = 'afterKeyword',
  replaceKeyword = 'replaceKeyword',
}

// Attribute view variant
export enum AttributeViewVariantModel {
  list = 'list',
  text = 'text',
  tag = 'tag',
  icon = 'icon',
  outerRating = 'outerRating',
}

// Attribute positioning in catalogue title for different locales
// Each key is locale with value for current locale
export interface AttributePositioningInTitleModel {
  [key: string]: AttributePositionInTitleModel;
}

// I18n model. Each key is locale with value for current locale
export type TranslationModel = JSONObjectModel;

export interface CountersItemModel {
  [key: string]: {
    [key: string]: number;
  };
}

export interface CountersModel {
  views: CountersItemModel;
  priorities: CountersItemModel;
}

export interface AttributeModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  name?: string | null;
  variant: AttributeVariantModel;
  viewVariant: AttributeViewVariantModel;
  optionsGroupId?: ObjectIdModel | null;
  options: OptionModel[];
  metric?: MetricModel | null;
  positioningInTitle?: AttributePositioningInTitleModel | null;
  capitalise?: boolean | null;
}

export interface AttributesGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  attributesIds: ObjectIdModel[];

  // types for ui
  name?: string | null;
}

export interface BrandModel extends BaseModel, TimestampModel, CountersModel {
  slug: string;
  url?: URLModel[] | null;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;

  // types for ui
  name?: string | null;
}

export interface BrandCollectionModel extends BaseModel, TimestampModel, CountersModel {
  slug: string;
  nameI18n: TranslationModel;
  brandSlug: string;
  brandId: ObjectIdModel;
  descriptionI18n?: TranslationModel | null;

  // types for ui
  name?: string | null;
}

export interface ManufacturerModel extends BaseModel, TimestampModel, CountersModel {
  nameI18n: TranslationModel;
  slug: string;
  url?: URLModel[] | null;
  descriptionI18n?: TranslationModel | null;

  // types for ui
  name?: string | null;
}

export interface CartProductModel {
  _id: ObjectIdModel;
  shopProductId?: ObjectIdModel | null;
  productId?: ObjectIdModel | null;
  amount: number;

  // types for ui
  product?: ProductModel;
  shopProduct?: ShopProductModel;
  isShopless?: boolean;
  totalPrice?: string;
}

export interface CartModel extends TimestampModel {
  _id: ObjectIdModel;
  cartProducts: CartProductModel[];

  // types for ui
  totalPrice?: number;
  productsCount?: number;
  formattedTotalPrice?: string;
  isWithShopless?: boolean;
}

export interface CityModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;

  // types for ui
  name?: string;
}

export interface CompanyModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  logo: AssetModel;
  ownerId: ObjectIdModel;
  staffIds: ObjectIdModel[];
  contacts: ContactsModel;
  shopsIds: ObjectIdModel[];
  domain?: string | null;
}

export enum ConfigVariantModel {
  string = 'string',
  number = 'number',
  email = 'email',
  tel = 'tel',
  asset = 'asset',
}

// I18n model. Each key is locale with value for current locale
export interface ConfigI18nModel {
  [key: string]: string[];
}

// I18n model. Each key is city slug with value for current city
export interface ConfigCitiesModel {
  [key: string]: ConfigI18nModel;
}

export interface ConfigModel {
  _id: ObjectIdModel;

  // Set to true if config is able to hold multiple values.
  multi: boolean;

  // Accepted formats for asset config.
  acceptedFormats: string[];

  slug: string;
  companySlug: string;
  group: string;
  name: string;
  description?: string | null;
  variant: ConfigVariantModel;
  cities: ConfigCitiesModel;

  // types for ui
  value?: string[];
  singleValue?: string;
}

export interface CountryModel {
  _id: ObjectIdModel;
  name: string;
  citiesIds: ObjectIdModel[];
  currency: string;
}

export interface CurrencyModel {
  _id: ObjectIdModel;
  name: string;
}

export interface LanguageModel {
  _id: ObjectIdModel;
  slug: string;
  name: string;
  nativeName: string;
}

export interface MessageType {
  slug: MessageSlug;
  messageI18n: TranslationModel;
}

export interface MessageBase {
  slug: string;
  messageI18n: TranslationModel;
}

export interface MessageModel extends MessageBase {
  _id: ObjectIdModel;
}

export interface MessagesGroupModel {
  _id: ObjectIdModel;
  name: string;
  messagesIds: ObjectIdModel[];
}

export interface MetricModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;

  // types for ui
  name?: string;
}

export interface NavItemModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;
  path?: string | null;
  navGroup: string;
  index: number;
  icon?: IconType | null;
  parentId?: ObjectIdModel | null;

  // types for ui
  name?: string;
  children?: NavItemModel[];
}

export interface OptionVariantsModel {
  [key: string]: TranslationModel;
}

export interface OptionModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  name?: string | null;
  variants: OptionVariantsModel;
  gender?: GenderModel | null;
  color?: string | null;
  icon?: string | null;
  options: OptionModel[];
}

// Options Group variant
export enum OptionsGroupVariantModel {
  text = 'text',
  icon = 'icon',
  color = 'color',
}

export interface OptionsGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  options: OptionModel[];
  variant: OptionsGroupVariantModel;
}

export interface ShopProductOldPriceModel extends TimestampModel {
  price: number;
}

export interface OrderStatusModel extends TimestampModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;
  color: string;
}

// Order log variant
export enum OrderLogVariantModel {
  status = 'status',
}

export interface OrderLogModel {
  _id: ObjectIdModel;
  variant: OrderLogVariantModel;
  userId: ObjectIdModel;
  createdAt: DateModel;
}

export interface OrderProductModel {
  _id: ObjectIdModel;
  itemId: string;
  price: number;
  amount: number;
  slug: string;
  originalName: string;
  oldPrices: ShopProductOldPriceModel[];
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  productId: ObjectIdModel;
  shopProductId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
}

export interface OrderCustomerModel {
  _id: ObjectIdModel;
  userId: ObjectIdModel;
  itemId: string;
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
}

export interface OrderModel extends BaseModel, TimestampModel {
  comment?: string | null;
  statusId: ObjectIdModel;
  customer: OrderCustomerModel;
  products: OrderProductModel[];
  logs: OrderLogModel[];
}

export interface ProductConnectionItemModel {
  _id: ObjectIdModel;
  option: OptionModel;
  productId: ObjectIdModel;

  // types for ui
  product?: ProductModel;
}

export interface ProductConnectionModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  attributeNameI18n: TranslationModel;
  attributeVariant: AttributeVariantModel;
  attributeViewVariant: AttributeViewVariantModel;
  connectionProducts: ProductConnectionItemModel[];

  // types for ui
  attributeName?: string;
}

export interface ProductAttributeModel {
  _id: ObjectIdModel;
  showInCard: boolean;
  showAsBreadcrumb: boolean;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  attributeNameI18n: TranslationModel;
  attributeMetric?: MetricModel | null;
  attributeVariant: AttributeVariantModel;
  attributeViewVariant: AttributeViewVariantModel;
  selectedOptions: OptionModel[];
  selectedOptionsSlugs: string[];
  textI18n?: TranslationModel | null;

  // types for ui
  attributeName?: string | null;
  number?: number | null;
  readableValue?: string | null;
  index?: number;
}

export interface CitiesCounterModel {
  [key: string]: number;
}

export interface CitiesBooleanModel {
  [key: string]: boolean;
}

export interface ProductModel extends BaseModel, TimestampModel {
  active: boolean;
  slug: string;
  originalName: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  rubricId: ObjectIdModel;
  attributes: ProductAttributeModel[];
  assets: AssetModel[];
  mainImage: string;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  connections: ProductConnectionModel[];

  // types for ui
  name?: string | null;
  description?: string | null;
  shopsCount?: number;
  available?: boolean;
  isCustomersChoice?: boolean;
  listFeatures?: ProductAttributeModel[];
  textFeatures?: ProductAttributeModel[];
  tagFeatures?: ProductAttributeModel[];
  iconFeatures?: ProductAttributeModel[];
  ratingFeatures?: ProductAttributeModel[];
  cardShopProducts?: ShopProductModel[];
  price?: number;
  cardPrices?: {
    min: string;
    max: string;
  };
  cardBreadcrumbs?: ProductCardBreadcrumbModel[];
  facets?: ProductFacetModel[] | null;
  facet?: ProductFacetModel | null;
  shopProducts?: ShopProductModel[];
  shopProductIds?: ObjectIdModel[];
  shopProduct?: ShopProductModel;
  rubric?: RubricModel;
}

export interface ProductFacetModel {
  _id: ObjectIdModel;
  slug: string;
  itemId: string;
  originalName: string;
  nameI18n: TranslationModel;
  active: boolean;
  rubricId: ObjectIdModel;
  brandCollectionSlug?: string | null;
  brandSlug?: string | null;
  manufacturerSlug?: string | null;
  selectedOptionsSlugs: string[];
  selectedAttributesIds: ObjectId[];
  mainImage: string;

  // types for ui
  name?: string | null;
  products?: ProductModel[] | null;
  product?: ProductModel | null;
  shopsCount?: number;
  cardPrices?: {
    min: string;
    max: string;
  };
}

export interface ProductCardPricesModel {
  _id: ObjectIdModel;
  min: string;
  max: string;
}

export interface ProductCardBreadcrumbModel {
  _id: ObjectIdModel;
  name: string;
  href: string;
}

export interface RoleRuleModel {
  operationName: string;
  allow: boolean;
  customFilter?: string | null;
}

export interface RoleBase {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  description?: string | null;
  slug: string;
  isStaff: boolean;
}

export interface RoleModel extends RoleBase, TimestampModel {
  rules: RoleRuleModel[];
  allowedAppNavigation: ObjectIdModel[];

  // types for ui
  name?: string;
  navItems?: NavItemModel[];
  appNavigation?: NavItemModel[];
  cmsNavigation?: NavItemModel[];
}

export interface RubricVariantModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
}

export interface RubricOptionModel extends OptionModel, CountersModel {
  options: RubricOptionModel[];
}

export interface RubricAttributeModel extends AttributeModel, CountersModel {
  _id: ObjectIdModel;
  showInCatalogueFilter: boolean;
  showInCatalogueNav: boolean;
  options: RubricOptionModel[];
}

export interface RubricAttributesGroupModel extends AttributesGroupModel {
  _id: ObjectIdModel;
  attributes: RubricAttributeModel[];
}

export interface RubricCatalogueTitleModel {
  defaultTitleI18n: TranslationModel;
  prefixI18n?: TranslationModel | null;
  keywordI18n: TranslationModel;
  gender: GenderModel;
}

export interface RubricModel extends CountersModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  shortDescriptionI18n: TranslationModel;
  catalogueTitle: RubricCatalogueTitleModel;
  slug: string;
  active: boolean;
  attributes: RubricAttributeModel[];
  attributesGroupsIds: ObjectIdModel[];
  variantId: ObjectIdModel;

  // types for ui
  name?: string | null;
  navItems?: RubricAttributeModel[];
  activeProductsCount?: number | null;
  productsCount?: number | null;
  variant?: RubricVariantModel | null;
  attributesGroups?: RubricAttributesGroupModel[] | null;
}

export interface ShopProductModel extends TimestampModel {
  _id: ObjectIdModel;
  available: number;
  citySlug: string;
  price: number;
  formattedPrice: string;
  formattedOldPrice: string;
  discountedPercent: number;
  itemId: string;
  slug: string;
  originalName: string;
  nameI18n: TranslationModel;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  oldPrices: ShopProductOldPriceModel[];
  productId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  rubricId: ObjectIdModel;
  selectedOptionsSlugs: string[];
  mainImage: string;

  // types for ui
  name?: string | null;
  shop?: ShopModel;
  inCartCount?: number;
  product?: ProductModel;
  products?: ProductModel[];
  facet?: ProductFacetModel | null;
}

export interface ShopModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  citySlug: string;
  logo: AssetModel;
  assets: AssetModel[];
  contacts: ContactsModel;
  address: AddressModel;
  companyId: ObjectIdModel;
  mainImage: string;

  // types for ui
  productsCount?: number | null;
  city?: CityModel | null;
}

export interface UserModel extends BaseModel, TimestampModel {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
  password: string;
  avatar?: AssetModel | null;
  roleId: ObjectIdModel;
  cartId?: ObjectIdModel | null;
  ordersIds?: ObjectIdModel[] | null;

  // types for ui
  role?: RoleModel;
  fullName?: string;
  shortName?: string;
  companies?: CompanyModel[];
}

// Payload
export type AttributesGroupPayloadModel = PayloadType<AttributesGroupModel>;
export type BrandPayloadModel = PayloadType<BrandModel>;
export type CompanyPayloadModel = PayloadType<CompanyModel>;
export type ConfigPayloadModel = PayloadType<ConfigModel>;
export type CountryPayloadModel = PayloadType<CountryModel>;
export type CurrencyPayloadModel = PayloadType<CurrencyModel>;
export type LanguagePayloadModel = PayloadType<LanguageModel>;
export type ManufacturerPayloadModel = PayloadType<ManufacturerModel>;
export type MetricPayloadModel = PayloadType<MetricModel>;
export type OptionsGroupPayloadModel = PayloadType<OptionsGroupModel>;
export type ProductPayloadModel = PayloadType<ProductModel>;
export type RubricVariantPayloadModel = PayloadType<RubricVariantModel>;
export type RubricPayloadModel = PayloadType<RubricModel>;
export type ShopProductPayloadModel = PayloadType<ShopProductModel>;
export type ShopPayloadModel = PayloadType<ShopModel>;
export type UserPayloadModel = PayloadType<UserModel>;
export type OrderPayloadModel = PayloadType<OrderModel>;
export type RolePayloadModel = PayloadType<RoleModel>;
export interface MakeAnOrderPayloadModel {
  success: boolean;
  message: string;
  order?: OrderModel;
}

export interface CartPayloadModel {
  success: boolean;
  message: string;
}

// Lists payload
export type ManufacturersAlphabetListModel = AlphabetListModelType<ManufacturerModel>;
export type BrandsAlphabetListModel = AlphabetListModelType<BrandModel>;
export type BrandCollectionsAlphabetListModel = AlphabetListModelType<BrandCollectionModel>;

// Pagination payload
export type BrandsPaginationPayloadModel = PaginationPayloadType<BrandModel>;
export type BrandCollectionsPaginationPayloadModel = PaginationPayloadType<BrandCollectionModel>;
export type CitiesPaginationPayloadModel = PaginationPayloadType<CityModel>;
export type CompaniesPaginationPayloadModel = PaginationPayloadType<CompanyModel>;
export type ManufacturersPaginationPayloadModel = PaginationPayloadType<ManufacturerModel>;
export type MetricsPaginationPayloadModel = PaginationPayloadType<MetricModel>;
export type ShopProductsPaginationPayloadModel = PaginationPayloadType<ShopProductModel>;
export type ShopsPaginationPayloadModel = PaginationPayloadType<ShopModel>;
export type UsersPaginationPayloadModel = PaginationPayloadType<UserModel>;
export type OrdersPaginationPayloadModel = PaginationPayloadType<OrderModel>;
export interface ProductsPaginationPayloadModel {
  sortBy: string;
  sortDir: SortDirectionModel;
  totalDocs: number;
  totalActiveDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  docs: ProductModel[];
}

// Catalogue
export interface CatalogueSearchResultModel {
  rubrics: RubricModel[];
  products: ProductModel[];
}

export interface CatalogueFilterAttributeOptionModel {
  _id: ObjectIdModel;
  slug: string;
  name: string;
  nextSlug: string;
  isSelected: boolean;
}

export interface CatalogueFilterAttributeModel {
  _id: ObjectIdModel;
  clearSlug: string;
  slug: string;
  name: string;
  metric?: string | null;
  isSelected: boolean;
  options: CatalogueFilterAttributeOptionModel[];
  viewVariant: AttributeViewVariantModel;
}

export type CatalogueProductInterface = Omit<ProductModel, 'attributes'>;

export interface CatalogueDataInterface {
  _id: ObjectIdModel;
  clearSlug: string;
  filter: string[];
  rubricName: string;
  rubricSlug: string;
  products: CatalogueProductInterface[];
  totalProducts: number;
  catalogueTitle: string;
  attributes: CatalogueFilterAttributeModel[];
  selectedAttributes: CatalogueFilterAttributeModel[];
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
  options: CatalogueProductOptionInterface[];
  docs: ProductModel[];
}

export interface ProductsPaginationAggregationInterface {
  docs: ProductFacetModel[];
  totalDocs?: number | null;
  totalActiveDocs?: number | null;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}
