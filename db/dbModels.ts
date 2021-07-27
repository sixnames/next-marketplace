import { ObjectId } from 'mongodb';
import { IconType } from 'types/iconTypes';

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
  plural = 'plural',
}

export interface SelectOptionModel {
  _id: string;
  name: string;
  icon?: string;
}

export interface MapMarkerModel {
  lightTheme?: string | null;
  darkTheme?: string | null;
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
  excludedOptionsSlugs?: string[] | null;
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
  attributesGroupId?: ObjectIdModel | null;
  nameI18n: TranslationModel;
  variant: AttributeVariantModel;
  viewVariant: AttributeViewVariantModel;
  optionsGroupId?: ObjectIdModel | null;
  metric?: MetricModel | null;
  positioningInTitle?: AttributePositioningInTitleModel | null;
  capitalise?: boolean | null;
  showInCard: boolean;
  showAsBreadcrumb: boolean;
  showAsCatalogueBreadcrumb?: boolean | null;
  showInSnippet?: boolean | null;
  notShowAsAlphabet?: boolean | null;
}

export interface AttributesGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  attributesIds: ObjectIdModel[];
}

export interface BrandModel extends BaseModel, TimestampModel, CountersModel {
  slug: string;
  url?: URLModel[] | null;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
}

export interface BrandCollectionModel extends BaseModel, TimestampModel, CountersModel {
  slug: string;
  nameI18n: TranslationModel;
  brandSlug: string;
  brandId: ObjectIdModel;
  descriptionI18n?: TranslationModel | null;
}

export interface ManufacturerModel extends BaseModel, TimestampModel, CountersModel {
  nameI18n: TranslationModel;
  slug: string;
  url?: URLModel[] | null;
  descriptionI18n?: TranslationModel | null;
}

export interface SupplierModel extends BaseModel, TimestampModel {
  nameI18n: TranslationModel;
  slug: string;
  url?: URLModel[] | null;
  descriptionI18n?: TranslationModel | null;
}

export interface CartProductModel {
  _id: ObjectIdModel;
  shopProductId?: ObjectIdModel | null;
  productId: ObjectIdModel;
  amount: number;
}

export interface CartModel extends TimestampModel {
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
  domain?: string | null;
}

export enum ConfigVariantModel {
  string = 'string',
  number = 'number',
  email = 'email',
  tel = 'tel',
  asset = 'asset',
  boolean = 'boolean',
  color = 'color',
  constructor = 'constructor',
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

export interface MessageBase {
  slug: string;
  messageI18n: TranslationModel;
}

export interface MessageModel extends MessageBase {
  _id: ObjectIdModel;
  messagesGroupId: ObjectIdModel;
}

export interface MessagesGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
}

export interface MetricModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
}

export interface NavItemModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;
  path: string;
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
  optionsGroupId: ObjectIdModel;
  parentId?: ObjectIdModel | null;

  options?: OptionModel[] | null;
  level?: number | null;
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
  index: number;
}

// Order log variant
export enum OrderLogVariantModel {
  status = 'status',
  confirm = 'confirm',
}

export interface OrderLogModel {
  _id: ObjectIdModel;
  variant: OrderLogVariantModel;
  userId: ObjectIdModel;
  orderId: ObjectIdModel;
  prevStatusId?: ObjectIdModel | null;
  statusId: ObjectIdModel;
  createdAt: DateModel;
}

export interface OrderProductModel extends TimestampModel {
  _id: ObjectIdModel;
  itemId: string;
  price: number;
  amount: number;
  totalPrice: number;
  slug: string;
  originalName: string;
  nameI18n?: TranslationModel | null;
  productId: ObjectIdModel;
  customerId: ObjectIdModel;
  shopProductId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  orderId: ObjectIdModel;
  statusId: ObjectIdModel;
  barcode?: string | null;
}

export interface OrderCustomerModel extends TimestampModel {
  _id: ObjectIdModel;
  userId: ObjectIdModel;
  itemId: string;
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
  orderId: ObjectIdModel;
}

