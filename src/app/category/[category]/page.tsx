import { notFound } from 'next/navigation';
import { getPostsByCategory, getCategories } from '@/lib/data';
import { BlogPostCard } from '@/components/blog/blog-post-card';

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(category => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const allCategories = await getCategories();
    const category = allCategories.find(c => c.slug === params.category);

    if (!category) {
        return {
            title: 'Category not found',
        };
    }

    return {
        title: category.seo?.title || category.name,
        description: category.seo?.metaDesc || `Posts in the ${category.name} category`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const allCategories = await getCategories();
  const category = allCategories.find(c => c.slug === params.category);
  
  if (!category) {
    notFound();
  }
  
  const posts = await getPostsByCategory(params.category);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">
        Category: <span className="text-primary">{category.name}</span>
      </h1>
      
      {posts.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 lg:gap-12">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-muted-foreground">No posts found in this category.</p>
      )}
    </div>
  );
}
