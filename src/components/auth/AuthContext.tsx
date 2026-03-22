'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // אנחנו מנסים לבדוק אם אתה מחובר
        const res = await fetch('/api/auth/me');
        
        // גם אם השרת מחזיר 401 (לא מחובר), אנחנו לא עוצרים את האתר
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        // במקרה של שגיאה, פשוט מדפיסים ללוג וממשיכים
        console.log("Not logged in, continuing as guest mode");
      } finally {
        // זה השלב הקריטי: אנחנו אומרים לאתר שהטעינה הסתיימה בכל מקרה
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* אם loading הוא true, האתר בדרך כלל מציג מסך לבן. 
          עכשיו אנחנו מבטיחים שהוא יהיה false מהר מאוד. */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);