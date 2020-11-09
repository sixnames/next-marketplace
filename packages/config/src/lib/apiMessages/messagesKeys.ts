const messagesKeys = [
  // Common validation ----------
  'validation.string.min',
  'validation.string.max',
  'validation.number.min',
  'validation.number.max',
  'validation.email',
  'validation.email.required',
  'validation.phone',
  'validation.phone.required',
  'validation.color',
  'validation.color.required',
  'validation.translation.key',
  'validation.contacts',

  // Configs ----------
  'configs.update.success',
  'configs.update.error',
  'configs.updateAsset.notFound',
  'configs.updateAsset.error',
  'configs.updateAsset.success',
  // Configs validation
  'validation.configs.id',
  'validation.configs.value',
  'validation.configs.translation',
  'validation.configs.cityKey',

  // Currencies ----------
  'currencies.create.duplicate',
  'currencies.create.error',
  'currencies.create.success',
  'currencies.update.duplicate',
  'currencies.update.error',
  'currencies.update.success',
  'currencies.delete.used',
  'currencies.delete.error',
  'currencies.delete.success',
  // Currencies validation
  'validation.currencies.id',
  'validation.currencies.nameString',

  // Cities ----------
  'cities.create.notFound',
  'cities.create.duplicate',
  'cities.create.error',
  'cities.create.success',
  'cities.update.notFound',
  'cities.update.duplicate',
  'cities.update.error',
  'cities.update.success',
  'cities.delete.notFound',
  'cities.delete.error',
  'cities.delete.success',
  // Cities validation
  'validation.cities.id',
  'validation.cities.name',
  'validation.cities.slug',

  // Countries ----------
  'countries.create.duplicate',
  'countries.create.error',
  'countries.create.success',
  'countries.update.notFound',
  'countries.update.duplicate',
  'countries.update.error',
  'countries.update.success',
  'countries.delete.notFound',
  'countries.delete.error',
  'countries.delete.success',
  // Countries validation
  'validation.countries.id',
  'validation.countries.nameString',
  'validation.countries.currency',

  // Languages ----------
  'languages.setLanguageAsDefault.error',
  'languages.setLanguageAsDefault.success',
  'languages.create.duplicate',
  'languages.create.error',
  'languages.create.success',
  'languages.update.duplicate',
  'languages.update.error',
  'languages.update.success',
  'languages.delete.default',
  'languages.delete.error',
  'languages.delete.success',
  // Languages validation
  'validation.languages.id',
  'validation.languages.name',
  'validation.languages.key',
  'validation.languages.nativeName',

  // Roles ----------
  'roles.create.duplicate',
  'roles.create.error',
  'roles.create.success',
  'roles.update.duplicate',
  'roles.update.error',
  'roles.update.success',
  'roles.delete.notFound',
  'roles.delete.rulesNotFound',
  'roles.delete.rulesError',
  'roles.delete.guestRoleNotFound',
  'roles.delete.usersUpdateError',
  'roles.delete.error',
  'roles.delete.success',
  'roles.permissions.notFound',
  'roles.permissions.error',
  'roles.permissions.success',
  // Roles validation
  'validation.roles.id',
  'validation.roles.name',
  'validation.roles.description',
  'validation.roles.ruleId',
  'validation.roles.navItemId',
  'validation.roles.operationId',

  // Users ----------
  'users.create.duplicate',
  'users.create.error',
  'users.create.success',
  'users.update.duplicate',
  'users.update.error',
  'users.update.passwordSuccess',
  'users.update.success',
  'users.delete.error',
  'users.delete.success',
  'users.signIn.authorized',
  'users.signIn.emailError',
  'users.signIn.passwordError',
  'users.signIn.success',
  'users.signOut.error',
  'users.signOut.success',
  // Users validation
  'validation.users.id',
  'validation.users.name',
  'validation.users.lastName',
  'validation.users.secondName',
  'validation.users.role',
  'validation.users.password',
  'validation.users.passwordCompare',

  // Companies ----------
  'companies.create.duplicate',
  'companies.create.error',
  'companies.create.success',
  'companies.update.notFound',
  'companies.update.duplicate',
  'companies.update.error',
  'companies.update.success',
  'companies.delete.error',
  'companies.delete.success',
  // Companies validation
  'validation.companies.id',
  'validation.companies.nameString',
  'validation.companies.owner',
  'validation.companies.staff',
  'validation.companies.logo',

  // Options groups ----------
  'optionsGroups.create.duplicate',
  'optionsGroups.create.error',
  'optionsGroups.create.success',
  'optionsGroups.update.duplicate',
  'optionsGroups.update.error',
  'optionsGroups.update.success',
  'optionsGroups.delete.used',
  'optionsGroups.delete.optionsError',
  'optionsGroups.delete.error',
  'optionsGroups.delete.success',
  'optionsGroups.addOption.groupError',
  'optionsGroups.addOption.colorError',
  'optionsGroups.addOption.iconError',
  'optionsGroups.addOption.optionError',
  'optionsGroups.addOption.duplicate',
  'optionsGroups.addOption.error',
  'optionsGroups.addOption.success',
  'optionsGroups.updateOption.groupError',
  'optionsGroups.updateOption.duplicate',
  'optionsGroups.updateOption.error',
  'optionsGroups.updateOption.success',
  'optionsGroups.deleteOption.groupError',
  'optionsGroups.deleteOption.error',
  'optionsGroups.deleteOption.success',
  // Options groups validation
  'validation.optionsGroup.id',
  'validation.optionsGroup.name',
  'validation.option.id',
  'validation.option.name',
  'validation.option.variantKey',
  'validation.option.variantValue',
  'validation.option.gender',

  // Attributes groups ----------
  'attributesGroups.create.duplicate',
  'attributesGroups.create.error',
  'attributesGroups.create.success',
  'attributesGroups.update.duplicate',
  'attributesGroups.update.error',
  'attributesGroups.update.success',
  'attributesGroups.delete.used',
  'attributesGroups.delete.notFound',
  'attributesGroups.delete.attributesError',
  'attributesGroups.delete.error',
  'attributesGroups.delete.success',
  'attributesGroups.addAttribute.groupError',
  'attributesGroups.addAttribute.attributeError',
  'attributesGroups.addAttribute.duplicate',
  'attributesGroups.addAttribute.addError',
  'attributesGroups.addAttribute.success',
  'attributesGroups.updateAttribute.groupError',
  'attributesGroups.updateAttribute.duplicate',
  'attributesGroups.updateAttribute.updateError',
  'attributesGroups.updateAttribute.success',
  'attributesGroups.deleteAttribute.deleteError',
  'attributesGroups.deleteAttribute.groupError',
  'attributesGroups.deleteAttribute.success',
  // Attributes groups validation
  'validation.attributesGroups.id',
  'validation.attributesGroups.name',
  'validation.attributes.id',
  'validation.attributes.name',
  'validation.attributes.variant',
  'validation.attributes.position',
  'validation.attributes.options',

  // Rubric variants ----------
  'rubricVariants.create.duplicate',
  'rubricVariants.create.error',
  'rubricVariants.create.success',
  'rubricVariants.update.duplicate',
  'rubricVariants.update.error',
  'rubricVariants.update.success',
  'rubricVariants.delete.used',
  'rubricVariants.delete.error',
  'rubricVariants.delete.success',
  // Rubric variants validation
  'validation.rubricVariants.id',
  'validation.rubricVariants.name',

  // Rubrics ----------
  'rubrics.create.duplicate',
  'rubrics.create.error',
  'rubrics.create.success',
  'rubrics.update.notFound',
  'rubrics.update.duplicate',
  'rubrics.update.error',
  'rubrics.update.success',
  'rubrics.delete.notFound',
  'rubrics.delete.error',
  'rubrics.delete.success',
  'rubrics.addAttributesGroup.notFound',
  'rubrics.addAttributesGroup.error',
  'rubrics.addAttributesGroup.success',
  'rubrics.updateAttributesGroup.notFound',
  'rubrics.updateAttributesGroup.error',
  'rubrics.updateAttributesGroup.success',
  'rubrics.deleteAttributesGroup.notFound',
  'rubrics.deleteAttributesGroup.ownerError',
  'rubrics.deleteAttributesGroup.error',
  'rubrics.deleteAttributesGroup.success',
  'rubrics.addProduct.notFound',
  'rubrics.addProduct.exists',
  'rubrics.addProduct.error',
  'rubrics.addProduct.success',
  'rubrics.deleteProduct.notFound',
  'rubrics.deleteProduct.error',
  'rubrics.deleteProduct.success',
  // Rubric validation
  'validation.rubrics.id',
  'validation.rubrics.name',
  'validation.rubrics.variant',
  'validation.rubrics.defaultTitle',
  'validation.rubrics.keyword',
  'validation.rubrics.gender',

  // Products ----------
  'products.create.duplicate',
  'products.create.error',
  'products.create.success',
  'products.update.duplicate',
  'products.update.notFound',
  'products.update.error',
  'products.update.attributeVariantError',
  'products.update.attributesGroupNotFound',
  'products.update.attributeNotFound',
  'products.update.attributeValueNotFound',
  'products.update.allOptionsAreUsed',
  'products.update.success',
  'products.delete.notFound',
  'products.delete.error',
  'products.delete.success',
  'products.connection.exist',
  // Products validation
  'validation.products.id',
  'validation.productConnections.id',
  'validation.products.name',
  'validation.products.cardName',
  'validation.products.description',
  'validation.products.rubrics',
  'validation.products.price',
  'validation.products.attributesGroupId',
  'validation.products.attributeId',
  'validation.products.attributeKey',
  'validation.products.assets',

  // Metrics ----------
  'metrics.create.duplicate',
  'metrics.create.error',
  'metrics.create.success',
  'metrics.update.duplicate',
  'metrics.update.error',
  'metrics.update.success',
  'metrics.delete.used',
  'metrics.delete.error',
  'metrics.delete.success',
  // Metrics validation
  'validation.metrics.id',
  'validation.metrics.name',

  // Fallback for empty key
  'none',
] as const;

export type MessageKey = typeof messagesKeys[number];

export interface LanguageInterface {
  key: string;
  value: string;
}

export interface MessageInterface {
  key: MessageKey;
  message: LanguageInterface[];
}