export interface OrderModel extends TimestampModel, BaseModel {
  orderId: string;
  statusId: ObjectIdModel;
  comment?: string | null;
  customerId: ObjectIdModel;
  companySiteSlug: string;
  productIds: ObjectIdModel[];
  shopProductIds: ObjectIdModel[];
  shopId: ObjectIdModel;
  shopItemId: string;
  companyId: ObjectIdModel;
  companyItemId: string;
  reservationDate?: DateModel | null;
}

export interface ProductConnectionItemModel {
  _id: ObjectIdModel;
  optionId: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  connectionId: ObjectIdModel;
}

export interface ProductConnectionModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  productsIds: ObjectIdModel[];
}

export interface ProductAttributeModel extends AttributeModel, CountersModel {
  _id: ObjectIdModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  productSlug: string;
  productId: ObjectIdModel;
  attributeId: ObjectIdModel;
  selectedOptionsSlugs: string[];
  selectedOptionsIds: ObjectIdModel[];
  textI18n?: TranslationModel | null;
  number?: number | null;
}

export interface ProductModel extends BaseModel, TimestampModel {
  active: boolean;
  slug: string;
  originalName: string;
  nameI18n?: TranslationModel | null;
  descriptionI18n: TranslationModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  mainImage: string;
  supplierSlug?: string | null;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  selectedOptionsSlugs: string[];
  selectedAttributesIds: ObjectId[];
  barcode?: string[] | null;

  // types for aggregation
  shopsCount?: number;
  cardPrices?: ProductCardPricesModel;
}

export interface ProductAssetsModel {
  _id: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  assets: AssetModel[];
}

export interface ProductCardContentModel {
  _id: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  content: string;
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

export interface CatalogueBreadcrumbModel {
  _id: ObjectIdModel;
  name: string;
  href: string;
}

export interface RoleRuleBase {
  slug: string;
  allow: boolean;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel;
}

export interface RoleRuleModel extends RoleRuleBase {
  _id: ObjectIdModel;
  roleId: ObjectIdModel;
}

export interface RoleModel extends TimestampModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  slug: string;
  isStaff: boolean;
  isCompanyStaff?: boolean;
  allowedAppNavigation: string[];
}

export interface RubricVariantModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
}

export interface RubricOptionModel extends OptionModel, CountersModel {
  options?: RubricOptionModel[] | null;
}

export interface RubricAttributeModel extends AttributeModel, CountersModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  showInCatalogueFilter: boolean;
  showInCatalogueNav: boolean;
  showInProductAttributes: boolean;
}

export interface RubricAttributesGroupModel extends AttributesGroupModel {
  attributes?: RubricAttributeModel[] | null;
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
  attributesGroupsIds: ObjectIdModel[];
  variantId: ObjectIdModel;
}

export interface ShopProductModel extends TimestampModel, CountersModel {
  _id: ObjectIdModel;
  active: boolean;
  available: number;
  citySlug: string;
  price: number;
  formattedPrice: string;
  formattedOldPrice: string;
  discountedPercent: number;
  itemId: string;
  slug: string;
  originalName: string;
  nameI18n?: TranslationModel | null;
  descriptionI18n: TranslationModel;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  oldPrices: ShopProductOldPriceModel[];
  productId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  selectedOptionsSlugs: string[];
  mainImage: string;
  barcode?: string | null;
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
  token?: string | null;
  rating?: number | null;
  mapMarker?: MapMarkerModel | null;
  license?: string | null;
}

export interface NotSyncedProductModel {
  _id: ObjectIdModel;
  name: string;
  price: number;
  available: number;
  barcode: string;
  shopId: ObjectIdModel;
  createdAt: DateModel;
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
}

// Pages
export interface PagesGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  index: number;
  companySlug: string;
  showInFooter: boolean;
  showInHeader: boolean;
}

// Page state enum
export enum PageStateModel {
  draft = 'draft',
  published = 'published',
}

