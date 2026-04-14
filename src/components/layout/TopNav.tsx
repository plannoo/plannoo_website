import { useState } from 'react';
import { LayoutGrid, Calendar, Plane, Clock, MessageCircle, Bell, User, LogOut, FileText, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils';

function UserMenu({ open, close }: { open: boolean; close: () => void }) {
  if (!open) return null;
  const items = [
    { Icon: LogOut,     label: 'Sign Out' },
    { Icon: User,       label: 'My Profile' },
    { Icon: FileText,   label: 'Meine Dokumente' },
    { Icon: HelpCircle, label: 'Help' },
    { Icon: Clock,      label: 'Time Clock Terminal' },
  ];
  return (
    <>
      <div className="fixed inset-0 z-[150]" onClick={close} />
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-xl z-[200] w-52 py-1">
        {items.map(({ Icon, label }) => (
          <button key={label} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left">
            <Icon size={14} className="text-gray-400 shrink-0" />{label}
          </button>
        ))}
      </div>
    </>
  );
}

export function TopNav() {
  const { mainTab, setMainTab } = useAppStore();
  const [userOpen, setUserOpen] = useState(false);

  const modes = [
    { Icon: LayoutGrid, tab: 'dashboard' as const },
    { Icon: Calendar,   tab: 'schedule'  as const },
    { Icon: Plane,      tab: 'absences'  as const },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center px-3 gap-0.5"
      style={{ height: 'var(--header-height)', background: '#2196F3', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}
    >
      {/* Logo */}
      <span className="italic font-bold text-white text-xl mr-4 select-none cursor-pointer" style={{ letterSpacing: '-0.5px' }}>
        Aplano
      </span>

      {/* Mode icons */}
      {modes.map(({ Icon, tab }) => (
        <button key={tab} onClick={() => setMainTab(tab)}
          className={cn('w-9 h-9 flex items-center justify-center rounded transition-all duration-150',
            mainTab === tab ? 'bg-black/25 text-white' : 'text-white/75 hover:bg-white/15 hover:text-white')}>
          <Icon size={18} />
        </button>
      ))}

      <div className="flex-1" />

      {/* Help badge */}
      <div className="bg-white/95 rounded px-2.5 py-1 mr-2 cursor-pointer hover:bg-white transition-colors select-none">
        <p className="text-[11px] font-bold text-gray-700 leading-tight">Do you need help?</p>
        <p className="text-[10px] font-semibold text-green-600 flex items-center gap-1 leading-tight">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />SUPPORT IS ONLINE
        </p>
      </div>

      {/* Action icons */}
      {[Clock, MessageCircle, Bell].map((Icon) => (
        <button key={Icon.displayName} className="w-9 h-9 flex items-center justify-center text-white/75 hover:bg-white/15 hover:text-white rounded transition-all">
          <Icon size={18} />
        </button>
      ))}

      {/* User with dropdown */}
      <div className="relative">
        <button onClick={() => setUserOpen(v => !v)}
          className={cn('w-9 h-9 flex items-center justify-center rounded transition-all border',
            userOpen ? 'bg-black/20 text-white border-white/30' : 'text-white/75 hover:bg-white/15 hover:text-white border-transparent')}>
          <User size={18} />
        </button>
        <UserMenu open={userOpen} close={() => setUserOpen(false)} />
      </div>
    </nav>
  );
}
