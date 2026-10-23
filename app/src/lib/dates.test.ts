import { describe, expect, it } from 'vitest';
import { daysBetween, dueStatus, formatDate, todayISO } from './dates';

describe('todayISO', () => {
  it('uses the Johannesburg calendar day, not UTC', () => {
    // 22:30 UTC on 30 Oct is 00:30 on 31 Oct in Johannesburg (UTC+2).
    expect(todayISO(new Date('2026-10-30T22:30:00Z'))).toBe('2026-10-31');
    // 21:59 UTC is still 23:59 on the 30th in Johannesburg.
    expect(todayISO(new Date('2026-10-30T21:59:00Z'))).toBe('2026-10-30');
  });
});

describe('formatDate', () => {
  it('formats as weekday, day, short month', () => {
    expect(formatDate('2026-10-30')).toBe('Fri 30 Oct');
  });
  it('adds the year only when it differs from the current one', () => {
    expect(formatDate('2027-01-04', 2026)).toBe('Mon 4 Jan 2027');
    expect(formatDate('2026-01-04', 2026)).toBe('Sun 4 Jan');
  });
  it('rejects anything that is not a plain date', () => {
    expect(() => formatDate('2026-10-30T10:00:00Z')).toThrow();
  });
});

describe('daysBetween', () => {
  it('counts across month ends and leap days', () => {
    expect(daysBetween('2026-10-30', '2026-11-02')).toBe(3);
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2);
    expect(daysBetween('2026-11-02', '2026-10-30')).toBe(-3);
  });
});

describe('dueStatus', () => {
  const today = '2026-10-23';
  it('labels overdue in days, singular and plural', () => {
    expect(dueStatus('2026-10-22', today)).toEqual({ tone: 'critical', label: '1 day overdue' });
    expect(dueStatus('2026-10-20', today)).toEqual({ tone: 'critical', label: '3 days overdue' });
  });
  it('labels today, tomorrow and the coming week', () => {
    expect(dueStatus('2026-10-23', today)).toEqual({ tone: 'warning', label: 'Due today' });
    expect(dueStatus('2026-10-24', today)).toEqual({ tone: 'info', label: 'Due tomorrow' });
    expect(dueStatus('2026-10-30', today)).toEqual({ tone: 'info', label: 'Due Fri 30 Oct' });
  });
  it('treats later dates and missing dates as neutral', () => {
    expect(dueStatus('2026-11-13', today)).toEqual({ tone: 'neutral', label: 'Due Fri 13 Nov' });
    expect(dueStatus(null, today)).toEqual({ tone: 'neutral', label: 'No due date' });
  });
  it('shows Done regardless of the date', () => {
    expect(dueStatus('2026-10-01', today, true)).toEqual({ tone: 'good', label: 'Done' });
  });
});
