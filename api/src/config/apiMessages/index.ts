import attributesGroupsMessages from './attributesGroupsMessages';
import languagesMessages from './languagesMessages';
import productsMessages from './productsMessages';
import metricsMessages from './metricsMessages';
import usersMessages from './usersMessages';
import rubricVariantsMessages from './rubricVariantsMessages';
import optionsGroupsMessages from './optionsGroupsMessages';
import rubricsMessages from './rubricsMessages';

const apiMessages = [
  ...languagesMessages,
  ...usersMessages,
  ...optionsGroupsMessages,
  ...attributesGroupsMessages,
  ...rubricVariantsMessages,
  ...rubricsMessages,
  ...productsMessages,
  ...metricsMessages,
];

export default apiMessages;
