import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group">
      {post.image && (
        <Link href={`/blog/${post.slug}`}>
          <div className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
            <Image
              src={post.image}
              alt={post.title}
              width={600}
              height={400}
              className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.imageHint}
            />
          </div>
        </Link>
      )}
      <div className="mt-4">
        {post.category && (
            <div className="flex items-center gap-2">
                <Link href={`/category/${post.category.slug}`}>
                    <Badge variant="outline" className="text-sm font-medium transition-colors hover:bg-accent">{post.category.name}</Badge>
                </Link>
            </div>
        )}
        <h2 className="mt-2 font-headline text-2xl font-semibold leading-tight tracking-tight text-foreground">
          <Link href={`/blog/${post.slug}`}>
            <span className="bg-gradient-to-r from-primary to-accent bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_3px]">
              {post.title}
            </span>
          </Link>
        </h2>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <Link href={`/author/${post.author.slug}`} className="flex items-center gap-2 transition-colors hover:text-foreground">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} data-ai-hint={post.author.avatarHint} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.name}</span>
          </Link>
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
          </time>
        </div>
      </div>
    </article>
  );
}
