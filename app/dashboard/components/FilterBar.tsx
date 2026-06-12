'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { sectoresAraucania } from '../data/sectores';
import { getCategoryIcon, getCategoryShortLabel, leadCategories } from '../data/categories';
import type { LeadsFilters } from '../hooks/useLeads';

interface FilterBarProps {
  filters: LeadsFilters;
  onChange: (partial: Partial<LeadsFilters>) => void;
}

const statusOptions = [
  { value: 'pendientes', label: 'Pendientes' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'respondio', label: 'Respondió' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'rechazo', label: 'Rechazo' },
  { value: 'todos', label: 'Todos' },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const { activeCategory, activeState, activeSector, searchTerm } = filters;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-white">Contactos guardados</h2>
        <p className="text-sm text-slate-400 mt-1">Filtra la lista actual para llamar, escribir y cambiar estados.</p>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={e => onChange({ searchTerm: e.target.value })}
          placeholder="Filtrar por empresa o ubicación guardada..."
          className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-amber-500 text-base"
        />
        <FaSearch className="absolute left-3 top-3.5 text-slate-500" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Tipo de contacto</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {leadCategories.map(c => (
            <button
              key={c.value}
              onClick={() => onChange({ activeCategory: c.value })}
              className={`min-h-11 px-3 py-2 rounded-lg text-sm font-bold border transition-all ${
                activeCategory === c.value
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {c.value === 'todos' ? c.label : `${getCategoryIcon(c.value)} ${getCategoryShortLabel(c.value)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="lead-sector-filter" className="block text-xs font-bold uppercase tracking-wide text-slate-400">
          Zona
        </label>
        <select
          id="lead-sector-filter"
          value={activeSector}
          onChange={e => onChange({ activeSector: e.target.value })}
          className="w-full sm:max-w-sm bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-3 outline-none focus:border-blue-500 text-base font-semibold"
        >
          <option value="todos">Todos los sectores</option>
          {Object.entries(sectoresAraucania).map(([key, sector]) => (
            <option key={key} value={key}>{sector.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {statusOptions.map(st => (
            <button
              key={st.value}
              onClick={() => onChange({ activeState: st.value })}
              className={`min-h-11 px-3 py-2 rounded-lg text-sm font-bold border transition-all ${
                activeState === st.value
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
