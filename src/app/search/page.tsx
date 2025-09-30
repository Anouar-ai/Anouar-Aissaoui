import { Suspense } from 'react';
import { blogSearchWithLlm } from '@/ai/flows/blog-search-llm';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { getPosts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

async function SearchResults({ query }: { query: string }) {
  const allPosts = await getPosts();
  
  const relevantPosts = await blogSearchWithLlm({
    query: query,
    blogPosts: allPosts.map(p => ({ title: p.title, excerpt: p.excerpt, content: p.content })),
  });
  
  const filteredAndSortedPosts = relevantPosts
    .filter(p => p.relevanceScore > 0.5)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  const results = filteredAndSortedPosts.map(relevantPost => {
      return allPosts.find(p => p.title === relevantPost.title);
  }).filter((p): p is NonNullable<typeof p> => p !== undefined);

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

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        Search Results
      </h1>
      
      {query ? (
        <>
          <p className="text-lg text-muted-foreground mb-8">Showing results for: <span className="font-semibold text-foreground">"{query}"</span></p>
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        </>
      ) : (
        <p className="text-center text-lg text-muted-foreground">Please enter a search term to begin.</p>
      )}
    </div>
  );
}
