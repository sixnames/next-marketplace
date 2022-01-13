import { ObjectId } from 'mongodb';
import { GEO_POINT_TYPE } from '../config/common';
import { IconType } from '../types/iconTypes';
import {
  BarcodeDoublesInterface,
  RubricInterface,
  ShopProductBarcodeDoublesInterface,
} from './uiInterfaces';

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
  singular = 'singular',
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
  statusCode?: number | null;
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
  type: typeof GEO_POINT_TYPE;

  // Coordinates that specifies the object’s coordinates.
  // If specifying latitude and longitude coordinates,
  // list the longitude first and then latitude.
  coordinates: number[];
}

export interface CoordinatesModel {
  lat: number;
  lng: number;
}

export interface AddressComponentModel {
  // types as Array<AddressType | GeocodingAddressComponentType>
  types: string[];
  longName: string;
  shortName: string;
}

export interface AddressModel {
  addressComponents: AddressComponentModel[];
  readableAddress: string;
  formattedAddress: string;
  point: PointGeoJSONModel;
  mapCoordinates: CoordinatesModel;
}

export interface ContactsModel {
  emails: EmailAddressModel[];
  phones: PhoneNumberModel[];
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

export interface IconModel {
  _id: ObjectIdModel;
  collectionName: string;
  documentId: ObjectIdModel;
  icon: string;
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
  priorities?: CountersItemModel;
}
export interface AttributeCountersItemModel {
  [key: string]: any;
}

export interface AttributeCountersModel {
  views?: AttributeCountersItemModel;
  priorities?: AttributeCountersItemModel;
}

export interface AttributeModel extends AttributeCountersModel {
  _id: ObjectIdModel;
  slug: string;
  attributesGroupId: ObjectIdModel;
  nameI18n: TranslationModel;
  optionsGroupId?: ObjectIdModel | null;
  metric?: MetricModel | null;
  capitalise?: boolean | null;

  // variants
  variant: AttributeVariantModel;
  viewVariant: AttributeViewVariantModel;

  // positioning in title
  positioningInTitle?: AttributePositioningInTitleModel | null;
  positioningInCardTitle?: AttributePositioningInTitleModel | null;

  // breadcrumbs
  showAsBreadcrumb: boolean;
  showAsCatalogueBreadcrumb?: boolean | null;

  // options modal
  notShowAsAlphabet?: boolean | null;

  // card / snippet visibility
  showInSnippet?: boolean | null;
  showInCard: boolean;
  showInCatalogueFilter: boolean;
  showInCatalogueNav: boolean;
  showInCatalogueTitle: boolean;
  showInCardTitle: boolean;
  showInSnippetTitle: boolean;

  // name visibility
  showNameInTitle?: boolean | null;
  showNameInSelectedAttributes?: boolean | null;
  showNameInCardTitle?: boolean | null;
  showNameInSnippetTitle?: boolean | null;

  // catalogue ui
  showAsLinkInFilter?: boolean | null;
  showAsAccordionInFilter?: boolean | null;
}

export interface AttributesGroupModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  attributesIds: ObjectIdModel[];
}

export interface BrandBaseModel {
  // breadcrumbs
  showAsBreadcrumb?: boolean | null;
  showAsCatalogueBreadcrumb?: boolean | null;

  // titles
  showInCardTitle?: boolean | null;
  showInSnippetTitle?: boolean | null;
  showInCatalogueTitle?: boolean | null;
}

export interface BrandModel extends BaseModel, TimestampModel, CountersModel, BrandBaseModel {
  url?: URLModel[] | null;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  logo?: string;
}

export interface BrandCollectionModel
  extends BaseModel,
    TimestampModel,
    CountersModel,
    BrandBaseModel {
  nameI18n: TranslationModel;
  brandSlug: string;
  brandId: ObjectIdModel;
  descriptionI18n?: TranslationModel | null;
}

export interface ManufacturerModel extends BaseModel, TimestampModel, CountersModel {
  nameI18n: TranslationModel;
  url?: URLModel[] | null;
  descriptionI18n?: TranslationModel | null;
}

export interface SupplierModel extends BaseModel, TimestampModel {
  nameI18n: TranslationModel;
  url?: URLModel[] | null;
  descriptionI18n?: TranslationModel | null;
}

