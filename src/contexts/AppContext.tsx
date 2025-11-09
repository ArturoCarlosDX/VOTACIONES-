import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, Admin, initialCandidates, initialAdmins } from '@/data/mockData';

interface UserSession {
  dni: string;
  votedPresidencia: boolean;
  votedAlcaldia: boolean;
}

interface AdminSession {
  email: string;
  name: string;
}

interface AppContextType {
  // User state
  userSession: UserSession | null;
  loginUser: (dni: string) => void;
  logoutUser: () => void;
  
  // Admin state
  adminSession: AdminSession | null;
  loginAdmin: (email: string, password: string) => boolean;
  registerAdmin: (name: string, email: string, password: string) => boolean;
  logoutAdmin: () => void;
  
  // Candidates
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  
  // Voting
  voteForCandidate: (candidateId: string) => void;
  getUserVotes: () => { presidencia: string | null; alcaldia: string | null };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const storedCandidates = localStorage.getItem('candidates');
    const storedAdmins = localStorage.getItem('admins');
    const storedUser = localStorage.getItem('userSession');
    const storedAdmin = localStorage.getItem('adminSession');

    setCandidates(storedCandidates ? JSON.parse(storedCandidates) : initialCandidates);
    setAdmins(storedAdmins ? JSON.parse(storedAdmins) : initialAdmins);
    
    if (storedUser) {
      setUserSession(JSON.parse(storedUser));
    }
    if (storedAdmin) {
      setAdminSession(JSON.parse(storedAdmin));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (candidates.length > 0) {
      localStorage.setItem('candidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  useEffect(() => {
    if (admins.length > 0) {
      localStorage.setItem('admins', JSON.stringify(admins));
    }
  }, [admins]);

  useEffect(() => {
    if (userSession) {
      localStorage.setItem('userSession', JSON.stringify(userSession));
    } else {
      localStorage.removeItem('userSession');
    }
  }, [userSession]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
    } else {
      localStorage.removeItem('adminSession');
    }
  }, [adminSession]);

  // User functions
  const loginUser = (dni: string) => {
    const existingVotes = localStorage.getItem(`votes_${dni}`);
    const parsedVotes = existingVotes ? JSON.parse(existingVotes) : {};
    
    setUserSession({
      dni,
      votedPresidencia: !!parsedVotes.presidencia,
      votedAlcaldia: !!parsedVotes.alcaldia
    });
  };

  const logoutUser = () => {
    setUserSession(null);
  };

  // Admin functions
  const loginAdmin = (email: string, password: string): boolean => {
    const admin = admins.find(a => a.email === email && a.password === password);
    if (admin) {
      setAdminSession({ email: admin.email, name: admin.name });
      return true;
    }
    return false;
  };

  const registerAdmin = (name: string, email: string, password: string): boolean => {
    if (admins.find(a => a.email === email)) {
      return false;
    }
    const newAdmin = { name, email, password };
    setAdmins([...admins, newAdmin]);
    setAdminSession({ email, name });
    return true;
  };

  const logoutAdmin = () => {
    setAdminSession(null);
  };

  // Candidate functions
  const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: `${candidate.category[0]}${Date.now()}`,
      votes: 0
    };
    setCandidates([...candidates, newCandidate]);
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  // Voting functions
  const voteForCandidate = (candidateId: string) => {
    if (!userSession) return;

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const votesKey = `votes_${userSession.dni}`;
    const existingVotes = localStorage.getItem(votesKey);
    const parsedVotes = existingVotes ? JSON.parse(existingVotes) : {};

    if (candidate.category === 'presidencia' && userSession.votedPresidencia) return;
    if (candidate.category === 'alcaldia' && userSession.votedAlcaldia) return;

    parsedVotes[candidate.category] = candidateId;
    localStorage.setItem(votesKey, JSON.stringify(parsedVotes));

    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
    ));

    setUserSession({
      ...userSession,
      votedPresidencia: candidate.category === 'presidencia' ? true : userSession.votedPresidencia,
      votedAlcaldia: candidate.category === 'alcaldia' ? true : userSession.votedAlcaldia
    });
  };

  const getUserVotes = () => {
    if (!userSession) return { presidencia: null, alcaldia: null };
    
    const votesKey = `votes_${userSession.dni}`;
    const existingVotes = localStorage.getItem(votesKey);
    const parsedVotes = existingVotes ? JSON.parse(existingVotes) : {};
    
    return {
      presidencia: parsedVotes.presidencia || null,
      alcaldia: parsedVotes.alcaldia || null
    };
  };

  return (
    <AppContext.Provider
      value={{
        userSession,
        loginUser,
        logoutUser,
        adminSession,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
        candidates,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        voteForCandidate,
        getUserVotes
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
