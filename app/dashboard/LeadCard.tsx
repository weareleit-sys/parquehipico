'use client';

import React from 'react';
import { FaWhatsapp, FaSearch, FaExternalLinkAlt, FaMagic, FaEye, FaInstagram, FaFacebook, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import type { Lead } from './hooks/useLeads';
import { buildSocialUrl, buildWebsiteUrl } from '@/lib/lead-links';
import { LEAD_VERIFICATION_VERSION } from '@/lib/lead-verification-version';
import {
  getEstadoColor,
  getEstadoBadge,
  getCategoryEmoji,
  getRelativeTime,
} from './components/LeadRow';
import { sectoresAraucania } from './data/sectores';
import { getCategoryLabel } from './data/categories';

interface LeadCardProps {
  lead: Lead;
  isNew: boolean;
  wasContacted: boolean;
  findingContact: boolean;
  whatsappLink: string;
  onOpenOutreach: () => void;
  onOpenGuion: () => void;
  onFindContact: () => void;
  onWhatsAppClick: () => void;
}

const getSectorLabel = (s: string) => sectoresAraucania[s]?.label || s || '—';

const getPriorityLabel = (score?: number) => {
  if (!score) return null;
  if (score >= 8) return { text: 'Prioridad alta', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' };
  if (score >= 6) return { text: 'Prioridad media', className: 'bg-amber-500/15 text-amber-300 border-amber-500/20' };
  return { text: 'Revisar', className: 'bg-slate-700/60 text-slate-300 border-slate-600' };
};

const getLeadRole = (rawData: string) => {
  if (!rawData) return '';
  try {
    const parsed = JSON.parse(rawData);
    return typeof parsed._leadRole === 'string' ? parsed._leadRole : '';
  } catch {
    return '';
  }
};

const getVerificationBadge = (rawData: string) => {
  const unreviewed = {
    text: 'Sin revisar',
    icon: <FaExclamationCircle className="text-[10px]" />,
    className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };
  if (!rawData) return unreviewed;
  try {
    const parsed = JSON.parse(rawData);
    const verification = parsed.verification;
    if (!verification?.status) return unreviewed;
    if (Number(verification.version || 0) < LEAD_VERIFICATION_VERSION) return unreviewed;
    if (verification.status === 'verificado') {
      return {
        text: 'Verificado',
        icon: <FaCheckCircle className="text-[10px]" />,
        className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
      };
    }
    if (verification.status === 'parcial') {
      return {
        text: 'Parcial',
        icon: <FaCheckCircle className="text-[10px]" />,
        className: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
      };
    }
    if (verification.status === 'conflicto') {
      return {
        text: 'Conflicto',
        icon: <FaExclamationCircle className="text-[10px]" />,
        className: 'bg-red-500/15 text-red-300 border-red-500/25',
      };
    }
    return {
      text: 'Sin verificar',
      icon: <FaExclamationCircle className="text-[10px]" />,
      className: 'bg-slate-700/50 text-slate-300 border-slate-600',
    };
  } catch {
    return unreviewed;
  }
};

const getTrustedLinks = (rawData: string) => {
  const hidden = { website: false, instagram: false, facebook: false, tiktok: false };
  if (!rawData) return hidden;
  try {
    const verification = JSON.parse(rawData).verification;
    if (!verification?.status || Number(verification.version || 0) < LEAD_VERIFICATION_VERSION) return hidden;
    const fields = verification.fields || {};
    return {
      website: !!fields.website || verification.website_health?.ok === true,
      instagram: !!fields.instagram,
      facebook: !!fields.facebook,
      tiktok: !!fields.tiktok,
    };
  } catch {
    return hidden;
  }
};

export default function LeadCard({
  lead, isNew, wasContacted, findingContact,
  whatsappLink, onOpenOutreach, onOpenGuion, onFindContact, onWhatsAppClick,
}: LeadCardProps) {
  const lastTime = getRelativeTime(lead._lastOutreach?.fecha_contacto || null);
  const lastResult = lead._lastOutreach?.resultado;
  const priority = getPriorityLabel(lead.score);
  const leadRole = getLeadRole(lead.raw_data);
  const verificationBadge = getVerificationBadge(lead.raw_data);
  const trustedLinks = getTrustedLinks(lead.raw_data);
  const websiteUrl = trustedLinks.website ? buildWebsiteUrl(lead.website) : '';
  const instagramUrl = trustedLinks.instagram ? buildSocialUrl('instagram', lead.instagram) : '';
  const facebookUrl = trustedLinks.facebook ? buildSocialUrl('facebook', lead.facebook) : '';
  const tiktokUrl = trustedLinks.tiktok ? buildSocialUrl('tiktok', lead.tiktok) : '';

  const lastContactLabel = (() => {
    if (!lastTime) return null;
    if (lastTime === 'ahora') return 'Contactado hoy';
    if (lastTime.startsWith('hace')) return `Contactado ${lastTime}`;
    return `Contactado ${lastTime}`;
  })();

  return (
    <div className={`bg-slate-900 rounded-2xl border border-slate-800 border-l-4 ${getEstadoColor(lead.estado_lead)} p-5 flex flex-col gap-4 hover:bg-slate-800/60 transition-all`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg leading-tight">{lead.empresa}</p>
          <p className="text-slate-400 text-sm mt-1">
            {getCategoryEmoji(lead.categoria)} {getCategoryLabel(lead.categoria)} · {lead.ubicacion?.split(',')[0] || '—'}
          </p>
          {(priority || leadRole || verificationBadge) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {verificationBadge && (
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${verificationBadge.className}`}>
                  {verificationBadge.icon} {verificationBadge.text}
                </span>
              )}
              {priority && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${priority.className}`}>
                  {priority.text}
                </span>
              )}
              {leadRole && leadRole !== 'cliente directo' && (
                <span className="text-xs font-bold px-2 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300">
                  {leadRole}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getEstadoBadge(lead.estado_lead)}`}>
            {lead.estado_lead.replace('_', ' ')}
          </span>
          {isNew && !wasContacted && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">Nuevo</span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {lead.telefono && (
          <p className={`text-base font-mono font-semibold ${lead.web_status === 'fijo' ? 'text-amber-400' : 'text-slate-200'}`}>
            {lead.web_status === 'fijo' ? '📞 ' : '📱 '}{lead.telefono}
          </p>
        )}
        {lead.email && (
          <p className="text-sm text-pink-400 font-mono break-all">{lead.email}</p>
        )}
        {!lead.telefono && !lead.email && (
          <p className="text-sm text-slate-500 italic">Sin datos de contacto</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {websiteUrl && (
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
            className="min-h-10 inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 text-amber-300 hover:bg-amber-500/20 text-sm font-bold"
            aria-label={`Abrir web de ${lead.empresa}`}>
            Web <FaExternalLinkAlt className="text-[10px]" />
          </a>
        )}
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-pink-300 hover:bg-slate-700 transition-colors"
            aria-label={`Abrir Instagram de ${lead.empresa}`}><FaInstagram /></a>
        )}
        {facebookUrl && (
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
            className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-blue-300 hover:bg-slate-700 transition-colors"
            aria-label={`Abrir Facebook de ${lead.empresa}`}><FaFacebook /></a>
        )}
        {tiktokUrl && (
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"
            className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors"
            aria-label={`Abrir TikTok de ${lead.empresa}`}><FaTiktok /></a>
        )}
        <span className="text-sm text-slate-500 sm:ml-auto">{getSectorLabel(lead.sector)}</span>
      </div>

      <div className="text-sm text-slate-400 border-t border-slate-800 pt-3">
        {lastContactLabel ? (
          <span title={lastResult || ''}>
            {lastResult === 'agendado' && '📅 '}
            {lastResult === 'rechazo' && '❌ '}
            {lastContactLabel}
          </span>
        ) : (
          <span className="text-slate-600">Sin contacto aún</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {lead.telefono ? (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={onWhatsAppClick}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-3 rounded-lg text-sm shadow transition-all">
            <FaWhatsapp /> WhatsApp
          </a>
        ) : (
          <button onClick={onFindContact} disabled={findingContact}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-3 rounded-lg text-sm transition-all disabled:opacity-50">
            <FaSearch /> {findingContact ? 'Buscando...' : 'Buscar contacto'}
          </button>
        )}
        <button onClick={onOpenGuion}
          className="inline-flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-bold bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition-all"
          title={lead.guion ? 'Ver mensaje' : 'Generar mensaje'}>
          {lead.guion ? <FaEye className="text-[10px]" /> : <FaMagic className="text-[10px]" />}
          Mensaje
        </button>
        <button onClick={onOpenOutreach}
          className="inline-flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-bold bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-600 transition-all">
          Estado
        </button>
      </div>
    </div>
  );
}
