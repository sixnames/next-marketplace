import { LinkProps } from 'next/link';
import * as React from 'react';
import {
  AssetModel,
  AttributeModel,
  AttributesGroupModel,
  AttributeViewVariantModel,
  BlogAttributeModel,
  BlogLikeModel,
  BlogPostModel,
  BrandCollectionModel,
  BrandModel,
  CartModel,
  CartProductModel,
  CatalogueBreadcrumbModel,
  CategoryModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  ContactsModel,
  FormattedPhoneModel,
  GiftCertificateLogModel,
  GiftCertificateModel,
  IconModel,
  ManufacturerModel,
  MetricModel,
  NavItemModel,
  NotificationConfigModel,
  NotSyncedProductModel,
  ObjectIdModel,
  OptionModel,
  OptionsGroupModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  OrderRequestModel,
  OrderStatusModel,
  PageModel,
  PagesGroupModel,
  PayloadType,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardBreadcrumbModel,
  ProductCardPricesModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  ProductSummaryModel,
  PromoModel,
  PromoProductModel,
  RoleModel,
  RoleRuleModel,
  RubricModel,
  RubricVariantModel,
  SeoContentModel,
  ShopModel,
  ShopProductModel,
  SupplierModel,
  SupplierProductModel,
  TranslationModel,
  UserCashbackLogModel,
  UserCashbackModel,
  UserCategoryModel,
  UserModel,
  UserNotificationsModel,
} from './dbModels';
import { NextApiRequest, NextApiResponse } from 'next';
import { MessageSlug } from '../types/messageSlugTypes';

// Blog
export interface BlogAttributeInterface extends BlogAttributeModel {
  name?: string | null;
  options?: OptionInterface[] | null;
  optionsGroup?: OptionsGroupInterface | null;
  readableValue?: string;
}

export interface BlogPostInterface extends Omit<BlogPostModel, 'views'> {
  title?: string | null;
  description?: string | null;
  attributes?: BlogAttributeInterface[] | [];
  author?: UserInterface | null;
  views?: number;
  options?: OptionInterface[] | null;
  likes?: BlogLikeInterface[] | null;
  likesCount?: number | null;
}

export interface BlogLikeInterface extends BlogLikeModel {
  blogPost?: BlogPostInterface | null;
  user?: UserInterface | null;
}

export interface ContactsInterface extends ContactsModel {
  formattedPhones: {
    raw: string;
    readable: string;
  }[];
}

export interface AttributeInterface extends AttributeModel {
  name?: string | null;
  metric?: MetricInterface | null;
  optionsGroup?: OptionsGroupInterface | null;
  options?: OptionInterface[] | null;
  childrenCount?: number | null;
}

export interface AttributesGroupInterface extends AttributesGroupModel {
  name?: string | null;
  attributes?: AttributeInterface[] | null;
}

export interface BrandInterface extends BrandModel {
  name?: string | null;
  description?: string | null;
  collections?: BrandCollectionInterface[] | null;
  mainUrl?: string | null;
}

export interface BrandCollectionInterface extends BrandCollectionModel {
  name?: string | null;
  description?: string | null;
  brand?: BrandInterface | null;
}

export interface ManufacturerInterface extends ManufacturerModel {
  name?: string | null;
  description?: string | null;
  mainUrl?: string | null;
}

export interface SupplierInterface extends SupplierModel {
  name?: string | null;
  description?: string | null;
  products?: SupplierProductInterface[] | null;
}

export interface CartProductInterface extends CartProductModel {
  product?: ProductInterface | null;
  shopProduct?: ShopProductInterface | null;
  isShopless?: boolean;
  totalPrice?: number;
}

export interface CartInterface extends CartModel {
  totalPrice?: number;
  totalBookingPrice?: number;
  totalDeliveryPrice?: number;
  productsCount?: number;
  isWithShopless?: boolean;
  isWithShoplessBooking?: boolean;
  isWithShoplessDelivery?: boolean;
  cartDeliveryProducts: CartProductInterface[];
  cartBookingProducts: CartProductInterface[];
  giftCertificates?: GiftCertificateInterface[] | null;
}