export enum SupplierPriceVariantModel {
  discount = 'discount',
  charge = 'charge',
}

export interface SupplierProductModel {
  _id: ObjectIdModel;
  supplierId: ObjectIdModel;
  shopProductId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  variant: SupplierPriceVariantModel;
  price: number;
  percent: number;
}

export interface CartProductModel {
  _id: ObjectIdModel;
  shopProductId?: ObjectIdModel | null;
  productId: ObjectIdModel;
  amount: number;
  allowDelivery: boolean;
}

export type CartProductsFieldNameType = 'cartDeliveryProducts' | 'cartBookingProducts';

export interface CartModel extends TimestampModel {
  _id: ObjectIdModel;
  giftCertificateIds?: ObjectIdModel[] | null;
  cartDeliveryProducts: CartProductModel[];
  cartBookingProducts: CartProductModel[];
}

export interface CompanyModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  logo: string;
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
  address = 'address',
  password = 'password',
  categoriesTree = 'categoriesTree',
  rubrics = 'rubrics',
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
  currency: string;
}

export interface CurrencyModel {
  _id: ObjectIdModel;
  name: string;
}

export interface CityModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;
  currency: string;
  countryId: ObjectIdModel;
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

export interface OptionModel extends CountersModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  variants: OptionVariantsModel;
  gender?: GenderModel | null;
  color?: string | null;
  optionsGroupId: ObjectIdModel;
  parentId?: ObjectIdModel | null;
  image?: string | null;

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
  isNew: boolean;
  isConfirmed: boolean;
  isPayed: boolean;
  isDone: boolean;
  isCancelationRequest: boolean;
  isCanceled: boolean;
}

export interface OrderLogDiffModel {
  added: Record<string, any>;
  deleted: Record<string, any>;
  updated: Record<string, any>;
}

export interface OrderLogUserModel {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
}

export interface OrderLogModel {
  _id: ObjectIdModel;
  userId: ObjectIdModel;
  logUser: OrderLogUserModel;
  orderId: ObjectIdModel;
  createdAt: DateModel;
  diff: OrderLogDiffModel;
}

export interface OrderProductModel extends TimestampModel {
  _id: ObjectIdModel;
  itemId: string;
  price: number;
  amount: number;
  finalPrice: number;
  customDiscount?: number | null;
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
  allowDelivery: boolean;
  barcode?: string[] | null;
  isCanceled?: boolean | null;
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

export enum OrderRequestVariantModel {
  cancelation = 'cancelation',
}

export enum OrderRequestStateModel {
  new = 'new',
  confirmed = 'confirmed',
  canceled = 'canceled',
}

export interface OrderRequestModel extends TimestampModel {
  _id: ObjectIdModel;
  state: OrderRequestStateModel;
  variant: OrderRequestVariantModel;
  nameI18n: TranslationModel;
  userId: ObjectIdModel;
  confirmedById?: ObjectIdModel | null;
  canceledById?: ObjectIdModel | null;
}

export enum OrderDeliveryVariantModel {
  pickup = 'pickup',
  courier = 'courier',
}

export enum OrderPaymentVariantModel {
  receipt = 'receipt',
}

export interface OrderDeliveryInfoModel {
  address?: AddressModel | null;
  entrance?: number | null;
  intercom?: string | null;
  floor?: number | null;
  apartment?: string | null;
  commentForCourier?: string | null;
  recipientName?: string | null;
  recipientPhone?: string | null;
  desiredDeliveryDate?: DateModel | null;
}

export interface OrderModel extends TimestampModel, BaseModel {
  orderId: string;
  statusId: ObjectIdModel;
  comment?: string | null;
  customerId: ObjectIdModel;
  companySiteSlug: string;
  companySiteItemId: string;
  productIds: ObjectIdModel[];
  shopProductIds: ObjectIdModel[];
  totalPrice: number;
  discountedPrice: number;
  shopId: ObjectIdModel;
  shopItemId: string;
  companyId: ObjectIdModel;
  companyItemId: string;
  allowDelivery: boolean;
  deliveryVariant: OrderDeliveryVariantModel;
  paymentVariant: OrderPaymentVariantModel;
  reservationDate?: DateModel | null;
  deliveryInfo?: OrderDeliveryInfoModel | null;
  isCanceled?: boolean;
  requests?: OrderRequestModel[] | null;
  promoId?: ObjectIdModel;
  giftCertificateId?: ObjectIdModel | null;
  giftCertificateChargedValue?: number | null;
}

export interface ProductVariantItemModel {
  _id: ObjectIdModel;
  optionId: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
}

export interface ProductVariantModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  products: ProductVariantItemModel[];
}

