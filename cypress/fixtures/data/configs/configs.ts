import { MOCK_ADDRESS_A, MOCK_ADDRESS_B } from '../../../../tests/mocks';
import { getConfigTemplates } from '../../../../lib/getConfigTemplates';
import { ASSETS_DIST_CONFIGS, DEFAULT_COMPANY_SLUG } from '../../../../config/common';
require('dotenv').config();

const defaultConfigs = getConfigTemplates({
  siteName: 'Default site',
  companySlug: DEFAULT_COMPANY_SLUG,
  assetsPath: `/${ASSETS_DIST_CONFIGS}/${DEFAULT_COMPANY_SLUG}`,
  phone: ['+86667774433'],
  email: ['default@email.com'],
  address: JSON.stringify(MOCK_ADDRESS_A),
});

const companyASlug = 'company_a';
const companyAConfigs = getConfigTemplates({
  siteName: 'Company A',
  companySlug: companyASlug,
  assetsPath: `/${ASSETS_DIST_CONFIGS}/${companyASlug}`,
  phone: ['+86667774422'],
  email: [`${companyASlug}@email.com`],
  address: JSON.stringify(MOCK_ADDRESS_B),
});

const companyBSlug = 'company_b';
const companyBConfigs = getConfigTemplates({
  siteName: 'Company B',
  companySlug: companyBSlug,
  assetsPath: `/${ASSETS_DIST_CONFIGS}/${companyBSlug}`,
  phone: ['+86667774411'],
  email: [`${companyBSlug}@email.com`],
  address: JSON.stringify(MOCK_ADDRESS_B),
});

// @ts-ignore
export = [...defaultConfigs, ...companyAConfigs, ...companyBConfigs];
