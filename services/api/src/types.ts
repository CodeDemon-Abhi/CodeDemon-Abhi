export interface UserRecord {
  userId: string;
  createdAtIso: string;
}

export interface HabitEntry {
  dateIso: string; // YYYY-MM-DD
  hydrationLiters?: number;
  proteinGrams?: number;
  collagenTaken?: boolean;
  coreDone?: boolean;
}

export interface ReportRecord {
  userId: string;
  createdAtIso: string;
  srs: number;
  analysis: any;
  images: {
    frontPath: string;
    backPath: string;
  };
}

export interface DataStoreShape {
  users: UserRecord[];
  habitsByUserId: Record<string, HabitEntry[]>;
  reportsByUserId: Record<string, ReportRecord[]>;
}

