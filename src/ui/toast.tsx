import type { ReactNode } from 'react';

export function Toast({ message }: { message: ReactNode }) {
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 rounded">
      {message}
    </div>
  );
}
