
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  PERSONAL = 'Personal',
  BUSINESS = 'Business',
  BILLS = 'Bills & Utilities',
  TAXES = 'Taxes & Gov',
  CUSTOM = 'Custom'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  subCategory?: string;
  priority: Priority;
  dueDate: string;
  isCompleted: boolean;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  createdAt: number;
}

export type ViewType = 'dashboard' | 'tasks' | 'calendar' | 'settings';
