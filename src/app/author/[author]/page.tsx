import { notFound } from 'next/navigation';
import { getPostsByAuthor, getAuthors } from '@/lib/data';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AuthorPageProps = {
  params: {
    author: string;
  };
};

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map(author => ({
    author: author.slug,
  }));
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const allAuthors = await getAuthors();
  const author = allAuthors.find(a => a.slug === params.author);
  
  if (!author) {
    notFound();
  }
  
  const posts = await getPostsByAuthor(params.author);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
            <AvatarImage src={author.avatar} alt={author.name} data-ai-hint={author.avatarHint} />
            <AvatarFallback className="text-3xl">{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Posts by {author.name}</h1>
      </div>
      
      {posts.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-muted-foreground">No posts found for this author.</p>
      )}
    </div>
  );
}
