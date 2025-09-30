export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  avatarHint: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SEO {
    title: string;
    metaDesc: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageHint: string;
  publishedAt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  seo: SEO;
}
