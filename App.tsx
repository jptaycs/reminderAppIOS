
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Task, Category, Priority } from './types';
import { Icons, CategoryColors } from './constants';
import Dashboard from './components/Dashboard';
import TaskListView from './components/TaskListView';
import TaskEditor from './components/TaskEditor';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Initialize with some mock data for the demo
  useEffect(() => {
    const saved = localStorage.getItem('pro_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const initialTasks: Task[] = [
        {
          id: '1',
          title: 'Quarterly BIR Filing',
          description: 'Submit quarterly income tax returns for Q1.',
          category: Category.TAXES,
          subCategory: 'BIR deadlines',
          priority: Priority.HIGH,
          dueDate: new Date().toISOString().split('T')[0],
          isCompleted: false,
          createdAt: Date.now()
        },
        {
          id: '2',
          title: 'Electricity Bill',
          description: 'Meralco account ending in 4522.',
          category: Category.BILLS,
          subCategory: 'Electricity',
          priority: Priority.MEDIUM,
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          isCompleted: false,
          createdAt: Date.now()
        },
        {
          id: '3',
          title: 'Weekly Team Sync',
          description: 'Review performance metrics with marketing team.',
          category: Category.BUSINESS,
          priority: Priority.MEDIUM,
          dueDate: new Date().toISOString().split('T')[0],
          isCompleted: true,
          createdAt: Date.now()
        }
      ];
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(7),
      isCompleted: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    setIsAddingTask(false);
  };

  const updateTask = (taskData: Task) => {
    setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    setEditingTask(null);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden relative border-x border-gray-200 shadow-xl">
      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto ios-scroll pb-24">
        {activeView === 'dashboard' && (
          <Dashboard 
            tasks={tasks} 
            onToggleTask={toggleTask} 
            onEditTask={setEditingTask}
          />
        )}
        {activeView === 'tasks' && (
          <TaskListView 
            tasks={tasks} 
            onToggleTask={toggleTask}
            onEditTask={setEditingTask}
            onDeleteTask={deleteTask}
          />
        )}
        {activeView === 'calendar' && (
          <div className="p-8 text-center text-gray-500">
            <h1 className="text-3xl font-bold text-black mb-4">Calendar</h1>
            <p>Calendar view implementation coming soon.</p>
          </div>
        )}
        {activeView === 'settings' && (
          <div className="p-8 text-center text-gray-500">
            <h1 className="text-3xl font-bold text-black mb-4 text-left">Settings</h1>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-left">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Face ID Lock</span>
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>iCloud Sync</span>
                <div className="w-12 h-6 bg-gray-200 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Dark Mode</span>
                <span className="text-sm text-gray-400">Automatic</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddingTask(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-20"
      >
        <Icons.Plus />
      </button>

      {/* Tab Bar Navigation */}
      <nav className="h-20 ios-blur bg-white/80 border-t border-gray-200 flex items-center justify-around pb-4 px-4 z-10">
        <NavButton active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<Icons.Dashboard />} label="Summary" />
        <NavButton active={activeView === 'tasks'} onClick={() => setActiveView('tasks')} icon={<Icons.List />} label="Tasks" />
        <NavButton active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={<Icons.Calendar />} label="Events" />
        <NavButton active={activeView === 'settings'} onClick={() => setActiveView('settings')} icon={<Icons.Settings />} label="Settings" />
      </nav>

      {/* Modals */}
      {(isAddingTask || editingTask) && (
        <TaskEditor 
          task={editingTask} 
          onSave={(data) => editingTask ? updateTask({ ...editingTask, ...data }) : addTask(data)} 
          onClose={() => { setIsAddingTask(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}
  >
    <div className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
