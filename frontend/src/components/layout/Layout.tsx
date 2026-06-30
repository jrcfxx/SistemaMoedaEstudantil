import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SaldoProvider } from '../../contexts/SaldoContext';
import { authService } from '../../services/authService';
import { Spinner } from '../ui/Spinner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [profileReady, setProfileReady] = useState(!authService.isAuthenticated());
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setProfileReady(true);
      return;
    }

    authService
      .refreshProfile()
      .finally(() => {
        setProfileVersion((v) => v + 1);
        setProfileReady(true);
      });
  }, []);

  return (
    <SaldoProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar key={profileVersion} />
        <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
          <Header key={profileVersion} />
          <main className="flex-1 overflow-y-auto p-6">
            {profileReady ? children : <Spinner message="Carregando perfil..." />}
          </main>
        </div>
      </div>
    </SaldoProvider>
  );
}
