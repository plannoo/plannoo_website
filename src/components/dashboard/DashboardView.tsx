import { useState } from 'react';
import { Clock, CalendarCheck2, Megaphone, Search, Plus, X, Upload } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils';
import { EMPLOYEES } from '@/data/mockData';

/* ──────────────────────────────────────────────────────── */
/* PRIMITIVES                                               */
/* ──────────────────────────────────────────────────────── */
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white rounded border border-gray-200 overflow-hidden', className)}>{children}</div>;
}

function CardHeader({ icon, title, hl, actions }: {
  icon: React.ReactNode; title: string; hl?: string; actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
      <span className="text-[#2196F3]">{icon}</span>
      <span className="text-[14px] text-gray-700 font-normal">
        {title}{hl && <span className="text-[#2196F3] font-medium ml-1">{hl}</span>}
      </span>
      {actions && <div className="ml-auto flex items-center gap-1.5">{actions}</div>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* MODAL SHELL                                              */
/* ──────────────────────────────────────────────────────── */
function Modal({ open, close, title, width = 560, children }: {
  open: boolean; close: () => void; title: string; width?: number; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="bg-white rounded-lg shadow-2xl fade-in flex flex-col"
        style={{ width, maxWidth: '100%', maxHeight: 'calc(100vh - 64px)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <h3 className="text-[15px] font-medium text-gray-800">{title}</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={17} /></button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* CLOCKED-IN EMPLOYEES MODAL                               */
/* ──────────────────────────────────────────────────────── */
function ClockedInModal({ open, close }: { open: boolean; close: () => void }) {
  return (
    <Modal open={open} close={close} title="" width={580}>
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={18} className="text-[#2196F3]" />
          <h3 className="text-[16px] font-semibold text-[#2196F3]">Clocked in employees</h3>
        </div>
        <div className="grid grid-cols-3 text-[12px] font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-2">
          <span>Employees</span><span>Shift start</span>
          <span className="text-[#2196F3]">Clocked In</span>
        </div>
        <div className="py-12 text-center text-[13px] text-gray-400">No employees currently clocked in.</div>
      </div>
    </Modal>
  );
}

// late employees modal

function LateModal({ open, close }: { open: boolean; close: () => void }) {
  return (
    <Modal open={open} close={close} title="" width={580}>
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={18} className="text-[#2196F3]" />
          <h3 className="text-[16px] font-semibold text-[#2196F3]">Late employess</h3>
        </div>
        <div className="grid grid-cols-3 text-[12px] font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-2">
          <span>Employees</span><span>employees</span>
        </div>
        <div className="py-12 text-center text-[13px] text-gray-400">No employees currently late</div>
      </div>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ANNOUNCEMENT MODAL                                       */
/* ──────────────────────────────────────────────────────── */
function AnnouncementModal({ open, close }: { open: boolean; close: () => void }) {
  const { addAnnouncement } = useAppStore();
  const [title, setTitle]   = useState('');
  const [msg, setMsg]       = useState('');
  const [loc, setLoc]       = useState('');
  const [role, setRole]     = useState('');
  const [sel, setSel]       = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const reset = () => { setTitle(''); setMsg(''); setLoc(''); setRole(''); setSel(new Set()); };

  const save = () => {
    if (!title.trim()) return;
    addAnnouncement({ id: String(Date.now()), title: title.trim(), message: msg.trim(), createdAt: new Date().toISOString(), createdBy: 1, isRead: false });
    reset(); close();
  };

  return (
    <Modal open={open} close={() => { reset(); close(); }} title="Announcement" width={620}>
      <div className="px-5 py-4 space-y-3">
        {/* Title input — blue border when focused */}
        <input autoFocus placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full border border-[#2196F3] rounded px-3 py-2 text-[13px] outline-none placeholder:text-gray-400" />

        {/* Message */}
        <textarea placeholder="Message" value={msg} onChange={e => setMsg(e.target.value)} rows={4}
          className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2196F3] resize-none placeholder:text-gray-400 transition-colors" />

        {/* Locations + Employees */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2.5">
            <div>
              <p className="text-[12px] text-gray-500 mb-1">Locations</p>
              <input placeholder="Locations" value={loc} onChange={e => setLoc(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#2196F3] placeholder:text-gray-400 transition-colors" />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 mb-1">Roles</p>
              <input placeholder="Roles" value={role} onChange={e => setRole(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#2196F3] placeholder:text-gray-400 transition-colors" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-gray-500 mb-1">Employees</p>
            <div className="border border-gray-200 rounded overflow-hidden max-h-36 overflow-y-auto">
              {EMPLOYEES.map(e => (
                <label key={e.id} className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="text-[13px] text-gray-700">{e.name}</span>
                  <input type="checkbox" checked={sel.has(e.id)} onChange={() => toggle(e.id)} className="accent-[#2196F3] w-3.5 h-3.5" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
          <Upload size={13} />Attachment
        </button>
        <button onClick={save} disabled={!title.trim()}
          className={cn('px-5 py-1.5 rounded text-[13px] font-medium transition-colors',
            title.trim() ? 'bg-[#2196F3] hover:bg-[#1976D2] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
          Save
        </button>
      </div>
    </Modal>
  );
}

/* ──────────────────────────────────────────────────────── */
/* MAIN DASHBOARD                                           */
/* ──────────────────────────────────────────────────────── */
export function DashboardView() {
  const { dashboardStats, announcements } = useAppStore();
  const [annOpen,   setAnnOpen]   = useState(false);
  const [clockOpen, setClockOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query,     setQuery]     = useState('');
  const [lateOpen, setLateOpen] = useState(false);
  const [timeTrackingOpen, setTimeTrackingOpen] = useState(true);
  const [shiftAppsOpen, setShiftAppsOpen] = useState(true);
  const [openShiftsOpen, setOpenShiftsOpen] = useState(true);
  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.message.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3" style={{ maxWidth: 1280 }}>

      {/* ── LEFT ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Clocked In / Late */}
        <Card>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <button onClick={() => setClockOpen(true)}
              className="flex flex-col items-center py-8 hover:bg-gray-50 transition-colors cursor-pointer select-none">
              <span className="text-5xl font-bold text-[#2196F3]">{dashboardStats.clockedIn}</span>
              <span className="text-sm text-[#2196F3] mt-2">Clocked In</span>
            </button>
            <button onClick={() => setLateOpen(true)}
              className="flex flex-col items-center py-8 hover:bg-gray-50 transition-colors cursor-pointer select-none">
              <span className="text-5xl font-bold text-red-500">{dashboardStats.late}</span>
              <span className="text-sm text-red-500 mt-2">Late</span>
            </button>
          </div>
        </Card>

        {/* Time Tracking */}
        <Card>
          <button onClick={() => setTimeTrackingOpen(v => !v)} className="w-full text-left">
            <CardHeader icon={<Clock size={16} />} title="Time Tracking" />
          </button>
          {timeTrackingOpen && (
            <div className="px-4 py-4 text-[13px] text-gray-400">No active time tracking sessions.</div>
          )}
        </Card>
      </div>

      {/* ── RIGHT ────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Shift applications */}
        <Card>
          <button onClick={() => setShiftAppsOpen(v => !v)} className="w-full text-left">
            <CardHeader icon={<CalendarCheck2 size={16} />} title="Shift applications" />
          </button>
          {shiftAppsOpen && (
            <div className="px-4 py-4 text-[13px] text-gray-400">No applications</div>
          )}
        </Card>

        {/* Open Shifts */}
        <Card>
          <button onClick={() => setOpenShiftsOpen(v => !v)} className="w-full text-left">
            <CardHeader icon={<CalendarCheck2 size={16} />} title="Open" hl="Shifts" />
          </button>
          {openShiftsOpen && (
            <div className="px-4 py-4 text-[13px] text-gray-400">No open shifts.</div>
          )}
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader
            icon={<Megaphone size={16} />}
            title="Announcements"
            actions={
              <>
                {searching ? (
                  <div className="flex items-center border border-gray-200 rounded px-2 py-1 gap-1">
                    <Search size={12} className="text-gray-400 shrink-0" />
                    <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                      className="text-[12px] outline-none w-28 bg-transparent" />
                    <button onClick={() => { setQuery(''); setSearching(false); }} className="text-gray-400 hover:text-gray-600">
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSearching(true)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Search size={14} />
                  </button>
                )}
                <button onClick={() => setAnnOpen(true)}
                  className="w-6 h-6 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded flex items-center justify-center transition-colors">
                  <Plus size={13} />
                </button>
              </>
            }
          />
          <div className="px-4 py-3 min-h-[56px]">
            {filtered.length === 0
              ? <p className="text-[13px] text-gray-400">No announcements</p>
              : <div className="divide-y divide-gray-100">
                  {filtered.map(a => (
                    <div key={a.id} className="py-2">
                      <p className="text-[13px] font-semibold text-gray-700">{a.title}</p>
                      {a.message && <p className="text-[12px] text-gray-500 mt-0.5">{a.message}</p>}
                    </div>
                  ))}
                </div>
            }
          </div>
        </Card>
      </div>

      {/* Modals */}
      <AnnouncementModal open={annOpen}   close={() => setAnnOpen(false)} />
      <ClockedInModal    open={clockOpen} close={() => setClockOpen(false)} />
      <LateModal    open={lateOpen} close={() => setLateOpen(false)} />
    </div>
  );
}
