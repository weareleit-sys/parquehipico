import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  try {
    const { lead_id } = await req.json();
    if (!lead_id) {
      return NextResponse.json({ error: 'Falta lead_id' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    // Obtener datos del lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const website = lead.website || '';
    const empresa = lead.empresa;
    const ciudad = lead.ubicacion || 'la Araucanía';
    const categoria = lead.categoria;

    const prompt = `Sos Alberto del Parque Hípico La Montaña, el recinto outdoor más grande del sur de Chile (3 hectáreas planas, 5.000 personas, luz trifásica).

Entraste a la web de "${empresa}" (${website || 'sin web'}) en ${ciudad} y viste qué hacen.

Escribí un mensaje de WhatsApp de 3 líneas para ofrecerles el parque como venue para eventos masivos. Mencioná algo concreto que viste de ellos. Tono directo, chileno, informal. NADA genérico. NADA de "Estimado" ni "24/7". Firmá: "soy Alberto del Parque Hípico La Montaña".

Respondé SOLO el texto del mensaje.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2000 }
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API error: ${geminiRes.status}` }, { status: 502 });
    }

    const data = await geminiRes.json();
    const guion = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!guion) {
      return NextResponse.json({ error: 'Gemini returned empty guion' }, { status: 502 });
    }

    // Guardar guion en el lead
    await supabase.from('leads').update({
      guion: guion,
      updated_at: new Date().toISOString()
    }).eq('id', lead_id);

    return NextResponse.json({ success: true, guion });
  } catch (error: any) {
    console.error('Generar Guion Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
