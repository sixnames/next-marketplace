import { GEO_POINT_TYPE } from 'config/common';
import {
  BarcodeDoublesInterface,
  BrandInterface,
  CategoryInterface,
  ProductAttributeInterface,
  RubricInterface,
  ShopProductBarcodeDoublesInterface,
} from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';
import { IconType } from 'types/iconTypes';

export type DateModel = Date;
export type JSONObjectModel = Record<string, any>;
export type ObjectIdModel = ObjectId;
export type EmailAddressModel = string;
export type PhoneNumberModel = string;
export type URLModel = string;
export type Maybe<T> = T | undefined | null;

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

export interface IconModel {
  _id: ObjectIdModel;
  collectionName: string;
  documentId: ObjectIdModel;
  icon: string;
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
}

export interface CartModel extends TimestampModel {
  _id: ObjectIdModel;
  cartProducts: CartProductModel[];
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
  address = 'address',
  password = 'password',
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

// Order log variant
export enum OrderLogVariantModel {
  status = 'status',
  confirm = 'confirm',
  cancel = 'cancel',
  cancelProduct = 'cancelProduct',
  updateProduct = 'updateProduct',
}

export interface OrderLogModel {
  _id: ObjectIdModel;
  variant: OrderLogVariantModel;
  userId: ObjectIdModel;
  orderId: ObjectIdModel;
  productId?: ObjectIdModel;
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

export interface OrderModel extends TimestampModel, BaseModel {
  orderId: string;
  statusId: ObjectIdModel;
  comment?: string | null;
  customerId: ObjectIdModel;
  companySiteSlug: string;
  companySiteItemId: string;
  productIds: ObjectIdModel[];
  shopProductIds: ObjectIdModel[];
  shopId: ObjectIdModel;
  shopItemId: string;
  companyId: ObjectIdModel;
  companyItemId: string;
  reservationDate?: DateModel | null;
  isCanceled?: boolean;
  requests?: OrderRequestModel[] | null;
  promoId?: ObjectIdModel;
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

export interface ProductAttributeModel {
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

interface ProductMainFieldsInterface {
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  manufacturerSlug?: string | null;
  selectedOptionsSlugs: string[];
  barcode?: string[] | null;
  allowDelivery: boolean;
}

export interface ProductModel extends ProductMainFieldsInterface, BaseModel, TimestampModel {
  slug: string;
  active: boolean;
  originalName: string;
  nameI18n?: TranslationModel | null;
  descriptionI18n?: TranslationModel | null;
  mainImage: string;
  titleCategoriesSlugs: string[];
  selectedAttributesIds: ObjectId[];
  gender: GenderModel;

  // types for aggregation
  shopsCount?: number | null;
  cardPrices?: ProductCardPricesModel | null;
  attributes?: ProductAttributeInterface[] | null;
  categories?: CategoryInterface[] | null;
  rubric?: RubricInterface | null;
  brand?: BrandInterface | null;
}

export interface ProductAssetsModel {
  _id: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  assets: AssetModel[];
}

export interface ProductCardDescriptionModel {
  _id: ObjectIdModel;
  companySlug: string;
  productSlug: string;
  productId: ObjectIdModel;
  textI18n: TranslationModel;
}

export interface ProductSeoModel {
  _id: ObjectIdModel;
  productId: ObjectIdModel;
  companySlug: string;
  locales: TextUniquenessApiParsedResponseModel[];
}

export interface ProductCardContentModel {
  _id: ObjectIdModel;
  companySlug: string;
  productSlug: string;
  productId: ObjectIdModel;
  content: JSONObjectModel;
  assetKeys: string[];
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
  icon?: string;
  image?: string;
}

export type DescriptionPositionType = 'top' | 'bottom';

export interface RubricDescriptionModel {
  _id: ObjectIdModel;
  companySlug: string;
  rubricSlug: string;
  position: DescriptionPositionType;
  rubricId: ObjectIdModel;
  content: JSONObjectModel;
  assetKeys: string[];
}

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

export interface CategoryDescriptionModel {
  _id: ObjectIdModel;
  companySlug: string;
  categoryId: ObjectIdModel;
  categorySlug: string;
  position: DescriptionPositionType;
  content: JSONObjectModel;
  assetKeys: string[];
}

export interface RubricSeoModel {
  _id: ObjectIdModel;
  companySlug: string;
  rubricId: ObjectIdModel;
  position: DescriptionPositionType;
  categoryId?: ObjectIdModel | null;
  locales: TextUniquenessApiParsedResponseModel[];
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
  mainImage: string;
  useCategoryDiscount?: boolean | null;
  useCategoryCashback?: boolean | null;
  useCategoryPayFromCashback?: boolean | null;
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
  companySlug: string;
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
  avatar?: AssetModel | null;
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
  descriptionI18n?: any;
  value: number; // - / +
  currency: string;
}

export interface UserPaybackLogModel extends UserCashbackLogModel {}

// Promo
export interface PromoModel extends TimestampModel {
  _id: ObjectIdModel;
  slug: string;
  companyId: ObjectIdModel;
  companySlug: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;

  // discount
  discountPercent: number;
  addCategoryDiscount: boolean;
  useBiggestDiscount: boolean;

  // cashback
  cashbackPercent: number;
  addCategoryCashback: boolean;
  useBiggestCashback: boolean;
  allowPayFromCashback: boolean;

  // ui configs
  showAsPromoPage: boolean;
  assetKeys: string[];
  content: string;

  // main banner
  showAsMainBanner: boolean;
  mainBanner?: AssetModel | null;
  mainBannerMobile?: AssetModel | null;
  mainBannerTextColor: string;
  mainBannerVerticalTextAlign: string;
  mainBannerHorizontalTextAlign: string;
  mainBannerTextAlign: string;
  mainBannerTextPadding: number;
  mainBannerTextMaxWidth: number;

  //secondary banner
  showAsSecondaryBanner: boolean;
  secondaryBanner?: AssetModel | null;
  secondaryBannerTextColor: string;
  secondaryBannerVerticalTextAlign: string;
  secondaryBannerHorizontalTextAlign: string;
  secondaryBannerTextAlign: string;
  secondaryBannerTextPadding: number;
  secondaryBannerTextMaxWidth: number;

  // dates
  startAt: DateModel;
  endAt: DateModel;
}

export interface PromoProductModel {
  _id: ObjectIdModel;
  promoId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  shopProductId: ObjectIdModel;

  // dates
  startAt: DateModel;
  endAt: DateModel;
}

export interface PromoCodeModel {
  _id: ObjectIdModel;
  code: string;
  active: boolean;
  promoId: ObjectIdModel;
  promoterId?: ObjectIdModel;
  paybackPercent: number;
  createdAt: Date;
  updatedAt: Date;
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
  selectedOptionsSlugs: string[];
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
export type ProductCardContentPayloadModel = PayloadType<ProductCardContentModel>;
export type PromoPayloadModel = PayloadType<PromoModel>;
export type RolePayloadModel = PayloadType<RoleModel>;
export type RoleRulePayloadModel = PayloadType<RoleRuleModel>;
export type RubricPayloadModel = PayloadType<RubricModel>;
export type RubricVariantPayloadModel = PayloadType<RubricVariantModel>;
export type ShopPayloadModel = PayloadType<ShopModel>;
export type SupplierPayloadModel = PayloadType<SupplierModel>;
export type UserCategoryPayloadModel = PayloadType<UserCategoryModel>;
export type UserPayloadModel = PayloadType<UserModel>;

export interface ProductPayloadModel extends PayloadType<ProductModel> {
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