export interface ProductSummaryAttributeModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  filterSlugs: string[];
  optionIds: ObjectIdModel[];
  textI18n?: TranslationModel | null;
  number?: number | null;
  readableValueI18n: TranslationModel;
}

interface ProductMainFieldsInterface {
  rubricId: ObjectIdModel;
  rubricSlug: string;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  filterSlugs: string[];
  barcode?: string[] | null;
  allowDelivery: boolean;
  mainImage: string;
}

export interface ProductFacetModel extends ProductMainFieldsInterface, BaseModel {
  slug: string;
  active: boolean;
  attributeIds: ObjectIdModel[];
}

export interface ProductSummaryModel extends ProductFacetModel, TimestampModel {
  originalName: string;
  nameI18n?: TranslationModel | null;
  descriptionI18n?: TranslationModel | null;
  gender: GenderModel;
  snippetTitleI18n: TranslationModel;
  cardTitleI18n: TranslationModel;
  assets: string[];
  attributes: ProductSummaryAttributeModel[];
  titleCategorySlugs: string[];
  variants: ProductVariantModel[];
  videos?: string[];
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
  descriptionI18n?: TranslationModel | null;
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
  showAdminUiInCatalogue?: boolean;
  allowedAppNavigation: string[];
}

export interface RubricVariantModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  slug: string;
  companySlug: string;

  // layouts
  cardLayout?: string | null;
  gridSnippetLayout?: string | null;
  rowSnippetLayout?: string | null;
  catalogueFilterLayout?: string | null;
  catalogueHeadLayout?: string | null;
  catalogueNavLayout?: string | null;

  // booleans
  showSnippetConnections?: boolean | null;
  showSnippetBackground?: boolean | null;
  showSnippetArticle?: boolean | null;
  showCardArticle?: boolean | null;
  showSnippetRating?: boolean | null;
  showSnippetButtonsOnHover?: boolean | null;
  showCardButtonsBackground?: boolean | null;
  showCardImagesSlider?: boolean | null;
  showCardBrands?: boolean | null;
  showCatalogueFilterBrands?: boolean | null;
  showCategoriesInFilter?: boolean | null;
  showCategoriesInNav?: boolean | null;
  allowDelivery?: boolean | null;

  // numbers
  gridCatalogueColumns?: number | null;
  navCategoryColumns?: number | null;

  // strings
  cardBrandsLabelI18n?: TranslationModel | null;
}

export interface RubricModel extends CountersModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  shortDescriptionI18n: TranslationModel;
  defaultTitleI18n: TranslationModel;
  prefixI18n?: TranslationModel | null;
  keywordI18n: TranslationModel;
  gender: GenderModel;
  slug: string;
  active: boolean;
  variantId: ObjectIdModel;
  capitalise?: boolean | null;
  attributesGroupIds: ObjectIdModel[];
  filterVisibleAttributeIds: ObjectIdModel[];
  showRubricNameInProductTitle?: boolean | null;
  showCategoryInProductTitle?: boolean | null;
  showBrandInNav?: boolean | null;
  showBrandInFilter?: boolean | null;
  showBrandAsAlphabet?: boolean | null;
  icon?: string;
  image?: string;
}

export type DescriptionPositionType = 'top' | 'bottom';

export interface CategoryModel extends CountersModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  gender?: GenderModel | null;
  parentTreeIds: ObjectIdModel[];
  attributesGroupIds: ObjectIdModel[];
  rubricId: ObjectIdModel;
  rubricSlug: string;
  parentId?: ObjectIdModel | null;
  image?: string | null;
  variants: OptionVariantsModel;
  replaceParentNameInCatalogueTitle?: boolean | null;
}

