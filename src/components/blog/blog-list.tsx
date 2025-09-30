'use client';

import { useState } from 'react';
import { Post } from '@/lib/types';
import { BlogPostCard } from './blog-post-card';
import { Button } from '@/components/ui/button';

const POSTS_PER_PAGE = 6;

export function BlogList({ posts }: { posts: Post[] }) {
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);

  const loadMore = () => {
    setVisiblePosts((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        All Posts
      </h1>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {posts.slice(0, visiblePosts).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {visiblePosts < posts.length && (
        <div className="mt-12 text-center">
          <Button onClick={loadMore} size="lg">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
