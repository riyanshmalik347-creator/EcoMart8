import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Compass, Send } from 'lucide-react';

export const Hero: React.FC = () => {
  const { 
    setCurrentView, 
    setIsEcoAgentOpen, 
    setAgentInitialPrompt, 
    setIsScoreExplainerOpen 
  } = useApp();

  const [promptText, setPromptText] = useState('');

  const samplePrompts = [
    'I need an environmentally friendly water bottle under ₹800',
    'Plastic-free starter kit for kitchen under ₹1,500',
    'Zero-waste shampoo bar for daily use',
    'Heirloom cast iron cookware without toxic non-stick',
  ];

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setAgentInitialPrompt(promptText.trim());
    setIsEcoAgentOpen(true);
    setPromptText('');
  };

  const handleSampleClick = (prompt: string) => {
    setAgentInitialPrompt(prompt);
    setIsEcoAgentOpen(true);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:py-20 bg-linear-to-b from-stone-50 via-stone-50 to-white dark:from-stone-950 dark:via-stone-900 dark:to-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Subtle organic background foliage gradient */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-100/50 dark:bg-emerald-950/20 blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-100/30 dark:bg-amber-950/15 blur-3xl pointer-events-none" 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs">
            <Leaf className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400" />
            <span>Zero Greenwashing · Verified Metrics</span>
          </div>

          {/* Headline with tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-[1.15] font-display">
            “Don’t Just Shop. <br />
            <span className="text-emerald-800 dark:text-emerald-400">Shop With Purpose.”</span>
          </h1>

          {/* Subtext */}
          <p className="mt-5 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Discover thoughtfully crafted everyday essentials with open Eco Scores (0-100), transparent raw material provenance, zero single-use plastics, and Indian Rupee (₹) pricing.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('shop')}
              className="flex items-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <span>Shop Sustainably</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsScoreExplainerOpen(true)}
              className="flex items-center gap-2 py-3.5 px-5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How Eco Scores Work</span>
            </button>
          </div>

          {/* Prominent Eco Agent Prompt Box */}
          <div className="mt-12 p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl text-left max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ask Eco Agent · Powered by Gemini</span>
              </div>
              <span className="text-[11px] text-stone-400">
                Honest catalog answers
              </span>
            </div>

            {/* Prompt input field */}
            <form onSubmit={handlePromptSubmit} className="relative flex items-center">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ask e.g. 'I need an environmentally friendly water bottle under ₹800'..."
                className="w-full py-3 pl-4 pr-12 text-xs sm:text-sm rounded-2xl bg-stone-50 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white dark:focus:bg-stone-800 transition-all"
              />
              <button
                type="submit"
                disabled={!promptText.trim()}
                aria-label="Send query to Eco Agent"
                className="absolute right-2 p-2 rounded-xl bg-emerald-800 text-white disabled:opacity-40 hover:bg-emerald-900 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Interactive example queries chips */}
            <div className="mt-3">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1.5 font-medium">
                Try asking our sustainable shopping assistant:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleClick(prompt)}
                    className="text-left text-xs py-1.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer font-medium"
                  >
                    “{prompt}” →
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust stats row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-stone-200 dark:border-stone-800/80 pt-8">
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white block font-display">
                0-100
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Verified Eco Scores
              </span>
            </div>
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white block font-display">
                100%
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Plastic-Free Packaging
              </span>
            </div>
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white block font-display">
                14+
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Artisan Cooperatives
              </span>
            </div>
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white block font-display">
                ₹0 Hidden
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Transparent Pricing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
