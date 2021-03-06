import { IconType } from './iconTypes';

export type Theme = 'light' | 'dark';
export type ButtonTheme = 'primary' | 'secondary' | 'secondary-b' | 'gray';
export type InputTheme = 'primary' | 'secondary';
export type SizeType = 'small' | 'normal';
export type ModalSizeType = 'small' | 'normal' | 'midWide' | 'wide';
export type ButtonType = 'submit' | 'button' | 'reset';
export type InputType = 'text' | 'number' | 'email' | 'tel' | 'password' | 'color';
export type JustifyType = 'flex-end' | 'flex-start';
export type OnOffType = 'on' | 'off';
export type NotificationVariant = 'success' | 'warning' | 'error';

export type ObjectType = Record<string, any>;

export interface ClientNavItemChildInterface {
  name: string;
  path: string;
  hidden?: boolean;
  testId?: string;
}

export interface ClientNavItemInterface {
  name: string;
  path?: string;
  icon?: IconType;
  counter?: number;
  children?: ClientNavItemChildInterface[];
  hidden?: boolean;
  testId?: string;
  shallow?: boolean;
  exact?: boolean;
  disabled?: boolean;
}

/*
 * Copyright 2019 Ipregistry (https://ipregistry.co).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export interface IpInfoInterface {
  ip: string;
  type: 'IPv4' | 'IPv6';
  hostname: string | null;
  carrier?: Carrier;
  company?: Company;
  connection?: Connection;
  currency?: Currency;
  location?: Location;
  security?: Security;
  time_zone?: TimeZone;
  user_agent?: UserAgent;
}

export interface UserAgent {
  header: string | null;
  name: string | null;
  type: string | null;
  version: string | null;
  version_major: string | null;
  device: UserAgentDevice;
  engine: UserAgentEngine;
  operating_system: UserAgentOperatingSystem;
}

export interface UserAgentDevice {
  brand: string | null;
  name: string | null;
  type: string | null;
}

export interface UserAgentEngine {
  name: string | null;
  type: string | null;
  version: string | null;
  version_major: string | null;
}

export interface UserAgentOperatingSystem {
  name: string | null;
  type: string | null;
  version: string | null;
}

export interface Carrier {
  name: string | null;
  mcc: string | null;
  mnc: string | null;
}

export interface Company {
  domain: string | null;
  name: string | null;
  type: 'business' | 'education' | 'government' | 'isp' | 'hosting' | null;
}

export interface Connection {
  asn: number | null;
  domain: string | null;
  organization: string | null;
  route: string | null;
  type: 'business' | 'education' | 'government' | 'inactive' | 'isp' | 'hosting' | null;
}

export interface Currency {
  code: string | null;
  name: string | null;
  name_native: string | null;
  plural: string | null;
  plural_native: string | null;
  symbol: string | null;
  symbol_native: string | null;
  format: CurrencyFormat;
}

export interface CurrencyFormat {
  negative: CurrencyFormatPrefixSuffix;
  positive: CurrencyFormatPrefixSuffix;
}

export interface CurrencyFormatPrefixSuffix {
  prefix: string | null;
  suffix: string | null;
}

export interface Location {
  continent: Continent;
  country: Country;
  region: Region;
  city: string | null;
  postal: string | null;
  latitude: number | null;
  longitude: number | null;
  language: Language;
  in_eu: boolean;
}

export interface Continent {
  code: string | null;
  name: string | null;
}

export interface Country {
  area: number;
  borders: string[];
  calling_code: string | null;
  capital: string | null;
  code: string | null;
  name: string | null;
  population: number;
  population_density: number;
  flag: Flag;
  languages: Language[];
  tld: string | null;
}

export interface Flag {
  emoji: string | null;
  emoji_unicode: string | null;
  emojitwo: string | null;
  noto: string | null;
  twemoji: string | null;
  wikimedia: string | null;
}

export interface Region {
  code: string | null;
  name: string | null;
}

export interface Language {
  code: string | null;
  name: string | null;
  native: string | null;
}

export interface Security {
  is_bogon: boolean;
  is_cloud_provider: boolean;
  is_tor: boolean;
  is_tor_exit_node: boolean;
  is_proxy: boolean;
  is_anonymous: boolean;
  is_abuser: boolean;
  is_attacker: boolean;
  is_threat: boolean;
}

export interface TimeZone {
  id: string | null;
  abbreviation: string | null;
  current_time: string | null;
  name: string | null;
  offset: number;
  in_daylight_saving: boolean;
}

export interface Account {
  remaining_credits: number;
  rate_limit: number;
  rate_limit_remaining: number;
}
