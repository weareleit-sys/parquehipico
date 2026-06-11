'use client';

import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import type { Lead } from '../hooks/useLeads';
import LeadRow from './LeadRow';
import { sectoresAraucania } from '../data/sectores';

type SortField = 'empresa' | 'categoria' | 'ubicacion' | 'created_at' | 'estado_lead';
type SortDir = 'asc' | 'desc';

const getSectorLabel = (s: string) => sectoresAraucania[s]?.label || s || '—';

interface LeadsTableProps {
  leads: Lead[];
  totalLeads: number;
  totalPages: number;
  page: number;
  newLeads: Lead[];
  findingContactId: string | null;
  onPage: (page: number) => void;
  onOpenOutreach: (lead: Lead) => void;
  onOpenGuion: (lead: Lead) => void;
  onFindContact: (leadId: string) => void;
  onLogOutreach: (leadId: string, resultado: string, nuevoEstado: string) => void;
}

export default function LeadsTable({
  leads, totalLeads, totalPages, page, newLeads, findingContactId,
  onPage, onOpenOutreach, onOpenGuion, onFindContact, onLogOutreach,
}: LeadsTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="text-slate-600 ml-1" />;
    return sortDir === 'asc'
      ? <FaSortUp className="text-amber-500 ml-1" />
      : <FaSortDown className="text-amber-500 ml-1" />;
  };

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      let va: any = a[sortField] || '';
      let vb: any = b[sortField] || '';
      if (sortField === 'estado_lead') {
        const order = ['nuevo', 'en_proceso', 'contactado', 'agendado', 'descartado'];
        va = order.indexOf(va);
        vb = order.indexOf(vb);
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [leads, sortField, sortDir]);

  const getNewLeadStatus = (lead: Lead) => ({
    isNew: newLeads.some(nl => nl.empresa === lead.empresa),
    wasContacted: !!lead._lastOutreach,
  });

  const thClass = "px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider";
  const thSort = `${thClass} cursor-pointer select-none hover:text-white transition-colors`;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950 border-b border-slate-800">
            <tr>
              <th className={thSort} onClick={() => handleSort('empresa')}>
                <span className="inline-flex items-center">Empresa {getSortIcon('empresa')}</span>
              </th>
              <th className={thClass}>Sector</th>
              <th className={thSort} onClick={() => handleSort('categoria')}>
                <span className="inline-flex items-center">Cat {getSortIcon('categoria')}</span>
              </th>
              <th className={thSort} onClick={() => handleSort('ubicacion')}>
                <span className="inline-flex items-center">Ciudad {getSortIcon('ubicacion')}</span>
              </th>
              <th className={`${thClass} text-center`}>Redes</th>
              <th className={thSort} onClick={() => handleSort('estado_lead')}>
                <span className="inline-flex items-center">Estado {getSortIcon('estado_lead')}</span>
              </th>
              <th className={thClass}>Último contacto</th>
              <th className={`${thClass} text-right`}>Contacto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No hay contactos para estos filtros.
                </td>
              </tr>
            ) : (
              sortedLeads.map(lead => {
                const { isNew, wasContacted } = getNewLeadStatus(lead);
                return (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    isNew={isNew}
                    wasContacted={wasContacted}
                    findingContactId={findingContactId}
                    onOpenOutreach={onOpenOutreach}
                    onOpenGuion={onOpenGuion}
                    onFindContact={onFindContact}
                    onLogOutreach={onLogOutreach}
                    getSectorLabel={getSectorLabel}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <span className="text-xs text-slate-500">
            {totalLeads} contactos · Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30 transition-all"
            >
              ← Anterior
            </button>
            <button
              onClick={() => onPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30 transition-all"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
