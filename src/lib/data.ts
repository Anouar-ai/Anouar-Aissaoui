import { Post, Author, Category, Tag } from './types';
import { getPosts as getPostsFromWP, getPostBySlug as getPostBySlugFromWP, getCategories as getCategoriesFromWP, getTags as getTagsFromWP, getAuthors as getAuthorsFromWP, getPostsByCategory as getPostsByCategoryFromWP, getPostsByTag as getPostsByTagFromWP, getPostsByAuthor as getPostsByAuthorFromWP } from './wordpress';


export async function getPosts(): Promise<Post[]> {
  return getPostsFromWP();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return getPostBySlugFromWP(slug);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return getPostsByCategoryFromWP(categorySlug);
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
    return getPostsByTagFromWP(tagSlug);
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
    return getPostsByAuthorFromWP(authorSlug);
}

export async function getCategories(): Promise<Category[]> {
    return getCategoriesFromWP();
}

export async function getTags(): Promise<Tag[]> {
    return getTagsFromWP();
}

export async function getAuthors(): Promise<Author[]> {
    return getAuthorsFromWP();
}
