'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaSignOutAlt, FaSyncAlt, FaThList, FaTable } from 'react-icons/fa';

import { useLeads, type Lead } from './hooks/useLeads';
import { useSearch, type SearchFormState } from './hooks/useSearch';
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

interface LeadStats {
  total: number;
  pending: number;
  scheduled: number;
  highPriority: number;
  review: number;
}

export default function DashboardClient({ initialLeads }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const apiFetch = useCallback((url: string, options?: RequestInit) => {
    const headers = new Headers(options?.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...options, headers });
  }, [token]);

  const leadsState = useLeads(initialLeads, apiFetch);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);
  const [selectedLeadForGuion, setSelectedLeadForGuion] = useState<Lead | null>(null);
  const [stats, setStats] = useState<LeadStats | null>(null);

  const { filters, page, fetchLeads, setFilters } = leadsState;

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiFetch('/api/leads/stats');
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('fetchStats error:', error);
    }
  }, [apiFetch]);

  const refreshDashboard = useCallback(async () => {
    await Promise.all([fetchLeads(), fetchStats()]);
  }, [fetchLeads, fetchStats]);

  const handleSearchComplete = useCallback((_newLeads: Lead[], searchForm: SearchFormState) => {
    setFilters({
      activeCategory: searchForm.searchCategory,
      activeState: 'pendientes',
      activeSector: searchForm.searchSector,
      searchTerm: '',
    });
  }, [setFilters]);

  const searchState = useSearch(refreshDashboard, apiFetch, handleSearchComplete);
  const outreachState = useOutreach(refreshDashboard, apiFetch);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    window.location.href = '/dashboard/login';
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [
    filters.activeCategory,
    filters.activeState,
    filters.activeSector,
    filters.searchTerm,
    page,
    refreshDashboard,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-5 border-b border-slate-800 pb-5 sm:pb-6">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">Parque Hípico La Montaña</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">Contactos pendientes</h1>
          <p className="text-slate-400 text-base mt-2 max-w-2xl">Lista simple para revisar, contactar por WhatsApp y actualizar el estado de cada posible cliente.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
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

          <div className="bg-slate-900 border border-slate-800 text-slate-200 font-bold py-2.5 px-4 rounded-xl">
            {leadsState.totalLeads} contactos
          </div>

          <button onClick={refreshDashboard}
            className="ml-auto md:ml-0 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all">
            <FaSyncAlt className={leadsState.loading ? 'animate-spin' : ''} /> Actualizar
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold py-2.5 px-3 rounded-xl transition-all"
            title="Salir"
          >
            <FaSignOutAlt /> <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
              {[
                ['Total', stats.total],
                ['Pendientes', stats.pending],
                ['Prioridad alta', stats.highPriority],
                ['Agendados', stats.scheduled],
                ['Revisar', stats.review],
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{label}</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
                </div>
              ))}
            </div>
          )}

          <SearchPanel {...searchState} />

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

      {selectedLeadForOutreach && (
        <OutreachModal lead={selectedLeadForOutreach} isOpen={true} onClose={() => setSelectedLeadForOutreach(null)} onSaved={refreshDashboard} token={token} />
      )}
      {selectedLeadForGuion && (
        <GuionModal lead={selectedLeadForGuion} isOpen={true} onClose={() => setSelectedLeadForGuion(null)} onSaved={refreshDashboard} getWhatsAppLink={getWhatsAppLink} token={token} />
      )}
    </div>
  );
}
