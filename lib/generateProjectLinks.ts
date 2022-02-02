import dirTree from 'directory-tree';
import fs from 'fs';
import capitalize from 'capitalize';
import { set } from 'lodash';

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

function normalizeUrlPath(pagePath: string) {
  const pagePathArray = pagePath.split('/');
  const cleanPagePath = pagePathArray.slice(1).join('/');
  return (
    '/' +
    cleanPagePath
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
      .join('/')
  );
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

(function () {
  console.log('reading pages directory');
  const tree = dirTree('./pages', {
    attributes: ['type'],
  });
  const excludedNames = ['webmanifest', 'robots', 'sitemap'];
  const pages = tree.children || [];
  const props = new Set<string>();
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
    // const fieldName = normalizeFieldName(cleanName);
    const urlPath = normalizeUrlPath(page.path);
    const fieldPath = normalizeFieldPath(urlPath);
    set(fields, `${fieldPath}.url`, urlPath);

    if (page.name.includes('[') && !page.name.includes('...')) {
      props.add(cleanName);
    }
    (page.children || []).forEach(iter);
  }
  pages.forEach(iter);

  let propsString = '';
  props.forEach((prop) => {
    propsString = `${propsString}${prop}: DynamicPagePropType; \n`;
  });

  // const fieldsString = JSON.stringify(fields).replaceAll('"', '`');
  const fieldsString = JSON.stringify(fields)
    .replaceAll(':"', ':`')
    .replaceAll('",', '`,')
    .replaceAll('"}', '`}');
  const output = `
  import { ObjectId } from 'mongodb';
  
  type DynamicPagePropType = ObjectId | string | null | undefined;
  export interface LinkPropsInterface {
    basePath?: string;
    ${propsString}
  }
  
  export function getProjectLinks({${Array.from(props).join(',')}}: LinkPropsInterface) {
    return ${fieldsString};
  }
  `;
  fs.writeFileSync('./lib/projectLinks.ts', output);
  // console.log(fields);
})();
