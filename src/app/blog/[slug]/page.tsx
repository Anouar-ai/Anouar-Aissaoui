import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getPostBySlug, getPosts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const post = await getPostBySlug(params.slug);
    if (!post) {
        return {
            title: 'Post not found',
        };
    }
    return {
        title: post.title,
        description: post.excerpt,
    };
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <Link href={`/category/${post.category.slug}`}>
            <Badge variant="default" className="text-sm font-medium mb-2">{post.category.name}</Badge>
        </Link>
        <h1 className="font-headline text-4xl md:text-5xl font-bold leading-tight tracking-tighter mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href={`/author/${post.author.slug}`} className="flex items-center gap-2 transition-colors hover:text-foreground">
            <Avatar className="h-9 w-9">
              <AvatarImage src={post.author.avatar} alt={post.author.name} data-ai-hint={post.author.avatarHint} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.name}</span>
          </Link>
          <span>&bull;</span>
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>
      
      <div className="overflow-hidden rounded-lg border shadow-md mb-8">
        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full h-auto object-cover"
          priority
          data-ai-hint={post.imageHint}
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-p:font-body prose-a:text-primary hover:prose-a:text-accent prose-a:transition-colors">
        {/* In a real app, you would parse markdown here */}
        <p>{post.content}</p>
      </div>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <Badge variant="secondary" className="transition-colors hover:bg-accent">{tag.name}</Badge>
                </Link>
            ))}
        </div>
      </div>
    </article>
  );
}
