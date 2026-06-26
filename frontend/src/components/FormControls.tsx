import { CalendarDays, Check, ChevronDown } from 'lucide-react';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

type Option = {
  label: string;
  value: string;
};

export function CustomSelect({ label, value, options, onChange }: { label?: string; value: string; options: Option[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];
  useCloseOnOutside(ref, () => setOpen(false));

  return (
    <div className="custom-control" ref={ref}>
      {label && <span>{label}</span>}
      <div className="custom-select">
        <button type="button" className="custom-trigger" onClick={() => setOpen((current) => !current)}>
          <strong>{selected.label}</strong>
          <ChevronDown size={16} />
        </button>
        {open && (
          <div className="custom-popover">
            {options.map((option) => (
              <button
                type="button"
                className={option.value === value ? 'selected' : ''}
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                {option.value === value && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CustomDatePicker({ label, value, onChange }: { label?: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(() => parseDate(value) ?? new Date());
  const selectedDate = parseDate(value);
  useCloseOnOutside(ref, () => setOpen(false));

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: startOffset }, () => null);
    const dates = Array.from({ length: total }, (_, index) => new Date(year, month, index + 1));
    return [...blanks, ...dates];
  }, [cursor]);

  return (
    <div className="custom-control" ref={ref}>
      {label && <span>{label}</span>}
      <div className="custom-select">
        <button type="button" className="custom-trigger" onClick={() => setOpen((current) => !current)}>
          <strong>{selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Selecionar data'}</strong>
          <CalendarDays size={17} />
        </button>
        {open && (
          <div className="custom-popover date-popover">
            <div className="calendar-head">
              <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>‹</button>
              <strong>{cursor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</strong>
              <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>›</button>
            </div>
            <div className="calendar-week">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="calendar-grid">
              {days.map((day, index) => {
                const iso = day ? toIso(day) : '';
                const selected = iso === value;
                return day ? (
                  <button
                    type="button"
                    className={selected ? 'selected-day' : ''}
                    key={iso}
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <i key={`blank-${index}`} />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CustomDateTimePicker({ label, value, onChange }: { label?: string; value: string; onChange: (value: string) => void }) {
  const normalized = value.includes('T') ? value.replace('T', ' ') : value;
  const [datePart = '', timePart = '09:00'] = normalized.split(' ');
  const cleanTime = timePart.slice(0, 5) || '09:00';
  const timeOptions = useMemo(() => {
    return Array.from({ length: 24 * 2 }, (_, index) => {
      const hours = String(Math.floor(index / 2)).padStart(2, '0');
      const minutes = index % 2 === 0 ? '00' : '30';
      return { label: `${hours}:${minutes}`, value: `${hours}:${minutes}` };
    });
  }, []);

  function commit(nextDate: string, nextTime: string) {
    onChange(nextDate ? `${nextDate} ${nextTime}:00` : '');
  }

  return (
    <div className="custom-control custom-datetime">
      {label && <span>{label}</span>}
      <div className="datetime-grid">
        <CustomDatePicker value={datePart} onChange={(nextDate) => commit(nextDate, cleanTime)} />
        <CustomSelect value={cleanTime} options={timeOptions} onChange={(nextTime) => commit(datePart || toIso(new Date()), nextTime)} />
      </div>
    </div>
  );
}

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function useCloseOnOutside(ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, ref]);
}
