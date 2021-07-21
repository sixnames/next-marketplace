export const notAZeroRegEx = /^(?!0$)/;
export const passwordRegEx = /^.{6,30}$/;
export const phoneRegEx = /^(\+\d|\d)+\s?\(?\d{3}\)?\s?\d{3}-?\s?\d{2}-?\s?\d{2}$/i;
// export const phoneRegEx = /^(\+7|\+8|7|8|\+3|3)+\s?\(?\d{3}\)?\s?\d{3}-?\s?\d{2}-?\s?\d{2}$/i;
export const emailRegEx =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
