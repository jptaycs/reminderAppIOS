
import React from 'react';
import { Task, Category, Priority } from '../types';
import { CategoryColors, Icons } from '../constants';

interface DashboardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onToggleTask, onEditTask }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === todayStr && !t.isCompleted);
  const overdueTasks = tasks.filter(t => t.dueDate < todayStr && !t.isCompleted);
  const categories = [Category.PERSONAL, Category.BUSINESS, Category.BILLS, Category.TAXES];

  const getStats = (cat: Category) => {
    const catTasks = tasks.filter(t => t.category === cat);
    const completed = catTasks.filter(t => t.isCompleted).length;
    const total = catTasks.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  return (
    <div className="p-6 space-y-8">
      <header>
        <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-3xl font-extrabold text-black">Dashboard</h1>
      </header>

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center space-x-4">
          <div className="bg-red-500 p-2 rounded-xl text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <p className="text-red-900 font-bold text-sm">{overdueTasks.length} Overdue Tasks</p>
            <p className="text-red-700 text-xs">Priority items need your immediate attention.</p>
          </div>
        </div>
      )}

      {/* Summary Cards Grid */}
      <section className="grid grid-cols-2 gap-4">
        {categories.map(cat => {
          const stats = getStats(cat);
          return (
            <div key={cat} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
              <div className="flex justify-between items-start">
                <div className={`${CategoryColors[cat]} w-10 h-10 rounded-2xl flex items-center justify-center text-white`}>
                   {cat === Category.PERSONAL && <Icons.Dashboard />}
                   {cat === Category.BUSINESS && <Icons.List />}
                   {cat === Category.BILLS && <Icons.Calendar />}
                   {cat === Category.TAXES && <Icons.Check />}
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm leading-tight mb-1">{cat}</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${CategoryColors[cat]} h-full transition-all duration-500`} style={{ width: `${stats.percentage}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Today's Focus */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Today's Focus</h2>
          <span className="text-xs text-blue-600 font-semibold uppercase">View All</span>
        </div>
        
        {todayTasks.length === 0 ? (
          <div className="bg-gray-100/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-sm">No tasks for today. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={() => onToggleTask(task.id)} 
                onClick={() => onEditTask(task)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; onToggle: () => void; onClick: () => void }> = ({ task, onToggle, onClick }) => (
  <div 
    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 active:scale-[0.98] transition-all cursor-pointer"
    onClick={(e) => {
      if ((e.target as HTMLElement).closest('.check-btn')) return;
      onClick();
    }}
  >
    <button 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`check-btn w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}
    >
      {task.isCompleted && <Icons.Check />}
    </button>
    <div className="flex-1 min-w-0">
      <h3 className={`font-semibold text-sm truncate ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h3>
      <div className="flex items-center space-x-2 mt-0.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md text-white font-bold uppercase ${CategoryColors[task.category]}`}>
          {task.category.split(' ')[0]}
        </span>
        {task.priority === Priority.HIGH && <span className="text-[10px] text-red-500 font-bold uppercase">Urgent</span>}
      </div>
    </div>
    <div className="text-gray-300">
      <Icons.ChevronRight />
    </div>
  </div>
);

export default Dashboard;
