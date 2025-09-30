import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground transition-opacity hover:opacity-80">
      <PenSquare className="h-7 w-7 text-primary" />
      <span className="font-headline">Blogtastic</span>
    </Link>
  );
}
