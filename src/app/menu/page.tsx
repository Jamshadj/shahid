'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';

export default function PublicMenuPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'beverages'>('food');

  return (
    <div className="min-h-screen bg-[#14100e] text-white flex flex-col items-center p-2 sm:p-6 md:p-10 font-sans selection:bg-[#d49e38] selection:text-black">
      {/* Main Container */}
      <div className="w-full max-w-5xl space-y-6">
        
        {/* Page Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2">
          <button
            onClick={() => setActiveTab('food')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 border ${
              activeTab === 'food'
                ? 'bg-[#d49e38] text-black border-[#d49e38] shadow-lg shadow-[#d49e38]/20 scale-105'
                : 'bg-[#261f1c] text-stone-300 border-[#423631] hover:text-white'
            }`}
          >
            📋 Food & Barbeque (Page 1)
          </button>
          <button
            onClick={() => setActiveTab('beverages')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 border ${
              activeTab === 'beverages'
                ? 'bg-[#d49e38] text-black border-[#d49e38] shadow-lg shadow-[#d49e38]/20 scale-105'
                : 'bg-[#261f1c] text-stone-300 border-[#423631] hover:text-white'
            }`}
          >
            🍹 Juices & Desserts (Page 2)
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 1: FOOD & BARBEQUE MENU (Matching Physical Photo 2)       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'food' && (
          <div className="bg-[#28201c] border-[3px] border-[#d49e38]/70 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Corner Gold Accents */}
            <div className="absolute top-0 left-0 w-14 h-14 border-t-[3px] border-l-[3px] border-[#d49e38] rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-14 h-14 border-t-[3px] border-r-[3px] border-[#d49e38] rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-14 h-14 border-b-[3px] border-l-[3px] border-[#d49e38] rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b-[3px] border-r-[3px] border-[#d49e38] rounded-br-2xl pointer-events-none" />

            {/* Restaurant Header */}
            <div className="text-center space-y-1 pt-2 pb-4 border-b border-[#d49e38]/30">
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#e6b34d] tracking-tight">Galaxy</h1>
              <p className="text-base sm:text-xl font-serif text-stone-200 uppercase tracking-widest font-medium">
                Bamboo hut Restaurant
              </p>
              <p className="text-xs sm:text-sm text-[#c89836] font-semibold tracking-wider">
                Ayyappankavu, Vandithavalam
              </p>
            </div>

            {/* 2-Column Physical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-stone-100 text-xs">
              
              {/* LEFT COLUMN: Poratta, Non Veg Curry, Veg Curry */}
              <div className="space-y-6">
                {/* PORATTA */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow flex justify-between items-center">
                    <span>PORATTA</span>
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PORATTA</span><span>₹15</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHAPPATHI</span><span>₹15</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>WHEAT PORATTA</span><span>₹18</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>NOOL PORATTA</span><span>₹22</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>EGG ROAST SINGLE</span><span>₹30</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>EGG ROAST FULL</span><span>₹50</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHICKEN CURRY</span><span>₹100</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BEEF CURRY</span><span>₹100</span></div>
                  </div>
                </div>

                {/* NON VEG. CURRY */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    NON VEG. CURRY
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHICKEN MANJOORIAN</span><span>₹140</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHILLY CHICKEN GRAVY</span><span>₹140</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PEPPER CHICKEN</span><span>₹150</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GARLIC CHICKEN</span><span>₹170</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHICKEN KONDATTAM</span><span>₹170</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BUTTER CHICKEN</span><span>₹180</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>KADAI CHICKEN</span><span>₹180</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GINGER CHICKEN</span><span>₹170</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHICKEN CHILLY(65) Q</span><span>₹140</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHICKEN CHILLY(65) 1/2</span><span>₹220</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHICKEN CHILLY(65) full</span><span>₹400</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BEEF CHILLY DRY FRY</span><span>₹150</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BEEF CHILLY GRAVY</span><span>₹170</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BEEF ROAST</span><span>₹130</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BEEF KONDATAM</span><span>₹190</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BEEF FRY</span><span>₹110</span></div>
                  </div>
                </div>

                {/* VEG. CURRY */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    VEG. CURRY
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GOBI MANJURIAN</span><span>₹100</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MUSHROOM MANJURIAN</span><span>₹120</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHILLY GOBI GRAVY</span><span>₹100</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MUSHROOM MASALA</span><span>₹130</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHILLY GOPI DRY</span><span>₹120</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PANEER MANJURIAN</span><span>₹140</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PANEER BUTTER</span><span>₹160</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GREEN PEICE</span><span>₹80</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHANNA MASALA</span><span>₹70</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>EGG ROAST</span><span>₹30, ₹50</span></div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Al-Faham, Mandhi, Biriyani, Meals, Chinese */}
              <div className="space-y-6">
                {/* AL-FAHAM */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm flex justify-between items-center shadow">
                    <span>AL-FAHAM</span>
                    <span className="font-mono text-[11px] font-extrabold tracking-widest">Q &nbsp;&nbsp;&nbsp; H &nbsp;&nbsp;&nbsp; F</span>
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>NORMAL</span><span className="font-mono text-[#e6b34d]">₹140 &nbsp; ₹260 &nbsp; ₹480</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PERI PERI</span><span className="font-mono text-[#e6b34d]">₹150 &nbsp; ₹270 &nbsp; ₹480</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BBQ</span><span className="font-mono text-[#e6b34d]">₹180 &nbsp; ₹340 &nbsp; ₹640</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PEPPER</span><span className="font-mono text-[#e6b34d]">₹150 &nbsp; ₹270 &nbsp; ₹640</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>TURKISH</span><span className="font-mono text-[#e6b34d]">₹180 &nbsp; ₹340 &nbsp; ₹640</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>HONEY</span><span className="font-mono text-[#e6b34d]">₹180 &nbsp; ₹340 &nbsp; ₹640</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>HONEY CHILLY</span><span className="font-mono text-[#e6b34d]">₹240 &nbsp; ₹440 &nbsp; ₹830</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>KANDHARI</span><span className="font-mono text-[#e6b34d]">₹180 &nbsp; ₹340 &nbsp; ₹640</span></div>
                  </div>
                </div>

                {/* AL-FAHAM MANDHI */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm flex justify-between items-center shadow">
                    <span>AL-FAHAM MANDHI</span>
                    <span className="font-mono text-[11px] font-extrabold tracking-widest">Q &nbsp;&nbsp;&nbsp; H &nbsp;&nbsp;&nbsp; F</span>
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>NORMAL</span><span className="font-mono text-[#e6b34d]">₹200 &nbsp; ₹400 &nbsp; ₹740</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PERI PERI</span><span className="font-mono text-[#e6b34d]">₹220 &nbsp; ₹420 &nbsp; ₹760</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BBQ</span><span className="font-mono text-[#e6b34d]">₹240 &nbsp; ₹440 &nbsp; ₹830</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PEPPER</span><span className="font-mono text-[#e6b34d]">₹220 &nbsp; ₹420 &nbsp; ₹760</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>TURKISH</span><span className="font-mono text-[#e6b34d]">₹240 &nbsp; ₹440 &nbsp; ₹830</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>HONEY</span><span className="font-mono text-[#e6b34d]">₹240 &nbsp; ₹440 &nbsp; ₹830</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>HONEY CHILLY</span><span className="font-mono text-[#e6b34d]">₹240 &nbsp; ₹440 &nbsp; ₹830</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>KANDHARI</span><span className="font-mono text-[#e6b34d]">₹240 &nbsp; ₹440 &nbsp; ₹830</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MANDHI RICE Q</span><span className="font-mono text-[#e6b34d]">₹100</span></div>
                  </div>
                </div>

                {/* BIRIYANI */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm flex justify-between items-center shadow">
                    <span>BIRIYANI</span>
                    <span className="font-mono text-[11px] font-extrabold tracking-wider">CHICKEN &nbsp;&nbsp; BEEF</span>
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>RAWTHER</span><span className="font-mono text-[#e6b34d]">₹150 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 150</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>THALASERRY</span><span className="font-mono text-[#e6b34d]">₹160 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 160</span></div>
                  </div>
                </div>

                {/* MEALS */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    MEALS
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHATTI CHOOR</span><span>₹200</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MEALS</span><span>₹60</span></div>
                  </div>
                </div>

                {/* CHINEES */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm flex justify-between items-center shadow">
                    <span>CHINEES</span>
                    <span className="font-mono text-[11px] font-extrabold tracking-wider">Veg &nbsp;&nbsp; Egg &nbsp;&nbsp; Chicken</span>
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>FRIED RICE</span><span className="font-mono text-[#e6b34d]">₹120 &nbsp; ₹130 &nbsp; ₹160</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>NOODLES</span><span className="font-mono text-[#e6b34d]">₹120 &nbsp; ₹130 &nbsp; ₹160</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>SCHEZWAN FRIED RICE</span><span className="font-mono text-[#e6b34d]">₹130 &nbsp; ₹150 &nbsp; ₹170</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>SCHEZWAN NOODLES</span><span className="font-mono text-[#e6b34d]">₹140 &nbsp; ₹150 &nbsp; ₹180</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Contact */}
            <div className="text-center pt-4 border-t border-[#d49e38]/30 text-stone-300 font-bold text-xs flex justify-center items-center gap-2">
              <Phone className="w-4 h-4 text-[#d49e38]" />
              <span>+91 9946238246, +91 7511104923</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* PAGE 2: JUICES & DESSERTS MENU (Matching Physical Photo 1)        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'beverages' && (
          <div className="bg-[#28201c] border-[3px] border-[#d49e38]/70 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Corner Gold Accents */}
            <div className="absolute top-0 left-0 w-14 h-14 border-t-[3px] border-l-[3px] border-[#d49e38] rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-14 h-14 border-t-[3px] border-r-[3px] border-[#d49e38] rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-14 h-14 border-b-[3px] border-l-[3px] border-[#d49e38] rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b-[3px] border-r-[3px] border-[#d49e38] rounded-br-2xl pointer-events-none" />

            {/* Restaurant Header */}
            <div className="text-center space-y-1 pt-2 pb-4 border-b border-[#d49e38]/30">
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#e6b34d] tracking-tight">Galaxy</h1>
              <p className="text-base sm:text-xl font-serif text-stone-200 uppercase tracking-widest font-medium">
                Bamboo hut restaurant
              </p>
            </div>

            {/* 2-Column Physical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-stone-100 text-xs">
              
              {/* LEFT COLUMN: Fresh Juice, Avil Milk, Mojitos */}
              <div className="space-y-6">
                {/* FRESH JUICE */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    FRESH JUICE
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>LIME</span><span>₹25</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MINT LIME</span><span>₹30</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>WATER MELON</span><span>₹40</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PAPPAYA</span><span>₹40</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>SHAMAM</span><span>₹50</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PINEAPPLE</span><span>₹50</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GRAPE</span><span>₹50</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>ORANGE</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MANGO</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>APPLE</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MUSAMBI</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>ANAR</span><span>₹80</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PINE APPLE LIME</span><span>₹35</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GRAPE LIME</span><span>₹40</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>LIME SODA</span><span>₹30</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GINGER LIME</span><span>₹30</span></div>
                  </div>
                </div>

                {/* AVIL MILK */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    AVIL MILK
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>AVIL MILK NORMAL</span><span>₹50</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>AVIL MILK SPECIAL</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BUTTERSCOTCH AVIL MILK</span><span>₹80</span></div>
                  </div>
                </div>

                {/* MOJITOS */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    MOJITOS
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GREEN APPLE</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>STRAWBERRY</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MINT LIME</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>RED CAROCCA</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BLUEBERRY</span><span>₹70</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BLUE CARACCO</span><span>₹70</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BLACK CURRENT</span><span>₹70</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>RED CHILLY</span><span>₹70</span></div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Milk Shakes, Ice Cream, Falooda */}
              <div className="space-y-6">
                {/* MILK SHAKES */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    MILK SHAKES
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>SHAMAM</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>OREO</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>STRAWBERRY</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>SHARJA</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHIKKU</span><span>₹60</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MANGO</span><span>₹70</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>APPLE</span><span>₹70</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BLUEBERRY</span><span>₹80</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BUTTERSCOCH</span><span>₹80</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>DATES</span><span>₹80</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHOCO CRUNCH</span><span>₹80</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>DAIRY MILK</span><span>₹90</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CASHEW</span><span>₹90</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>SNICKERS</span><span>₹90</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>KIT-KAT</span><span>₹90</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>FRENCH VANILA</span><span>₹90</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>ANAR</span><span>₹90</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BADAM</span><span>₹100</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>PEANUT BUTTER</span><span>₹100</span></div>
                  </div>
                </div>

                {/* ICE CREAM SCOOPS */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    ICE CREAM SCOOPS
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>VANILA</span><span>₹30</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>STRAWBERRY</span><span>₹30</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MANGO</span><span>₹40</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>CHOCOLATE</span><span>₹40</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>BUTTERSCOTCH</span><span>₹40</span></div>
                  </div>
                </div>

                {/* FALOODA */}
                <div className="space-y-2">
                  <div className="bg-[#d49e38] text-black font-black px-3 py-1 text-xs uppercase tracking-widest rounded-sm shadow">
                    FALOODA
                  </div>
                  <div className="space-y-1 font-bold text-stone-200">
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>MEXICAN FALODA</span><span>₹140</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>GALAXY FALODA</span><span>₹150</span></div>
                    <div className="flex justify-between border-b border-stone-700/60 pb-1"><span>FEUIT MAGIC</span><span>₹100</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Contact */}
            <div className="text-center pt-4 border-t border-[#d49e38]/30 text-stone-300 font-bold text-xs flex justify-center items-center gap-2">
              <Phone className="w-4 h-4 text-[#d49e38]" />
              <span>7511104923, 9946238246</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
