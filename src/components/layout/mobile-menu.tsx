"use client"

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { Logo } from './logo';
import { SearchInput } from '../search-input';

export function MobileMenu({ navLinks }: { navLinks: { href: string; label: string }[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <div className="p-4">
            <Logo />
        </div>
        <nav className="mt-8 flex flex-col gap-4 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 px-4">
            <SearchInput />
        </div>
      </SheetContent>
    </Sheet>
  );
}