export interface PageModel extends TimestampModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  index: number;
  slug: string;
  citySlug: string;
  assetKeys: string[];
  pagesGroupId: ObjectIdModel;
  content: string;
  state: PageStateModel;
  companySlug: string;
  pageScreenshot?: AssetModel | null;
  mainBanner?: AssetModel | null;
  mainBannerMobile?: AssetModel | null;
  showAsMainBanner?: boolean | null;
  mainBannerTextColor?: string | null;
  mainBannerVerticalTextAlign?: string | null;
  mainBannerHorizontalTextAlign?: string | null;
  mainBannerTextAlign?: string | null;
  mainBannerTextPadding?: number | null;
  mainBannerTextMaxWidth?: number | null;
  secondaryBanner?: AssetModel | null;
  showAsSecondaryBanner?: boolean | null;
  secondaryBannerTextColor?: string | null;
  secondaryBannerVerticalTextAlign?: string | null;
  secondaryBannerHorizontalTextAlign?: string | null;
  secondaryBannerTextAlign?: string | null;
  secondaryBannerTextPadding?: number | null;
  secondaryBannerTextMaxWidth?: number | null;
}

export type PagesGroupTemplateModel = PagesGroupModel;
export type PagesTemplateModel = PageModel;

// Payload
export type AttributesGroupPayloadModel = PayloadType<AttributesGroupModel>;
export type BrandPayloadModel = PayloadType<BrandModel>;
export type CompanyPayloadModel = PayloadType<CompanyModel>;
export type ConfigPayloadModel = PayloadType<ConfigModel>;
export type CountryPayloadModel = PayloadType<CountryModel>;
export type CurrencyPayloadModel = PayloadType<CurrencyModel>;
export type LanguagePayloadModel = PayloadType<LanguageModel>;
export type ManufacturerPayloadModel = PayloadType<ManufacturerModel>;
export type SupplierPayloadModel = PayloadType<SupplierModel>;
export type MetricPayloadModel = PayloadType<MetricModel>;
export type OrderStatusPayloadModel = PayloadType<OrderStatusModel>;
export type OptionsGroupPayloadModel = PayloadType<OptionsGroupModel>;
export type ProductPayloadModel = PayloadType<ProductModel>;
export type RubricVariantPayloadModel = PayloadType<RubricVariantModel>;
export type RubricPayloadModel = PayloadType<RubricModel>;
export type ShopProductPayloadModel = PayloadType<ShopProductModel>;
export type ShopPayloadModel = PayloadType<ShopModel>;
export type UserPayloadModel = PayloadType<UserModel>;
export type RolePayloadModel = PayloadType<RoleModel>;
export type NavItemPayloadModel = PayloadType<NavItemModel>;
export type RoleRulePayloadModel = PayloadType<RoleRuleModel>;
export type PagesGroupPayloadModel = PayloadType<PagesGroupModel>;
export type PagePayloadModel = PayloadType<PageModel>;
export type OrderPayloadModel = PayloadType<OrderModel>;
export interface MakeAnOrderPayloadModel {
  success: boolean;
  message: string;
}

export interface CartPayloadModel {
  success: boolean;
  message: string;
}

// Lists payload
export type ManufacturersAlphabetListModel = AlphabetListModelType<ManufacturerModel>;
export type SuppliersAlphabetListModel = AlphabetListModelType<SupplierModel>;
export type BrandsAlphabetListModel = AlphabetListModelType<BrandModel>;
export type BrandCollectionsAlphabetListModel = AlphabetListModelType<BrandCollectionModel>;
export type OptionAlphabetListModel = AlphabetListModelType<OptionModel>;

// Pagination payload
export type BrandsPaginationPayloadModel = PaginationPayloadType<BrandModel>;
export type BrandCollectionsPaginationPayloadModel = PaginationPayloadType<BrandCollectionModel>;
export type CitiesPaginationPayloadModel = PaginationPayloadType<CityModel>;
export type CompaniesPaginationPayloadModel = PaginationPayloadType<CompanyModel>;
export type ManufacturersPaginationPayloadModel = PaginationPayloadType<ManufacturerModel>;
export type SuppliersPaginationPayloadModel = PaginationPayloadType<SupplierModel>;
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
