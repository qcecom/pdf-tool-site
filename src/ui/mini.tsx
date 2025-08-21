import type { ReactNode } from 'react';
export const Row = ({ children, className = '' }: {children: ReactNode; className?: string}) =>
  <div className={`flex items-center gap-2 ${className}`}>{children}</div>;
export const Btn = ({ onClick, children }: {onClick?: ()=>void; children: ReactNode}) =>
  <button onClick={onClick} className="px-3 py-1 rounded border">{children}</button>;
