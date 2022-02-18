interface FormatDateTimeInterface {
  value?: any;
  locale: string;
}

export function formatDateTime({ value, locale }: FormatDateTimeInterface): string | null {
  if (!value) {
    return null;
  }

  try {
    const date = new Date(value);
    const formattedDate = Intl.DateTimeFormat(locale, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false,
    }).format(date);
    return formattedDate;
  } catch {
    return null;
  }
}

export function formatDate({ value, locale }: FormatDateTimeInterface): string | null {
  if (!value) {
    return null;
  }

  try {
    const date = new Date(value);
    const formattedDate = Intl.DateTimeFormat(locale, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dateStyle: 'short',
      hour12: false,
    }).format(date);
    return formattedDate;
  } catch {
    return null;
  }
}
