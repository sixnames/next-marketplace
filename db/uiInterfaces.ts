import {
  AddressModel,
  AttributeModel,
  AttributesGroupModel,
  AttributeViewVariantModel,
  BrandCollectionModel,
  BrandModel,
  CartModel,
  CartProductModel,
  CatalogueBreadcrumbModel,
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
  NotSyncedProductModel,
  ObjectIdModel,
  OptionModel,
  OptionsGroupModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  OrderStatusModel,
  PageModel,
  PagesGroupModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardBreadcrumbModel,
  ProductCardContentModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  RoleModel,
  RoleRuleModel,
  RubricAttributeModel,
  RubricAttributesGroupModel,
  RubricCatalogueTitleModel,
  RubricModel,
  RubricOptionModel,
  RubricVariantModel,
  ShopModel,
  ShopProductModel,
  SupplierModel,
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
  metric?: MetricInterface | null;
  optionsGroup?: OptionsGroupInterface | null;
}

export interface AttributesGroupInterface extends AttributesGroupModel {
  name?: string | null;
  attributes?: AttributeInterface[] | null;
}

export interface BrandInterface extends BrandModel {
  name?: string | null;
  description?: string | null;
  collections?: BrandCollectionInterface[] | null;
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

export interface SupplierInterface extends SupplierModel {
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
  owner?: UserInterface | null;
  staff?: UserInterface[] | null;
  customers?: UserInterface[] | null;
  orders?: OrderInterface[] | null;
}

export interface MessageBaseInterface {
  slug: MessageSlug;
  messageI18n: TranslationModel;
}

export interface MessageInterface extends MessageModel {
  message: string | null;
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

export interface ShopProductsGroupInterface {
  _id: ObjectIdModel;
  shopProducts: ShopProductInterface[];
}

export interface ProductConnectionInterface extends ProductConnectionModel {
  attribute?: AttributeInterface | null;
  connectionProducts?: ProductConnectionItemInterface[];
}

export interface ProductAttributeInterface extends ProductAttributeModel {
  readableValue?: string | null;
  index?: number | null;
  options?: OptionInterface[] | null;
  name?: string | null;
  metric?: MetricInterface | null;
}

export interface RubricAttributesGroupASTInterface {
  _id: string;
  attributes: RubricAttributeInterface[];
}

export interface ProductAttributesGroupASTInterface {
  _id: string;
  attributes: ProductAttributeInterface[];
}

export interface ProductCardContentInterface extends ProductCardContentModel {
  value?: string | null;
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
  similarProducts?: ProductInterface[] | null;
  shopProductsIds?: ObjectIdModel[] | null;
  cardContent?: ProductCardContentInterface | null;
  attributesCount?: number | null;
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
  orders?: OrderInterface[];
}

export interface ShopInterface extends ShopModel {
  productsCount?: number | null;
  city?: CityInterface | null;
  contacts: ContactsInterface;
  address: AddressInterface;
  orders?: OrderInterface[];
  company?: CompanyInterface | null;
}

export interface NotSyncedProductInterface extends NotSyncedProductModel {
  shop?: ShopInterface | null;
}

export interface UserInterface extends UserModel {
  role?: RoleInterface | null;
  fullName?: string;
  shortName?: string;
  companies?: CompanyInterface[];
  formattedPhone?: FormattedPhoneModel | null;
  orders?: OrderInterface[] | null;
}

export interface CatalogueDataInterface {
  _id: ObjectIdModel;
  clearSlug: string;
  filters: string[];
  rubricName: string;
  rubricSlug: string;
  rubricVariant?: RubricVariantInterface | null;
  products: ProductInterface[];
  totalProducts: number;
  catalogueTitle: string;
  breadcrumbs: CatalogueBreadcrumbModel[];
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
  rubrics?: RubricInterface[] | null;
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
  notShowAsAlphabet: boolean;
  options: CatalogueFilterAttributeOptionInterface[];
  viewVariant: AttributeViewVariantModel;
  showAsCatalogueBreadcrumb?: boolean | null;
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
  isPending?: boolean;
  isConfirmed?: boolean;
  isDone?: boolean;
  isCanceled?: boolean;
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

export interface OrderInterface extends OrderModel {
  user?: UserInterface | null;
  customer?: OrderCustomerInterface | null;
  products?: OrderProductInterface[] | null;
  logs?: OrderLogInterface[] | null;
  shopsCount?: number | null;
  shop?: ShopInterface | null;
  status?: OrderStatusInterface | null;
  productsCount?: number | null;
  totalPrice?: number | null;
  formattedTotalPrice?: string | null;
}

export interface TopFilterInterface {
  name: string;
  href: string;
}

export interface MobileTopFilters {
  visible: TopFilterInterface[];
  hidden: TopFilterInterface[];
}

export interface AppPaginationAggregationInterface<Model> {
  docs: Model[];
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface AppPaginationInterface<Model> {
  docs: Model[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  clearSlug: string;
  itemPath?: string;
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

export interface ProductSnippetConfigInterface {
  // booleans
  showSnippetBackground?: boolean | null;
  showSnippetArticle?: boolean | null;
  showSnippetRating?: boolean | null;
  showSnippetButtonsOnHover?: boolean | null;

  // numbers
  gridCatalogueColumns?: number | null;
}

export interface ProductSnippetInterface extends ProductSnippetConfigInterface {
  product: ProductInterface;
  testId?: string;
  className?: string;
  noAttributes?: boolean;
  noSecondaryName?: boolean;
}

export interface ProductSnippetLayoutInterface extends ProductSnippetInterface {
  layout?: string | null;
}
