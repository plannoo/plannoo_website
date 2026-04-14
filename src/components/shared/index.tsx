import React from 'react';
import { cn } from '@/utils';
import { Icon } from './Icon';

// ─────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md';
  icon?: string;
  active?: boolean;
}

export function Button({
  variant = 'outline',
  size = 'md',
  icon,
  active,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 rounded-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1d8ce0]/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-[#1d8ce0] hover:bg-[#1570b8] text-white border border-[#1d8ce0]',
        variant === 'outline' && 'bg-white hover:border-[#1d8ce0] hover:text-[#1d8ce0] text-slate-600 border border-slate-200',
        variant === 'ghost'   && 'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
        variant === 'icon'    && cn(
          'w-8 h-8 text-slate-500 border border-slate-200 bg-white',
          active
            ? 'bg-[#1d8ce0] border-[#1d8ce0] text-white'
            : 'hover:border-[#1d8ce0] hover:text-[#1d8ce0] hover:bg-[#e8f4fd]'
        ),
        size === 'sm' && 'text-xs px-2 py-1',
        size === 'md' && variant !== 'icon' && 'text-[13px] px-3 py-[6px]',
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// DATE NAV BUTTON
// ─────────────────────────────────────────────
export function DateNavButton({
  direction,
  onClick,
  variant = 'default',
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  variant?: 'default' | 'primary';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded transition-all duration-150',
        variant === 'default'  && 'border border-slate-200 bg-white text-slate-500 hover:border-[#1d8ce0] hover:text-[#1d8ce0]',
        variant === 'primary'  && 'bg-[#1d8ce0] border border-[#1d8ce0] text-white hover:bg-[#1570b8]',
      )}
    >
      <Icon name={direction === 'prev' ? 'chevronLeft' : 'chevronRight'} size={12} />
    </button>
  );
}

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────
type BadgeVariant = 'default' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
const BADGE_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600',
  blue:    'bg-blue-100 text-blue-700',
  green:   'bg-green-100 text-green-700',
  orange:  'bg-orange-100 text-orange-700',
  red:     'bg-red-100 text-red-700',
  purple:  'bg-purple-100 text-purple-700',
};

export function Badge({ children, variant = 'default', className }: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide', BADGE_STYLES[variant], className)}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// STATUS BADGE  (Pending / Approved / Rejected)
// ─────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending:  'bg-amber-100 text-amber-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide', styles[status] ?? 'bg-slate-100 text-slate-600')}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────
// SEARCH INPUT
// ─────────────────────────────────────────────
export function SearchInput({
  value, onChange, placeholder = 'Search...', className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Icon name="search" size={13} className="absolute left-2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        className="pl-7 pr-3 py-[5px] text-[13px] border border-slate-200 rounded-md bg-white outline-none focus:border-[#1d8ce0] transition-colors w-full placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// SELECT / DROPDOWN
// ─────────────────────────────────────────────
interface DropdownOption { value: string; label: string }

export function Dropdown({
  value, onChange, options, className, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: (string | DropdownOption)[];
  className?: string;
  placeholder?: string;
}) {
  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'border border-slate-200 rounded-md px-2.5 py-[5px] text-[13px] text-slate-600 bg-white outline-none cursor-pointer',
        'focus:border-[#1d8ce0] hover:border-slate-300 transition-colors appearance-none',
        className,
      )}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {normalised.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────
// DATE RANGE PICKER (two inputs + calendar icon)
// ─────────────────────────────────────────────
export function DateRangePicker({
  start, end, onStartChange, onEndChange,
}: {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2.5 py-[5px] bg-white">
      <input
        type="date"
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="text-[13px] text-slate-600 outline-none bg-transparent"
      />
      <span className="text-slate-400 text-xs">~</span>
      <input
        type="date"
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="text-[13px] text-slate-600 outline-none bg-transparent"
      />
      <Icon name="calendar" size={13} className="text-slate-400 ml-1" />
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
export function Modal({
  isOpen, onClose, title, children, width = 440,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl animate-fadeIn"
        style={{ width, maxWidth: 'calc(100vw - 40px)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 hover:border-red-300 hover:text-red-500 text-slate-400 transition-colors">
            <Icon name="x" size={14} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FORM FIELD
// ─────────────────────────────────────────────
export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'border border-slate-200 rounded-md px-3 py-2 text-[13px] w-full outline-none bg-white',
        'focus:border-[#1d8ce0] focus:ring-2 focus:ring-[#1d8ce0]/10 transition-all',
        props.className,
      )}
    />
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
export function EmptyState({ icon = 'fileText', message = 'No entries in the selected period' }: {
  icon?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
      <Icon name={icon} size={36} className="text-slate-200" />
      <span className="text-[13px]">{message}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// TERTIARY TAB BAR
// ─────────────────────────────────────────────
export function TertiaryTabBar({ tabs, active, onChange }: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex border-b border-slate-200 bg-white px-4 pt-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'px-3 py-1.5 text-[13px] font-medium border-b-2 transition-all duration-150 -mb-px',
            active === tab
              ? 'border-[#1d8ce0] text-[#1d8ce0] font-semibold'
              : 'border-transparent text-slate-500 hover:text-[#1d8ce0]'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// DATA TABLE
// ─────────────────────────────────────────────
export function DataTable({
  columns, children, className,
}: {
  columns: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3.5 py-2.5 text-left text-[12px] font-semibold text-[#1d8ce0] border-b border-slate-200 bg-white whitespace-nowrap cursor-pointer hover:text-[#1570b8] select-none"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn('border-b border-slate-100 hover:bg-slate-50 transition-colors duration-100', className)}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={cn('px-3.5 py-2.5 text-[13px] text-slate-700', className)}>
      {children}
    </td>
  );
}