export interface SeoContentModel {
  _id: ObjectIdModel;
  slug: string;
  companySlug: string;
  rubricSlug: string;
  url: string;
  content: string;
  showForIndex?: boolean | null;
  titleI18n?: TranslationModel | null;
  metaTitleI18n?: TranslationModel | null;
  metaDescriptionI18n?: TranslationModel | null;
  seoLocales?: TextUniquenessApiParsedResponseModel[] | null;
}

export interface ShopProductModel
  extends ProductMainFieldsInterface,
    TimestampModel,
    CountersModel {
  _id: ObjectIdModel;
  available: number;
  citySlug: string;
  price: number;
  oldPrice?: number | null;
  oldPrices: ShopProductOldPriceModel[];
  discountedPercent: number;
  itemId: string;
  productId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  companySlug: string;
  shopProductUid?: string | null;
  useCategoryDiscount?: boolean | null;
  useCategoryCashback?: boolean | null;
  useCategoryPayFromCashback?: boolean | null;
}

export interface ShopModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  citySlug: string;
  logo: string;
  assets: string[];
  contacts: ContactsModel;
  address: AddressModel;
  companyId: ObjectIdModel;
  companySlug: string;
  mainImage: string;
  token?: string | null;
  rating?: number | null;
  mapMarker?: MapMarkerModel | null;
  license?: string | null;
  priceWarningI18n?: TranslationModel | null;
}

export interface NotSyncedProductModel {
  _id: ObjectIdModel;
  name: string;
  price: number;
  available: number;
  barcode: string[];
  shopId: ObjectIdModel;
  createdAt: DateModel;
}

// User
export interface NotificationConfigModel {
  nameI18n: TranslationModel;
  group: string;
  sms?: boolean | null;
  email?: boolean | null;
}

export interface UserNotificationsModel {
  // customer
  newOrder?: NotificationConfigModel | null;
  confirmedOrder?: NotificationConfigModel | null;
  canceledOrder?: NotificationConfigModel | null;
  canceledOrderProduct?: NotificationConfigModel | null;

  // admin
  adminNewOrder?: NotificationConfigModel | null;
  adminConfirmedOrder?: NotificationConfigModel | null;
  adminCanceledOrder?: NotificationConfigModel | null;
  adminCanceledOrderProduct?: NotificationConfigModel | null;

  // company
  companyNewOrder?: NotificationConfigModel | null;
  companyConfirmedOrder?: NotificationConfigModel | null;
  companyCanceledOrder?: NotificationConfigModel | null;
  companyCanceledOrderProduct?: NotificationConfigModel | null;
}

export interface UserCashbackModel {
  _id: ObjectIdModel;
  companyId: ObjectIdModel;
  value: number;
}

export interface UserPaybackModel extends UserCashbackModel {}

export interface UserModel extends BaseModel, TimestampModel {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
  password: string;
  avatar?: string | null;
  roleId: ObjectIdModel;
  cartId?: ObjectIdModel | null;
  notifications: UserNotificationsModel;
  categoryIds: ObjectIdModel[];
  cashback?: UserCashbackModel[] | null;
  payback?: UserPaybackModel[] | null;
}

export interface UserCategoryModel extends TimestampModel {
  _id: ObjectIdModel;
  companyId: ObjectIdModel;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel;
  discountPercent: number;
  cashbackPercent: number;
  payFromCashbackPercent: number;
  entryMinCharge?: number | null;
  // addCashbackIfPayFromCashback: boolean;
}

export interface UserCashbackLogModel extends TimestampModel {
  _id: ObjectIdModel;
  userId: ObjectIdModel;
  orderId?: ObjectIdModel;
  creatorId?: ObjectIdModel;
  companyId: ObjectIdModel;
  variant: 'add' | 'subtract';
  descriptionI18n?: TranslationModel;
  value: number; // - / +
  currency: string;
}

export interface UserPaybackLogModel extends UserCashbackLogModel {}

export interface GiftCertificateLogModel {
  orderId: ObjectIdModel;
  value: number;
}

export interface GiftCertificateModel extends TimestampModel {
  _id: ObjectIdModel;
  code: string;
  userId?: ObjectIdModel | null;
  companyId: ObjectIdModel;
  companySlug: string;
  initialValue: number;
  value: number;
  nameI18n?: TranslationModel;
  descriptionI18n?: TranslationModel;
  log: GiftCertificateLogModel[];
}

