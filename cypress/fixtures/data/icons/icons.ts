import { COL_CATEGORIES } from '../../../../db/collectionNames';
import { IconModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import categories from '../categories/categories';

const icon = `
    <svg version='1.1' xmlns='http://www.w3.org/2000/svg' width='985' height='1024' viewBox='0 0 985 1024'>
<path d='M608.016 336.012c-31.090 33.965 22.091 80.059 53.181 46.093 74.012-80.887 44.658-124.525 16.683-165.774-12.469-18.408-24.273-36.164 16.486-72.79 34.19-30.601-13.765-81.412-48.132-50.636-84.96 76.535-57.131 117.943-27.715 161.327 13.292 19.684 27.238 40.547-10.504 81.779z'></path>
<path d='M451.805 252.654c-31.122 33.981 22.091 80.074 53.15 46.093 74.027-80.87 44.725-124.525 16.715-165.757-12.505-18.409-24.237-36.164 16.486-72.758 34.154-30.633-13.765-81.46-48.163-50.683-84.929 76.536-57.131 117.959-27.715 161.327 13.292 19.668 27.238 40.547-10.472 81.779z'></path>
<path d='M983.167 451.068c-327.105 0-654.229 0-981.336 0v138.709c0 78.497 92.925 191.181 156.776 259.332h-74.422v79.419c0 52.488 44.168 95.472 98.137 95.472h620.419c53.87 0 98.15-43.099 98.15-95.472v-79.419h-74.567c63.917-68.151 156.841-180.834 156.841-259.332v-138.709zM829.519 918.52c0 17.467-3.572 36.053-26.778 36.053h-620.419c-23.24 0-26.812-18.471-26.812-36.053 224.724 0 449.351 0 674.009 0zM727.631 849.109h-470.264c-35.122-33.997-145.877-145.195-176.345-223.819h822.938c-30.468 78.624-141.241 189.822-176.329 223.819zM911.774 555.878h-838.553v-35.399h838.553v35.399z'></path>
<path d='M295.686 336.012c-31.106 33.965 22.109 80.059 53.166 46.093 74.014-80.887 44.692-124.525 16.668-165.774-12.455-18.408-24.239-36.164 16.52-72.79 34.17-30.601-13.783-81.412-48.167-50.636v0c-84.927 76.535-57.115 117.943-27.73 161.327 13.324 19.684 27.271 40.547-10.456 81.779z'></path>
</svg>
    `;

const categoryIcons = categories.map((category) => {
  return {
    _id: getObjectId(`category icon ${category.slug}`),
    collectionName: COL_CATEGORIES,
    documentId: category._id,
    icon,
  };
});

const icons: IconModel[] = [...categoryIcons];

// @ts-ignore
export = icons;
