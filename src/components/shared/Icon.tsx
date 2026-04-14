import {
  LayoutGrid, Calendar, Plane, Clock, MessageCircle, Bell, User,
  Search, Filter, Plus, ChevronLeft, ChevronRight, ChevronDown,
  Eye, EyeOff, Download, List, Grid2X2, Copy, Square, Columns,
  Table, MoreVertical, Shield, Settings, Trash2, HelpCircle,
  FileText, X, Info, CheckSquare, LogOut, Megaphone, Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  grid: LayoutGrid,
  calendar: Calendar,
  plane: Plane,
  clock: Clock,
  chat: MessageCircle,
  bell: Bell,
  user: User,
  search: Search,
  filter: Filter,
  plus: Plus,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  eye: Eye,
  eyeOff: EyeOff,
  download: Download,
  list: List,
  grid2: Grid2X2,
  copy: Copy,
  square: Square,
  columns: Columns,
  table: Table,
  moreVertical: MoreVertical,
  shield: Shield,
  gear: Settings,
  trash: Trash2,
  question: HelpCircle,
  fileText: FileText,
  x: X,
  info: Info,
  checkSquare: CheckSquare,
  logout: LogOut,
  megaphone: Megaphone,
  users: Users,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className }: IconProps) {
  const Component = ICON_MAP[name];
  if (!Component) return null;
  return <Component size={size} className={cn(className)} />;
}
