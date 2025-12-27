
import React, { useState } from 'react';
import { Task, Category, Priority } from '../types';
import { CategoryColors, Icons } from '../constants';

interface TaskListViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onToggleTask, onEditTask, onDeleteTask }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'All' || t.category === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const grouped = {
    pending: filteredTasks.filter(t => !t.isCompleted),
    completed: filteredTasks.filter(t => t.isCompleted)
  };

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-extrabold text-black">Tasks</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search activities, bills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-200/50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto ios-scroll pb-1">
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === cat ? 'bg-black text-white' : 'bg-white border border-gray-100 text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="space-y-6">
        {grouped.pending.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">In Progress</h2>
            {grouped.pending.map(task => (
              <TaskRow key={task.id} task={task} onToggle={() => onToggleTask(task.id)} onClick={() => onEditTask(task)} onDelete={() => onDeleteTask(task.id)} />
            ))}
          </div>
        )}

        {grouped.completed.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Completed</h2>
            {grouped.completed.map(task => (
              <TaskRow key={task.id} task={task} onToggle={() => onToggleTask(task.id)} onClick={() => onEditTask(task)} onDelete={() => onDeleteTask(task.id)} />
            ))}
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="py-20 text-center space-y-2">
            <div className="text-4xl">🗒️</div>
            <p className="text-gray-400 text-sm">No tasks found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const TaskRow: React.FC<{ task: Task; onToggle: () => void; onClick: () => void; onDelete: () => void }> = ({ task, onToggle, onClick, onDelete }) => {
  const [swiped, setSwiped] = useState(false);
  const priorityColor = task.priority === Priority.HIGH ? 'text-red-500' : task.priority === Priority.MEDIUM ? 'text-orange-500' : 'text-blue-500';

  return (
    <div className="relative group">
      <div 
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4 transition-transform ${swiped ? '-translate-x-16' : ''} active:bg-gray-50`}
        onClick={onClick}
        onTouchStart={(e) => {
          const startX = e.touches[0].clientX;
          const onMove = (me: TouchEvent) => {
            if (startX - me.touches[0].clientX > 50) setSwiped(true);
            if (me.touches[0].clientX - startX > 50) setSwiped(false);
          };
          window.addEventListener('touchmove', onMove, { once: true });
        }}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}
        >
          {task.isCompleted && <Icons.Check />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <h3 className={`font-semibold text-[15px] ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h3>
             <span className={`text-[10px] font-black uppercase ${priorityColor}`}>{task.priority}</span>
          </div>
          <p className="text-xs text-gray-500 truncate">{task.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[10px] text-gray-400 font-medium">{task.dueDate}</span>
            <span className={`w-1 h-1 rounded-full bg-gray-300`}></span>
            <span className="text-[10px] text-blue-600 font-semibold uppercase">{task.subCategory || task.category}</span>
          </div>
        </div>
      </div>
      
      {/* Swipe Actions (Simulated) */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute right-0 top-0 bottom-0 w-14 bg-red-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>
  );
};

export default TaskListView;
