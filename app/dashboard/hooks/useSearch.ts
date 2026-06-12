'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Lead } from './useLeads';
import { sectoresAraucania } from '../data/sectores';

const searchPhases = [
  'Consultando Google Maps...',
  'Rastreando páginas amarillas...',
  'Verificando teléfonos...',
  'Buscando redes sociales...',
  'Analizando resultados...',
  'Guardando en base de datos...',
];

export interface SearchFormState {
  searchCategory: string;
  searchLocation: string;
  searchSector: string;
  searchLimit: number;
}

export interface SearchState {
  searchStatus: 'idle' | 'running' | 'done' | 'error';
  searchMessage: string;
  searchStats: {
    withWhatsApp: number;
    withPhone: number;
    withWebsite: number;
    withEmail: number;
    filteredOut?: number;
  } | null;
  searchPhaseIdx: number;
  newLeads: Lead[];
  searchPhases: string[];
  form: SearchFormState;
  isSearching: boolean;
}

export interface SearchActions {
  setForm: (partial: Partial<SearchFormState>) => void;
  handleStartSearch: (e: React.FormEvent) => Promise<void>;
  markNewLeadContacted: (leadId: string) => void;
}

export function useSearch(
  fetchLeads: () => Promise<void>,
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>,
  onSearchComplete?: (leads: Lead[], form: SearchFormState) => void
): SearchState & SearchActions {
  const [searchStatus, setSearchStatus] = useState<SearchState['searchStatus']>('idle');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchStats, setSearchStats] = useState<SearchState['searchStats']>(null);
  const [searchPhaseIdx, setSearchPhaseIdx] = useState(0);
  const [newLeads, setNewLeads] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [form, setFormState] = useState<SearchFormState>({
    searchCategory: 'productoras',
    searchLocation: 'Pucón y Villarrica',
    searchSector: 'lacustre',
    searchLimit: 10,
  });

  const phaseInterval = useRef<NodeJS.Timeout | null>(null);

  const setForm = useCallback((partial: Partial<SearchFormState>) => {
    setFormState(prev => {
      const next = { ...prev, ...partial };
      if (partial.searchSector && partial.searchSector !== prev.searchSector) {
        const ciudades = sectoresAraucania[partial.searchSector]?.ciudades;
        if (ciudades?.length) next.searchLocation = ciudades[0].value;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (searchStatus === 'running') {
      phaseInterval.current = setInterval(() => {
        setSearchPhaseIdx(prev => (prev + 1) % searchPhases.length);
      }, 3000);
    } else {
      if (phaseInterval.current) clearInterval(phaseInterval.current);
    }
    return () => {
      if (phaseInterval.current) clearInterval(phaseInterval.current);
    };
  }, [searchStatus]);

  const handleStartSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchStatus('running');
    setSearchPhaseIdx(0);
    setNewLeads([]);
    setSearchStats(null);
    setSearchMessage(`Buscando ${form.searchCategory} en ${form.searchLocation}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 85000);

    try {
      const res = await apiFetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: form.searchCategory,
          ubicacion: form.searchLocation,
          sector: form.searchSector,
          limit: form.searchLimit,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok && data.success) {
        setNewLeads(data.leads || []);
        setSearchStats(data.stats || null);
        setSearchStatus('done');
        const filteredOut = Number(data.stats?.filteredOut || 0);
        setSearchMessage(filteredOut > 0
          ? `${data.total} contactos útiles en ${form.searchLocation}. Se omitieron ${filteredOut} fuera de zona.`
          : `${data.total} contactos útiles en ${form.searchLocation}`);
        if (onSearchComplete) {
          onSearchComplete(data.leads || [], form);
        } else {
          fetchLeads();
        }
      } else {
        setSearchStatus('error');
        setSearchMessage(data.error || 'Error en la búsqueda');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setSearchStatus('running');
        setSearchMessage('Búsqueda sigue en servidor. Recargá en unos segundos para ver resultados.');
        setIsSearching(false);
        return;
      }
      setSearchStatus('error');
      setSearchMessage('Error de red al buscar');
    } finally {
      setIsSearching(false);
    }
  }, [form, apiFetch, fetchLeads, onSearchComplete]);

  const markNewLeadContacted = useCallback((leadId: string) => {
    setNewLeads(prev => prev.map(lead => lead.id === leadId
      ? {
          ...lead,
          estado_lead: 'contactado',
          _lastOutreach: {
            resultado: 'contactado',
            fecha_contacto: new Date().toISOString(),
          },
        }
      : lead
    ));
  }, []);

  return {
    searchStatus,
    searchMessage,
    searchStats,
    searchPhaseIdx,
    newLeads,
    searchPhases,
    form,
    isSearching,
    setForm,
    handleStartSearch,
    markNewLeadContacted,
  };
}
