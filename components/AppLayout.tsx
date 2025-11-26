'use client';

import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-light overflow-hidden">
      <Sidebar />
      <main className="ml-56 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