export interface PromoInterface extends PromoModel {
  name?: string | null;
  description?: string | null;
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
  owner?: UserInterface | null;
  staff?: UserInterface[] | null;
  customers?: UserInterface[] | null;
  orders?: OrderInterface[] | null;
  categories?: UserCategoryInterface[] | null;
  mainShop?: ShopInterface | null;
}

export interface MessageBaseInterface {
  slug: MessageSlug;
  messageI18n: TranslationModel;
}

export interface MetricInterface extends MetricModel {
  name?: string | null;
}

export interface NavItemInterface extends NavItemModel {
  name?: string | null;
  children?: NavItemInterface[];
}

export interface NavGroupInterface {
  _id: string;
  name?: string | null;
  children?: NavItemInterface[] | null;
}

export interface OptionInterface extends OptionModel {
  name?: string | null;
  options?: OptionInterface[] | null;
  icon?: IconModel | null;
  optionsGroup?: OptionsGroupInterface | null;
  childrenCount?: number | null;
  isSelected?: boolean;
}

export interface OptionsGroupInterface extends OptionsGroupModel {
  name?: string | null;
  variantName?: string | null;
  optionsCount?: number | null;
  options?: OptionInterface[] | null;
}

export interface ProductConnectionItemInterface extends ProductConnectionItemModel {
  shopProduct?: ShopProductInterface;
  product?: ProductInterface;
  option?: OptionInterface | null;
}

export interface ProductConnectionInterface extends ProductConnectionModel {
  attribute?: AttributeInterface | null;
  connectionProducts?: ProductConnectionItemInterface[];
}

export interface ProductAttributeInterface extends ProductAttributeModel {
  readableValue?: string | null;
  index?: number | null;
  attribute?: AttributeInterface | null;
}

export interface ProductCategoryInterface extends CategoryInterface {
  selected: boolean;
  categories: ProductCategoryInterface[];
}

export interface ProductAttributesGroupInterface extends AttributesGroupModel {
  _id: ObjectIdModel;
  name?: string | null;
  attributes: ProductAttributeInterface[];
  stringAttributesAST?: ProductAttributeInterface[] | null;
  numberAttributesAST?: ProductAttributeInterface[] | null;
  multipleSelectAttributesAST?: ProductAttributeInterface[] | null;
  selectAttributesAST?: ProductAttributeInterface[] | null;
}

export interface ProductInterface extends ProductModel {
  minPrice?: number | null;
  maxPrice?: number | null;
  available?: boolean | null;
  name?: string | null;
  description?: string | null;
  assets?: ProductAssetsModel | null;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
  suppliers?: SupplierInterface[] | null;
  connections?: ProductConnectionInterface[] | null;
  attributes?: ProductAttributeInterface[] | null;
  attributesGroups?: ProductAttributesGroupInterface[] | null;
  listFeatures?: ProductAttributeInterface[] | null;
  textFeatures?: ProductAttributeInterface[] | null;
  tagFeatures?: ProductAttributeInterface[] | null;
  iconFeatures?: ProductAttributeInterface[] | null;
  ratingFeatures?: ProductAttributeInterface[] | null;
  cardShopProducts?: ShopProductInterface[] | null;
  price?: number | null;
  cardBreadcrumbs?: ProductCardBreadcrumbModel[] | null;
  shopProductIds?: string[] | null;
  shopProducts?: ShopProductInterface[] | null;
  shopProduct?: ShopProductInterface | null;
  rubric?: RubricInterface | null;
  stringAttributesAST?: ProductAttributeInterface[] | null;
  numberAttributesAST?: ProductAttributeInterface[] | null;
  multipleSelectAttributesAST?: ProductAttributeInterface[] | null;
  selectAttributesAST?: ProductAttributeInterface[] | null;
  shopProductsIds?: ObjectIdModel[] | null;
  attributesCount?: number | null;
  totalAttributesCount?: number | null;
  categories?: CategoryInterface[] | null;
  snippetTitle?: string | null;
  cardTitle?: string | null;
  cardContent?: SeoContentModel | null;
  cardContentCities?: SeoContentCitiesInterface | null;
  shops?: ShopInterface[] | null;
  shopsCount?: number | null;
  cardPrices?: ProductCardPricesModel | null;
  summary?: ProductSummaryInterface | null;
}

