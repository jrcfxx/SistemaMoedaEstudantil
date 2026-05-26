import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SaldoProvider } from '../../contexts/SaldoContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SaldoProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SaldoProvider>
  );
}
