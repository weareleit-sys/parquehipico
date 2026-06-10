'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { sectoresAraucania } from '../data/sectores';
import type { LeadsFilters } from '../hooks/useLeads';

const getCategoryEmoji = (cat: string) => {
  switch (cat) {
    case 'productoras': return '🎪';
    case 'corporativo': return '🏢';
    case 'matrimonios': return '💒';
    case 'municipal': return '🏛️';
    case 'cumpleanos': return '🎂';
    default: return '📍';
  }
};

interface FilterBarProps {
  filters: LeadsFilters;
  onChange: (partial: Partial<LeadsFilters>) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const { activeCategory, activeState, activeSector, searchTerm } = filters;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={e => onChange({ searchTerm: e.target.value })}
          placeholder="Buscar por empresa o ubicación..."
          className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-xl outline-none focus:border-amber-500 text-sm"
        />
        <FaSearch className="absolute left-3 top-3 text-slate-500" />
      </div>

      <div className="flex flex-wrap gap-2">
        {['todos', 'productoras', 'corporativo', 'matrimonios', 'cumpleanos', 'municipal'].map(c => (
          <button
            key={c}
            onClick={() => onChange({ activeCategory: c })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
              activeCategory === c
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {c === 'todos' ? 'Todas' : `${getCategoryEmoji(c)} ${c}`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['todos', 'temuco', 'lacustre', 'sur', 'costa', 'norte', 'lagos'].map(s => (
          <button
            key={s}
            onClick={() => onChange({ activeSector: s })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
              activeSector === s
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {s === 'todos' ? 'Todos los Sectores' : sectoresAraucania[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['pendientes', 'contactado', 'respondio', 'agendado', 'rechazo', 'todos'].map(st => (
          <button
            key={st}
            onClick={() => onChange({ activeState: st })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
              activeState === st
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {st === 'todos' ? 'Todos'
              : st === 'pendientes' ? '🔵 Pendientes'
              : st.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
