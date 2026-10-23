// Calendar-day logic for Client Desk. Every "today" is the Africa/Johannesburg calendar day,
// never the server's or the browser's zone. Dates are ISO strings (YYYY-MM-DD) with no time part.

export const APP_TIME_ZONE = 'Africa/Johannesburg';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type Tone = 'critical' | 'warning' | 'info' | 'good' | 'neutral';
export interface DueStatus { tone: Tone; label: string }

function toUtcMidnight(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Expected a YYYY-MM-DD date, got "${iso}"`);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

/** Today's calendar date in the given zone, as YYYY-MM-DD. */
export function todayISO(now: Date = new Date(), timeZone: string = APP_TIME_ZONE): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** "2026-10-30" → "Fri 30 Oct". Adds the year when it differs from `currentYear`. */
export function formatDate(iso: string, currentYear?: number): string {
  const d = toUtcMidnight(iso);
  const base = `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  return currentYear !== undefined && d.getUTCFullYear() !== currentYear ? `${base} ${d.getUTCFullYear()}` : base;
}

/** Whole calendar days from `fromISO` to `toISO` (negative when `toISO` is earlier). */
export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((toUtcMidnight(toISO).getTime() - toUtcMidnight(fromISO).getTime()) / 86_400_000);
}

/** The due pill for a task: "3 days overdue", "Due today", "Due tomorrow", "Due Tue 27 Oct", "Done". */
export function dueStatus(dueISO: string | null | undefined, today: string, done = false): DueStatus {
  if (done) return { tone: 'good', label: 'Done' };
  if (!dueISO) return { tone: 'neutral', label: 'No due date' };
  const n = daysBetween(today, dueISO);
  const year = toUtcMidnight(today).getUTCFullYear();
  if (n < 0) return { tone: 'critical', label: `${-n} ${n === -1 ? 'day' : 'days'} overdue` };
  if (n === 0) return { tone: 'warning', label: 'Due today' };
  if (n === 1) return { tone: 'info', label: 'Due tomorrow' };
  if (n <= 7) return { tone: 'info', label: `Due ${formatDate(dueISO, year)}` };
  return { tone: 'neutral', label: `Due ${formatDate(dueISO, year)}` };
}
