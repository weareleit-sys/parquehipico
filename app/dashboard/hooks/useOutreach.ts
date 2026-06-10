'use client';

import { useState, useCallback } from 'react';

export interface OutreachState {
  findingContactId: string | null;
}

export interface OutreachActions {
  handleFindContact: (leadId: string) => Promise<void>;
  logOutreach: (leadId: string, resultado: string, nuevoEstado: string) => Promise<void>;
}

export function useOutreach(
  fetchLeads: () => Promise<void>,
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>
): OutreachState & OutreachActions {
  const [findingContactId, setFindingContactId] = useState<string | null>(null);

  const handleFindContact = useCallback(async (leadId: string) => {
    setFindingContactId(leadId);
    try {
      const res = await apiFetch('/api/leads/find-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId }),
      });
      if ((await res.json()).success) fetchLeads();
    } catch (err) {
      console.error('handleFindContact error:', err);
    } finally {
      setFindingContactId(null);
    }
  }, [apiFetch, fetchLeads]);

  const logOutreach = useCallback(async (
    leadId: string,
    resultado: string,
    nuevoEstado: string
  ) => {
    try {
      await apiFetch('/api/outreach/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          resultado,
          nuevo_estado_lead: nuevoEstado,
        }),
      });
      fetchLeads();
    } catch (err) {
      console.error('logOutreach error:', err);
    }
  }, [apiFetch, fetchLeads]);

  return {
    findingContactId,
    handleFindContact,
    logOutreach,
  };
}
