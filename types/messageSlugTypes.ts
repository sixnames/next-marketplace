export type MessageSlug =
  // Common validation ----------
  | 'permission.error'
  | 'validation.string.min'
  | 'validation.string.max'
  | 'validation.number.min'
  | 'validation.number.max'
  | 'validation.email'
  | 'validation.email.required'
  | 'validation.phone'
  | 'validation.phone.required'
  | 'validation.color'
  | 'validation.color.required'
  | 'validation.translation.key'
  | 'validation.contacts'
  | 'validation.address'
  | 'validation.point.lat'
  | 'validation.point.lng'
  | 'validation.url'

  // Configs ----------
  | 'configs.update.success'
  | 'configs.update.error'
  | 'configs.updateAsset.notFound'
  | 'configs.updateAsset.error'
  | 'configs.updateAsset.success'
  | 'configs.delete.error'
  // Configs validation
  | 'validation.configs.id'
  | 'validation.configs.value'
  | 'validation.configs.translation'
  | 'validation.configs.citySlug'

  // Currencies ----------
  | 'currencies.create.duplicate'
  | 'currencies.create.error'
  | 'currencies.create.success'
  | 'currencies.update.duplicate'
  | 'currencies.update.error'
  | 'currencies.update.success'
  | 'currencies.delete.used'
  | 'currencies.delete.error'
  | 'currencies.delete.success'
  // Currencies validation
  | 'validation.currencies.id'
  | 'validation.currencies.nameString'

  // Cities ----------
  | 'cities.create.notFound'
  | 'cities.create.duplicate'
  | 'cities.create.error'
  | 'cities.create.success'
  | 'cities.update.notFound'
  | 'cities.update.duplicate'
  | 'cities.update.error'
  | 'cities.update.success'
  | 'cities.delete.notFound'
  | 'cities.delete.error'
  | 'cities.delete.success'
  // Cities validation
  | 'validation.cities.id'
  | 'validation.cities.name'
  | 'validation.cities.slug'

  // Countries ----------
  | 'countries.create.duplicate'
  | 'countries.create.error'
  | 'countries.create.success'
  | 'countries.update.notFound'
  | 'countries.update.duplicate'
  | 'countries.update.error'
  | 'countries.update.success'
  | 'countries.delete.notFound'
  | 'countries.delete.error'
  | 'countries.delete.success'
  // Countries validation
  | 'validation.countries.id'
  | 'validation.countries.nameString'
  | 'validation.countries.currency'

  // Languages ----------
  | 'languages.setLanguageAsDefault.error'
  | 'languages.setLanguageAsDefault.success'
  | 'languages.create.duplicate'
  | 'languages.create.error'
  | 'languages.create.success'
  | 'languages.update.duplicate'
  | 'languages.update.error'
  | 'languages.update.success'
  | 'languages.delete.error'
  | 'languages.delete.success'
  // Languages validation
  | 'validation.languages.id'
  | 'validation.languages.name'
  | 'validation.languages.slug'
  | 'validation.languages.nativeName'

  // Nav items ----------
  | 'navItems.create.duplicate'
  | 'navItems.create.error'
  | 'navItems.create.success'
  | 'navItems.update.duplicate'
  | 'navItems.update.error'
  | 'navItems.update.success'
  | 'navItems.delete.error'
  | 'navItems.delete.success'
  // Nav items validation
  | 'validation.navItems.id'
  | 'validation.navItems.name'
  | 'validation.navItems.slug'
  | 'validation.navItems.path'
  | 'validation.navItems.navGroup'
  | 'validation.navItems.index'
  | 'validation.navItems.icon'

  // Carts ----------
  | 'carts.addProduct.cartNotFound'
  | 'carts.addProduct.error'
  | 'carts.addProduct.success'
  | 'carts.repeatOrder.orderNotFound'
  | 'carts.repeatOrder.shopProductNotFound'
  | 'carts.repeatOrder.productNotFound'
  | 'carts.repeatOrder.notEnough'
  | 'carts.repeatOrder.error'
  | 'carts.repeatOrder.success'
  | 'carts.updateProduct.cartNotFound'
  | 'carts.updateProduct.error'
  | 'carts.updateProduct.success'
  | 'carts.deleteProduct.cartNotFound'
  | 'carts.deleteProduct.error'
  | 'carts.deleteProduct.success'
  | 'carts.clear.error'
  | 'carts.clear.success'
  // Carts validation
  | 'validation.carts.shopProductId'
  | 'validation.carts.amount'
  | 'validation.carts.cartProductId'

  // Roles ----------
  | 'roles.create.duplicate'
  | 'roles.create.error'
  | 'roles.create.success'
  | 'roles.update.duplicate'
  | 'roles.update.error'
  | 'roles.update.success'
  | 'roles.delete.notFound'
  | 'roles.delete.rulesNotFound'
  | 'roles.delete.rulesError'
  | 'roles.delete.guestRoleNotFound'
  | 'roles.delete.usersUpdateError'
  | 'roles.delete.error'
  | 'roles.delete.success'
  // Roles validation
  | 'validation.roles.id'
  | 'validation.roles.name'
  | 'validation.roles.navItemId'

  // Role rules ----------
  | 'roleRules.create.duplicate'
  | 'roleRules.create.error'
  | 'roleRules.create.success'
  | 'roleRules.update.duplicate'
  | 'roleRules.update.error'
  | 'roleRules.update.success'
  | 'roleRules.delete.notFound'
  | 'roleRules.delete.error'
  | 'roleRules.delete.success'
  // Role rules validation
  | 'validation.roleRules.id'
  | 'validation.roleRules.name'
  | 'validation.rolesRule.slug'
  | 'validation.roleRules.roleId'

  // Users ----------
  | 'users.create.duplicate'
  | 'users.create.error'
  | 'users.create.success'
  | 'users.update.duplicate'
  | 'users.update.error'
  | 'users.update.passwordSuccess'
  | 'users.update.success'
  | 'users.delete.error'
  | 'users.delete.success'
  | 'users.signIn.authorized'
  | 'users.signIn.emailError'
  | 'users.signIn.passwordError'
  | 'users.signIn.success'
  | 'users.signOut.error'
  | 'users.signOut.success'
  // Users validation
  | 'validation.users.id'
  | 'validation.users.name'
  | 'validation.users.lastName'
  | 'validation.users.secondName'
  | 'validation.users.role'
  | 'validation.users.password'
  | 'validation.users.passwordCompare'

  // Companies ----------
  | 'companies.create.duplicate'
  | 'companies.create.error'
  | 'companies.create.success'
  | 'companies.update.notFound'
  | 'companies.update.duplicate'
  | 'companies.update.error'
  | 'companies.update.success'
  | 'companies.delete.notFound'
  | 'companies.delete.error'
  | 'companies.shopsDelete.error'
  | 'companies.delete.success'
  // Companies validation
  | 'validation.companies.id'
  | 'validation.companies.nameString'
  | 'validation.companies.owner'
  | 'validation.companies.staff'
  | 'validation.companies.logo'

  // Shops ----------
  | 'shops.create.duplicate'
  | 'shops.create.error'
  | 'shops.create.success'
  | 'shops.update.notFound'
  | 'shops.update.duplicate'
  | 'shops.update.error'
  | 'shops.update.success'
  | 'shops.addProduct.duplicate'
  | 'shops.addProduct.notFound'
  | 'shops.addProduct.error'
  | 'shops.addProduct.success'
  | 'shops.deleteProduct.notFound'
  | 'shops.deleteProduct.error'
  | 'shops.deleteProduct.success'
  | 'shops.delete.notFound'
  | 'shops.delete.error'
  | 'shops.delete.success'
  // Companies validation
  | 'validation.shops.id'
  | 'validation.shops.nameString'
  | 'validation.shops.city'
  | 'validation.shops.logo'
  | 'validation.shops.assets'
  | 'validation.shops.address'
  | 'validation.shops.products'

  // Shop products ----------
  | 'shopProducts.create.duplicate'
  | 'shopProducts.create.error'
  | 'shopProducts.create.success'
  | 'shopProducts.update.notFound'
  | 'shopProducts.update.duplicate'
  | 'shopProducts.update.error'
  | 'shopProducts.update.success'
  | 'shopProducts.delete.notFound'
  | 'shopProducts.delete.error'
  | 'shopProducts.delete.success'
  // Companies validation
  | 'validation.shopProducts.id'
  | 'validation.shopProducts.available'
  | 'validation.shopProducts.price'
  | 'validation.shopProducts.product'

  // Options groups ----------
  | 'optionsGroups.create.duplicate'
  | 'optionsGroups.create.error'
  | 'optionsGroups.create.success'
  | 'optionsGroups.update.notFound'
  | 'optionsGroups.update.duplicate'
  | 'optionsGroups.update.error'
  | 'optionsGroups.update.success'
  | 'optionsGroups.delete.used'
  | 'optionsGroups.delete.notFound'
  | 'optionsGroups.delete.optionsError'
  | 'optionsGroups.delete.error'
  | 'optionsGroups.delete.success'
  | 'optionsGroups.addOption.groupError'
  | 'optionsGroups.addOption.colorError'
  | 'optionsGroups.addOption.iconError'
  | 'optionsGroups.addOption.optionError'
  | 'optionsGroups.addOption.duplicate'
  | 'optionsGroups.addOption.error'
  | 'optionsGroups.addOption.success'
  | 'optionsGroups.updateOption.groupError'
  | 'optionsGroups.updateOption.duplicate'
  | 'optionsGroups.updateOption.error'
  | 'optionsGroups.updateOption.success'
  | 'optionsGroups.deleteOption.notFound'
  | 'optionsGroups.deleteOption.used'
  | 'optionsGroups.deleteOption.groupError'
  | 'optionsGroups.deleteOption.error'
  | 'optionsGroups.deleteOption.success'
  // Options groups validation
  | 'validation.optionsGroup.id'
  | 'validation.optionsGroup.name'
  | 'validation.option.id'
  | 'validation.option.name'
  | 'validation.option.variantGender'
  | 'validation.option.variantValue'
  | 'validation.option.gender'

  // Attributes groups ----------
  | 'attributesGroups.create.duplicate'
  | 'attributesGroups.create.error'
  | 'attributesGroups.create.success'
  | 'attributesGroups.update.duplicate'
  | 'attributesGroups.update.error'
  | 'attributesGroups.update.success'
  | 'attributesGroups.delete.used'
  | 'attributesGroups.delete.notFound'
  | 'attributesGroups.delete.attributesError'
  | 'attributesGroups.delete.error'
  | 'attributesGroups.delete.success'
  | 'attributesGroups.addAttribute.groupError'
  | 'attributesGroups.addAttribute.attributeError'
  | 'attributesGroups.addAttribute.duplicate'
  | 'attributesGroups.addAttribute.addError'
  | 'attributesGroups.addAttribute.success'
  | 'attributesGroups.updateAttribute.groupError'
  | 'attributesGroups.updateAttribute.duplicate'
  | 'attributesGroups.updateAttribute.updateError'
  | 'attributesGroups.updateAttribute.success'
  | 'attributesGroups.deleteAttribute.used'
  | 'attributesGroups.deleteAttribute.deleteError'
  | 'attributesGroups.deleteAttribute.groupError'
  | 'attributesGroups.deleteAttribute.success'
  // Attributes groups validation
  | 'validation.attributesGroups.id'
  | 'validation.attributesGroups.name'
  | 'validation.attributes.id'
  | 'validation.attributes.name'
  | 'validation.attributes.variant'
  | 'validation.attributes.viewVariant'
  | 'validation.attributes.position'
  | 'validation.attributes.options'

  // Rubric variants ----------
  | 'rubricVariants.create.duplicate'
  | 'rubricVariants.create.error'
  | 'rubricVariants.create.success'
  | 'rubricVariants.update.duplicate'
  | 'rubricVariants.update.error'
  | 'rubricVariants.update.success'
  | 'rubricVariants.delete.used'
  | 'rubricVariants.delete.error'
  | 'rubricVariants.delete.success'
  // Rubric variants validation
  | 'validation.rubricVariants.id'
  | 'validation.rubricVariants.name'

  // Rubrics ----------
  | 'rubrics.create.duplicate'
  | 'rubrics.create.error'
  | 'rubrics.create.success'
  | 'rubrics.update.notFound'
  | 'rubrics.update.duplicate'
  | 'rubrics.update.error'
  | 'rubrics.update.success'
  | 'rubrics.delete.notFound'
  | 'rubrics.delete.error'
  | 'rubrics.delete.success'
  | 'rubrics.addAttributesGroup.notFound'
  | 'rubrics.addAttributesGroup.noAttributes'
  | 'rubrics.addAttributesGroup.error'
  | 'rubrics.addAttributesGroup.success'
  | 'rubrics.updateAttributesGroup.notFound'
  | 'rubrics.updateAttributesGroup.error'
  | 'rubrics.updateAttributesGroup.success'
  | 'rubrics.deleteAttributesGroup.notFound'
  | 'rubrics.deleteAttributesGroup.ownerError'
  | 'rubrics.deleteAttributesGroup.error'
  | 'rubrics.deleteAttributesGroup.success'
  | 'rubrics.addProduct.notFound'
  | 'rubrics.addProduct.exists'
  | 'rubrics.addProduct.error'
  | 'rubrics.addProduct.success'
  | 'rubrics.deleteProduct.notFound'
  | 'rubrics.deleteProduct.error'
  | 'rubrics.deleteProduct.success'
  // Rubric validation
  | 'validation.rubrics.id'
  | 'validation.rubrics.name'
  | 'validation.rubrics.description'
  | 'validation.rubrics.shortDescription'
  | 'validation.rubrics.variant'
  | 'validation.rubrics.defaultTitle'
  | 'validation.rubrics.keyword'
  | 'validation.rubrics.gender'

  // Products ----------
  | 'products.create.error'
  | 'products.create.success'
  | 'products.update.notFound'
  | 'products.update.error'
  | 'products.update.attributeVariantError'
  | 'products.update.attributesGroupNotFound'
  | 'products.update.attributeNotFound'
  | 'products.update.attributeValueNotFound'
  | 'products.update.allOptionsAreUsed'
  | 'products.update.success'
  | 'products.delete.notFound'
  | 'products.delete.error'
  | 'products.delete.success'
  | 'products.connection.exist'
  | 'products.connection.createError'
  | 'products.connection.updateError'
  | 'products.connection.deleteError'
  | 'products.connection.noAttributeError'
  | 'products.connection.intersect'
  | 'products.connection.createSuccess'
  | 'products.connection.addProductSuccess'
  | 'products.connection.deleteProductSuccess'
  // Products validation
  | 'validation.products.id'
  | 'validation.productConnections.id'
  | 'validation.products.name'
  | 'validation.products.originalName'
  | 'validation.products.cardName'
  | 'validation.products.description'
  | 'validation.products.rubrics'
  | 'validation.products.manufacturer'
  | 'validation.products.price'
  | 'validation.products.attributesGroupId'
  | 'validation.products.attributeId'
  | 'validation.products.attributeSlug'
  | 'validation.products.assets'

  // Brands ----------
  | 'brands.create.duplicate'
  | 'brands.create.error'
  | 'brands.create.success'
  | 'brands.update.duplicate'
  | 'brands.update.notFound'
  | 'brands.update.error'
  | 'brands.update.success'
  | 'brands.delete.notFound'
  | 'brands.delete.used'
  | 'brands.delete.error'
  | 'brands.delete.success'
  // Brands validation
  | 'validation.brands.id'
  | 'validation.brands.name'
  | 'validation.brands.url'
  | 'validation.brands.description'

  // BrandCollections ----------
  | 'brandCollections.create.duplicate'
  | 'brandCollections.create.error'
  | 'brandCollections.create.success'
  | 'brandCollections.update.duplicate'
  | 'brandCollections.update.notFound'
  | 'brandCollections.update.error'
  | 'brandCollections.update.success'
  | 'brandCollections.delete.notFound'
  | 'brandCollections.delete.used'
  | 'brandCollections.delete.error'
  | 'brandCollections.delete.success'
  // BrandCollections validation
  | 'validation.brandCollections.id'
  | 'validation.brandCollections.name'
  | 'validation.brandCollections.description'

  // Manufacturers ----------
  | 'manufacturers.create.duplicate'
  | 'manufacturers.create.error'
  | 'manufacturers.create.success'
  | 'manufacturers.update.duplicate'
  | 'manufacturers.update.notFound'
  | 'manufacturers.update.error'
  | 'manufacturers.update.success'
  | 'manufacturers.delete.notFound'
  | 'manufacturers.delete.used'
  | 'manufacturers.delete.error'
  | 'manufacturers.delete.success'
  // Manufacturers validation
  | 'validation.manufacturers.id'
  | 'validation.manufacturers.name'
  | 'validation.manufacturers.url'
  | 'validation.manufacturers.description'

  // Metrics ----------
  | 'metrics.create.duplicate'
  | 'metrics.create.error'
  | 'metrics.create.success'
  | 'metrics.update.duplicate'
  | 'metrics.update.error'
  | 'metrics.update.success'
  | 'metrics.delete.used'
  | 'metrics.delete.error'
  | 'metrics.delete.success'
  // Metrics validation
  | 'validation.metrics.id'
  | 'validation.metrics.name'

  // Orders ----------
  | 'orders.makeAnOrder.guestRoleNotFound'
  | 'orders.makeAnOrder.userCreationError'
  | 'orders.makeAnOrder.userCreationDuplicate'
  | 'orders.makeAnOrder.productsNotFound'
  | 'orders.makeAnOrder.initialStatusNotFound'
  | 'orders.makeAnOrder.error'
  | 'orders.makeAnOrder.empty'
  | 'orders.makeAnOrder.success'
  // Orders validation

  // Fallback for empty key
  | 'none';
