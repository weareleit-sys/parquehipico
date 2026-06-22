'use client';

import React from 'react';
import { FaCheckCircle, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { leadCategoryDefinitions } from '@/lib/lead-categories';
import { sectoresAraucania } from '../data/sectores';
import type { SearchState, SearchActions } from '../hooks/useSearch';
import type { Lead } from '../hooks/useLeads';
import LeadCard from '../LeadCard';
import { getWhatsAppLink } from './LeadRow';

interface SearchPanelProps extends SearchState, SearchActions {
  findingContactId: string | null;
  onOpenOutreach: (lead: Lead) => void;
  onOpenGuion: (lead: Lead) => void;
  onFindContact: (leadId: string) => void;
  onLogOutreach: (leadId: string, resultado: string, nuevoEstado: string) => void;
}

function getVerificationStatus(lead: Lead): string {
  const directStatus = (lead as any).verification?.status;
  if (directStatus) return String(directStatus);
  try {
    const parsed = lead.raw_data ? JSON.parse(lead.raw_data) : null;
    return parsed?.verification?.status ? String(parsed.verification.status) : '';
  } catch {
    return '';
  }
}

function isReadyToContact(lead: Lead): boolean {
  const status = getVerificationStatus(lead);
  return ['verificado', 'parcial'].includes(status) && lead.estado_lead !== 'descartado';
}

export default function SearchPanel({
  searchStatus, searchMessage, searchStats, searchPhaseIdx, newLeads,
  searchPhases, form, isSearching, setForm, handleStartSearch, markNewLeadContacted,
  findingContactId, onOpenOutreach, onOpenGuion, onFindContact, onLogOutreach,
}: SearchPanelProps) {
  const foundCount = newLeads.length;
  const readyLeads = newLeads.filter(isReadyToContact);
  const reviewLeads = newLeads.filter(lead => !isReadyToContact(lead));
  const readyCount = readyLeads.length;
  const reviewCount = reviewLeads.length;

  const renderLeadCard = (lead: Lead) => {
    const wasContacted = !!lead._lastOutreach || ['contactado', 'respondio', 'agendado', 'rechazo'].includes(lead.estado_lead);
    return (
      <LeadCard
        key={lead.id}
        lead={lead}
        isNew={true}
        wasContacted={wasContacted}
        findingContact={findingContactId === lead.id}
        whatsappLink={getWhatsAppLink(lead)}
        onOpenOutreach={() => onOpenOutreach(lead)}
        onOpenGuion={() => onOpenGuion(lead)}
        onFindContact={() => onFindContact(lead.id)}
        onPrimaryContactClick={() => {
          markNewLeadContacted(lead.id);
          onLogOutreach(lead.id, 'contactado', 'contactado');
        }}
      />
    );
  };

  return (
    <section className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-amber-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0">
            <FaPlusCircle className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Buscar nuevos contactos</h2>
            <p className="text-sm text-slate-400">Los resultados quedan abajo, listos para contactar.</p>
          </div>
        </div>

        {searchStatus === 'done' && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm font-bold text-emerald-300">
            <FaCheckCircle /> {readyCount} listos{reviewCount > 0 ? `, ${reviewCount} revisar` : ''}
          </div>
        )}
      </div>

      <form onSubmit={handleStartSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Tipo</label>
          <select
            value={form.searchCategory}
            onChange={event => setForm({ searchCategory: event.target.value })}
            className="w-full min-h-12 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 outline-none focus:border-amber-500 text-base font-semibold"
          >
            {leadCategoryDefinitions.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.shortLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Zona</label>
          <select
            value={form.searchSector}
            onChange={event => setForm({ searchSector: event.target.value })}
            className="w-full min-h-12 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 outline-none focus:border-amber-500 text-base font-semibold"
          >
            {Object.entries(sectoresAraucania)
              .filter(([key]) => key !== 'externo')
              .map(([key, sector]) => (
                <option key={key} value={key}>{sector.label}</option>
              ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Ciudad</label>
          <select
            value={form.searchLocation}
            onChange={event => setForm({ searchLocation: event.target.value })}
            className="w-full min-h-12 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 outline-none focus:border-amber-500 text-base font-semibold"
          >
            {(sectoresAraucania[form.searchSector]?.ciudades || []).map(city => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Cantidad</label>
          <select
            value={form.searchLimit}
            onChange={event => setForm({ searchLimit: Number(event.target.value) })}
            className="w-full min-h-12 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 outline-none focus:border-amber-500 text-base font-semibold"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="md:col-span-2 min-h-12 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 px-4"
        >
          <FaSearch />
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {searchStatus === 'running' && (
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 animate-pulse rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-sm text-amber-300 font-bold text-center">
            {searchPhases[searchPhaseIdx]}
          </p>
        </div>
      )}

      {searchStatus === 'done' && (
        <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-900 space-y-3">
          <p className="text-sm font-bold text-emerald-300">{searchMessage}</p>
          {searchStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-900 rounded-lg p-3 text-center">
                <p className="text-emerald-300 font-extrabold text-lg">{searchStats.withWhatsApp}</p>
                <p className="text-slate-500">WhatsApp</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 text-center">
                <p className="text-amber-300 font-extrabold text-lg">{Math.max(0, searchStats.withPhone - searchStats.withWhatsApp)}</p>
                <p className="text-slate-500">Fijo</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 text-center">
                <p className="text-blue-300 font-extrabold text-lg">{searchStats.withWebsite}</p>
                <p className="text-slate-500">Web</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 text-center">
                <p className="text-pink-300 font-extrabold text-lg">{searchStats.withEmail}</p>
                <p className="text-slate-500">Email</p>
              </div>
            </div>
          )}

          {searchStats && ((searchStats.filteredOut || 0) + (searchStats.filteredBadFit || 0)) > 0 && (
            <p className="text-xs font-semibold text-slate-400">
              Se omitieron {(searchStats.filteredOut || 0) + (searchStats.filteredBadFit || 0)} resultados fuera de zona o poco útiles.
            </p>
          )}

          {foundCount > 0 && (
            <div className="space-y-3">
              {readyCount > 0 && (
                <>
                  <div className="flex items-center justify-between gap-3 border-t border-emerald-900/80 pt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">
                      Listos para contactar
                    </p>
                    <p className="text-xs text-slate-500">
                      Al buscar de nuevo, estos pasan a la lista general.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    {readyLeads.map(renderLeadCard)}
                  </div>
                </>
              )}

              {reviewCount > 0 && (
                <>
                  <div className="flex items-center justify-between gap-3 border-t border-amber-900/80 pt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-200">
                      Revisar antes de contactar
                    </p>
                    <p className="text-xs text-slate-500">
                      Datos incompletos o sin verificaci&oacute;n fuerte.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 opacity-90">
                    {reviewLeads.map(renderLeadCard)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {searchStatus === 'error' && (
        <div className="bg-red-950/30 rounded-xl p-4 border border-red-900">
          <p className="text-sm font-bold text-red-300">{searchMessage}</p>
        </div>
      )}
    </section>
  );
}
