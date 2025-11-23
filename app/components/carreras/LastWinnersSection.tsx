'use client';

import styles from './LastWinnersSection.module.css';
import { RaceWinner } from '@/lib/types/carreras';

interface LastWinnersSectionProps {
  winners?: RaceWinner[];
}

/**
 * Componente LastWinnersSection
 * 
 * Muestra un registro histórico de últimos ganadores de carreras.
 * Diseño: tabla/tarjetas con columnas Fecha – Carrera – Caballo – Corral
 * 
 * TODO: En el futuro conectar a /api/winners para traer datos de Prisma
 */
export default function LastWinnersSection({ winners = [] }: LastWinnersSectionProps) {
  // Datos de ejemplo si no se pasan winners
  const defaultWinners: RaceWinner[] = [
    {
      id: '1',
      date: '28-11-2025',
      raceName: 'Carrera de Apertura',
      horseName: 'Rayo Azul',
      corral: 'A',
    },
    {
      id: '2',
      date: '28-11-2025',
      raceName: 'Segunda Manga',
      horseName: 'La Montaña',
      corral: 'B',
    },
    {
      id: '3',
      date: '21-11-2025',
      raceName: 'Clásico Noviembre',
      horseName: 'Trueno Negro',
      corral: 'C',
    },
    {
      id: '4',
      date: '21-11-2025',
      raceName: 'Carrera Especial',
      horseName: 'Viento Sur',
      corral: 'A',
    },
    {
      id: '5',
      date: '14-11-2025',
      raceName: 'Primera de la Jornada',
      horseName: 'Estrella Dorada',
      corral: 'D',
    },
    {
      id: '6',
      date: '14-11-2025',
      raceName: 'Desafío del Parque',
      horseName: 'Corcel Rápido',
      corral: 'B',
    },
  ];

  const displayWinners = winners.length > 0 ? winners : defaultWinners;

  return (
    <section className={styles.winnersSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>🏆 Últimos Ganadores</h2>
        <p className={styles.subtitle}>
          Registro histórico de los campeones en nuestras carreras
        </p>
      </div>

      {/* Desktop: Tabla */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Carrera</th>
              <th>Caballo Ganador</th>
              <th>Corral</th>
            </tr>
          </thead>
          <tbody>
            {displayWinners.map((winner) => (
              <tr key={winner.id}>
                <td>{winner.date}</td>
                <td>{winner.raceName}</td>
                <td className={styles.horseNameCell}>{winner.horseName}</td>
                <td>
                  {winner.corral && (
                    <span className={styles.corralBadge}>{winner.corral}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Móvil: Cards */}
      <div className={styles.cardsContainer}>
        {displayWinners.map((winner) => (
          <div key={winner.id} className={styles.winnerCard}>
            <div className={styles.cardRow}>
              <span className={styles.label}>Fecha</span>
              <span className={styles.value}>{winner.date}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.label}>Carrera</span>
              <span className={styles.value}>{winner.raceName}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.label}>🏇 Ganador</span>
              <span className={styles.valueHorse}>{winner.horseName}</span>
            </div>
            {winner.corral && (
              <div className={styles.cardRow}>
                <span className={styles.label}>Corral</span>
                <span className={styles.corralBadge}>{winner.corral}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Futuro modelo Prisma sugerido:
 *
 * model RaceWinner {
 *   id        Int      @id @default(autoincrement())
 *   date      DateTime
 *   raceName  String
 *   horseName String
 *   corral    String?
 *   createdAt DateTime @default(now())
 *
 *   @@map("race_winners")
 * }
 *
 * API Endpoint sugerido:
 * GET /api/winners?limit=20&order=desc
 * Response: { success: boolean, data: RaceWinner[] }
 */




