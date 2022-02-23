import capitalize from 'capitalize';
import { TranslationModel } from 'db/dbModels';
import dirTree from 'directory-tree';
import fs from 'fs';
import { DEFAULT_LOCALE } from 'lib/config/common';
import { set } from 'lodash';

const excludedNames = ['webmanifest', 'robots', 'sitemap', '404', '_app', '_document', '_error'];

function cleanupName(name: string) {
  return name
    .replace('[', '')
    .replace(']', '')
    .replace('...', '')
    .replace('.tsx', '')
    .replace('.ts', '');
}

function normalizeFieldName(name: string) {
  const nameParts = name.split('-');
  const firstWord = nameParts[0];
  const otherWords = nameParts.slice(1).map((word) => capitalize(word));
  const fieldName = [firstWord, ...otherWords].join('');
  return fieldName;
}

interface NormalizeUrlPathInterface {
  pagePath: string;
  replacePath: string;
}

function normalizeUrlPath({ pagePath, replacePath }: NormalizeUrlPathInterface) {
  const url = pagePath
    .replace(replacePath, '')
    .replace('index', '')
    .replaceAll('/[...filters].tsx', '')
    .replaceAll('/[...filters].ts', '')
    .replaceAll('/[...nextauth].ts', '')
    .replaceAll('/[...props].ts', '')
    .replaceAll('/[...url].tsx', '')
    .replace('.tsx', '')
    .replace('.ts', '')
    .replaceAll('[', '${')
    .replaceAll(']', '}')
    .split('/')
    .filter((part) => part)
    .join('/');
  return `/${url}`;
}

function normalizeFieldPath(urlPath: string) {
  const pagePathArray = urlPath.split('/');
  const normalizedPathNames = pagePathArray
    .filter((part) => part)
    .map((name) => {
      const cleanName = name.replace('${', '').replace('}', '');
      return normalizeFieldName(cleanName);
    })
    .join('.');
  return normalizedPathNames;
}

interface IterPagesInterface {
  pagesPath: string;
  replacePath: string;
  addBasePathVariable: boolean;
}

function iterPages({ pagesPath, replacePath, addBasePathVariable }: IterPagesInterface) {
  const allPagesTree = dirTree(pagesPath, {
    attributes: ['type'],
  });
  const pages = allPagesTree.children || [];
  const props = new Set<string>();
  const pathNames = new Set<string>();
  const fields: Record<any, any> = {};

  function iter(page: dirTree.DirectoryTree) {
    // console.log(page);
    const excluded = excludedNames.some((excludedName) => {
      return page.name.includes(excludedName);
    });
    if (excluded) {
      return;
    }
    const cleanName = cleanupName(page.name);

    const urlPath = normalizeUrlPath({
      pagePath: page.path,
      replacePath,
    });

    let fieldPath = normalizeFieldPath(urlPath);
    if (!fieldPath) {
      fieldPath = 'root';
    }

    // eslint-disable-next-line no-template-curly-in-string
    const finalUrl = addBasePathVariable ? '${basePath}' + urlPath : urlPath;
    set(fields, `${fieldPath}.url`, finalUrl);

    if (page.name.includes('[') && !page.name.includes('...')) {
      props.add(cleanName);
    }

    if (!page.path.includes('api') && !page.name.includes('[') && !page.name.includes('...')) {
      pathNames.add(cleanName);
    }

    (page.children || []).forEach(iter);
  }
  pages.forEach(iter);

  let propsString = '';
  props.forEach((prop) => {
    propsString = `${propsString}${prop}?: DynamicPagePropType; \n`;
  });

  const propsDestructure = Array.from(props).join(',');

  const fieldsString = JSON.stringify(fields)
    .replaceAll(':"', ':`')
    .replaceAll('",', '`,')
    .replaceAll('"}', '`}');

  const paths: Record<string, TranslationModel> = {};
  Array.from(pathNames).forEach((key) => {
    paths[key] = {
      [DEFAULT_LOCALE]: '',
    };
  });

  return {
    props,
    fields,
    propsString,
    propsDestructure,
    fieldsString,
    paths,
  };
}

(function () {
  console.log('reading pages directory');
  const allPagesResult = iterPages({
    pagesPath: './pages',
    replacePath: 'pages',
    addBasePathVariable: false,
  });

  console.log('reading pages/cms/companies/[companyId] directory');
  const companyPagesResult = iterPages({
    pagesPath: './pages/cms/companies/[companyId]',
    replacePath: 'pages/cms/companies/[companyId]',
    addBasePathVariable: true,
  });

  // const paths = ${JSON.stringify(allPagesResult.paths)}
  const output = `
  import { ObjectId } from 'mongodb';
  
  type DynamicPagePropType = ObjectId | string | null;
  export interface LinkPropsInterface {
    ${allPagesResult.propsString}
  }
  
  export function getProjectLinks(props?: LinkPropsInterface) {
    const {${allPagesResult.propsDestructure}} = props || {};
    return ${allPagesResult.fieldsString};
  }
  
  export interface ConsoleCompanyLinkPropsInterface {
    basePath: string;
    ${allPagesResult.propsString}
  }
  
  export function getConsoleCompanyLinks(props: ConsoleCompanyLinkPropsInterface) {
    const {basePath, ${companyPagesResult.propsDestructure}} = props;
    return ${companyPagesResult.fieldsString};
  }
  
  export interface CmsCompanyLinkPropsInterface extends Omit<ConsoleCompanyLinkPropsInterface, 'basePath'> {
    companyId: ObjectId | string;
  }
 
  export function getCmsCompanyLinks(props: CmsCompanyLinkPropsInterface) {
    const links = getProjectLinks({
      companyId: props.companyId,
    });
    
    return getConsoleCompanyLinks({
    basePath: links.cms.companies.companyId.url,
    ...props,
    });
  }
  `;
  fs.writeFileSync('./lib/links/getProjectLinks.ts', output);
})();
