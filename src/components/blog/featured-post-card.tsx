import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FeaturedPostCardProps {
  post: Post;
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <article className="group grid cursor-pointer items-center gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={500}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={post.imageHint}
            priority
          />
        </Link>
      </div>
      <div>
        <div className="flex items-center gap-2">
            <Link href={`/category/${post.category.slug}`}>
                <Badge variant="outline" className="text-sm font-medium transition-colors hover:bg-accent">{post.category.name}</Badge>
            </Link>
        </div>
        <h2 className="mt-2 font-headline text-3xl font-semibold leading-tight tracking-tight text-foreground lg:text-4xl">
          <Link href={`/blog/${post.slug}`}>
            <span className="bg-gradient-to-r from-primary to-accent bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_3px]">
              {post.title}
            </span>
          </Link>
        </h2>
        <p className="mt-4 text-base text-muted-foreground">{post.excerpt}</p>
        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
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
