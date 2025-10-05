'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollText, User } from 'lucide-react';

const navItems = [
    { href: '/account/orders', label: 'My Orders', icon: <ScrollText className="h-4 w-4" /> },
    { href: '#', label: 'Profile', icon: <User className="h-4 w-4" /> },
];

function AccountNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    asChild
                    className="justify-start"
                >
                    <Link href={item.href}>
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                    </Link>
                </Button>
            ))}
        </nav>
    );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">My Account</h1>
            <p className="text-muted-foreground">Manage your orders and profile details.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <AccountNav />
        </aside>
        <main className="md:col-span-3">
            {children}
        </main>
      </div>
    </div>
  );
}
