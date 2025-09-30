import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/lib/data';
import { FeaturedPostCard } from '@/components/blog/featured-post-card';
import { BlogPostCard } from '@/components/blog/blog-post-card';

export default async function Home() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 5); // Show first 4 other posts

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {featuredPost && <FeaturedPostCard post={featuredPost} />}

      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:gap-12 xl:grid-cols-2">
        {otherPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Button asChild size="lg">
          <Link href="/archive">View All Posts</Link>
        </Button>
      </div>
    </div>
  );
}
