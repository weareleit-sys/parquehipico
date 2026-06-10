'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Lead {
  id: string;
  empresa: string;
  categoria: string;
  categorias: string[];
  estado_lead: string;
  telefono: string;
  website: string;
  email: string;
  ubicacion: string;
  sector: string;
  capacidad_estimada: number;
  web_status: string;
  score: number;
  redes: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  guion: string;
  raw_data: string;
  created_at: string;
  _lastOutreach: { resultado: string; fecha_contacto: string } | null;
}

export interface LeadsFilters {
  activeCategory: string;
  activeState: string;
  activeSector: string;
  searchTerm: string;
}

export interface LeadsState {
  leads: Lead[];
  totalLeads: number;
  totalPages: number;
  page: number;
  loading: boolean;
  filters: LeadsFilters;
}

export interface LeadsActions {
  setPage: (page: number) => void;
  setFilters: (filters: Partial<LeadsFilters>) => void;
  fetchLeads: () => Promise<void>;
}

export function useLeads(
  initialLeads: Lead[],
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>
): LeadsState & LeadsActions {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFiltersState] = useState<LeadsFilters>({
    activeCategory: 'todos',
    activeState: 'pendientes',
    activeSector: 'todos',
    searchTerm: '',
  });

  const setFilters = useCallback((partial: Partial<LeadsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const filtersRef = useRef(filters);
  const pageRef = useRef(page);
  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const f = filtersRef.current;
      const p = pageRef.current;
      const q = new URLSearchParams();
      if (f.activeCategory !== 'todos') q.append('categoria', f.activeCategory);
      if (f.activeState !== 'todos') {
        q.append('estado', f.activeState);
      }
      if (f.activeSector !== 'todos') q.append('sector', f.activeSector);
      if (f.searchTerm) q.append('search', f.searchTerm);
      q.append('page', p.toString());
      q.append('limit', '25');

      const res = await apiFetch(`/api/leads/list?${q.toString()}`);
      if (res.ok) {
        const d = await res.json();
        setLeads(d.leads || []);
        setTotalLeads(d.total || 0);
        setTotalPages(d.totalPages || 0);
      }
    } catch (err) {
      console.error('fetchLeads error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  return {
    leads,
    totalLeads,
    totalPages,
    page,
    loading,
    filters,
    setPage,
    setFilters,
    fetchLeads,
  };
}