export interface ProductSummaryInterface extends ProductSummaryModel {
  shopProductIds?: string[] | null;

  // ui
  cardTitle?: string | null;
  snippetTitle?: string | null;
  name?: string | null;
  description?: string | null;
  cardContent?: SeoContentModel | null;
  cardContentCities?: SeoContentCitiesInterface | null;
  connections?: ProductConnectionInterface[] | null;
  shopProducts?: ShopProductInterface[] | null;
  shops?: ShopInterface[] | null;
  shopsCount?: number | null;

  // parents
  rubric?: RubricInterface | null;
  categories?: CategoryInterface[] | null;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;

  // attributes
  attributes: ProductAttributeInterface[];
  attributesGroups?: ProductAttributesGroupInterface[] | null;
  listAttributes?: ProductAttributeInterface[] | null;
  textAttributes?: ProductAttributeInterface[] | null;
  tagAttributes?: ProductAttributeInterface[] | null;
  iconAttributes?: ProductAttributeInterface[] | null;
  ratingAttributes?: ProductAttributeInterface[] | null;
}

export interface BarcodeDoublesInterface {
  products: ProductInterface[];
  barcode: string;
}

export interface ShopProductBarcodeDoublesInterface {
  products: ShopProductInterface[];
  barcode: string;
}

export interface RoleRuleInterface extends RoleRuleModel {
  name?: string | null;
  description?: string | null;
  role?: RoleInterface | null;
}

export interface RoleInterface extends RoleModel {
  name?: string | null;
  description?: string | null;
  navItems?: NavItemInterface[];
  appNavigation?: NavItemInterface[];
  cmsNavigation?: NavItemInterface[];
  rules?: RoleRuleInterface[] | null;
}

export interface RubricVariantInterface extends RubricVariantModel {
  name?: string | null;
  cardBrandsLabel?: string | null;
}

export interface RubricInterface extends RubricModel {
  name?: string | null;
  attributes?: AttributeInterface[] | null;
  navItems?: AttributeInterface[] | null;
  activeProductsCount?: number | null;
  productsCount?: number | null;
  variant?: RubricVariantInterface | null;
  attributesGroups?: AttributesGroupInterface[] | null;
  categories?: CategoryInterface[] | null;
  textTop?: string | null;
  textBottom?: string | null;
  seoDescriptionTop?: SeoContentModel | null;
  seoDescriptionBottom?: SeoContentModel | null;
}

export interface CategoryInterface extends CategoryModel {
  name?: string | null;
  attributes?: AttributeInterface[] | null;
  attributesGroups?: AttributesGroupInterface[] | null;
  activeProductsCount?: number | null;
  productsCount?: number | null;
  variant?: RubricVariantInterface | null;
  rubric?: RubricInterface | null;
  categories?: CategoryInterface[] | null;
  parents?: CategoryInterface[] | null;
  icon?: IconModel | null;
  textTop?: string | null;
  textBottom?: string | null;
  childrenCount?: number | null;
  seoDescriptionTop?: SeoContentModel | null;
  seoDescriptionBottom?: SeoContentModel | null;
}

export interface SupplierProductInterface extends SupplierProductModel {
  supplier?: SupplierInterface | null;
  shop?: ShopInterface | null;
  company?: CompanyInterface | null;
  shopProduct?: ShopProductInterface;
  recommendedPrice?: number | null;
}

