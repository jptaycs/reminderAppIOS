
import React, { useState, useEffect } from 'react';
import { Task, Category, Priority } from '../types';

interface TaskEditorProps {
  task?: Task | null;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onClose: () => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ task, onSave, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState<Category>(task?.category || Category.PERSONAL);
  const [subCategory, setSubCategory] = useState(task?.subCategory || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || Priority.MEDIUM);
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().split('T')[0]);

  const subCategories: Record<Category, string[]> = {
    [Category.PERSONAL]: ['Health', 'Social', 'Admin'],
    [Category.BUSINESS]: ['Meetings', 'Operations', 'Strategy'],
    [Category.BILLS]: ['Electricity', 'Water', 'Internet', 'Credit Card'],
    [Category.TAXES]: ['BIR Deadlines', 'Annual Tax', 'LGU Fees'],
    [Category.CUSTOM]: []
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, category, subCategory, priority, dueDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <header className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <button onClick={onClose} className="text-blue-600 font-medium">Cancel</button>
          <h2 className="font-bold text-lg">{task ? 'Edit Task' : 'New Task'}</h2>
          <button 
            onClick={handleSubmit} 
            disabled={!title.trim()}
            className="text-blue-600 font-bold disabled:text-gray-300"
          >
            {task ? 'Update' : 'Add'}
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto ios-scroll">
          {/* Main Info */}
          <section className="space-y-4">
            <input 
              autoFocus
              type="text" 
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-2xl font-bold placeholder:text-gray-300 border-none focus:ring-0 p-0 outline-none"
            />
            <textarea 
              placeholder="Add notes or descriptions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-gray-500 placeholder:text-gray-300 border-none focus:ring-0 p-0 outline-none resize-none h-20 text-sm"
            />
          </section>

          <hr className="border-gray-100" />

          {/* Configuration Grid */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">Category</span>
              <select 
                value={category} 
                onChange={e => {
                    const newCat = e.target.value as Category;
                    setCategory(newCat);
                    setSubCategory(subCategories[newCat][0] || '');
                }}
                className="text-sm font-bold bg-transparent border-none focus:ring-0 text-blue-600 text-right outline-none appearance-none"
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {subCategories[category].length > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-400">Sub-category</span>
                    <select 
                        value={subCategory} 
                        onChange={e => setSubCategory(e.target.value)}
                        className="text-sm font-bold bg-transparent border-none focus:ring-0 text-blue-600 text-right outline-none appearance-none"
                    >
                        {subCategories[category].map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">Due Date</span>
              <input 
                type="date" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="text-sm font-bold bg-transparent border-none focus:ring-0 text-blue-600 text-right outline-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">Priority</span>
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
                {Object.values(Priority).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${priority === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Attachments UI Mockup */}
          <section className="pt-4">
             <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span className="text-xs font-bold text-gray-400">Tap to add attachments</span>
             </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default TaskEditor;
