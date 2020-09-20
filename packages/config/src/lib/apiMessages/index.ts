import { commonMessages } from './commonMessages';
import { configsMessages } from './configsMessages';
import { currenciesMessages } from './currenciesMessages';
import { languagesMessages } from './languagesMessages';
import { citiesMessages } from './citiesMessages';
import { countriesMessages } from './countriesMessages';
import { attributesGroupsMessages } from './attributesGroupsMessages';
import { productsMessages } from './productsMessages';
import { metricsMessages } from './metricsMessages';
import { rolesMessages } from './rolesMessages';
import { usersMessages } from './usersMessages';
import { rubricVariantsMessages } from './rubricVariantsMessages';
import { optionsGroupsMessages } from './optionsGroupsMessages';
import { rubricsMessages } from './rubricsMessages';

export * from './commonMessages';
export * from './configsMessages';
export * from './currenciesMessages';
export * from './languagesMessages';
export * from './citiesMessages';
export * from './countriesMessages';
export * from './attributesGroupsMessages';
export * from './productsMessages';
export * from './metricsMessages';
export * from './rolesMessages';
export * from './usersMessages';
export * from './rubricVariantsMessages';
export * from './optionsGroupsMessages';
export * from './rubricsMessages';
export * from './messagesKeys';

export const apiMessages = [
  ...commonMessages,
  ...configsMessages,
  ...currenciesMessages,
  ...languagesMessages,
  ...citiesMessages,
  ...countriesMessages,
  ...rolesMessages,
  ...usersMessages,
  ...optionsGroupsMessages,
  ...attributesGroupsMessages,
  ...rubricVariantsMessages,
  ...rubricsMessages,
  ...productsMessages,
  ...metricsMessages,
];