export interface ShopProductInterface extends ShopProductModel {
  shop?: ShopInterface | null;
  minAvailable?: number | null;
  maxAvailable?: number | null;
  company?: CompanyInterface | null;
  product?: ProductInterface | null;
  products?: ProductInterface[] | null;
  orders?: OrderInterface[] | null;
  cardPrices?: ProductCardPricesModel | null;
  shopsCount?: number | null;
  similarProducts?: ShopProductInterface[] | null;
  suppliers?: SupplierInterface[] | null;
  supplierProducts?: SupplierProductInterface[] | null;
  promoProducts?: PromoProductInterface[] | null;
  promoProductsCount?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface ShopInterface extends ShopModel {
  productsCount?: number | null;
  city?: CityInterface | null;
  contacts: ContactsInterface;
  orders?: OrderInterface[];
  company?: CompanyInterface | null;
  shopProducts?: ShopProductInterface[] | null;
  cardShopProduct?: ShopProductInterface | null;
  priceWarning: string | null;
}

export interface PromoProductInterface extends PromoProductModel {
  promo?: PromoInterface | null;
  shop?: ShopInterface | null;
  shopProduct?: ShopProductInterface | null;
  product?: ProductInterface | null;
  company?: CompanyInterface | null;
}

export interface NotSyncedProductInterface extends NotSyncedProductModel {
  shop?: ShopInterface | null;
  errorIds?: ObjectIdModel[] | null;
}

export interface NotificationConfigInterface extends NotificationConfigModel {
  name?: string | null;
}

export interface UserNotificationsInterface extends UserNotificationsModel {
  // customer
  newOrder?: NotificationConfigInterface | null;
  confirmedOrder?: NotificationConfigInterface | null;
  canceledOrder?: NotificationConfigInterface | null;
  canceledOrderProduct?: NotificationConfigInterface | null;

  // admin
  adminNewOrder?: NotificationConfigInterface | null;
  adminConfirmedOrder?: NotificationConfigInterface | null;
  adminCanceledOrder?: NotificationConfigInterface | null;
  adminCanceledOrderProduct?: NotificationConfigInterface | null;

