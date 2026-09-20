import React, { useState } from 'react';
import { toast } from 'sonner';
import { SUMMON_DATA } from '../../lib/dark-fantasy-data';

export const SummonSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', objective: '', report: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailSubject = encodeURIComponent(`[EXPEDITION REPORT] ${form.objective || 'New Directive'}`);
    const mailBody = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nObjective: ${form.objective}\n\nReport:\n${form.report}`
    );
    toast.success('Raven dispatched. Launching email transmission.');
    window.location.href = `mailto:${SUMMON_DATA.dispatch}?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <section id="summon" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-24 z-10 border-t border-[#2a2723]">
      <div className="mb-8">
        <span className="font-military text-xs sm:text-sm tracking-[0.25em] text-[#b4442e]">
          05 — SUMMON
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Title & Dispatch Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#d6cfc2]">
              {SUMMON_DATA.title}
            </h2>
            <p className="font-body text-base sm:text-lg text-[#b7ad99] leading-relaxed mt-6">
              {SUMMON_DATA.subtitle}
            </p>
          </div>

          <div className="space-y-4 mt-12 pt-8 border-t border-[#2a2723] font-military text-xs tracking-wider">
            <div>
              <span className="text-[#b7ad99]/60 block">DISPATCH:</span>
              <a href={`mailto:${SUMMON_DATA.dispatch}`} className="text-[#d6cfc2] hover:text-[#b4442e] transition-colors">
                {SUMMON_DATA.dispatch}
              </a>
            </div>
            <div>
              <span className="text-[#b7ad99]/60 block">STATION:</span>
              <span className="text-[#d6cfc2]">{SUMMON_DATA.station}</span>
            </div>
            <div>
              <span className="text-[#b7ad99]/60 block">REGIMENT:</span>
              <span className="text-[#4d6155] font-semibold">{SUMMON_DATA.regiment}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
                NAME
              </label>
              <input
                type="text"
                required
                placeholder="Levi Ackerman"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
                CALLSIGN / EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="you@corps.dev"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
              OBJECTIVE
            </label>
            <input
              type="text"
              required
              placeholder="What wall are we taking?"
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-military text-xs tracking-wider text-[#b7ad99] mb-2">
              REPORT
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the terrain, the threat, and the timeline."
              value={form.report}
              onChange={(e) => setForm({ ...form, report: e.target.value })}
              className="w-full px-4 py-3 rounded border border-[#2a2723] bg-[#12100e] text-[#d6cfc2] font-body text-sm focus:border-[#b4442e] focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            aria-label="Dispatch the report"
            className="w-full sm:w-auto px-8 py-3.5 rounded border border-[#b4442e] bg-[#b4442e]/10 text-[#d6cfc2] font-military text-xs tracking-[0.2em] font-bold hover:bg-[#b4442e] hover:text-white transition-all duration-300"
          >
            DISPATCH THE REPORT →
          </button>
        </form>
      </div>
    </section>
  );
};
