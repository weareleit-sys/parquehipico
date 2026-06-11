'use client';

import React from 'react';
import {
  FaWhatsapp, FaSearch, FaExternalLinkAlt, FaMagic, FaEye,
  FaInstagram, FaFacebook,
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import type { Lead } from '../hooks/useLeads';
import { whatsappTemplates } from '../data/sectores';
import { getCategoryIcon, getCategoryLabel } from '../data/categories';

// ─── Pure helpers ────────────────────────────────────────────────────────────

export const getCategoryEmoji = (cat: string) => {
  return getCategoryIcon(cat);
};

export const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case 'nuevo': return 'bg-blue-500/20 text-blue-400';
    case 'en_proceso':
    case 'contactado': return 'bg-amber-500/20 text-amber-400';
    case 'respondio': return 'bg-emerald-500/20 text-emerald-400';
    case 'agendado': return 'bg-purple-500/20 text-purple-400';
    case 'rechazo': return 'bg-red-500/20 text-red-400';
    case 'descartado': return 'bg-slate-700/50 text-slate-400';
    default: return 'bg-slate-800 text-slate-400';
  }
};

export const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'nuevo': return 'border-l-blue-500';
    case 'en_proceso':
    case 'contactado': return 'border-l-amber-500';
    case 'respondio': return 'border-l-emerald-500';
    case 'agendado': return 'border-l-purple-500';
    case 'rechazo': return 'border-l-red-500';
    case 'descartado': return 'border-l-slate-600';
    default: return 'border-l-transparent';
  }
};

export const getRelativeTime = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 30) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-CL');
};

export const getWhatsAppLink = (lead: Lead, customGuion?: string): string => {
  if (!lead.telefono) return '#';
  const phones = lead.telefono.split(/[,;\/]\s*/);
  let bestPhone = phones[0];
  for (const p of phones) {
    const d = p.replace(/\D/g, '');
    if (d.startsWith('569') || (d.startsWith('9') && d.length <= 9)) {
      bestPhone = p;
      break;
    }
  }
  let digits = bestPhone.replace(/\D/g, '');
  if (digits.startsWith('569')) { /* ok */ }
  else if (digits.startsWith('9') && digits.length <= 9) { digits = '56' + digits; }
  else if (digits.length === 8) { digits = '569' + digits; }
  else if (!digits.startsWith('56')) { digits = '56' + digits; }

  const template = whatsappTemplates[lead.categoria] || whatsappTemplates.productoras;
  const ciudad = lead.ubicacion?.split(',')[0]?.trim() || 'la Araucanía';
  const defaultMsg = template.replace('{empresa}', lead.empresa).replace('{ciudad}', ciudad);
  const msg = customGuion || lead.guion || defaultMsg;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
};

const getSocialLinks = (lead: Lead) => {
  const links: { icon: React.ReactNode; url: string; color: string }[] = [];
  if (lead.instagram) links.push({
    icon: <FaInstagram className="text-sm" />,
    url: `https://instagram.com/${lead.instagram.replace('@', '').replace('instagram.com/', '')}`,
    color: 'hover:text-pink-400',
  });
  if (lead.facebook) links.push({
    icon: <FaFacebook className="text-sm" />,
    url: lead.facebook.startsWith('http') ? lead.facebook : `https://facebook.com/${lead.facebook}`,
    color: 'hover:text-blue-400',
  });
  if (lead.tiktok) links.push({
    icon: <FaTiktok className="text-sm" />,
    url: lead.tiktok.startsWith('http') ? lead.tiktok : `https://tiktok.com/@${lead.tiktok.replace('@', '')}`,
    color: 'hover:text-cyan-400',
  });
  return links;
};

