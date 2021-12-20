import { MessageBaseInterface } from '../../db/uiInterfaces';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from '../../config/common';

export const blogPostsMessages: MessageBaseInterface[] = [
  {
    slug: 'blogPosts.create.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост с таким заголовком уже существует.`,
      [SECONDARY_LOCALE]: `Blog post with same title is already exists.`,
    },
  },
  {
    slug: 'blogPosts.create.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка создания поста.`,
      [SECONDARY_LOCALE]: `Blog post creation error.`,
    },
  },
  {
    slug: 'blogPosts.create.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост создан.`,
      [SECONDARY_LOCALE]: `Blog post created.`,
    },
  },
  {
    slug: 'blogPosts.update.duplicate',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост с таким заголовком уже существует.`,
      [SECONDARY_LOCALE]: `Blog post with same title is already exists.`,
    },
  },
  {
    slug: 'blogPosts.update.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост не найден.`,
      [SECONDARY_LOCALE]: `Blog post not found.`,
    },
  },
  {
    slug: 'blogPosts.update.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка обновления поста.`,
      [SECONDARY_LOCALE]: `Blog post update error.`,
    },
  },
  {
    slug: 'blogPosts.update.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост обновлён.`,
      [SECONDARY_LOCALE]: `Blog post updated.`,
    },
  },
  {
    slug: 'blogPosts.delete.notFound',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост не найден.`,
      [SECONDARY_LOCALE]: `Blog post not found.`,
    },
  },
  {
    slug: 'blogPosts.delete.error',
    messageI18n: {
      [DEFAULT_LOCALE]: `Ошибка удаления поста.`,
      [SECONDARY_LOCALE]: `Blog post delete error.`,
    },
  },
  {
    slug: 'blogPosts.delete.success',
    messageI18n: {
      [DEFAULT_LOCALE]: `Пост удалён.`,
      [SECONDARY_LOCALE]: `Blog post removed.`,
    },
  },
  {
    slug: 'validation.blogPosts.id',
    messageI18n: {
      [DEFAULT_LOCALE]: `ID поста обязательно.`,
      [SECONDARY_LOCALE]: `Blog post ID is required.`,
    },
  },
  {
    slug: 'validation.blogPosts.title',
    messageI18n: {
      [DEFAULT_LOCALE]: `Заголовок поста обязателен.`,
      [SECONDARY_LOCALE]: `Blog post title is required.`,
    },
  },
  {
    slug: 'validation.blogPosts.companySlug',
    messageI18n: {
      [DEFAULT_LOCALE]: `Slug компании обязателен.`,
      [SECONDARY_LOCALE]: `Company slug is required.`,
    },
  },
  {
    slug: 'validation.blogPosts.description',
    messageI18n: {
      [DEFAULT_LOCALE]: `Описание поста обязательно.`,
      [SECONDARY_LOCALE]: `Blog post description is required.`,
    },
  },
];
