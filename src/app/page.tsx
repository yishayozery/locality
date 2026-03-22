"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Store, Search, Shield, Clock, Star, ArrowLeft } from 'lucide-react';

// --- Navbar Component ---
const Navbar = () => (
  <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center" dir="rtl">
      <div className="flex items-center gap-2 text-2xl font-black text-blue-700">
        <Package className="w-8 h-8" />
        <span>PickPoint</span>
      </div>
      <div className="hidden md:flex gap-8 font-medium text-gray-600">
        <a href="#features" className="hover:text-blue-600 transition">למה אנחנו?</a>
        <a href="#how" className="hover:text-blue-600 transition">איך זה עובד?</a>
      </div>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 shadow-lg transition">
          הצטרף כנקודה
        </button>
      </div>
    </div>
  </nav>
);

export default function FullLandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      setShowResults(true);
    } else {
      alert("נא להזין לפחות 3 אותיות לחיפוש");
    }
  };

  return (
    <div className="min-h-screen bg-white text-right" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold">
              החבילות שלך בדרך ליעד 🚀
            </span>
            <h1 className="text-6xl font-black text-gray-900 mt-6 leading-tight">
              החבילה שלך, <br />
              <span className="text-blue-600">במקום שנוח לך.</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 mb-10 leading-relaxed">
              רשת נקודות האיסוף החכמה בישראל. אלפי עסקים מקומיים שהופכים לתחנת האיסוף האישית שלך.
            </p>

            <div className="relative max-w-lg">
              <input 
                type="text"
                placeholder="הכנס עיר (למשל: תל אביב)..."
                className="w-full p-5 pr-14 rounded-2xl border-2 border-gray-100 shadow-xl focus:border-blue-500 outline-none transition text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <button 
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700"
              >
                חיפוש
              </button>
            </div>

            {showResults && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-white border rounded-xl shadow-lg border-blue-200">
                <p className="font-bold text-blue-700 mb-2">נמצאו 2 נקודות בקרבת "{searchQuery}":</p>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between border-b pb-1"><span>קיוסק המרכז - רח' הרצל 12</span> <span className="text-green-600 font-bold underline cursor-pointer">בחר</span></div>
                  <div className="flex justify-between"><span>מינימרקט השלום - דרך בגין 45</span> <span className="text-green-600 font-bold underline cursor-pointer">בחר</span></div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="relative hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=800" 
              alt="Pickup Point"
              className="rounded-[40px] shadow-2xl h-[500px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {[
          { label: "נקודות איסוף", val: "2,500+", icon: MapPin },
          { label: "חבילות שנמסרו", val: "1M+", icon: Package },
          { label: "זמן המתנה", val: "45 שניות", icon: Clock },
          { label: "שביעות רצון", val: "4.9/5", icon: Star },
        ].map((item, idx) => (
          <div key={idx} className="text-center p-6 bg-white rounded-2xl border border-gray-50 shadow-sm">
            <item.icon className="mx-auto text-blue-600 mb-4 w-8 h-8" />
            <div className="text-3xl font-black text-gray-900">{item.val}</div>
            <div className="text-gray-500 font-medium">{item.label}</div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400">
        <div>© 2024 PickPoint Logistics - נבנה עבור ישי</div>
      </footer>
    </div>
  );
}
