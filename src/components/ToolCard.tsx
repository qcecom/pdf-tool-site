'use client';
import Link from 'next/link';
import { track } from '../lib/analytics';

interface Props {
  title: string;
  href: string;
  hint: string;
}

export default function ToolCard({ title, href, hint }: Props) {
  return (
    <Link
      href={href}
      className="border rounded p-4 focus:outline-none focus:ring block"
      onClick={() => track('tool_opened', { tool: title })}
      aria-label={`Start ${title}`}
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{hint}</p>
      <span className="text-blue-600">Start →</span>
    </Link>
  );
}
