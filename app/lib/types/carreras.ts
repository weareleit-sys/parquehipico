/**
 * Tipos de datos para la sección de Carreras a la Chilena
 * Modelos preparados para futura migración a Prisma + PostgreSQL
 */

export type RaceStatus = 'programada' | 'confirmada' | 'suspendida';

export interface RaceParticipant {
  horseName: string;
  corral?: string;
}

export interface Race {
  id: string;
  name: string;
  time: string; // "15:30 hrs"
  distance?: string; // "300 m", opcional
  status: RaceStatus;
  participants: RaceParticipant[]; // normalmente 2–3 caballos
  notes?: string; // ej: "Premios pactados entre corrales"
}

export interface RaceWinner {
  id: string;
  date: string; // "30-11-2025"
  raceName: string; // "Clásico de Noviembre"
  horseName: string; // "Caballo X"
  corral?: string; // opcional
}

export interface RaceFeedback {
  rating: number; // 1-5 estrellas
  comment?: string;
  timestamp: string;
}

/**
 * Futuro modelo Prisma sugerido:
 * 
 * model Race {
 *   id        String    @id @default(cuid())
 *   name      String
 *   date      DateTime
 *   time      String
 *   distance  String?
 *   status    String    @default("programada")
 *   notes     String?
 *   participants Participant[]
 *   createdAt DateTime  @default(now())
 *   updatedAt DateTime  @updatedAt
 * }
 *
 * model Participant {
 *   id        Int       @id @default(autoincrement())
 *   raceId    String
 *   race      Race      @relation(fields: [raceId], references: [id])
 *   horseName String
 *   corral    String?
 * }
 *
 * model RaceWinner {
 *   id        Int       @id @default(autoincrement())
 *   date      DateTime
 *   raceName  String
 *   horseName String
 *   corral    String?
 *   createdAt DateTime  @default(now())
 * }
 *
 * model RaceFeedback {
 *   id        Int       @id @default(autoincrement())
 *   rating    Int       @db.SmallInt
 *   comment   String?   @db.Text
 *   createdAt DateTime  @default(now())
 * }
 */




