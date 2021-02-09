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

export type StoreFileFormat = 'jpg' | 'png' | 'svg' | 'webp';
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
}

export interface ContactsModel {
  emails: EmailAddressModel[];
  phones: PhoneNumberModel[];
}

export interface AssetModel {
  url: string;
  index: number;
}

/*export interface CoordinatesInputModel {
  lat: number;
  lng: number;
}

export interface AddressInputModel {
  formattedAddress: string;
  point: CoordinatesInputModel;
}*/

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
  rubricsIds?: ObjectIdModel[] | null;
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
  [key: string]: number;
}

export interface CountersModel {
  views: CountersItemModel;
  priorities: CountersItemModel;
}

export interface AttributeModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  variant: AttributeVariantModel;
  viewVariant: AttributeViewVariantModel;
  optionsGroupId?: ObjectIdModel | null;
  options: OptionModel[];
  metric?: MetricModel | null;
  positioningInTitle?: AttributePositioningInTitleModel | null;
}

export interface AttributesGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  attributesIds: ObjectIdModel[];
}

export interface BrandModel extends BaseModel, TimestampModel {
  slug: string;
  url?: URLModel[] | null;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  collectionsIds: ObjectIdModel[];
}

export interface BrandCollectionModel extends BaseModel, TimestampModel {
  slug: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
}

export interface CartProductModel {
  _id: ObjectIdModel;
  shopProductId?: ObjectIdModel | null;
  productId?: ObjectIdModel | null;
  amount: number;
}

export interface CartModel {
  _id: ObjectIdModel;
  cartProducts: CartProductModel[];
}

export interface CityModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;
}

export interface CompanyModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  logo: AssetModel;
  ownerId: ObjectIdModel;
  staffIds: ObjectIdModel[];
  contacts: ContactsModel;
  shopsIds: ObjectIdModel[];
  archive: boolean;
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
  name: string;
  description?: string | null;
  variant: ConfigVariantModel;
  cities: ConfigCitiesModel;
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

export interface ManufacturerModel extends BaseModel, TimestampModel {
  nameI18n: TranslationModel;
  slug: string;
  url?: URLModel[] | null;
  descriptionI18n?: TranslationModel | null;
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
}

export interface OptionVariantsModel {
  [key: string]: TranslationModel;
}

export interface OptionModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
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

export interface OrderLogModel extends TimestampModel {
  _id: ObjectIdModel;
  variant: OrderLogVariantModel;
  userId: ObjectIdModel;
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
  archive: boolean;
}

export interface ProductConnectionItemModel {
  _id: ObjectIdModel;
  value: string;
  product: ProductModel;
}

export interface ProductConnectionModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  attributesGroupId: ObjectIdModel;
  productsIds: ObjectIdModel[];
}

export interface ProductAttributeModel {
  showInCard: boolean;
  showAsBreadcrumb: boolean;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  selectedOptionsSlugs: string[];
  attributeSlugs: string[];
  textI18n?: TranslationModel | null;
  number?: number | null;
}

export interface CitiesCounterModel {
  [key: string]: number;
}

export interface CitiesBooleanModel {
  [key: string]: boolean;
}

export interface ProductModel extends BaseModel, TimestampModel, CountersModel {
  active: boolean;
  slug: string;
  originalName: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  rubricsIds: ObjectIdModel[];
  attributes: ProductAttributeModel[];
  assets: AssetModel[];
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  archive: boolean;
  selectedOptionsSlugs: string[];
  shopProductsIds: ObjectIdModel[];
  shopProductsCountCities: CitiesCounterModel;
  minPriceCities: CitiesCounterModel;
  maxPriceCities: CitiesCounterModel;
}

export interface ProductCardPricesModel {
  min: string;
  max: string;
}

export interface ProductCardFeaturesModel {
  _id: ObjectIdModel;
  listFeatures: ProductAttributeModel[];
  textFeatures: ProductAttributeModel[];
  tagFeatures: ProductAttributeModel[];
  iconFeatures: ProductAttributeModel[];
  ratingFeatures: ProductAttributeModel[];
}

export interface ProductSnippetFeaturesModel {
  _id: ObjectIdModel;
  listFeaturesString: string;
  ratingFeaturesValues: string[];
}

export interface ProductCardConnectionItemModel {
  _id: ObjectIdModel;
  value: string;
  product: ProductModel;
  isCurrent: boolean;
}

export interface ProductCardConnectionModel {
  _id: ObjectIdModel;
  name: string;
  productsIds: ObjectIdModel[];
  attributeId: ObjectIdModel;
  connectionProducts: ProductCardConnectionItemModel[];
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
  nameI18n: TranslationModel;
  description?: string | null;
  slug: string;
  isStuff: boolean;
}

export interface RoleModel extends RoleBase, TimestampModel {
  _id: ObjectIdModel;
  rules: RoleRuleModel[];
  allowedAppNavigation: ObjectIdModel[];
}

export interface RubricVariantModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
}

export interface RubricCountersInterface {
  productsCount: number;
  activeProductsCount: number;
  shopProductsCountCities: CitiesCounterModel;
  visibleInCatalogueCities: CitiesBooleanModel;
}

export interface RubricOptionModel extends OptionModel, CountersModel, RubricCountersInterface {
  options: RubricOptionModel[];
}

export interface RubricAttributeModel extends AttributeModel, CountersModel {
  _id: ObjectIdModel;
  showInCatalogueFilter: boolean;
  showInCatalogueNav: boolean;
  options: RubricOptionModel[];
  visibleInCatalogueCities: CitiesBooleanModel;
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

export interface RubricModel extends CountersModel, RubricCountersInterface {
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
}

export interface ShopProductModel extends TimestampModel {
  _id: ObjectIdModel;
  available: number;
  citySlug: string;
  price: number;
  oldPrices: ShopProductOldPriceModel[];
  productId: ObjectIdModel;
  shopId: ObjectIdModel;
  archive: boolean;
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
  shopProductsIds: ObjectIdModel[];
  archive: boolean;
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
  archive: boolean;
}

// Payload
export type AttributesGroupPayloadModel = PayloadType<AttributesGroupModel>;
export type BrandPayloadModel = PayloadType<BrandModel>;
export type CartPayloadModel = PayloadType<CartModel>;
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
  cart?: CartModel;
  order?: OrderModel;
}

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
  minPrice: number;
  maxPrice: number;
  docs: ProductModel[];
}

// Catalogue
export interface CatalogueSearchResultModel {
  rubrics: RubricModel[];
  products: ProductModel[];
}

export interface CatalogueFilterSelectedPricesModel {
  _id: ObjectIdModel;
  clearSlug: string;
  formattedMinPrice: string;
  formattedMaxPrice: string;
}

export interface CatalogueFilterAttributeOptionModel {
  _id: ObjectIdModel;
  slug: string;
  name: string;
  counter: number;
  nextSlug: string;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface CatalogueFilterAttributeModel {
  _id: ObjectIdModel;
  clearSlug: string;
  slug: string;
  name: string;
  isSelected: boolean;
  isDisabled: boolean;
  options: CatalogueFilterAttributeOptionModel[];
}

export interface CatalogueFilterModel {
  _id: ObjectIdModel;
  attributes: CatalogueFilterAttributeModel[];
  selectedAttributes: CatalogueFilterAttributeModel[];
  selectedPrices?: CatalogueFilterSelectedPricesModel | null;
  clearSlug: string;
}

export interface CatalogueDataModel {
  _id: ObjectIdModel;
  rubric: RubricModel;
  products: ProductsPaginationPayloadModel;
  catalogueFilter: CatalogueFilterModel;
  catalogueTitle: string;
}
