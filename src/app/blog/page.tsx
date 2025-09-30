import { BlogList } from '@/components/blog/blog-list';
import { getPosts } from '@/lib/data';

export const metadata = {
  title: 'Blog - Blogtastic',
  description: 'Explore the latest articles on technology, design, and more.',
};

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
