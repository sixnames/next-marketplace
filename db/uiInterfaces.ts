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
  EmailAddressModel,
  ManufacturerModel,
  MessageModel,
  MetricModel,
  NavItemModel,
  ObjectIdModel,
  OptionModel,
  OptionsGroupModel,
  OrderStatusModel,
  PhoneNumberModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardBreadcrumbModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  RoleModel,
  RubricAttributeModel,
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
  emails: EmailAddressModel[];
  phones: PhoneNumberModel[];
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
  product?: ProductModel;
  shopProduct?: ShopProductModel;
  isShopless?: boolean;
  totalPrice?: string;
}

export interface CartInterface extends CartModel {
  totalPrice?: number;
  productsCount?: number;
  formattedTotalPrice?: string;
  isWithShopless?: boolean;
}

export interface CityInterface extends CityModel {
  name?: string;
}

export interface ConfigInterface extends ConfigModel {
  value?: string[];
  singleValue?: string;
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

export interface OrderStatusInterface extends OrderStatusModel {
  name?: string | null;
}

export interface ProductConnectionItemInterface extends ProductConnectionItemModel {
  product?: ProductModel;
}

export interface ProductConnectionInterface extends ProductConnectionModel {
  attributeName?: string;
}

export interface ProductAttributeInterface extends ProductAttributeModel {
  attributeName?: string | null;
  readableValue?: string | null;
  index?: number;
}

export interface ProductCardPricesInterface {
  min: string;
  max: string;
}

export interface ProductInterface extends ProductModel {
  name?: string | null;
  description?: string | null;
  shopsCount?: number;
  available?: boolean;
  assets?: ProductAssetsModel[];
  connections?: ProductConnectionInterface[];
  attributes?: ProductAttributeInterface[];
  listFeatures?: ProductAttributeInterface[];
  textFeatures?: ProductAttributeInterface[];
  tagFeatures?: ProductAttributeInterface[];
  iconFeatures?: ProductAttributeInterface[];
  ratingFeatures?: ProductAttributeInterface[];
  cardShopProducts?: ShopProductModel[];
  price?: number;
  cardPrices?: ProductCardPricesInterface;
  cardBreadcrumbs?: ProductCardBreadcrumbModel[];
  shopProducts?: ShopProductModel[];
  shopProductIds?: ObjectIdModel[];
  shopProduct?: ShopProductModel;
  rubric?: RubricModel;
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
  options: RubricOptionInterface[];
  name?: string | null;
}

export interface RubricAttributeInterface extends RubricAttributeModel, AttributeInterface {
  options: RubricOptionInterface[];
  name?: string | null;
  metric?: MetricInterface | null;
}

export interface RubricCatalogueTitleInterface extends RubricCatalogueTitleModel {
  defaultTitle?: string | null;
  prefix?: string | null;
  keyword?: string | null;
}

export interface RubricInterface extends RubricModel {
  name?: string | null;
  attributes?: RubricAttributeInterface[] | null;
  navItems?: RubricAttributeInterface[] | null;
  activeProductsCount?: number | null;
  productsCount?: number | null;
  variant?: RubricVariantInterface | null;
}

export interface ShopProductInterface extends ShopProductModel {
  name?: string | null;
  shop?: ShopModel;
  inCartCount?: number;
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
}

export interface UserInterface extends UserModel {
  role?: RoleInterface;
  fullName?: string;
  shortName?: string;
  companies?: CompanyModel[];
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
  options: CatalogueProductOptionInterface[];
  docs: ProductModel[];
}

export interface ProductsPaginationAggregationInterface {
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
  clearSlug: string;
  slug: string;
  name: string;
  metric?: string | null;
  isSelected: boolean;
  options: CatalogueFilterAttributeOptionInterface[];
  viewVariant: AttributeViewVariantModel;
}
