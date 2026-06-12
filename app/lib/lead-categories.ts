export type LeadCategoryDefinition = {
  value: string;
  label: string;
  shortLabel: string;
  icon: string;
  role: string;
  searchPrompt: string;
  guionContext: string;
  template: string;
};

export const leadCategoryDefinitions: LeadCategoryDefinition[] = [
  {
    value: 'productoras',
    label: 'Productoras de eventos',
    shortLabel: 'Productoras',
    icon: '🎪',
    role: 'Organizan eventos para terceros y necesitan espacios para sus clientes.',
    searchPrompt: 'busca productoras de eventos, festivales, conciertos, ferias, activaciones de marca, producción técnica integral y organizadores de experiencias masivas. Prioriza quienes producen o coordinan eventos completos. Evita proveedores que solo arriendan sonido, iluminación, fotografía, video, pantallas o equipos, salvo que también organicen eventos.',
    guionContext: 'productoras de eventos, festivales, conciertos, ferias y activaciones que podrían necesitar un venue outdoor amplio para sus clientes',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} produce eventos en {ciudad}. Cuando tus clientes necesiten un espacio outdoor grande, campestre y con infraestructura, podemos ser una muy buena alternativa. ¿Conversamos?',
  },
  {
    value: 'corporativo',
    label: 'Empresas y corporativos',
    shortLabel: 'Empresas',
    icon: '🏢',
    role: 'Empresas que podrían hacer jornadas internas, celebraciones, activaciones o eventos de clientes.',
    searchPrompt: 'busca empresas, cámaras de comercio, asociaciones empresariales, proveedores corporativos, agencias B2B y organizaciones que realicen team building, cenas de fin de año, aniversarios, lanzamientos, ferias internas, activaciones o eventos para colaboradores/clientes. Excluye empresas agrícolas, forestales, industriales o constructoras si no hay señal de que hagan eventos.',
    guionContext: 'empresas, cámaras, asociaciones y proveedores corporativos que podrían organizar jornadas, aniversarios, team building, activaciones o eventos para colaboradores/clientes',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} está en {ciudad}. Para jornadas, aniversarios o actividades corporativas al aire libre, tenemos un espacio amplio, campestre y fácil de adaptar. ¿Conversamos?',
  },
  {
    value: 'matrimonios',
    label: 'Matrimonios',
    shortLabel: 'Matrimonios',
    icon: '💒',
    role: 'Planners y proveedores que pueden recomendar un lugar para bodas grandes u outdoor.',
    searchPrompt: 'busca wedding planners, banqueterías de matrimonios, organizadores de bodas, decoradores integrales, productoras de matrimonios y proveedores que recomienden locaciones outdoor. Excluye tiendas de vestidos, joyerías, florerías o fotógrafos si solo venden un servicio puntual y no influyen en la elección del lugar.',
    guionContext: 'wedding planners, banqueterías y proveedores integrales de matrimonios que podrían recomendar o necesitar una locación outdoor amplia',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi el trabajo de {empresa} en {ciudad}. Si alguna pareja necesita una locación outdoor amplia, campestre y distinta para su matrimonio, nos gustaría que conozcan el parque. ¿Conversamos?',
  },
  {
    value: 'cumpleanos',
    label: 'Eventos familiares',
    shortLabel: 'Familiares',
    icon: '🎉',
    role: 'Celebraciones privadas grandes, aniversarios y proveedores que organizan eventos familiares.',
    searchPrompt: 'interprétala como eventos familiares y celebraciones privadas, NO como tiendas de cumpleaños. Busca organizadores de celebraciones, banqueterías, productoras pequeñas, catering, planners para aniversarios, fiestas privadas, hoteles, cabañas, centros de eventos, salones y venues que podrían necesitar un espacio outdoor complementario, más grande, más campestre o con bosque. Excluye tiendas de artículos para fiestas, cotillón, decoración, globos, tortas, piñaterías, dulcerías, jugueterías y negocios dedicados principalmente a vender productos.',
    guionContext: 'eventos familiares y celebraciones privadas. Puede incluir banqueterías, productoras, hoteles, cabañas, centros de eventos o venues que podrían necesitar un espacio outdoor complementario, más grande, más campestre o con bosque. Evita decir "cumpleaños" salvo que esté confirmado; prefiere "celebraciones", "fiestas privadas" o "eventos familiares"',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} organiza celebraciones familiares en {ciudad}. Para fiestas privadas, aniversarios o encuentros grandes donde se necesita espacio campestre, podemos ser una buena alternativa. ¿Conversamos?',
  },
  {
    value: 'turismo',
    label: 'Turismo y venues',
    shortLabel: 'Turismo/Venues',
    icon: '🌲',
    role: 'Aliados turísticos, hoteles y venues que pueden derivar clientes o necesitar un espacio mayor/complementario.',
    searchPrompt: 'busca hoteles, cabañas, centros turísticos, agencias de turismo receptivo, operadores outdoor, restaurantes turísticos, centros de eventos, salones, venues, campings, resorts y alojamientos que podrían derivar clientes o necesitar un espacio outdoor grande con bosque e infraestructura para eventos especiales. Prioriza empresas turísticas o venues; NO devuelvas productoras genéricas de eventos salvo que también sean venue, centro turístico, hotel, agencia u operador turístico.',
    guionContext: 'hoteles, cabañas, centros turísticos, agencias, operadores outdoor, restaurantes turísticos y venues que podrían derivar clientes o necesitar un espacio outdoor grande y campestre para eventos especiales',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} trabaja con turismo y experiencias en {ciudad}. Cuando necesiten un espacio outdoor grande, con bosque e infraestructura para eventos especiales, podemos ser un muy buen complemento. ¿Conversamos?',
  },
  {
    value: 'educacion',
    label: 'Colegios e instituciones',
    shortLabel: 'Educación',
    icon: '🎓',
    role: 'Instituciones que convocan comunidades y pueden hacer jornadas, aniversarios o actividades al aire libre.',
    searchPrompt: 'busca colegios, liceos, universidades, institutos, jardines, centros de padres, fundaciones educativas, organizaciones estudiantiles, centros de formación, preuniversitarios grandes y entidades educativas que podrían realizar jornadas, alianzas, celebraciones, licenciaturas, aniversarios, encuentros o actividades al aire libre.',
    guionContext: 'colegios, universidades, institutos, centros de padres, fundaciones educativas y organizaciones que podrían hacer jornadas, alianzas, aniversarios, licenciaturas o encuentros al aire libre',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} trabaja con comunidad educativa en {ciudad}. Para jornadas, celebraciones, alianzas o encuentros grandes al aire libre, tenemos un espacio amplio, seguro y fácil de adaptar. ¿Conversamos?',
  },
  {
    value: 'municipal',
    label: 'Público y gobierno',
    shortLabel: 'Gobierno',
    icon: '🏛️',
    role: 'Municipalidades, servicios públicos y corporaciones que organizan actividades abiertas a la comunidad.',
    searchPrompt: 'busca municipalidades, corporaciones municipales, departamentos de cultura, turismo, deporte, DIDECO, servicios públicos, gobierno regional, delegaciones, fundaciones públicas y entidades que organicen ferias, actividades comunitarias, ceremonias o eventos masivos.',
    guionContext: 'municipalidades, gobierno regional, servicios públicos, corporaciones culturales, turismo, deporte, DIDECO, fundaciones públicas y ferias',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi el trabajo de {empresa} en {ciudad}. Para ferias, encuentros comunitarios, actividades culturales y eventos masivos que necesitan espacio real al aire libre, podemos ser una alternativa local. ¿Conversamos?',
  },
  {
    value: 'comunidad',
    label: 'Comunidad y clubes',
    shortLabel: 'Comunidad',
    icon: '🤝',
    role: 'Organizaciones sociales con capacidad de convocatoria o recomendación.',
    searchPrompt: 'busca clubes deportivos, juntas de vecinos, iglesias, parroquias, fundaciones, ONGs, clubes de adulto mayor, cámaras gremiales locales, asociaciones culturales, agrupaciones folclóricas, clubes sociales y organizaciones comunitarias que podrían realizar encuentros, campeonatos, celebraciones, bingos, ferias o actividades masivas al aire libre.',
    guionContext: 'clubes deportivos, juntas de vecinos, iglesias, fundaciones, ONGs, cámaras locales, asociaciones culturales y organizaciones comunitarias que convocan personas y podrían hacer actividades al aire libre',
    template: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} reúne comunidad en {ciudad}. Para encuentros, celebraciones o actividades grandes al aire libre, tenemos un espacio campestre y amplio que puede funcionar muy bien. ¿Conversamos?',
  },
];

