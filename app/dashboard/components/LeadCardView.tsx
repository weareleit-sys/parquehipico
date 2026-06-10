'use client';

import React from 'react';
import type { Lead } from '../hooks/useLeads';
import LeadCard from '../LeadCard';
import { getWhatsAppLink } from './LeadRow';

interface LeadCardViewProps {
  leads: Lead[];
  newLeads: Lead[];
  findingContactId: string | null;
  onOpenOutreach: (lead: Lead) => void;
  onOpenGuion: (lead: Lead) => void;
  onFindContact: (leadId: string) => void;
  onLogOutreach: (leadId: string, resultado: string, nuevoEstado: string) => void;
}

export default function LeadCardView({
  leads, newLeads, findingContactId,
  onOpenOutreach, onOpenGuion, onFindContact, onLogOutreach,
}: LeadCardViewProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 px-6 py-12 text-center text-slate-500 text-sm">
        No hay contactos. Usa el panel lateral para buscar empresas en la Araucanía.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {leads.map(lead => (
        <LeadCard
          key={lead.id}
          lead={lead}
          isNew={newLeads.some(nl => nl.empresa === lead.empresa)}
          wasContacted={!!lead._lastOutreach}
          findingContact={findingContactId === lead.id}
          whatsappLink={getWhatsAppLink(lead)}
          onOpenOutreach={() => onOpenOutreach(lead)}
          onOpenGuion={() => onOpenGuion(lead)}
          onFindContact={() => onFindContact(lead.id)}
          onWhatsAppClick={() => onLogOutreach(lead.id, 'contactado', 'contactado')}
        />
      ))}
    </div>
  );
}
