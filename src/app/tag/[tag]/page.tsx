import { notFound } from 'next/navigation';
import { getPostsByTag, getTags } from '@/lib/data';
import { BlogPostCard } from '@/components/blog/blog-post-card';

type TagPageProps = {
  params: {
    tag: string;
  };
};

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map(tag => ({
    tag: tag.slug,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const allTags = await getTags();
  const tag = allTags.find(t => t.slug === params.tag);
  
  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(params.tag);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        Tagged: <span className="text-primary">{tag.name}</span>
      </h1>
      
      {posts.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-muted-foreground">No posts found with this tag.</p>
      )}
    </div>
  );
}