export interface PromoBaseInterface {
  companyId: ObjectIdModel;
  companySlug: string;

  // discount
  discountPercent: number;
  addCategoryDiscount: boolean;
  useBiggestDiscount: boolean;

  // cashback
  cashbackPercent: number;
  addCategoryCashback: boolean;
  useBiggestCashback: boolean;
  allowPayFromCashback: boolean;

  // dates
  startAt: DateModel;
  endAt: DateModel;
}

// Promo
export interface PromoModel extends TimestampModel, PromoBaseInterface {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;

  // ui configs
  showAsPromoPage: boolean;
  assetKeys: string[];
  content: string;

  // main banner
  showAsMainBanner: boolean;
  mainBanner?: string | null;
  mainBannerMobile?: string | null;
  mainBannerTextColor: string;
  mainBannerVerticalTextAlign: string;
  mainBannerHorizontalTextAlign: string;
  mainBannerTextAlign: string;
  mainBannerTextPadding: number;
  mainBannerTextMaxWidth: number;

  //secondary banner
  showAsSecondaryBanner: boolean;
  secondaryBanner?: string | null;
  secondaryBannerTextColor: string;
  secondaryBannerVerticalTextAlign: string;
  secondaryBannerHorizontalTextAlign: string;
  secondaryBannerTextAlign: string;
  secondaryBannerTextPadding: number;
  secondaryBannerTextMaxWidth: number;
}

export interface PromoProductModel extends PromoBaseInterface {
  _id: ObjectIdModel;
  rubricSlug: string;
  rubricId: ObjectIdModel;
  promoId: ObjectIdModel;
  shopId: ObjectIdModel;
  shopProductId: ObjectIdModel;
  productId: ObjectIdModel;
}

