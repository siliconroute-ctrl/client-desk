import { useId, useState } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'clientdesk.theme';
const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function readTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  try {
    if (choice === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage blocked (private window): the choice lasts for this visit only.
  }
}

function CheckIcon() {
  return (
    <svg className="cd-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

/** System, Light or Dark, remembered on this device. Matches the design system's ThemeToggle. */
export function ThemeToggle({ legend = 'Theme' }: { legend?: string }) {
  const [choice, setChoice] = useState<ThemeChoice>(readTheme);
  const name = useId();
  return (
    <fieldset className="cd-chips">
      <legend className="cd-chips__legend">{legend}</legend>
      <div className="cd-chips__row">
        {OPTIONS.map((o) => (
          <label key={o.value} className="cd-chip">
            <input
              type="radio"
              className="cd-chip__input"
              name={name}
              value={o.value}
              checked={choice === o.value}
              onChange={() => {
                setChoice(o.value);
                applyTheme(o.value);
              }}
            />
            <span className="cd-chip__face">
              {choice === o.value ? <CheckIcon /> : null}
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
