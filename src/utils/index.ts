import { clsx, type ClassValue } from 'clsx';
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
export const generateId = () => Math.random().toString(36).slice(2, 10);
