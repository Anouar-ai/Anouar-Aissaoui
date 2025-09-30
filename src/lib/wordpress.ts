import type { Post, Category, Tag, Author } from './types';
import { PlaceHolderImages } from './placeholder-images';

const API_URL = 'https://dev-anouarweb.pantheonsite.io/graphql';

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const json = await res.json();
    if (json.errors) {
        console.error(json.errors);
        throw new Error('Failed to fetch API');
    }
    return json.data;
}

function mapPost(postData: any, index: number = 0): Post {
    const { id, title, slug, excerpt, content, date, featuredImage, author, categories, tags, seo } = postData;
    const category = categories?.edges[0]?.node || { name: 'Uncategorized', slug: 'uncategorized' };

    const placeholderImage = PlaceHolderImages.find(p => p.id === `post-${(index % 8) + 1}`) || PlaceHolderImages[0];

    return {
        id,
        title,
        slug,
        excerpt: excerpt || content.slice(0, 150) + '...',
        content,
        image: featuredImage?.node?.sourceUrl || placeholderImage.imageUrl,
        imageHint: featuredImage?.node?.altText || placeholderImage.imageHint,
        publishedAt: date,
        author: {
            id: author?.node?.id || '0',
            name: author?.node?.name || 'Anonymous',
            slug: author?.node?.slug || 'anonymous',
            avatar: author?.node?.avatar?.url || PlaceHolderImages.find(p => p.id.startsWith('author-'))?.imageUrl || `https://www.gravatar.com/avatar/${author?.node?.id}?d=mp`,
            avatarHint: author?.node?.name || 'author avatar'
        },
        category: {
            id: category.id || '0',
            name: category.name,
            slug: category.slug,
        },
        tags: tags?.edges.map((edge: any) => edge.node) || [],
        seo: {
            title: seo?.title || title,
            metaDesc: seo?.metaDesc || excerpt || '',
        }
    };
}

export async function getPosts(): Promise<Post[]> {
    const data = await fetchAPI(`
        query AllPosts {
            posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
                edges {
                    node {
                        id
                        title
                        excerpt(format: RENDERED)
                        slug
                        content(format: RENDERED)
                        date
                        featuredImage {
                            node {
                                sourceUrl
                                altText
                            }
                        }
                        author {
                          node {
                            id
                            name
                            slug
                            avatar {
                              url
                            }
                          }
                        }
                        categories {
                          edges {
                            node {
                              id
                              name
                              slug
                            }
                          }
                        }
                        tags {
                          edges {
                            node {
                              id
                              name
                              slug
                            }
                          }
                        }
                        seo {
                          title
                          metaDesc
                        }
                    }
                }
            }
        }
    `);
    return data?.posts.edges.map((edge: any, index: number) => mapPost(edge.node, index));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const data = await fetchAPI(`
        query PostBySlug($id: ID!, $idType: PostIdType!) {
            post(id: $id, idType: $idType) {
                id
                title
                slug
                content(format: RENDERED)
                excerpt(format: RENDERED)
                date
                featuredImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                author {
                  node {
                    id
                    name
                    slug
                    avatar {
                      url
                    }
                  }
                }
                categories {
                  edges {
                    node {
                      id
                      name
                      slug
                    }
                  }
                }
                tags {
                  edges {
                    node {
                      id
                      name
                      slug
                    }
                  }
                }
                seo {
                  title
                  metaDesc
                }
            }
        }
    `, {
        variables: {
            id: slug,
            idType: 'SLUG'
        }
    });

    if (!data.post) return undefined;
    
    return mapPost(data.post);
}

export async function getCategories(): Promise<Category[]> {
    const data = await fetchAPI(`
        query AllCategories {
            categories {
                edges {
                    node {
                        id
                        name
                        slug
                        seo {
                            title
                            metaDesc
                        }
                    }
                }
            }
        }
    `);
    return data?.categories.edges.map((edge: any) => edge.node);
}

export async function getTags(): Promise<Tag[]> {
    const data = await fetchAPI(`
        query AllTags {
            tags {
                edges {
                    node {
                        id
                        name
                        slug
                    }
                }
            }
        }
    `);
    return data?.tags.edges.map((edge: any) => edge.node);
}

export async function getAuthors(): Promise<Author[]> {
    const data = await fetchAPI(`
        query AllAuthors {
            users {
                edges {
                    node {
                        id
                        name
                        slug
                        avatar {
                            url
                        }
                    }
                }
            }
        }
    `);
    return data?.users.edges.map((edge: any) => {
        const authorImages = [
            PlaceHolderImages.find(p => p.id === 'author-jane-doe'),
            PlaceHolderImages.find(p => p.id === 'author-john-smith')
        ].filter(Boolean);
        const authorImage = authorImages[Math.floor(Math.random() * authorImages.length)];
        return {
            id: edge.node.id,
            name: edge.node.name,
            slug: edge.node.slug,
            avatar: edge.node.avatar?.url || authorImage?.imageUrl || `https://www.gravatar.com/avatar/${edge.node.id}?d=mp`,
            avatarHint: edge.node.name || authorImage?.imageHint || 'author avatar'
        }
    });
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const data = await fetchAPI(
    `
    query PostsByCategory($id: ID!, $idType: CategoryIdType!) {
      category(id: $id, idType: $idType) {
        posts {
          edges {
            node {
              id
              title
              excerpt(format: RENDERED)
              content(format: RENDERED)
              slug
              date
              featuredImage {
                  node {
                      sourceUrl
                      altText
                  }
              }
              author {
                node {
                  id
                  name
                  slug
                  avatar {
                    url
                  }
                }
              }
              categories {
                edges {
                  node {
                    id
                    name
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: categorySlug,
        idType: 'SLUG',
      },
    }
  );
  return data?.category.posts.edges.map((edge: any, index: number) => mapPost(edge.node, index));
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const data = await fetchAPI(
    `
    query PostsByTag($id: ID!, $idType: TagIdType!) {
      tag(id: $id, idType: $idType) {
        posts {
          edges {
            node {
              id
              title
              excerpt(format: RENDERED)
              content(format: RENDERED)
              slug
              date
              featuredImage {
                  node {
                      sourceUrl
                      altText
                  }
              }
              author {
                node {
                  id
                  name
                  slug
                  avatar {
                    url
                  }
                }
              }
              categories {
                edges {
                  node {
                    id
                    name
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: tagSlug,
        idType: 'SLUG',
      },
    }
  );
  return data?.tag.posts.edges.map((edge: any, index: number) => mapPost(edge.node, index));
}


export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  const data = await fetchAPI(
    `
    query PostsByAuthor($id: ID!, $idType: UserNodeIdTypeEnum!) {
      user(id: $id, idType: $idType) {
        posts {
          edges {
            node {
              id
              title
              excerpt(format: RENDERED)
              content(format: RENDERED)
              slug
              date
              featuredImage {
                  node {
                      sourceUrl
                      altText
                  }
              }
              author {
                node {
                  id
                  name
                  slug
                  avatar {
                    url
                  }
                }
              }
              categories {
                edges {
                  node {
                    id
                    name
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: authorSlug,
        idType: 'SLUG',
      },
    }
  );
  return data?.user.posts.edges.map((edge: any, index: number) => mapPost(edge.node, index));
}
