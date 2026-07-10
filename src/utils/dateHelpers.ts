export interface NutrientEntry {
  amount: number;
  label?: string;
}

export interface DailyLog {
  sober: boolean;
  ran: boolean;
  miles: number;
  potassiumEntries?: NutrientEntry[];
  sodiumEntries?: NutrientEntry[];
}

export interface LogsMap {
  [dateStr: string]: DailyLog;
}

export function getDailyPotassium(log: DailyLog | undefined): number {
  if (!log?.potassiumEntries) return 0;
  return log.potassiumEntries.reduce((sum, e) => sum + e.amount, 0);
}

export function getDailySodium(log: DailyLog | undefined): number {
  if (!log?.sodiumEntries) return 0;
  return log.sodiumEntries.reduce((sum, e) => sum + e.amount, 0);
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Calculates the sobriety streak from today going backwards.
 */
export function calculateSoberStreak(logs: LogsMap, startDateStr: string): number {
  let streak = 0;
  const startLimit = parseLocalDate(startDateStr);
  const today = new Date();
  
  // Set time components to zero to compare dates properly
  today.setHours(0, 0, 0, 0);
  startLimit.setHours(0, 0, 0, 0);
  
  const current = new Date(today);
  
  while (current >= startLimit) {
    const dateStr = formatDate(current);
    const log = logs[dateStr];
    
    if (log !== undefined) {
      if (log.sober) {
        streak++;
      } else {
        break; // Streak broken
      }
    } else {
      // Unlogged days are assumed to be sober days
      streak++;
    }
    
    current.setDate(current.getDate() - 1);
  }
  
  return streak;
}

/**
 * Calculates the running streak from today going backwards.
 */
export function calculateRunningStreak(logs: LogsMap, startDateStr: string): number {
  let streak = 0;
  const startLimit = parseLocalDate(startDateStr);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  startLimit.setHours(0, 0, 0, 0);
  
  const current = new Date(today);
  
  while (current >= startLimit) {
    const dateStr = formatDate(current);
    const log = logs[dateStr];
    
    if (log !== undefined) {
      if (log.ran && log.miles > 0) {
        streak++;
      } else {
        break; // Streak broken
      }
    } else {
      // Unlogged days are assumed to be run days
      streak++;
    }
    
    current.setDate(current.getDate() - 1);
  }
  
  return streak;
}

/**
 * Calculates total miles run from the start date up to today.
 */
export function calculateTotalMiles(
  logs: LogsMap,
  startDateStr: string,
  defaultMiles: number
): number {
  let totalMiles = 0;
  const startLimit = parseLocalDate(startDateStr);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  startLimit.setHours(0, 0, 0, 0);
  
  const current = new Date(startLimit);
  
  while (current <= today) {
    const dateStr = formatDate(current);
    const log = logs[dateStr];
    
    if (log !== undefined) {
      if (log.ran) {
        totalMiles += log.miles;
      }
    } else {
      // Unlogged days are assumed to be 1 mile (or defaultMiles)
      totalMiles += defaultMiles;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return parseFloat(totalMiles.toFixed(2));
}