export const leadCategories = [
  { value: 'todos', label: 'Todas', shortLabel: 'Todas', icon: '📍' },
  ...leadCategoryDefinitions.map(({ value, label, shortLabel, icon }) => ({ value, label, shortLabel, icon })),
] as const;

const categoryAliases: Record<string, string> = {
  cumpleanos: 'cumpleanos',
  cumpleaños: 'cumpleanos',
  familiares: 'cumpleanos',
  eventos_familiares: 'cumpleanos',
  familia: 'cumpleanos',
  productora: 'productoras',
  productoras: 'productoras',
  productoras_de_eventos: 'productoras',
  productores: 'productoras',
  empresas: 'corporativo',
  empresa: 'corporativo',
  empresas_y_corporativos: 'corporativo',
  corporativo: 'corporativo',
  corporativos: 'corporativo',
  gobierno: 'municipal',
  municipalidad: 'municipal',
  municipal: 'municipal',
  publico: 'municipal',
  publico_y_gobierno: 'municipal',
  publico_gobierno: 'municipal',
  educacion: 'educacion',
  educacional: 'educacion',
  colegios: 'educacion',
  colegios_e_instituciones: 'educacion',
  colegio: 'educacion',
  turismo: 'turismo',
  turismo_y_venues: 'turismo',
  venues: 'turismo',
  venue: 'turismo',
  comunidad: 'comunidad',
  comunidad_y_clubes: 'comunidad',
  clubes: 'comunidad',
  matrimonios: 'matrimonios',
  matrimonio: 'matrimonios',
};

export function normalizeLeadCategoryValue(value: string | null | undefined): string {
  const raw = (value || '').trim();
  if (!raw) return '';
  const key = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return categoryAliases[key] || raw.toLowerCase();
}

export function isLeadCategoryValue(value: string | null | undefined): boolean {
  const normalized = normalizeLeadCategoryValue(value);
  return leadCategoryDefinitions.some(category => category.value === normalized);
}

export const getLeadCategoryDefinition = (value: string) =>
  leadCategoryDefinitions.find(category => category.value === normalizeLeadCategoryValue(value));

export const getCategoryMeta = (value: string) =>
  leadCategories.find(category => category.value === normalizeLeadCategoryValue(value)) || {
    value,
    label: value || 'Sin categoría',
    shortLabel: value || 'Sin categoría',
    icon: '📍',
  };

export const getCategoryLabel = (value: string) => getCategoryMeta(value).label;
export const getCategoryShortLabel = (value: string) => getCategoryMeta(value).shortLabel;
export const getCategoryIcon = (value: string) => getCategoryMeta(value).icon;
