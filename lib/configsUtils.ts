import { ConfigInterface } from 'db/uiInterfaces';
import { noNaN } from './numbers';

interface GetCurrentConfigInterface {
  configs: ConfigInterface[];
  slug: string;
}

export function getCurrentConfig({
  slug,
  configs,
}: GetCurrentConfigInterface): ConfigInterface | undefined {
  return configs.find((config) => config.slug === slug);
}

export function getConfigBooleanValue({ configs, slug }: GetCurrentConfigInterface): boolean {
  const config = getCurrentConfig({ slug, configs });
  return config?.singleValue === 'true';
}

export function getConfigStringValue({ configs, slug }: GetCurrentConfigInterface): string {
  const config = getCurrentConfig({ slug, configs });
  return config?.singleValue || '';
}

export function getConfigNumberValue({ configs, slug }: GetCurrentConfigInterface): number {
  const config = getCurrentConfig({ slug, configs });
  return noNaN(config?.singleValue);
}

export function getConfigListValue({ configs, slug }: GetCurrentConfigInterface): string[] {
  const config = getCurrentConfig({ slug, configs });
  return config?.value || [];
}
