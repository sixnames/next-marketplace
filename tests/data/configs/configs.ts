import { MOCK_ADDRESS_A, MOCK_ADDRESS_B } from '../../mocks';
import { getConfigTemplates } from 'db/utils/getConfigTemplates';
import { ASSETS_DIST_CONFIGS, DEFAULT_COMPANY_SLUG, FILTER_SEPARATOR } from 'lib/config/common';
import categories from '../categories/categories';
import rubrics from '../rubrics/rubrics';
require('dotenv').config();

const companyBSlug = 'company_b';
const visibleRubrics: string[] = [];
const visibleCategoriesInNavDropdown = rubrics.reduce((acc: string[], rubric) => {
  visibleRubrics.push(rubric.slug);
  const rubricCategorySlugs = categories.map(({ _id }) => {
    return `${rubric._id.toHexString()}${FILTER_SEPARATOR}${_id.toHexString()}`;
  });
  return [...acc, ...rubricCategorySlugs];
}, []);

const defaultConfigs = getConfigTemplates({
  siteName: 'Default site',
  companySlug: DEFAULT_COMPANY_SLUG,
  assetsPath: `/${ASSETS_DIST_CONFIGS}/${DEFAULT_COMPANY_SLUG}`,
  phone: ['+86667774433'],
  email: ['default@email.com'],
  address: JSON.stringify(MOCK_ADDRESS_A),
  visibleCategoriesInNavDropdown,
  visibleRubrics,
});

const companyASlug = 'company_a';
const companyAConfigs = getConfigTemplates({
  siteName: 'Company A',
  companySlug: companyASlug,
  assetsPath: `/${ASSETS_DIST_CONFIGS}/${companyASlug}`,
  phone: ['+86667774422'],
  email: [`${companyASlug}@email.com`],
  address: JSON.stringify(MOCK_ADDRESS_B),
  visibleCategoriesInNavDropdown,
  visibleRubrics,
});

const companyBConfigs = getConfigTemplates({
  siteName: 'Company B',
  companySlug: companyBSlug,
  assetsPath: `/${ASSETS_DIST_CONFIGS}/${companyBSlug}`,
  phone: ['+86667774411'],
  email: [`${companyBSlug}@email.com`],
  address: JSON.stringify(MOCK_ADDRESS_B),
  visibleCategoriesInNavDropdown,
  visibleRubrics,
});

// @ts-ignore
export = [...defaultConfigs, ...companyAConfigs, ...companyBConfigs];