  // company
  companyNewOrder?: NotificationConfigInterface | null;
  companyConfirmedOrder?: NotificationConfigInterface | null;
  companyCanceledOrder?: NotificationConfigInterface | null;
  companyCanceledOrderProduct?: NotificationConfigInterface | null;
}

// User
export interface UserCashbackInterface extends UserCashbackModel {
  company?: CompanyInterface | null;
}

export interface UserPaybackInterface extends UserCashbackInterface {}

export interface UserCategoryInterface extends UserCategoryModel {
  company?: CompanyInterface | null;
  name?: string | null;
  description?: string | null;
}

export interface UserCashbackLogInterface extends UserCashbackLogModel {
  user?: UserInterface | null;
  order?: OrderInterface | null;
  creator?: UserInterface | null;
  company?: CompanyInterface | null;
  description?: string | null;
}

export interface UserPaybackLogInterface extends UserCashbackLogInterface {}

export interface UserInterface extends UserModel {
  role?: RoleInterface | null;
  fullName?: string;
  shortName?: string;
  companies?: CompanyInterface[];
  formattedPhone?: FormattedPhoneModel | null;
  orders?: OrderInterface[] | null;
  notifications: UserNotificationsInterface;
  customerNotifications?: NotificationConfigInterface[] | null;
  adminNotifications?: NotificationConfigInterface[] | null;
  companyNotifications?: NotificationConfigInterface[] | null;
  categories?: UserCategoryInterface[] | null;
  category?: UserCategoryInterface | null;
  cashback?: UserCashbackInterface[] | null;
  payback?: UserPaybackInterface[] | null;
  cashbackLog?: UserCashbackLogInterface[] | null;
  paybackLog?: UserPaybackLogInterface[] | null;
}

export interface CatalogueDataInterface {
  _id: ObjectIdModel;
  isSearch: boolean;
  redirect?: string | null;
  basePath: string;
  clearSlug: string;
  filters: string[];
  rubricName: string;
  rubricSlug: string;
  editUrl: string;
  catalogueFilterLayout: string;
  catalogueHeadLayout: string;
  gridSnippetLayout: string;
  rowSnippetLayout: string;
  showSnippetConnections: boolean;
  showSnippetBackground: boolean;
  showSnippetArticle: boolean;
  showSnippetButtonsOnHover: boolean;
  gridCatalogueColumns: number;
  products: ShopProductInterface[];
  totalPages: number;
  totalProducts: number;
  catalogueTitle: string;
  headCategories?: CategoryInterface[] | null;
  breadcrumbs: CatalogueBreadcrumbModel[];
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  page: number;
  textTop?: SeoContentInterface | null;
  textTopEditUrl: string;
  textBottom?: SeoContentInterface | null;
  textBottomEditUrl: string;
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
  docs: ShopProductInterface[];
  rubrics: RubricInterface[];
  attributes?: AttributeInterface[] | null;
  categories?: CategoryInterface[];
  brands?: BrandInterface[];
}

export interface CatalogueFilterAttributeOptionInterface {
  _id: ObjectIdModel;
  slug: string;
  castedSlug: string;
  name: string;
  nextSlug: string;
  isSelected: boolean;
  options?: CatalogueFilterAttributeOptionInterface[] | null;
}

export interface CatalogueFilterAttributeInterface {
  _id: ObjectIdModel;
  clearSlug: string;
  slug: string;
  name: string;
  metric?: string | null;
  isSelected: boolean;
  notShowAsAlphabet: boolean;
  options: CatalogueFilterAttributeOptionInterface[];
  childrenCount: number;
  viewVariant: AttributeViewVariantModel;
  showAsCatalogueBreadcrumb?: boolean | null;
  showAsLinkInFilter: boolean;
  showAsAccordionInFilter: boolean;
}

export interface OrderStatusInterface extends OrderStatusModel {
  name?: string | null;
}

export interface OrderLogInterface extends OrderLogModel {
  user?: UserInterface | null;
  status?: OrderStatusInterface | null;
  prevStatus?: OrderStatusInterface | null;
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
  formattedTotalPrice?: string | null;
  name?: string | null;
  status?: OrderStatusInterface | null;
}

export interface OrderRequestModelInterface extends OrderRequestModel {
  user?: UserInterface | null;
  confirmedBy?: UserInterface | null;
  canceledBy?: UserInterface | null;
}

export interface OrderInterface extends OrderModel {
  user?: UserInterface | null;
  customer?: OrderCustomerInterface | null;
  products?: OrderProductInterface[] | null;
  logs?: OrderLogInterface[] | null;
  shopsCount?: number | null;
  shop?: ShopInterface | null;
  status?: OrderStatusInterface | null;
  productsCount?: number | null;
  formattedTotalPrice?: string | null;
  requests?: OrderRequestModelInterface[] | null;
  giftCertificate?: GiftCertificateInterface | null;
}

export interface TopFilterInterface {
  name: string;
  href: string;
}

export interface MobileTopFilters {
  visible: TopFilterInterface[];
  hidden: TopFilterInterface[];
}

export interface PagesGroupInterface extends PagesGroupModel {
  name?: string | null;
  pages?: PageInterface[];
}

export interface PageInterface extends PageModel {
  name?: string | null;
  description?: string | null;
  city?: CityInterface | null;
  pagesGroup?: PagesGroupInterface | null;
}

export type PagesGroupTemplateInterface = PagesGroupInterface;
export type PagesTemplateInterface = PageInterface;

export interface GiftCertificateLogInterface extends GiftCertificateLogModel {
  order?: OrderInterface | null;
}

export interface GiftCertificateInterface extends GiftCertificateModel {
  user?: UserInterface | null;
  company?: CompanyInterface;
  name?: string | null;
  description?: string | null;
  log: GiftCertificateLogInterface[];
}

export interface ProductSnippetConfigInterface {
  // booleans
  showSnippetBackground?: boolean | null;
  showSnippetArticle?: boolean | null;
  showSnippetRating?: boolean | null;
  showSnippetButtonsOnHover?: boolean | null;
  showSnippetConnections?: boolean | null;

