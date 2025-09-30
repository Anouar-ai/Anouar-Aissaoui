
'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { getPosts } from '@/lib/data';
import { Post } from '@/lib/types';
import { blogSearchWithLlm } from '@/ai/flows/blog-search-llm';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const allPosts = await getPosts();

      try {
        const llmResults = await blogSearchWithLlm({
          query,
          blogPosts: allPosts.map(p => ({ title: p.title, excerpt: p.excerpt, content: p.content })),
        });
        
        // Filter posts with relevance score > 0.5 and sort by score
        const relevantPostTitles = llmResults
          .filter(r => r.relevanceScore > 0.5)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .map(r => r.title);
        
        const filteredPosts = allPosts.filter(p => relevantPostTitles.includes(p.title));
        
        // Maintain the order from llmResults
        const orderedPosts = relevantPostTitles.map(title => filteredPosts.find(p => p.title === title)).filter(Boolean) as Post[];

        setResults(orderedPosts);

      } catch (error) {
        console.error("AI search failed, falling back to simple search:", error);
        // Fallback to simple search
        const lowercasedQuery = query.toLowerCase();
        const fallbackResults = allPosts.filter(post =>
          post.title.toLowerCase().includes(lowercasedQuery) ||
          post.excerpt.toLowerCase().includes(lowercasedQuery) ||
          post.content.toLowerCase().includes(lowercasedQuery)
        );
        setResults(fallbackResults);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  if (loading) {
    return <SearchSkeleton />;
  }
  
  if (!query) {
    return <p className="text-center text-lg text-muted-foreground">Please enter a search term to begin.</p>;
  }

  if (results.length === 0) {
    return <p className="text-center text-lg text-muted-foreground">No results found for "{query}".</p>;
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
      {results.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function SearchSkeleton() {
    return (
        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        Search Results
      </h1>
      
      {query ? (
        <p className="text-lg text-muted-foreground mb-8">Showing results for: <span className="font-semibold text-foreground">"{query}"</span></p>
      ) : null}
      
      <SearchResults />
    </div>
  )
}


export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPageComponent />
    </Suspense>
  )
}
