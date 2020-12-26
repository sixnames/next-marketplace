interface NameUtilInterface {
  name?: string | null;
  lastName?: string | null;
  secondName?: string | null;
  [key: string]: any;
}

export const getFullName = (props: NameUtilInterface): string => {
  const { name, lastName, secondName } = props;
  return `${lastName ? `${lastName} ` : ''}${name}${secondName ? ` ${secondName}` : ''}`;
};

export const getShortName = (props: NameUtilInterface): string => {
  const { name, lastName } = props;
  if (lastName && lastName.length > 0 && name) {
    return `${name.charAt(0)}.${lastName}`;
  }

  if (!name) {
    return 'Undefined name';
  }

  return name;
};
