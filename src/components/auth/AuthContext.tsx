'use client';
import React, { createContext, useContext } from 'react';

// אנחנו משאירים את המבנה, אבל מנטרלים את החסימות
const AuthContext = createContext({ user: { email: 'yishay@locality.com' }, loading: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: { email: 'yishay@locality.com' }, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);