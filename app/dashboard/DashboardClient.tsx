'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaSyncAlt, FaThList, FaTable } from 'react-icons/fa';

import { useLeads, type Lead } from './hooks/useLeads';
import { useSearch } from './hooks/useSearch';
import { useOutreach } from './hooks/useOutreach';
import SearchPanel from './components/SearchPanel';
import FilterBar from './components/FilterBar';
import LeadsTable from './components/LeadsTable';
import LeadCardView from './components/LeadCardView';
import OutreachModal from './OutreachModal';
import GuionModal from './GuionModal';
import { getWhatsAppLink } from './components/LeadRow';

interface DashboardClientProps {
  initialLeads: Lead[];
}

export default function DashboardClient({ initialLeads }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const apiFetch = useCallback((url: string, options?: RequestInit) => {
    const separator = url.includes('?') ? '&' : '?';
    return fetch(`${url}${token ? `${separator}token=${token}` : ''}`, options);
  }, [token]);

  const leadsState = useLeads(initialLeads, apiFetch);
  const searchState = useSearch(leadsState.fetchLeads, apiFetch);
  const outreachState = useOutreach(leadsState.fetchLeads, apiFetch);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);
  const [selectedLeadForGuion, setSelectedLeadForGuion] = useState<Lead | null>(null);

  const { filters, page, fetchLeads } = leadsState;

  useEffect(() => {
    fetchLeads();
  }, [
    filters.activeCategory,
    filters.activeState,
    filters.activeSector,
    filters.searchTerm,
    page,
    fetchLeads,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">Parque Hípico La Montaña</span>
          <h1 className="text-4xl font-extrabold text-white mt-1 tracking-tight">Contactos</h1>
          <p className="text-slate-400 text-sm mt-1">Busca empresas en la Araucanía, por sector y categoría. Contacta por WhatsApp, Instagram, Facebook o TikTok.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Vista tabla">
              <FaTable /> Tabla
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Vista tarjetas">
              <FaThList /> Tarjetas
            </button>
          </div>

          <button onClick={leadsState.fetchLeads}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all">
            <FaSyncAlt className={leadsState.loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <SearchPanel {...searchState} />

        <div className="lg:col-span-3 space-y-6">
          <FilterBar filters={leadsState.filters} onChange={leadsState.setFilters} />

          {viewMode === 'table' ? (
            <LeadsTable
              leads={leadsState.leads}
              totalLeads={leadsState.totalLeads}
              totalPages={leadsState.totalPages}
              page={leadsState.page}
              newLeads={searchState.newLeads}
              findingContactId={outreachState.findingContactId}
              onPage={leadsState.setPage}
              onOpenOutreach={setSelectedLeadForOutreach}
              onOpenGuion={setSelectedLeadForGuion}
              onFindContact={outreachState.handleFindContact}
              onLogOutreach={outreachState.logOutreach}
            />
          ) : (
            <LeadCardView
              leads={leadsState.leads}
              newLeads={searchState.newLeads}
              findingContactId={outreachState.findingContactId}
              onOpenOutreach={setSelectedLeadForOutreach}
              onOpenGuion={setSelectedLeadForGuion}
              onFindContact={outreachState.handleFindContact}
              onLogOutreach={outreachState.logOutreach}
            />
          )}
        </div>
      </div>

      {selectedLeadForOutreach && (
        <OutreachModal lead={selectedLeadForOutreach} isOpen={true} onClose={() => setSelectedLeadForOutreach(null)} onSaved={leadsState.fetchLeads} />
      )}
      {selectedLeadForGuion && (
        <GuionModal lead={selectedLeadForGuion} isOpen={true} onClose={() => setSelectedLeadForGuion(null)} onSaved={leadsState.fetchLeads} getWhatsAppLink={getWhatsAppLink} token={token} />
      )}
    </div>
  );
}
