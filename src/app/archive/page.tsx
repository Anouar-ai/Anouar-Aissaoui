import Link from 'next/link';
import { getPosts } from '@/lib/data';
import { Post } from '@/lib/types';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata = {
  title: 'Archive - Blogtastic',
  description: 'Browse all posts by month and year.',
};

export default async function ArchivePage() {
  const posts = await getPosts();

  const groupedPosts = posts.reduce((acc, post) => {
    const yearMonth = format(new Date(post.publishedAt), 'MMMM yyyy');
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">Archive</h1>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(groupedPosts).map(([month, postsInMonth]) => (
          <AccordionItem key={month} value={month}>
            <AccordionTrigger className="font-headline text-xl">
              {month}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4 py-4">
                {postsInMonth.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-baseline justify-between"
                    >
                      <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </span>
                      <time className="text-sm text-muted-foreground mt-1 sm:mt-0">
                        {format(new Date(post.publishedAt), 'do')}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
