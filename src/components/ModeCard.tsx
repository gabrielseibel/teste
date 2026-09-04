import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface ModeCardProps {
  href: string;
  icon: LucideIcon;
  emoji: string;
  title: string;
  description: string;
  accentClass: string;
}

export function ModeCard({ href, icon: Icon, emoji, title, description, accentClass }: ModeCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-4 rounded-2xl border-2 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-brand-800 sm:p-8 ${accentClass}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {emoji}
        </span>
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <p className="text-base opacity-90">{description}</p>
      <span className="mt-2 inline-flex items-center gap-1 font-semibold">
        Começar agora
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
