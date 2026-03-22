'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// התחברות ל-Supabase
// וודא שהמפתחות האלו מוגדרים בתוך קובץ .env.local 
// או שתחליף את process.env בכתובות האמיתיות (בתוך גרשיים) אם יש שגיאת Url
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LocalityApp() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [packageName, setPackageName] = useState('');
  const [customerName, setCustomerName] = useState('');

  // 1. שליפת חבילות מהענן (Database)
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // 2. הוספת חבילה חדשה בלחיצה על הכפתור
  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName) return;

    try {
      const { error } = await supabase
        .from('packages')
        .insert([{ 
          name: packageName, 
          customer_name: customerName || 'אורח',
          status: 'בטיפול' 
        }]);

      if (error) throw error;

      // ניקוי שדות ורענון רשימה
      setPackageName('');
      setCustomerName('');
      fetchPackages();
    } catch (error: any) {
      alert('שגיאה בהוספה: ' + error.message);
    }
  };

  // 3. מחיקת חבילה
  const deletePkg = async (id: string) => {
    if (!confirm('האם למחוק את החבילה מהמערכת?')) return;
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (!error) fetchPackages();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans rtl" dir="rtl">
      {/* Navbar יוקרתי */}
      <nav className="p-6 flex justify-between items-center border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-3xl font-black tracking-tighter text-blue-500">LOCALITY</div>
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <span className="hover:text-white cursor-pointer transition">לוח בקרה</span>
          <span className="hover:text-white cursor-pointer transition">משלוחים</span>
          <span className="hover:text-white cursor-pointer transition">הגדרות</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Hero Section */}
        <header className="py-16 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            ניהול חבילות <br/> מעולם אחר.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            הפלטפורמה המתקדמת ביותר לניהול לוגיסטיקה מקומית. <br/> חכם, מהיר, ומחובר לענן בזמן אמת.
          </p>
        </header>

        {/* טופס הוספה מעוצב */}
        <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-sm mb-12">
          <form onSubmit={handleAddPackage} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="שם החבילה / מספר מעקב" 
              className="bg-white/10 border-none p-5 rounded-2xl text-xl outline-none focus:ring-2 ring-blue-500 transition"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="שם הלקוח (אופציונלי)" 
              className="bg-white/10 border-none p-5 rounded-2xl text-xl outline-none focus:ring-2 ring-blue-500 transition"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
              הוסף למערכת 🚀
            </button>
          </form>
        </div>

        {/* רשימת חבילות בפורמט כרטיסיות (Cards) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            משלוחים פעילים (Live)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500 text-xl italic">
                מתחבר ללוויין... טוען נתונים
              </div>
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500 text-xl">
                אין חבילות רשומות כרגע במערכת.
              </div>
            ) : (
              packages.map((pkg) => (
                <div key={pkg.id} className="bg-white/5 border border-white/5 p-8 rounded-[32px] hover:border-blue-500/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="bg-blue-500/10 text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {pkg.status}
                    </span>
                    <button 
                      onClick={() => deletePkg(pkg.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-2 relative z-10">{pkg.name}</h4>
                  <p className="text-gray-400 font-medium relative z-10">{pkg.customer_name}</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>עודכן לאחרונה</span>
                    <span>{new Date(pkg.created_at).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="p-20 text-center text-gray-600 text-sm border-t border-white/5 mt-20">
        © 2026 Locality Global Systems. All rights reserved.
      </footer>
    </div>
  );
}