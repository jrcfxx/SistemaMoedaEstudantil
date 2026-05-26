import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { alunoService } from '../services/alunoService';
import { professorService } from '../services/professorService';

interface SaldoContextValue {
  saldo: number | null;
  refreshSaldo: () => Promise<void>;
}

const SaldoContext = createContext<SaldoContextValue>({
  saldo: null,
  refreshSaldo: async () => {},
});

export function SaldoProvider({ children }: { children: ReactNode }) {
  const [saldo, setSaldo] = useState<number | null>(null);

  const refreshSaldo = useCallback(async () => {
    const user = authService.getUser();
    if (!user) {
      setSaldo(null);
      return;
    }

    try {
      if (user.tipo === 'ALUNO' && user.alunoId) {
        const aluno = await alunoService.findById(user.alunoId);
        setSaldo(aluno.saldoMoedas);
      } else if (user.tipo === 'PROFESSOR' && user.professorId) {
        const professor = await professorService.findById(user.professorId);
        setSaldo(professor.saldoMoedas);
      } else {
        setSaldo(null);
      }
    } catch {
      setSaldo(null);
    }
  }, []);

  useEffect(() => {
    refreshSaldo();
  }, [refreshSaldo]);

  return (
    <SaldoContext.Provider value={{ saldo, refreshSaldo }}>
      {children}
    </SaldoContext.Provider>
  );
}

export function useSaldo() {
  return useContext(SaldoContext);
}
