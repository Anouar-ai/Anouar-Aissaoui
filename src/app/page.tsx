import { getPosts } from '@/lib/data';
import { FeaturedPostCard } from '@/components/blog/featured-post-card';
import { BlogPostCard } from '@/components/blog/blog-post-card';

export default async function Home() {
  const allPosts = await getPosts();
  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(1, 5); // Get next 4 posts

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
          Welcome to Blogtastic
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your source for fantastic articles on technology, design, and more.
        </p>
      </div>

      {featuredPost && (
        <section className="mb-16">
           <h2 className="font-headline text-3xl font-bold mb-6 pb-2 border-b-2 border-primary">Featured Post</h2>
          <FeaturedPostCard post={featuredPost} />
        </section>
      )}

      {otherPosts.length > 0 && (
        <section>
          <h2 className="font-headline text-3xl font-bold mb-8 pb-2 border-b">Latest Posts</h2>
          <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
            {otherPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
