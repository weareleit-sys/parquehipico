import React from 'react';
import { getSupabase } from '@/app/lib/supabase';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = getSupabase();

  // Obtener los leads iniciales directamente desde el servidor
  const { data: initialLeads, error } = await supabase
    .from('leads')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching initial leads:', error);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <DashboardClient initialLeads={initialLeads || []} />
    </div>
  );
}
