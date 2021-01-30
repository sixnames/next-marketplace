function getResolverErrorMessage(args: any) {
  const { errors = [], name, message } = args;

  // If mongo error
  if (name && message) {
    return `${name}: ${message}`;
  }

  if (!errors) {
    return 'Error message not found';
  }

  // If validation error
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
