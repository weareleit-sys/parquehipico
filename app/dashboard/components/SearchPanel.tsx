'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { sectoresAraucania } from '../data/sectores';
import type { SearchState, SearchActions } from '../hooks/useSearch';

interface SearchPanelProps extends SearchState, SearchActions {}

export default function SearchPanel({
  searchStatus, searchMessage, searchStats, searchPhaseIdx, newLeads,
  searchPhases, form, isSearching, setForm, handleStartSearch,
}: SearchPanelProps) {
  return (
    <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 border border-slate-800 h-fit space-y-6">
      <div className="flex items-center gap-3">
        <FaSearch className="text-amber-500 text-xl" />
        <h3 className="text-lg font-bold text-white">Buscar empresas</h3>
      </div>

      <form onSubmit={handleStartSearch} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Categoría</label>
          <select
            value={form.searchCategory}
            onChange={e => setForm({ searchCategory: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm"
          >
            <option value="productoras">🎪 Productoras de Eventos</option>
            <option value="corporativo">🏢 Corporativo / Empresas</option>
            <option value="matrimonios">💒 Wedding Planners / Bodas</option>
            <option value="cumpleanos">🎂 Cumpleaños / Celebraciones</option>
            <option value="municipal">🏛️ Municipalidades / Ferias</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sector</label>
          <select
            value={form.searchSector}
            onChange={e => setForm({ searchSector: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm"
          >
            {Object.entries(sectoresAraucania).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ciudad</label>
          <select
            value={form.searchLocation}
            onChange={e => setForm({ searchLocation: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm"
          >
            {(sectoresAraucania[form.searchSector]?.ciudades || []).map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Resultados</label>
          <input
            type="number" min={1} max={20}
            value={form.searchLimit}
            onChange={e => setForm({ searchLimit: parseInt(e.target.value) || 5 })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <FaSearch /> {isSearching ? 'Buscando...' : 'Buscar empresas'}
        </button>
      </form>

      {searchStatus === 'running' && (
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 animate-pulse rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-amber-400 font-medium text-center">
            {searchPhases[searchPhaseIdx]}
          </p>
        </div>
      )}

      {searchStatus === 'done' && (
        <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-900 space-y-2">
          <p className="text-xs font-bold text-emerald-400">{searchMessage}</p>
          {searchStats && (
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-900 rounded-lg p-2 text-center">
                <p className="text-emerald-400 font-bold">{searchStats.withWhatsApp}</p>
                <p className="text-slate-500">WhatsApp</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-2 text-center">
                <p className="text-amber-400 font-bold">{searchStats.withPhone - searchStats.withWhatsApp}</p>
                <p className="text-slate-500">Fijo</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-2 text-center">
                <p className="text-blue-400 font-bold">{searchStats.withWebsite}</p>
                <p className="text-slate-500">Con web</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-2 text-center">
                <p className="text-pink-400 font-bold">{searchStats.withEmail}</p>
                <p className="text-slate-500">Con email</p>
              </div>
            </div>
          )}
        </div>
      )}

      {searchStatus === 'error' && (
        <div className="bg-red-950/30 rounded-xl p-4 border border-red-900">
          <p className="text-xs font-bold text-red-400">{searchMessage}</p>
        </div>
      )}

      {newLeads.length > 0 && searchStatus === 'done' && (
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 max-h-80 overflow-y-auto">
          <p className="text-xs font-bold text-amber-500 uppercase">Encontrados</p>
          {newLeads.map((lead, i) => (
            <div key={i} className="text-xs border-b border-slate-800 pb-2 last:border-0 last:pb-0">
              <p className="text-white font-semibold">{lead.empresa}</p>
              <p className="text-slate-500">
                {lead.ubicacion}{lead.telefono ? ` · ${lead.telefono}` : ''}
              </p>
              {lead._lastOutreach && (
                <span className="inline-block mt-1 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">
                  Ya contactado
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
