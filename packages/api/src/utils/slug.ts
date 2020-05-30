import cyrillicToTranslit from 'cyrillic-to-translit-js';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  return translit.transform(name ? `${name}` : '', '_');
};
