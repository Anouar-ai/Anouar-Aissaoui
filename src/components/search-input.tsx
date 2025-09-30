"use client";

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full md:w-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="query"
          placeholder="Search posts..."
          className="w-full rounded-full bg-muted pl-10"
          aria-label="Search posts"
        />
      </div>
    </form>
  );
}
