import React from 'react';
import { getSupabaseAdmin } from '@/lib/supabase';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = getSupabaseAdmin();

  const { data: initialLeads, error } = await supabase
    .from('leads')
    .select('*')
    .in('estado_lead', ['nuevo', 'en_proceso'])
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) {
    console.error('Error fetching initial leads:', error);
  }

  const leads = initialLeads || [];

  // Obtener último outreach por lead
  let outreachByLead: Record<string, any> = {};
  if (leads.length > 0) {
    const leadIds = leads.map((l: any) => l.id);
    try {
      const { data: outreachData } = await supabase
        .from('outreach')
        .select('lead_id, resultado, fecha_contacto')
        .in('lead_id', leadIds)
        .order('fecha_contacto', { ascending: false });

      if (outreachData) {
        for (const o of outreachData) {
          if (!outreachByLead[o.lead_id]) {
            outreachByLead[o.lead_id] = o;
          }
        }
      }
    } catch { /* outreach no disponible */ }
  }

  const enrichedLeads = leads.map((lead: any) => ({
    ...lead,
    _lastOutreach: outreachByLead[lead.id] || null
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <DashboardClient initialLeads={enrichedLeads} />
    </div>
  );
}
