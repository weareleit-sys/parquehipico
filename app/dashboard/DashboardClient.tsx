'use client';

import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaSyncAlt, FaSearch, FaBrain, FaExternalLinkAlt, FaSlidersH, FaUserTie } from 'react-icons/fa';
import OutreachModal from './OutreachModal';

interface Lead {
  id: string;
  empresa: string;
  categoria: string;
  categorias: string[];
  estado_lead: string;
  telefono: string;
  website: string;
  email: string;
  ubicacion: string;
  capacidad_estimada: number;
  web_status: string;
  score: number;
  redes: string;
  guion: string;
  created_at: string;
}

interface DashboardClientProps {
  initialLeads: Lead[];
}

export default function DashboardClient({ initialLeads }: DashboardClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeState, setActiveState] = useState('todos');

  // Lógica del buscador asíncrono
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('productoras');
  const [searchLocation, setSearchLocation] = useState('Temuco');
  const [searchSector, setSearchSector] = useState('temuco');

  const sectoresAraucania: Record<string, { label: string; ciudades: { value: string; label: string }[] }> = {
    temuco: {
      label: 'Temuco y alrededores',
      ciudades: [
        { value: 'Temuco', label: 'Temuco' },
        { value: 'Padre Las Casas', label: 'Padre Las Casas' },
        { value: 'Vilcún', label: 'Vilcún' },
        { value: 'Freire', label: 'Freire' },
        { value: 'Pitrufquén', label: 'Pitrufquén' },
        { value: 'Nueva Imperial', label: 'Nueva Imperial' },
        { value: 'Cholchol', label: 'Cholchol' },
        { value: 'Galvarino', label: 'Galvarino' },
      ]
    },
    lacustre: {
      label: 'Zona Lacustre (Villarrica-Pucón)',
      ciudades: [
        { value: 'Villarrica', label: 'Villarrica' },
        { value: 'Pucón', label: 'Pucón' },
        { value: 'Lican Ray', label: 'Lican Ray' },
        { value: 'Caburgua', label: 'Caburgua' },
        { value: 'Curarrehue', label: 'Curarrehue' },
        { value: 'Coñaripe', label: 'Coñaripe' },
      ]
    },
    sur: {
      label: 'Zona Sur (Loncoche-Gorbea)',
      ciudades: [
        { value: 'Loncoche', label: 'Loncoche' },
        { value: 'Gorbea', label: 'Gorbea' },
        { value: 'Toltén', label: 'Toltén' },
        { value: 'Teodoro Schmidt', label: 'Teodoro Schmidt' },
      ]
    },
    costa: {
      label: 'Costa Araucanía',
      ciudades: [
        { value: 'Carahue', label: 'Carahue' },
        { value: 'Puerto Saavedra', label: 'Puerto Saavedra' },
      ]
    },
    norte: {
      label: 'Zona Norte (Malleco)',
      ciudades: [
        { value: 'Victoria', label: 'Victoria' },
        { value: 'Curacautín', label: 'Curacautín' },
        { value: 'Lautaro', label: 'Lautaro' },
        { value: 'Collipulli', label: 'Collipulli' },
        { value: 'Angol', label: 'Angol' },
        { value: 'Lonquimay', label: 'Lonquimay' },
      ]
    },
    lagos: {
      label: 'Zona Lagos (Panguipulli y alrededores)',
      ciudades: [
        { value: 'Panguipulli', label: 'Panguipulli' },
        { value: 'Lanco', label: 'Lanco' },
        { value: 'Mariquina', label: 'Mariquina' },
      ]
    },
  };
  const [searchLimit, setSearchLimit] = useState(10);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobPhase, setJobPhase] = useState('');

  // Estados de Análisis Asíncronos
  const [analyzingLeadId, setAnalyzingLeadId] = useState<string | null>(null);
  const [analysisJobId, setAnalysisJobId] = useState<string | null>(null);

  // Modal de Outreach
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);

  // Polling para Jobs de Análisis de Lead Individual
  useEffect(() => {
    if (!analysisJobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/leads/job-status/${analysisJobId}`);
        if (!res.ok) throw new Error('Error al obtener estado');
        const data = await res.json();

        if (data.status === 'done' || data.status === 'error') {
          clearInterval(interval);
          setAnalysisJobId(null);
          setAnalyzingLeadId(null);
          // Recargar lista completa
          fetchLeads();
        }
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setAnalysisJobId(null);
        setAnalyzingLeadId(null);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [analysisJobId]);

  const fetchLeads = React.useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (activeCategory !== 'todos') queryParams.append('categoria', activeCategory);
      if (activeState !== 'todos') queryParams.append('estado', activeState);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await fetch(`/api/leads/list?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  }, [activeCategory, activeState, searchTerm]);

  // Ejecutar filtros y búsquedas reactivas locales
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);


  // Iniciar búsqueda con Gemini Grounding (sincrónica, sin polling)
  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setJobProgress(0);
    setJobStatus('running');
    setJobPhase(`Buscando empresas de ${searchCategory} en ${searchLocation}...`);

    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: searchCategory,
          ubicacion: searchLocation,
          limit: searchLimit
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJobProgress(100);
        setJobStatus('done');
        setJobPhase(`Completado: ${data.total} leads encontrados`);
        fetchLeads();
      } else {
        setJobStatus('error');
        setJobPhase(data.error || 'Error en la búsqueda');
        alert(data.error || 'Ocurrió un error al buscar');
      }
    } catch (err) {
      console.error(err);
      setJobStatus('error');
      setJobPhase('Error de red al buscar');
      alert('Error de red al intentar buscar.');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar análisis de lead con Gemini
  const handleAnalyzeLead = async (lead: Lead) => {
    setAnalyzingLeadId(lead.id);
    try {
      const res = await fetch('/api/leads/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          empresa: lead.empresa,
          categoria: lead.categoria,
          website: lead.website
        })
      });

      const data = await res.json();
      if (res.ok && data.job_id) {
        setAnalysisJobId(data.job_id);
      } else {
        alert(data.error || 'Error al iniciar análisis');
        setAnalyzingLeadId(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
      setAnalyzingLeadId(null);
    }
  };

  // Generar link directo de WhatsApp (limpiar y codificar)
  const getWhatsAppLink = (lead: Lead) => {
    if (!lead.telefono) return '#';
    const cleanPhone = lead.telefono.replace(/\D/g, '');
    const defaultText = `Hola, soy Alberto del Parque Hípico La Montaña. Vi que organizan eventos. Tenemos un predio con 3 hectáreas planas y luz trifásica. ¿Tienen algún evento que necesite locación?`;
    const message = lead.guion || defaultText;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Visual del score
  const getScoreBadgeClass = (score: number | null) => {
    if (!score) return 'bg-slate-800 text-slate-400 border border-slate-700';
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (score >= 5) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-slate-700/50 text-slate-300 border border-slate-600';
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'productoras': return '🎪';
      case 'corporativo': return '🏢';
      case 'matrimonios': return '💒';
      case 'municipal': return '🏛️';
      case 'cumpleanos': return '🎂';
      default: return '📍';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">
            Parque Hípico La Montaña
          </span>
          <h1 className="text-4xl font-extrabold text-white mt-1 tracking-tight">
            Panel de Leads & Outreach
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Busca productoras o empresas, califícalas con IA y contáctalas directamente por WhatsApp.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all"
        >
          <FaSyncAlt className={loading ? 'animate-spin' : ''} />
          Actualizar Vista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* PANEL LATERAL DE BÚSQUEDA GEMINI */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 border border-slate-800 h-fit space-y-6">
          <div className="flex items-center gap-3">
            <FaBrain className="text-amber-500 text-xl" />
            <h3 className="text-lg font-bold text-white">Buscar con Gemini</h3>
          </div>

          <form onSubmit={handleStartSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Categoría</label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm"
              >
                <option value="productoras">🎪 Productoras de Eventos</option>
                <option value="corporativo">🏢 Corporativo / Empresas</option>
                <option value="matrimonios">💒 Wedding Planners / Bodas</option>
                <option value="cumpleanos">🎂 Cumpleaños / Celebraciones</option>
                <option value="municipal">🏛️ Municipalidades / Ferias</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sector</label>
              <select
                value={searchSector}
                onChange={(e) => {
                  setSearchSector(e.target.value);
                  const sector = sectoresAraucania[e.target.value];
                  if (sector && sector.ciudades.length > 0) {
                    setSearchLocation(sector.ciudades[0].value);
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm"
              >
                {Object.entries(sectoresAraucania).map(([key, sector]) => (
                  <option key={key} value={key}>{sector.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ciudad / Localidad</label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm"
              >
                {(sectoresAraucania[searchSector]?.ciudades || []).map((ciudad) => (
                  <option key={ciudad.value} value={ciudad.value}>{ciudad.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Cantidad de Leads</label>
              <input
                type="number"
                min={1}
                max={20}
                value={searchLimit}
                onChange={(e) => setSearchLimit(parseInt(e.target.value) || 5)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <FaSearch />
              {loading ? 'Ejecutando Job...' : 'Buscar con Grounding'}
            </button>
          </form>

          {/* Estado de ejecución del Job */}
          {jobStatus && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Progreso del Job</span>
                <span className="text-amber-500 font-bold">{jobProgress}%</span>
              </div>
              <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300" 
                  style={{ width: `${jobProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 italic leading-relaxed text-center">
                {jobPhase}
              </p>
            </div>
          )}
        </div>

        {/* LISTADO DE LEADS Y TABLA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* BARRA DE FILTROS Y BÚSQUEDA LOCAL */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente o ubicación..."
                className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-xl outline-none focus:border-amber-500 transition-colors text-sm"
              />
              <FaSearch className="absolute left-3 top-3 text-slate-500" />
            </div>

            {/* Chips de Categorías y Estados */}
            <div className="flex flex-col gap-2 items-start md:items-end w-full md:w-auto">
              <div className="flex flex-wrap gap-2">
                {['todos', 'productoras', 'corporativo', 'matrimonios', 'cumpleanos', 'municipal'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase border ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {cat === 'todos' ? 'Todas' : `${getCategoryEmoji(cat)} ${cat}`}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {['todos', 'nuevo', 'en_proceso', 'contactado', 'agendado', 'descartado'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveState(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase border ${
                      activeState === st
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-755'
                    }`}
                  >
                    {st === 'todos' ? 'Todos los Estados' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla de Leads */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-450 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-450 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-450 uppercase tracking-wider">Ciudad/Ubicación</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-450 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-450 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-450 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No se encontraron leads registrados. Intenta buscar nuevos clientes con Gemini Grounding en el panel lateral.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-850/30 transition-all duration-200">
                        {/* Info básica */}
                        <td className="px-6 py-4">
                          <div>
                            <span className="text-white font-semibold text-sm hover:text-amber-400 transition-colors block">
                              {lead.empresa}
                            </span>
                            <div className="flex gap-4 text-xs text-slate-400 mt-1">
                              {lead.telefono && <span className="font-mono">{lead.telefono}</span>}
                              {lead.website && (
                                <a 
                                  href={lead.website.startsWith('http') ? lead.website : `http://${lead.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-white flex items-center gap-1"
                                >
                                  web <FaExternalLinkAlt className="text-[9px]" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Categoría */}
                        <td className="px-6 py-4 text-sm text-slate-300">
                          <span className="capitalize">
                            {getCategoryEmoji(lead.categoria)} {lead.categoria}
                          </span>
                        </td>
                        {/* Ubicación */}
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {lead.ubicacion || 'No especificada'}
                        </td>
                        {/* Score con IA */}
                        <td className="px-6 py-4 text-center">
                          {lead.score ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-black ${getScoreBadgeClass(lead.score)}`}>
                              {lead.score}/10
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAnalyzeLead(lead)}
                              disabled={analyzingLeadId === lead.id}
                              className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-2 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 mx-auto"
                            >
                              <FaBrain className="text-amber-500" />
                              {analyzingLeadId === lead.id ? 'Calculando...' : 'Calificar'}
                            </button>
                          )}
                        </td>
                        {/* Estado del Lead */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedLeadForOutreach(lead)}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            <span className="capitalize block">{lead.estado_lead.replace('_', ' ')}</span>
                          </button>
                        </td>
                        {/* Botón WhatsApp */}
                        <td className="px-6 py-4 text-right">
                          {lead.telefono ? (
                            <a
                              href={getWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                // De forma automática registrar el primer intento al hacer clic
                                fetch('/api/outreach/log', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    lead_id: lead.id,
                                    resultado: 'contactado',
                                    nuevo_estado_lead: 'contactado'
                                  })
                                }).then(() => fetchLeads());
                              }}
                              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-lg shadow-emerald-950/20 transition-all"
                            >
                              <FaWhatsapp className="text-sm" />
                              Enviar WhatsApp
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">Sin Teléfono</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Modal de Outreach */}
      {selectedLeadForOutreach && (
        <OutreachModal
          lead={selectedLeadForOutreach}
          isOpen={true}
          onClose={() => setSelectedLeadForOutreach(null)}
          onSaved={fetchLeads}
        />
      )}
    </div>
  );
}
