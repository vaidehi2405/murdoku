import type { Case, Difficulty, DifficultyConfig } from '../types/case';

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  very_easy: {
    label: 'VERY EASY',
    color: '#10B981', // emerald-500
    bgColor: '#ECFDF5', // emerald-50
    borderColor: '#A7F3D0', // emerald-200
    textColor: '#047857', // emerald-700
    badgeBg: '#10B981',
    btnBg: '#2D7A54',
    btnHover: '#236343',
    btnText: '#FFFFFF',
  },
  easy: {
    label: 'EASY',
    color: '#3B82F6', // blue-500
    bgColor: '#EFF6FF', // blue-50
    borderColor: '#BFDBFE', // blue-200
    textColor: '#1D4ED8', // blue-700
    badgeBg: '#3B82F6',
    btnBg: '#356399',
    btnHover: '#2A517E',
    btnText: '#FFFFFF',
  },
  medium: {
    label: 'MEDIUM',
    color: '#F59E0B', // amber-500
    bgColor: '#FFFBEB', // amber-50
    borderColor: '#FDE68A', // amber-200
    textColor: '#B45309', // amber-700
    badgeBg: '#F59E0B',
    btnBg: '#D97706',
    btnHover: '#B45309',
    btnText: '#FFFFFF',
  },
  hard: {
    label: 'HARD',
    color: '#EF4444', // red-500
    bgColor: '#FEF2F2', // red-50
    borderColor: '#FECACA', // red-200
    textColor: '#B91C1C', // red-700
    badgeBg: '#EF4444',
    btnBg: '#C53030',
    btnHover: '#9B2C2C',
    btnText: '#FFFFFF',
  },
  expert: {
    label: 'EXPERT',
    color: '#8B5CF6', // purple-500
    bgColor: '#F5F3FF', // purple-50
    borderColor: '#DDD6FE', // purple-200
    textColor: '#6D28D9', // purple-700
    badgeBg: '#8B5CF6',
    btnBg: '#5A3E94',
    btnHover: '#473076',
    btnText: '#FFFFFF',
  },
};

export const INITIAL_CASES: Case[] = [
  {
    id: 'case-01',
    caseNumber: 'CASE 01',
    title: 'The Missing Prototype',
    difficulty: 'very_easy',
    status: 'new',
    estimatedTime: '~5 min',
    orderIndex: 1,
    roomType: 'lab',
  },
  {
    id: 'case-02',
    caseNumber: 'CASE 02',
    title: 'The Library Secret',
    difficulty: 'very_easy',
    status: 'new',
    estimatedTime: '~5–8 min',
    orderIndex: 2,
    roomType: 'library',
  },
  {
    id: 'case-03',
    caseNumber: 'CASE 03',
    title: 'The Locked Office',
    difficulty: 'easy',
    status: 'new',
    estimatedTime: '~6–10 min',
    orderIndex: 3,
    roomType: 'office',
  },
  {
    id: 'case-04',
    caseNumber: 'CASE 04',
    title: 'Murder at Midnight',
    difficulty: 'easy',
    status: 'new',
    estimatedTime: '~6–10 min',
    orderIndex: 4,
    roomType: 'penthouse',
  },
  {
    id: 'case-05',
    caseNumber: 'CASE 05',
    title: 'Death in the Lab',
    difficulty: 'medium',
    status: 'new',
    estimatedTime: '~8–12 min',
    orderIndex: 5,
    roomType: 'medlab',
  },
  {
    id: 'case-06',
    caseNumber: 'CASE 06',
    title: 'The Red Envelope',
    difficulty: 'hard',
    status: 'new',
    estimatedTime: '~10–15 min',
    orderIndex: 6,
    roomType: 'manor',
  },
  {
    id: 'case-07',
    caseNumber: 'CASE 07',
    title: 'The Empty Room',
    difficulty: 'medium',
    status: 'new',
    estimatedTime: '~8–12 min',
    orderIndex: 7,
    roomType: 'vault',
  },
  {
    id: 'case-08',
    caseNumber: 'CASE 08',
    title: 'The Missing Necklace',
    difficulty: 'medium',
    status: 'new',
    estimatedTime: '~8–12 min',
    orderIndex: 8,
    roomType: 'showroom',
  },
  {
    id: 'case-09',
    caseNumber: 'CASE 09',
    title: 'Murder on Floor 7',
    difficulty: 'hard',
    status: 'new',
    estimatedTime: '~10–15 min',
    orderIndex: 9,
    roomType: 'cubicles',
  },
  {
    id: 'case-10',
    caseNumber: 'CASE 10',
    title: 'The Last Meeting',
    difficulty: 'expert',
    status: 'new',
    estimatedTime: '~15–20 min',
    orderIndex: 10,
    roomType: 'boardroom',
  },
  {
    id: 'case-11',
    caseNumber: 'CASE 11',
    title: 'The Silent Witness',
    difficulty: 'expert',
    status: 'new',
    estimatedTime: '~15–20 min',
    orderIndex: 11,
    roomType: 'gallery',
  },
  {
    id: 'case-12',
    caseNumber: 'CASE 12',
    title: 'The Final Case',
    difficulty: 'expert',
    status: 'locked',
    estimatedTime: '~15–20 min',
    orderIndex: 12,
    roomType: 'mansion',
  },
];
