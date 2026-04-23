import { useState, useEffect } from 'react';
import { X, ChevronRight, User } from 'lucide-react';
import { cn } from '@/utils';

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
interface Employee {
  id: number;
  name: string;
  avatar?: string;
  initials: string;
}

/* ══════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════ */
const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Adan Mohamed',       initials: 'AM' },
  { id: 2, name: 'Ahmed Yassin Osman', initials: 'AY', avatar: 'https://i.pravatar.cc/40?img=8' },
  { id: 3, name: 'Ali Abdi Kosar',     initials: 'AA' },
  { id: 4, name: 'nacima Mohamed',     initials: 'NM' },
  { id: 5, name: 'Ralf Bertelt',       initials: 'RB' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/* ══════════════════════════════════════════════════════════
   EMPLOYEE CLOCK-IN SCREEN  (shown after selecting employee)
══════════════════════════════════════════════════════════ */
function EmployeeClockScreen({ employee, onBack }: { employee: Employee; onBack: () => void }) {
  const [clocked, setClocked] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center" style={{ background: '#2196F3' }}>
      {/* X button */}
      <button onClick={onBack}
        className="absolute top-5 right-5 w-9 h-9 border-2 border-white/50 rounded flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-colors">
        <X size={18} />
      </button>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center overflow-hidden mb-6">
        {employee.avatar
          ? <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
          : <span className="text-white text-3xl font-bold">{employee.initials}</span>
        }
      </div>

      {/* Name */}
      <h2 className="text-white text-3xl font-bold mb-2">{employee.name}</h2>

      {/* Time */}
      <p className="text-white/70 text-lg mb-1">{dateStr}</p>
      <p className="text-white text-5xl font-mono font-bold mb-10">{timeStr}</p>

      {/* Action buttons */}
      {clocked ? (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/20 border-2 border-white/40 rounded-2xl px-10 py-4 text-white text-xl font-semibold">
            ✓ Clocked In
          </div>
          <button onClick={() => { setClocked(false); onBack(); }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-10 py-4 text-xl font-semibold transition-colors">
            Clock Out
          </button>
        </div>
      ) : (
        <button onClick={() => setClocked(true)}
          className="bg-white text-[#2196F3] hover:bg-white/90 rounded-2xl px-16 py-5 text-xl font-bold transition-colors shadow-lg">
          Clock In
        </button>
      )}

      {/* Aplano logo */}
      <p className="absolute bottom-8 left-8 text-white text-2xl font-bold italic select-none" style={{ fontFamily: 'Georgia, serif' }}>
        Aplano
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LOADING SCREEN  (Image 2)
══════════════════════════════════════════════════════════ */
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center" style={{ background: '#2196F3' }}>
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-10" />

      {/* Welcome text */}
      <p className="text-white text-2xl font-light mb-2">
        Welcome to{' '}
        <span className="italic font-bold text-white text-3xl" style={{ fontFamily: 'Georgia, serif' }}>
          Aplano
        </span>
      </p>
      <p className="text-white/70 text-base">Just a moment please. Loading account data.</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   QR CODE  (bottom-right)
══════════════════════════════════════════════════════════ */
function QRCode() {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
      <p className="text-white/80 text-xs font-medium tracking-wide">Mobile Check-In</p>
      {/* Simple QR placeholder — grid of squares */}
      <div className="w-20 h-20 bg-white p-1 rounded">
        <div className="w-full h-full grid" style={{ gridTemplateColumns: 'repeat(7,1fr)', gap: '1px' }}>
          {Array.from({ length: 49 }).map((_, i) => {
            // Hard-coded QR-like pattern
            const qr = [1,1,1,1,1,1,1, 1,0,0,0,0,0,1, 1,0,1,1,1,0,1, 1,0,1,0,1,0,1, 1,0,1,1,1,0,1, 1,0,0,0,0,0,1, 1,1,1,1,1,1,1];
            return (
              <div key={i} className={cn('rounded-[0.5px]', qr[i] ? 'bg-gray-900' : 'bg-white')} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN TIME CLOCK TERMINAL  (Image 1)
══════════════════════════════════════════════════════════ */
interface TimeClockTerminalProps {
  onClose: () => void;
}

export function TimeClockTerminal({ onClose }: TimeClockTerminalProps) {
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen />;
  if (selectedEmployee) return <EmployeeClockScreen employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;

  // Filter employees by selected letter
  const filtered = activeLetter
    ? EMPLOYEES.filter(e => e.name.toUpperCase().startsWith(activeLetter))
    : EMPLOYEES;

  // Which letters have employees
  const hasEmployee = new Set(EMPLOYEES.map(e => e.name[0].toUpperCase()));

  return (
    <div className="fixed inset-0 z-[500] flex flex-col" style={{ background: '#2196F3' }}>

      {/* X button — top right */}
      <button onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 border-2 border-white/50 rounded flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-colors">
        <X size={18} />
      </button>

      {/* Title */}
      <div className="pt-14 pb-8 text-center shrink-0">
        <h1 className="text-white text-3xl font-bold tracking-wide">Time clock</h1>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-start justify-center gap-4 px-8 overflow-auto">

        {/* Employee list */}
        <div className="flex flex-col gap-3 w-[380px] shrink-0">
          {filtered.map(emp => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="flex items-center gap-4 px-5 py-4 rounded-full border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-left group"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                {emp.avatar
                  ? <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  : <User size={18} className="text-white/70" />
                }
              </div>
              <span className="flex-1 text-white text-[17px] font-medium">{emp.name}</span>
              <ChevronRight size={18} className="text-white/50 group-hover:text-white/80 transition-colors shrink-0" />
            </button>
          ))}

          {filtered.length === 0 && activeLetter && (
            <div className="text-white/60 text-center py-8 text-[15px]">
              No employees starting with "{activeLetter}"
            </div>
          )}
        </div>

        {/* Alphabet index — two staggered columns like screenshot */}
        <div className="flex gap-1 shrink-0 self-start pt-1">
          {/* Left column: A C E G I K M O Q S U W Y */}
          <div className="flex flex-col gap-1">
            {ALPHABET.filter((_, i) => i % 2 === 0).map(letter => (
              <button
                key={letter}
                onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
                className={cn(
                  'w-9 h-9 rounded text-[13px] font-bold transition-all',
                  activeLetter === letter
                    ? 'bg-white text-[#2196F3]'
                    : hasEmployee.has(letter)
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-white/10 text-white/40 hover:bg-white/15'
                )}
              >
                {letter}
              </button>
            ))}
          </div>
          {/* Right column: B D F H J L N P R T V X Z (offset down) */}
          <div className="flex flex-col gap-1 mt-5">
            {ALPHABET.filter((_, i) => i % 2 === 1).map(letter => (
              <button
                key={letter}
                onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
                className={cn(
                  'w-9 h-9 rounded text-[13px] font-bold transition-all',
                  activeLetter === letter
                    ? 'bg-white text-[#2196F3]'
                    : hasEmployee.has(letter)
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-white/10 text-white/40 hover:bg-white/15'
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aplano logo — bottom left */}
      <p className="absolute bottom-8 left-8 text-white text-2xl font-bold italic select-none"
        style={{ fontFamily: 'Georgia, serif' }}>
        Aplano
      </p>

      {/* QR code — bottom right */}
      <QRCode />
    </div>
  );
}