  // numbers
  gridCatalogueColumns?: number | 'full' | null;
  imageLoading?: 'lazy' | 'eager';
}

export interface ProductSnippetInterface extends ProductSnippetConfigInterface {
  shopProduct: ShopProductInterface;
  testId?: string;
  className?: string;
  noAttributes?: boolean;
  noSecondaryName?: boolean;
}

export interface ProductSnippetLayoutInterface extends ProductSnippetInterface {
  layout?: string | null;
}

export interface InitialCardDataInterface {
  cardTitle: string;
  product: ProductInterface;
  listFeatures: ProductAttributeInterface[];
  iconFeatures: ProductAttributeInterface[];
  tagFeatures: ProductAttributeInterface[];
  textFeatures: ProductAttributeInterface[];
  ratingFeatures: ProductAttributeInterface[];
  attributesGroups: ProductAttributesGroupInterface[];
  connections: ProductConnectionInterface[];
  showFeaturesSection: boolean;
  showCardImagesSlider: boolean;
  showArticle: boolean;
  showCardBrands: boolean;
  cardBrandsLabel: string;
  isShopless: boolean;
  shopsCounterPostfix: string;
  isSingleImage: boolean;
  assets: AssetModel[];
  cardShops: ShopInterface[];
  cardBreadcrumbs: ProductCardBreadcrumbModel[];
  shopsCount: number;
  cardContent: SeoContentModel | null;
  cardLayout: string;
  rubric: RubricInterface;
  cardPrices: ProductCardPricesModel;
  breadcrumbs?: ProductCardBreadcrumbModel[] | null;
  maxAvailable: number;
}

export interface SsrConfigsInterface {
  // Site globals
  siteName: string;
  siteFoundationYear: number;
  yaVerification: string;
  yaMetrica: string;
  googleAnalytics: string;
  isOneShopCompany: boolean;

  // Site ui
  siteLogo: string;
  siteLogoDark: string;
  siteLogoWidth: string;
  siteMobileLogoWidth: string;
  siteThemeColor: string;
  siteTopBarBgLightTheme: string;
  headerTopBarBgDarkTheme: string;
  headerTopBarTextLightTheme: string;
  headerTopBarTextDarkTheme: string;
  siteNavBarBgLightTheme: string;
  siteNavBarBgDarkTheme: string;
  siteNavBarTextLightTheme: string;
  siteNavBarTextDarkTheme: string;
  siteNavDropdownBgLightTheme: string;
  siteNavDropdownBgDarkTheme: string;
  siteNavDropdownTextLightTheme: string;
  siteNavDropdownTextDarkTheme: string;
  siteNavDropdownAttributeLightTheme: string;
  siteNavDropdownAttributeDarkTheme: string;
  showAdultModal: boolean;
  showBlog: boolean;
  showBlogPostViews: boolean;
  categoriesAsNavItems: string[];
  visibleCategoriesInNavDropdown: string[];

  // Contacts
  contactEmail: string[];
  phone: string[];
  facebook: string;
  instagram: string;
  telegram: string;
  vkontakte: string;
  odnoklassniki: string;
  youtube: string;
  twitter: string;
  pageDefaultPreviewImage: string;
  androidChrome192: string;
  androidChrome512: string;
  appleTouchIcon: string;
  faviconIco: string;
  iconSvg: string;
  pageDefaultTitle: string;
  pageDefaultDescription: string;
  seoTextTitle: string;
  actualAddress: string;
  contactsContent: string;
  seoText: string;
  seoTextBottom: string;
  mapMarkerDarkTheme: string;
  mapMarkerLightTheme: string;

  /// Catalogue
  mainBannerAutoplaySpeed: number;
  showCardArticle: boolean;
  catalogueProductsCount: number;
  stickyNavVisibleCategoriesCount: number;
  stickyNavVisibleSubCategoriesCount: number;
  stickyNavVisibleAttributesCount: number;
  stickyNavVisibleOptionsCount: number;
  catalogueFilterVisibleAttributesCount: number;
  catalogueFilterVisibleOptionsCount: number;
  snippetAttributesCount: number;
  cardListFeaturesCount: number;
  catalogueMetaPrefix: string;
  cartBookingButtonDescription: string;
  cardMetaPrefix: string;
  robotsTxt: string[];

