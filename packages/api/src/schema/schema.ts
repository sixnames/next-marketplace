import { AddressResolver } from '../resolvers/address/AddressResolver';
import { ConfigCityResolver, ConfigResolver } from '../resolvers/config/ConfigResolver';
import { NavItemResolver } from '../resolvers/navItem/NavItemResolver';
import { RoleResolver } from '../resolvers/role/RoleResolver';
import { RoleRuleResolver } from '../resolvers/roleRule/RoleRuleResolver';
import { AttributeResolver } from '../resolvers/attribute/AttributeResolver';
import { AttributesGroupResolver } from '../resolvers/attributesGroup/AttributesGroupResolver';
import { CatalogueDataResolver } from '../resolvers/catalogueData/CatalogueDataResolver';
import { CityResolver } from '../resolvers/city/CityResolver';
import { CountryResolver } from '../resolvers/country/CountryResolver';
import { CurrencyResolver } from '../resolvers/currency/CurrencyResolver';
import { LanguageResolver } from '../resolvers/languages/LanguageResolver';
import { MessageResolver } from '../resolvers/message/MessageResolver';
import { MetricResolver } from '../resolvers/metric/MetricResolver';
import { OptionResolver } from '../resolvers/option/OptionResolver';
import { OptionsGroupResolver } from '../resolvers/optionsGroup/OptionsGroupResolver';
import {
  ProductAttributeResolver,
  ProductAttributesGroupResolver,
  ProductConnectionResolver,
  ProductResolver,
} from '../resolvers/product/ProductResolver';
import { RubricResolver } from '../resolvers/rubric/RubricResolver';
import { RubricVariantResolver } from '../resolvers/rubricVariant/RubricVariantResolver';
import { UserResolver } from '../resolvers/user/UserResolver';
import { CompanyResolver } from '../resolvers/company/CompanyResolver';
import { ShopResolver } from '../resolvers/shop/ShopResolver';
import { ShopProductResolver } from '../resolvers/shopProduct/ShopProductResolver';
import {
  AttributePositioningListResolver,
  AttributeVariantResolver,
  AttributeViewVariantsListResolver,
  GendersListResolver,
  IconOptionsListResolver,
  ISOLanguagesListResolver,
  OptionsGroupVariantsListResolver,
} from '../resolvers/selects/SelectsResolver';
import { ContactsResolver } from '../resolvers/contacts/ContactsResolver';
import { CartResolver } from '../resolvers/cart/CartResolver';
import { CartProductResolver } from '../resolvers/cartProduct/CartProductResolver';
import path from 'path';
import { BuildSchemaOptions } from 'type-graphql/dist/utils/buildSchema';
import { OrderProductResolver } from '../resolvers/order/OrderProductResolver';
import { OrderCustomerResolver } from '../resolvers/order/OrderCustomerResolver';
import { OrderLogResolver } from '../resolvers/order/OrderLogResolver';
import { OrderResolver } from '../resolvers/order/OrderResolver';
import { OrderStatusResolver } from '../resolvers/order/OrderStatusResolver';
import { BrandResolver } from '../resolvers/brand/BrandResolver';
import { BrandCollectionResolver } from '../resolvers/brandCollection/BrandCollectionResolver';
import { ManufacturerResolver } from '../resolvers/manufacturer/ManufacturerResolver';
import { RubricNavResolver } from '../resolvers/rubric/RubricNavResolver';

export const schemaOptions: BuildSchemaOptions = {
  resolvers: [
    AddressResolver,
    ConfigResolver,
    ConfigCityResolver,
    NavItemResolver,
    RoleResolver,
    RoleRuleResolver,
    AttributeResolver,
    AttributesGroupResolver,
    CatalogueDataResolver,
    CityResolver,
    CountryResolver,
    CurrencyResolver,
    LanguageResolver,
    MessageResolver,
    MetricResolver,
    OptionResolver,
    OptionsGroupResolver,
    ProductResolver,
    ProductConnectionResolver,
    ProductAttributesGroupResolver,
    ProductAttributeResolver,
    RubricResolver,
    RubricNavResolver,
    RubricVariantResolver,
    UserResolver,
    CompanyResolver,
    ShopResolver,
    ShopProductResolver,
    GendersListResolver,
    AttributeVariantResolver,
    AttributePositioningListResolver,
    ISOLanguagesListResolver,
    IconOptionsListResolver,
    AttributeViewVariantsListResolver,
    OptionsGroupVariantsListResolver,
    ContactsResolver,
    CartResolver,
    CartProductResolver,
    OrderProductResolver,
    OrderCustomerResolver,
    OrderLogResolver,
    OrderStatusResolver,
    OrderResolver,
    BrandResolver,
    BrandCollectionResolver,
    ManufacturerResolver,
  ],
  emitSchemaFile: path.resolve('./schema.graphql'),
  validate: false,
};
