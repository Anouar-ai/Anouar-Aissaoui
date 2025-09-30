import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/lib/data';
import { FeaturedPostCard } from '@/components/blog/featured-post-card';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 5); // Show first 4 other posts

  return (
    <>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
          Welcome to <span className="text-primary">Blogtastic</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your daily dose of fantastic articles, tutorials, and insights from the world of tech and beyond.
        </p>
      </section>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {featuredPost && (
            <section>
                 <h2 className="text-3xl font-bold font-headline mb-8">Featured Post</h2>
                <FeaturedPostCard post={featuredPost} />
            </section>
        )}

        <section className="mt-16">
            <h2 className="text-3xl font-bold font-headline mb-8">Latest Posts</h2>
            <div className="grid gap-10 md:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                {otherPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </section>

        <div className="mt-16 flex justify-center">
          <Button asChild size="lg">
            <Link href="/archive">View All Posts <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </>
  );
}
