import { Post, Author, Category, Tag } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        return {
            url: "https://picsum.photos/seed/default/1200/800",
            hint: "default image"
        }
    }
    return {
        url: img.imageUrl,
        hint: img.imageHint
    }
}

const authors: Author[] = [
  { id: '1', name: 'Jane Doe', slug: 'jane-doe', avatar: getImage('author-jane-doe').url, avatarHint: getImage('author-jane-doe').hint },
  { id: '2', name: 'John Smith', slug: 'john-smith', avatar: getImage('author-john-smith').url, avatarHint: getImage('author-john-smith').hint },
];

const categories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Design', slug: 'design' },
  { id: '3', name: 'Lifestyle', slug: 'lifestyle' },
];

const tags: Tag[] = [
  { id: '1', name: 'React', slug: 'react' },
  { id: '2', name: 'Next.js', slug: 'next-js' },
  { id: '3', name: 'UI/UX', slug: 'ui-ux' },
  { id: '4', name: 'Productivity', slug: 'productivity' },
  { id: '5', name: 'AI', slug: 'ai' },
];

const posts: Post[] = [
  {
    id: '1',
    slug: 'exploring-the-future-of-ai',
    title: 'Exploring the Future of Artificial Intelligence',
    excerpt: 'AI is rapidly evolving, promising to reshape industries and our daily lives. This post dives into the latest trends and what we can expect in the coming years.',
    content: `
Artificial intelligence (AI) is no longer a concept of science fiction; it's a reality that's reshaping our world. From machine learning algorithms that power our favorite streaming services to natural language processing that allows us to communicate with devices, AI is everywhere.

### Key Trends to Watch

1.  **Generative AI**: The ability of AI to create new content, from text to images, is one of the most exciting developments. Tools like Genkit are making it easier for developers to integrate these capabilities into their applications.
2.  **AI in Healthcare**: AI is helping doctors diagnose diseases earlier and more accurately. It's also personalizing treatment plans, leading to better patient outcomes.
3.  **Ethical AI**: As AI becomes more powerful, the conversation around ethics is crucial. Ensuring fairness, transparency, and accountability in AI systems is a major focus for researchers and policymakers.

The future of AI is bright, but it's up to us to steer it in a direction that benefits all of humanity.`,
    image: getImage('post-1').url,
    imageHint: getImage('post-1').hint,
    publishedAt: '2024-08-01',
    author: authors[0],
    category: categories[0],
    tags: [tags[0], tags[4]],
  },
  {
    id: '2',
    slug: 'mastering-ui-ux-design-principles',
    title: 'Mastering UI/UX Design Principles',
    excerpt: 'A great user experience is key to a successful product. We break down the fundamental principles of UI/UX design that every designer should know.',
    content: `
Good design is not just about aesthetics; it's about creating intuitive and enjoyable experiences for users.

### Core Principles

*   **Clarity**: The interface should be easy to understand. Users should know what to do without needing instructions.
*   **Consistency**: A consistent design allows users to transfer knowledge from one part of your app to another.
*   **Feedback**: The system should always inform the user about what's happening.
*   **Flexibility**: Good design accommodates a range of user expertise.

By focusing on these principles, you can create products that are not only beautiful but also a joy to use.`,
    image: getImage('post-2').url,
    imageHint: getImage('post-2').hint,
    publishedAt: '2024-07-25',
    author: authors[1],
    category: categories[1],
    tags: [tags[2]],
  },
  {
    id: '3',
    slug: 'a-guide-to-mindful-living',
    title: 'A Guide to Mindful Living in a Hectic World',
    excerpt: 'In a world that never stops, finding moments of peace is essential. This guide offers practical tips for incorporating mindfulness into your daily routine.',
    content: `
Mindfulness is the practice of being present and fully engaged with whatever we’re doing at the moment.

### Simple Practices

1.  **Mindful Breathing**: Take a few minutes each day to focus on your breath.
2.  **Mindful Walking**: Pay attention to the sensation of your feet on the ground.
3.  **Digital Detox**: Set aside time each day to disconnect from your devices.

These small changes can make a big difference in your overall well-being.`,
    image: getImage('post-3').url,
    imageHint: getImage('post-3').hint,
    publishedAt: '2024-07-18',
    author: authors[0],
    category: categories[2],
    tags: [tags[3]],
  },
  {
    id: '4',
    slug: 'the-power-of-nextjs-for-modern-web-apps',
    title: 'The Power of Next.js for Modern Web Apps',
    excerpt: 'Next.js has become a go-to framework for building fast, scalable, and SEO-friendly React applications. Let\'s explore why.',
    content: `
Next.js provides a robust set of features out of the box that streamline the development process.

### Key Features

*   **Server-Side Rendering (SSR)**: Improves performance and SEO.
*   **Static Site Generation (SSG)**: Creates pre-built pages for lightning-fast load times.
*   **App Router**: A new paradigm for routing that simplifies layouts and data fetching.

Whether you're building a blog or a large-scale e-commerce platform, Next.js provides the tools you need to succeed.`,
    image: getImage('post-4').url,
    imageHint: getImage('post-4').hint,
    publishedAt: '2024-07-10',
    author: authors[1],
    category: categories[0],
    tags: [tags[0], tags[1]],
  },
    {
    id: '5',
    slug: 'boosting-productivity-with-simple-hacks',
    title: 'Boosting Your Productivity With Simple Hacks',
    excerpt: 'We all want to get more done in less time. Here are some simple, science-backed productivity hacks that actually work.',
    content: `
Productivity isn't about working harder; it's about working smarter.

### Effective Techniques

*   **The Pomodoro Technique**: Work in focused 25-minute intervals.
*   **Time Blocking**: Schedule your day in advance.
*   **The Two-Minute Rule**: If a task takes less than two minutes, do it now.

By implementing these strategies, you can take control of your day and achieve your goals.
    `,
    image: getImage('post-5').url,
    imageHint: getImage('post-5').hint,
    publishedAt: '2024-06-28',
    author: authors[0],
    category: categories[2],
    tags: [tags[3]],
  },
  {
    id: '6',
    slug: 'the-art-of-minimalist-design',
    title: 'The Art of Minimalist Design',
    excerpt: 'Less is more. Discover how minimalist design principles can lead to more effective and beautiful user interfaces.',
    content: `
Minimalism in design is about stripping away the unnecessary to focus on what's essential.

### Why Minimalism Works

*   **Improved Usability**: Fewer elements mean less distraction.
*   **Faster Load Times**: Less content to load.
*   **Timeless Aesthetic**: Minimalist designs tend to age well.

Embracing minimalism can be a powerful way to enhance your design work.`,
    image: getImage('post-6').url,
    imageHint: getImage('post-6').hint,
    publishedAt: '2024-06-15',
    author: authors[1],
    category: categories[1],
    tags: [tags[2]],
  },
];

// Sort posts by date, newest first
const sortedPosts = posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export async function getPosts(): Promise<Post[]> {
  return sortedPosts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return sortedPosts.find(post => post.slug === slug);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return sortedPosts.filter(post => post.category.slug === categorySlug);
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  return sortedPosts.filter(post => post.tags.some(tag => tag.slug === tagSlug));
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
    return sortedPosts.filter(post => post.author.slug === authorSlug);
}

export async function getCategories(): Promise<Category[]> {
    return categories;
}

export async function getTags(): Promise<Tag[]> {
    return tags;
}

export async function getAuthors(): Promise<Author[]> {
    return authors;
}