const getOutreachResultLabel = (r: string) => {
  switch (r) {
    case 'contactado': return '📱 Contactado';
    case 'respondio': return '💬 Respondió';
    case 'agendado': return '📅 Agendado';
    case 'rechazo': return '❌ Rechazo';
    default: return '⏳ Pendiente';
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

interface LeadRowProps {
  lead: Lead;
  isNew: boolean;
  wasContacted: boolean;
  findingContactId: string | null;
  onOpenOutreach: (lead: Lead) => void;
  onOpenGuion: (lead: Lead) => void;
  onFindContact: (leadId: string) => void;
  onLogOutreach: (leadId: string, resultado: string, nuevoEstado: string) => void;
  getSectorLabel: (s: string) => string;
}

export default function LeadRow({
  lead, isNew, wasContacted, findingContactId,
  onOpenOutreach, onOpenGuion, onFindContact, onLogOutreach, getSectorLabel,
}: LeadRowProps) {
  const socials = getSocialLinks(lead);
  const lastTime = getRelativeTime(lead._lastOutreach?.fecha_contacto || null);
  const lastResult = lead._lastOutreach?.resultado;

  return (
    <tr className={`border-l-2 ${getEstadoColor(lead.estado_lead)} hover:bg-slate-800/30 transition-all`}>
      <td className="px-4 py-4">
        <div>
          <span className="text-white font-semibold text-sm block">
            {lead.empresa}
            {isNew && !wasContacted && (
              <span className="ml-2 inline-block text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">Nuevo</span>
            )}
            {isNew && wasContacted && (
              <span className="ml-2 inline-block text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">Ya contactado</span>
            )}
          </span>
          <div className="flex gap-3 text-xs text-slate-500 mt-1 flex-wrap">
            {lead.telefono && (
              <span className={`font-mono ${lead.web_status === 'fijo' ? 'text-amber-500' : 'text-slate-400'}`}>
                {lead.web_status === 'fijo' ? '📞 ' : ''}{lead.telefono}
              </span>
            )}
            {lead.email && <span className="text-pink-400 font-mono text-[11px]">{lead.email}</span>}
            {lead.website && (
              <a
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank" rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 flex items-center gap-1"
              >
                web <FaExternalLinkAlt className="text-[9px]" />
              </a>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-xs text-slate-400">{getSectorLabel(lead.sector)}</td>
      <td className="px-4 py-4 text-sm text-slate-300">
        <span>{getCategoryEmoji(lead.categoria)} {getCategoryLabel(lead.categoria)}</span>
      </td>
      <td className="px-4 py-4 text-sm text-slate-400">{lead.ubicacion || '—'}</td>
      <td className="px-4 py-4 text-center">
        <div className="flex justify-center gap-3">
          {socials.length === 0
            ? <span className="text-xs text-slate-600">—</span>
            : socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={`text-slate-500 ${s.color} transition-colors`}>
                  {s.icon}
                </a>
              ))
          }
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onOpenOutreach(lead)}
          className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize"
        >
          {lead.estado_lead.replace('_', ' ')}
        </button>
      </td>
      <td className="px-4 py-4 text-xs text-slate-400">
        {lastTime ? (
          <span title={lastResult ? getOutreachResultLabel(lastResult) : ''} className="cursor-help">
            {lastResult === 'agendado' && '📅 '}
            {lastResult === 'rechazo' && '❌ '}
            {lastTime === 'ahora'
              ? 'Contactado hoy'
              : lastTime.startsWith('hace')
              ? `Contactado ${lastTime}`
              : `Contactado ${lastTime}`}
          </span>
        ) : (
          <span className="text-slate-600">Sin contacto aún</span>
        )}
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          <button
            onClick={() => onOpenGuion(lead)}
            className={`text-xs font-bold flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all ${
              lead.guion
                ? 'text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20'
                : 'text-purple-400 hover:text-purple-300 bg-purple-500/10 border-purple-500/20'
            }`}
            title={lead.guion ? 'Ver mensaje personalizado' : 'Generar mensaje con IA'}
          >
            {lead.guion ? <FaEye className="text-[10px]" /> : <FaMagic className="text-[10px]" />} Mensaje
          </button>

          {lead.website && (
            <a
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
              target="_blank" rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1 bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700"
            >
              web <FaExternalLinkAlt className="text-[9px]" />
            </a>
          )}

          {lead.telefono ? (
            <a
              href={getWhatsAppLink(lead)}
              target="_blank" rel="noopener noreferrer"
              onClick={() => onLogOutreach(lead.id, 'contactado', 'contactado')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-lg transition-all"
            >
              <FaWhatsapp className="text-xs" /> WhatsApp
            </a>
          ) : (
            <button
              onClick={() => onFindContact(lead.id)}
              disabled={findingContactId === lead.id}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all disabled:opacity-50"
            >
              <FaSearch className="text-xs" />
              {findingContactId === lead.id ? 'Buscando...' : 'Buscar contacto'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
