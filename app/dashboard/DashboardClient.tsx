'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaSignOutAlt, FaSyncAlt, FaThList, FaTable } from 'react-icons/fa';

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
  needsVerification: number;
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
  const [verifyingOldData, setVerifyingOldData] = useState(false);
  const [verifyOldDataMessage, setVerifyOldDataMessage] = useState('');

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

  const handleVerifyOldData = useCallback(async () => {
    setVerifyingOldData(true);
    setVerifyOldDataMessage('Revisando 10 contactos antiguos...');
    try {
      const response = await apiFetch('/api/leads/verify-missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10 }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setVerifyOldDataMessage(data.error || 'No se pudieron revisar los datos.');
        return;
      }

      setVerifyOldDataMessage(
        data.processed > 0
          ? `Listo: ${data.processed} revisados, ${data.verified} verificados, ${data.partial} parciales.`
          : 'No quedan contactos antiguos por revisar.'
      );
      await refreshDashboard();
    } catch {
      setVerifyOldDataMessage('Error de red revisando datos.');
    } finally {
      setVerifyingOldData(false);
    }
  }, [apiFetch, refreshDashboard]);

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
  const currentSearchLeadIds = useMemo(
    () => new Set(searchState.newLeads.map(lead => lead.id)),
    [searchState.newLeads]
  );
  const generalLeads = useMemo(
    () => leadsState.leads.filter(lead => !currentSearchLeadIds.has(lead.id)),
    [leadsState.leads, currentSearchLeadIds]
  );
  const hiddenCurrentSearchCount = leadsState.leads.length - generalLeads.length;
  const generalTotalLeads = Math.max(0, leadsState.totalLeads - hiddenCurrentSearchCount);

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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <header className="mb-6 sm:mb-8 border-b border-slate-800 pb-5 sm:pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-white font-extrabold text-sm sm:text-base leading-none tracking-[0.12em] uppercase whitespace-nowrap">
                PARQUE H&Iacute;PICO
              </span>
              <span className="hidden sm:block w-7 h-[2px] bg-amber-500" />
              <span className="text-amber-500 text-base sm:text-lg font-serif italic leading-none whitespace-nowrap">
                La Monta&ntilde;a
              </span>
            </div>
            <p className="mt-4 text-amber-400 font-bold uppercase tracking-[0.12em] text-xs">Sistema de leads</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">Contactos pendientes</h1>
            <p className="text-slate-400 text-base mt-2 max-w-2xl">Lista simple para revisar, contactar por WhatsApp y actualizar el estado de cada posible cliente.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-wrap sm:items-center sm:justify-start lg:justify-end lg:w-auto">
            <div className="hidden md:flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`min-h-11 flex items-center gap-1.5 px-3 text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Vista tabla">
                <FaTable /> Tabla
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`min-h-11 flex items-center gap-1.5 px-3 text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Vista tarjetas">
                <FaThList /> Tarjetas
              </button>
            </div>

            <div className="min-h-11 inline-flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-200 font-bold px-3 sm:px-4 rounded-xl">
              {leadsState.totalLeads} contactos
            </div>

            <button onClick={refreshDashboard}
              className="min-h-11 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold px-3 sm:px-4 rounded-xl shadow-lg transition-all">
              <FaSyncAlt className={leadsState.loading ? 'animate-spin' : ''} /> Actualizar
            </button>

            <button
              onClick={handleLogout}
              className="min-h-11 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold px-3 rounded-xl transition-all"
              title="Salir"
            >
              <FaSignOutAlt /> <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3">
            {[
              ['Total', stats.total],
              ['Pendientes', stats.pending],
              ['Prioridad alta', stats.highPriority],
              ['Agendados', stats.scheduled],
              ['Sin revisar', stats.needsVerification],
              ['Revisar', stats.review],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
              </div>
            ))}
          </div>
        )}

        {stats && stats.needsVerification > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-extrabold text-amber-200">Hay {stats.needsVerification} contactos antiguos sin revisar.</p>
              <p className="text-sm text-slate-400 mt-1">Puedes revisar 10 por tanda para limpiar datos dudosos sin buscar contactos nuevos.</p>
              {verifyOldDataMessage && <p className="text-sm text-amber-100 mt-2 font-semibold">{verifyOldDataMessage}</p>}
            </div>
            <button
              onClick={handleVerifyOldData}
              disabled={verifyingOldData}
              className="min-h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-extrabold px-4 inline-flex items-center justify-center gap-2"
            >
              <FaCheckCircle className={verifyingOldData ? 'animate-pulse' : ''} />
              {verifyingOldData ? 'Revisando...' : 'Revisar 10 datos'}
            </button>
          </div>
        )}

        <SearchPanel
          {...searchState}
          findingContactId={outreachState.findingContactId}
          onOpenOutreach={setSelectedLeadForOutreach}
          onOpenGuion={setSelectedLeadForGuion}
          onFindContact={outreachState.handleFindContact}
          onLogOutreach={outreachState.logOutreach}
        />

        <FilterBar filters={leadsState.filters} onChange={leadsState.setFilters} />

        {viewMode === 'table' ? (
          <LeadsTable
            leads={generalLeads}
            totalLeads={generalTotalLeads}
            totalPages={leadsState.totalPages}
            page={leadsState.page}
            newLeads={[]}
            findingContactId={outreachState.findingContactId}
            onPage={leadsState.setPage}
            onOpenOutreach={setSelectedLeadForOutreach}
            onOpenGuion={setSelectedLeadForGuion}
            onFindContact={outreachState.handleFindContact}
            onLogOutreach={outreachState.logOutreach}
          />
        ) : (
          <LeadCardView
            leads={generalLeads}
            newLeads={[]}
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
