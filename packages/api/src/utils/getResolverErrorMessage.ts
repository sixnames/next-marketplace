function getResolverErrorMessage(
  { errors }: { errors: { [key: string]: any } | string[] } = { errors: {} },
) {
  const messagesArray: string[] = [];

  if (Array.isArray(errors)) {
    errors.forEach((message: string) => {
      messagesArray.push(message);
    });
  } else {
    Object.keys(errors).forEach((key) => {
      messagesArray.push(errors[key].message);
    });
  }

  return messagesArray.join(', ');
}

export default getResolverErrorMessage;