  // Project
  showReservationDate: boolean;
  useNoIndexRules: boolean;
  buyButtonText: string;
}

export interface DaoPropsInterface<TInput> {
  input?: TInput;
  context: {
    req: NextApiRequest;
    res: NextApiResponse;
  };
}

export interface ShopProductsAggregationInterface {
  docs: ShopProductInterface[];
  rubric: RubricInterface;
  totalDocs: number;
  totalPages: number;
  prices: CatalogueProductPricesInterface[];
  options: CatalogueProductOptionInterface[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
  attributes?: AttributeInterface[] | null;
  categories?: CategoryInterface[];
  brands?: BrandInterface[];
  allShopProducts?: ShopProductInterface[] | null;
}

export interface ProductsAggregationInterface {
  docs: ProductInterface[];
  totalDocs: number;
  totalPages: number;
  prices: CatalogueProductPricesInterface[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
  attributes?: AttributeInterface[] | null;
  categories?: CategoryInterface[];
  brands?: BrandInterface[];
}

export interface AppPaginationAggregationInterface<Model> {
  docs: Model[];
  totalDocs: number;
  totalPages: number;
}

export interface AppPaginationInterface<Model> {
  docs: Model[];
  totalDocs: number;
  totalPages: number;
  page: number;
  itemPath?: string;
  clearSlug?: string;
}

export interface AppPaginationWithFiltersInterface<Model> extends AppPaginationInterface<Model> {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  basePath: string;
  clearSlug: string;
}

export interface ConsoleRubricProductsInterface
  extends AppPaginationWithFiltersInterface<ProductInterface> {
  rubric?: RubricInterface | null;
  companySlug: string;
}

export interface GetConsoleRubricPromoProductsPayloadInterface
  extends AppPaginationWithFiltersInterface<ShopProductInterface> {
  rubric?: RubricInterface | null;
  selectedShopProductIds: string[];
}

export interface GetConsoleGiftCertificatesPayloadInterface
  extends AppPaginationInterface<GiftCertificateInterface> {}

export interface LinkInterface
  extends Omit<LinkProps, 'as' | 'href'>,
    React.PropsWithChildren<any> {
  className?: string;
  activeClassName?: string;
  testId?: string;
  exact?: boolean;
  isTab?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href: string;
  ariaLabel?: string;
}

export interface BreadcrumbsItemInterface extends LinkInterface {
  name: string;
}

export type AppContentWrapperBreadCrumbs = Omit<
  BreadcrumbsInterface,
  'noMainPage' | 'lowWrapper' | 'lowBottom'
>;

export interface BreadcrumbsInterface {
  currentPageName?: string;
  config?: BreadcrumbsItemInterface[];
  noMainPage?: boolean;
  lowTop?: boolean;
  lowBottom?: boolean;
  lowWrapper?: boolean;
  urlPrefix?: string;
  centered?: boolean;
}

export interface ConsoleShopLayoutInterface {
  shop: ShopInterface;
  basePath: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

export interface ShopRubricProductsInterface
  extends AppPaginationInterface<ShopProductInterface>,
    ConsoleShopLayoutInterface {
  shop: ShopInterface;
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  clearSlug: string;
  rubricName: string;
  rubricId: string;
  rubricSlug: string;
  layoutBasePath: string;
  basePath: string;
  currency: string;
}

export interface CompanyShopProductsPageInterface
  extends Omit<ShopRubricProductsInterface, 'layoutBasePath' | 'breadcrumbs' | 'itemPath'> {}

export interface CardLayoutInterface {
  cardData: InitialCardDataInterface;
  companySlug?: string;
  companyId?: string | null;
}

export interface SeoContentInterface extends SeoContentModel {
  title?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface SeoContentCitiesInterface {
  [key: string]: SeoContentInterface;
}

export type OrderInterfacePayloadModel = PayloadType<OrderInterface>;

export interface ShopProductPricesInterface {
  _id: ObjectIdModel;
  minPrice: number;
  maxPrice: number;
}
