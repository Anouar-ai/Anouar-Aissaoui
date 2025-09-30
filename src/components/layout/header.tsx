import Link from 'next/link';
import { Logo } from './logo';
import { ThemeToggle } from '../theme-toggle';
import { SearchInput } from '../search-input';
import { MobileMenu } from './mobile-menu';

const navLinks = [
  { href: '/category/technology', label: 'Technology' },
  { href: '/category/design', label: 'Design' },
  { href: '/archive', label: 'Archive' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SearchInput />
          </div>
          <ThemeToggle />
          <MobileMenu navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