export interface PromoCodeModel extends PromoBaseInterface {
  _id: ObjectIdModel;
  code: string;
  active: boolean;
  promoId: ObjectIdModel;
  promoterId?: ObjectIdModel;
  paybackPercent?: number;
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
  pageScreenshot?: string | null;
  mainBanner?: string | null;
  mainBannerMobile?: string | null;
  showAsMainBanner?: boolean | null;
  mainBannerTextColor?: string | null;
  mainBannerVerticalTextAlign?: string | null;
  mainBannerHorizontalTextAlign?: string | null;
  mainBannerTextAlign?: string | null;
  mainBannerTextPadding?: number | null;
  mainBannerTextMaxWidth?: number | null;
  secondaryBanner?: string | null;
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

// Blog
export interface BlogAttributeModel extends CountersModel {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  optionsGroupId: ObjectIdModel;
}

export interface BlogPostModel extends CountersModel {
  _id: ObjectIdModel;
  slug: string;
  companySlug: string;
  previewImage?: string | null;
  state: PageStateModel;
  source?: string;
  titleI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  assetKeys: string[];
  content: string;
  authorId: ObjectIdModel;
  filterSlugs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogLikeModel {
  _id: ObjectIdModel;
  blogPostId: ObjectIdModel;
  userId: ObjectIdModel;
}

// Payload
export interface ConstructorAssetPayloadModel extends PayloadType<string> {
  payload: string;
}
export type AttributesGroupPayloadModel = PayloadType<AttributesGroupModel>;
export type AttributePayloadModel = PayloadType<AttributeModel>;
export type BlogAttributePayloadModel = PayloadType<BlogAttributeModel>;
export type BlogPostPayloadModel = PayloadType<BlogPostModel>;
export type BrandPayloadModel = PayloadType<BrandModel>;
export type CategoryPayloadModel = PayloadType<CategoryModel>;
export type CompanyPayloadModel = PayloadType<CompanyModel>;
export type ConfigPayloadModel = PayloadType<ConfigModel>;
export type CountryPayloadModel = PayloadType<CountryModel>;
export type CurrencyPayloadModel = PayloadType<CurrencyModel>;
export type LanguagePayloadModel = PayloadType<LanguageModel>;
export type ManufacturerPayloadModel = PayloadType<ManufacturerModel>;
export type MetricPayloadModel = PayloadType<MetricModel>;
export type NavItemPayloadModel = PayloadType<NavItemModel>;
export type OptionsGroupPayloadModel = PayloadType<OptionsGroupModel>;
export type OrderPayloadModel = PayloadType<OrderModel>;
export type OrderProductPayloadModel = PayloadType<OrderProductModel>;
export type OrderStatusPayloadModel = PayloadType<OrderStatusModel>;
export type PagePayloadModel = PayloadType<PageModel>;
export type PagesGroupPayloadModel = PayloadType<PagesGroupModel>;
export type PromoPayloadModel = PayloadType<PromoModel>;
export type RolePayloadModel = PayloadType<RoleModel>;
export type RoleRulePayloadModel = PayloadType<RoleRuleModel>;
export type RubricPayloadModel = PayloadType<RubricModel>;
export type RubricVariantPayloadModel = PayloadType<RubricVariantModel>;
export type ShopPayloadModel = PayloadType<ShopModel>;
export type SupplierPayloadModel = PayloadType<SupplierModel>;
export type UserCategoryPayloadModel = PayloadType<UserCategoryModel>;
export type UserPayloadModel = PayloadType<UserModel>;
export type SeoContentPayloadModel = PayloadType<SeoContentModel>;

export interface GiftCertificatePayloadModel extends PayloadType<GiftCertificateModel> {
  notAuth?: boolean;
}

export interface ProductPayloadModel extends PayloadType<ProductFacetModel> {
  barcodeDoubles?: BarcodeDoublesInterface[] | null;
}

export interface ShopProductPayloadModel extends PayloadType<ShopProductModel> {
  barcodeDoubles?: ShopProductBarcodeDoublesInterface[] | null;
}

export interface CartPayloadModel {
  success: boolean;
  message: string;
}

// Lists payload
export type ManufacturersAlphabetListModel = AlphabetListModelType<ManufacturerModel>;
export type SuppliersAlphabetListModel = AlphabetListModelType<SupplierModel>;
export type BrandsAlphabetListModel = AlphabetListModelType<BrandModel>;
export type CategoriesAlphabetListModel = AlphabetListModelType<CategoryModel>;
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
export type UsersPaginationPayloadModel = PayloadType<PaginationPayloadType<UserModel>>;

// SEO
export interface TextUniquenessApiResponseInterface {
  uid: string;
  text_unique: string;
  json_result?: string;
  spell_check?: string;
  seo_check?: string;
}

export interface TextUniquenessApiJsonResultUrlModel {
  url: string;
  plagiat: number;
}

export interface TextUniquenessApiJsonResultModel {
  date_check: string;
  unique: number;
  urls: TextUniquenessApiJsonResultUrlModel[];
}

export interface TextUniquenessApiSpellCheckModel {
  error_type: string;
  replacements: string[];
  reason: string;
  error_text: string;
  start: number;
  end: number;
}

export interface TextUniquenessApiSeoCheckModel {
  count_chars_with_space: number;
  count_chars_without_space: number;
  count_words: number;
  water_percent: number;
  spam_percent: number;
  mixed_words: string[];
  list_keys: {
    count: number;
    key_title: string;
  }[];
  list_keys_group: {
    count: number;
    key_title: string;
    sub_keys: string[];
  }[];
}

export interface TextUniquenessApiParsedResponseModel {
  uid: string;
  locale: string;
  textUnique?: string | null;
  jsonResult?: TextUniquenessApiJsonResultModel | null;
  spellCheck?: TextUniquenessApiSpellCheckModel[] | null;
  seoCheck?: TextUniquenessApiSeoCheckModel | null;
}

export interface BlackListProductItemModel {
  id?: string | null;
  barcode: string[];
  available: number;
  price: number;
  name: string;
}

export interface BlackListProductModel {
  _id: ObjectIdModel;
  shopProductUid: string;
  shopId: ObjectIdModel;
  products: BlackListProductItemModel[];
}

export interface SyncIntersectModel {
  _id: ObjectIdModel;
  shopId: ObjectIdModel;
  products: BlackListProductItemModel[];
}

// Catalogue nav
export interface CatalogueNavModel {
  _id: ObjectIdModel;
  companySlug: string;
  citySlug: string;
  rubrics: RubricInterface[];
  createdAt: DateModel;
}
