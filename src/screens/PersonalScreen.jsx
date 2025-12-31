// PersonalScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { User, Plus, Check, ChevronRight, Edit3, Trash2, Calendar, Star, Target, Home, Plane, BookOpen, Heart, Briefcase } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState } from '../components/ui';
import { DEFAULT_PERSONAL_CATEGORIES } from '../data/appData';

const PersonalScreen = ({ data, setData, showToast }) => {
  const today = getToday();
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    category: 'home',
    dueDate: '',
    important: false,
    notes: ''
  });

  const categories = [
    { id: 'home', name: 'Casa', icon: '🏠', color: '#F59E0B' },
    { id: 'vehicle', name: 'Vehículo', icon: '🚗', color: '#3B82F6' },
    { id: 'health', name: 'Salud', icon: '🏥', color: '#10B981' },
    { id: 'errands', name: 'Trámites', icon: '📋', color: '#8B5CF6' },
    { id: 'shopping', name: 'Compras', icon: '🛒', color: '#EC4899' },
    { id: 'selfcare', name: 'Cuidado', icon: '👤', color: '#06B6D4' },
    { id: 'calls', name: 'Gestiones', icon: '📞', color: '#EF4444' }
  ];

  const getCat = (id) => categories.find(c => c.id === id) || categories[0];

  // Data
  const tasks = data.personalTasks || [];
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Filtered
  const filteredPending = filter === 'all' ? pendingTasks : pendingTasks.filter(t => t.category === filter);

  // Group by date
  const withDate = filteredPending.filter(t => t.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const withoutDate = filteredPending.filter(t => !t.dueDate);
  const overdue = withDate.filter(t => t.dueDate < today);
  const upcoming = withDate.filter(t => t.dueDate >= today);

  // Actions
  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: crypto.randomUUID(),
      ...newTask,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      personalTasks: [...(prev.personalTasks || []), task]
    }));
    setNewTask({ title: '', category: 'home', dueDate: '', important: false, notes: '' });
    setShowAdd(false);
    showToast('✓ Tarea añadida');
  };

  const toggleTask = (id) => {
    setData(prev => ({
      ...prev,
      personalTasks: prev.personalTasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t
      )
    }));
  };

  const deleteTask = (id) => {
    setData(prev => ({
      ...prev,
      personalTasks: prev.personalTasks.filter(t => t.id !== id)
    }));
    setEditingTask(null);
    showToast('Eliminada');
  };

  const updateTask = (task) => {
    setData(prev => ({
      ...prev,
      personalTasks: prev.personalTasks.map(t => t.id === task.id ? task : t)
    }));
    setEditingTask(null);
    showToast('Guardado');
  };

  // Task card component
  const TaskCard = ({ task }) => {
    const cat = getCat(task.category);
    const isOverdue = task.dueDate && task.dueDate < today && !task.completed;

    return (
      <div
        onClick={() => setEditingTask(task)}
        className={`p-3 bg-zinc-800/50 rounded-xl border-l-4 cursor-pointer hover:bg-zinc-800 transition-all ${task.completed ? 'opacity-50' : ''
          }`}
        style={{ borderColor: cat.color }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white/50'
              }`}
          >
            {task.completed && <Check className="w-4 h-4" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {task.important && <span className="text-amber-400">⭐</span>}
              <p className={`font-medium ${task.completed ? 'line-through text-white/40' : ''}`}>
                {task.title}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.color + '30', color: cat.color }}>
                {cat.icon} {cat.name}
              </span>
              {task.dueDate && (
                <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-white/40'}`}>
                  📅 {task.dueDate === today ? 'Hoy' : new Date(task.dueDate).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                </span>
              )}
              {isOverdue && <span className="text-xs text-red-400">⚠️ Vencida</span>}
            </div>

            {task.notes && (
              <p className="text-xs text-white/40 mt-1 line-clamp-1">{task.notes}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <AnimatedMount>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Personal</h1>
            <p className="text-white/50 text-sm">{pendingTasks.length} pendientes</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-violet-500 rounded-full p-3"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </AnimatedMount>

      {/* Category filters */}
      <AnimatedMount delay={50}>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === 'all' ? 'bg-violet-500' : 'bg-white/10'
              }`}
          >
            Todos ({pendingTasks.length})
          </button>
          {categories.map(cat => {
            const count = pendingTasks.filter(t => t.category === cat.id).length;
            if (count === 0 && filter !== cat.id) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${filter === cat.id ? 'bg-violet-500' : 'bg-white/10'
                  }`}
              >
                {cat.icon} {count}
              </button>
            );
          })}
        </div>
      </AnimatedMount>

      {/* Overdue */}
      {overdue.length > 0 && (
        <AnimatedMount delay={75}>
          <div className="space-y-2">
            <p className="text-xs text-red-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> VENCIDAS ({overdue.length})
            </p>
            {overdue.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </AnimatedMount>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <AnimatedMount delay={100}>
          <div className="space-y-2">
            <p className="text-xs text-white/40 font-medium">📅 PRÓXIMAS ({upcoming.length})</p>
            {upcoming.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </AnimatedMount>
      )}

      {/* Without date */}
      {withoutDate.length > 0 && (
        <AnimatedMount delay={125}>
          <div className="space-y-2">
            <p className="text-xs text-white/40 font-medium">📋 SIN FECHA ({withoutDate.length})</p>
            {withoutDate.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </AnimatedMount>
      )}

      {/* Empty state */}
      {filteredPending.length === 0 && (
        <AnimatedMount delay={100}>
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-white/60">Sin tareas pendientes</p>
            <p className="text-sm text-white/40">¡Todo al día!</p>
          </div>
        </AnimatedMount>
      )}

      {/* Completed toggle */}
      {completedTasks.length > 0 && (
        <AnimatedMount delay={150}>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full py-3 text-sm text-white/40 hover:text-white/60 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Completadas ({completedTasks.length})
            <ChevronDown className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
          </button>

          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.slice(0, 10).map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          )}
        </AnimatedMount>
      )}

      {/* ADD MODAL */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nueva tarea personal">
        <div className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
            placeholder="¿Qué necesitas hacer?"
            className="w-full bg-white/10 rounded-xl p-4 outline-none text-lg"
            autoFocus
          />

          {/* Category */}
          <div>
            <p className="text-xs text-white/40 mb-2">Categoría</p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewTask(p => ({ ...p, category: cat.id }))}
                  className={`p-2 rounded-xl text-center transition-all ${newTask.category === cat.id ? 'ring-2 ring-violet-500' : ''
                    }`}
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <p className="text-[10px] mt-1" style={{ color: cat.color }}>{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Important */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/40 mb-2">Fecha (opcional)</p>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
              />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-2">Prioridad</p>
              <button
                onClick={() => setNewTask(p => ({ ...p, important: !p.important }))}
                className={`w-full p-3 rounded-xl flex items-center justify-center gap-2 ${newTask.important ? 'bg-amber-500' : 'bg-white/10'
                  }`}
              >
                ⭐ {newTask.important ? 'Importante' : 'Normal'}
              </button>
            </div>
          </div>

          {/* Notes */}
          <textarea
            value={newTask.notes}
            onChange={(e) => setNewTask(p => ({ ...p, notes: e.target.value }))}
            placeholder="Notas (opcional)"
            className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm h-20 resize-none"
          />

          <button
            onClick={addTask}
            disabled={!newTask.title.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg ${newTask.title.trim() ? 'bg-violet-500' : 'bg-white/10 text-white/30'
              }`}
          >
            Añadir tarea
          </button>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Editar tarea">
        {editingTask && (
          <div className="space-y-4">
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask(p => ({ ...p, title: e.target.value }))}
              className="w-full bg-white/10 rounded-xl p-4 outline-none text-lg"
            />

            {/* Category */}
            <div>
              <p className="text-xs text-white/40 mb-2">Categoría</p>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setEditingTask(p => ({ ...p, category: cat.id }))}
                    className={`p-2 rounded-xl text-center transition-all ${editingTask.category === cat.id ? 'ring-2 ring-violet-500' : ''
                      }`}
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <p className="text-[10px] mt-1" style={{ color: cat.color }}>{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Important */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-white/40 mb-2">Fecha</p>
                <input
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => setEditingTask(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm"
                />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-2">Prioridad</p>
                <button
                  onClick={() => setEditingTask(p => ({ ...p, important: !p.important }))}
                  className={`w-full p-3 rounded-xl flex items-center justify-center gap-2 ${editingTask.important ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                >
                  ⭐ {editingTask.important ? 'Importante' : 'Normal'}
                </button>
              </div>
            </div>

            {/* Notes */}
            <textarea
              value={editingTask.notes || ''}
              onChange={(e) => setEditingTask(p => ({ ...p, notes: e.target.value }))}
              placeholder="Notas"
              className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm h-20 resize-none"
            />

            {/* Meta */}
            <div className="text-xs text-white/30 pt-2 border-t border-white/10">
              <p>Creada: {new Date(editingTask.createdAt).toLocaleDateString('es')}</p>
              {editingTask.completedAt && <p>Completada: {new Date(editingTask.completedAt).toLocaleDateString('es')}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => updateTask(editingTask)}
                className="flex-1 py-4 bg-violet-500 rounded-xl font-bold"
              >
                Guardar
              </button>
              <button
                onClick={() => { toggleTask(editingTask.id); setEditingTask(null); }}
                className={`py-4 px-5 rounded-xl ${editingTask.completed ? 'bg-amber-500' : 'bg-emerald-500'}`}
              >
                {editingTask.completed ? '↩️' : '✓'}
              </button>
              <button
                onClick={() => deleteTask(editingTask.id)}
                className="py-4 px-5 bg-red-500/20 text-red-400 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// ============================================================================
// CALENDAR SCREEN - Google Calendar Style
// ============================================================================


export default PersonalScreen;
