// WorkScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Briefcase, Plus, Check, ChevronRight, Edit3, Trash2, Target, Calendar, Clock, Zap, Star, AlertCircle, Play, Pause, Timer, BarChart3, TrendingUp, Filter, MoreHorizontal, GripVertical } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { formatMinutes } from '../utils/formatting';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState } from '../components/ui';

const WorkScreen = ({ data, setData, showToast }) => {
  const today = getToday();


  // ============================================================================
  // STATE
  // ============================================================================
  const [view, setView] = useState('agenda'); // agenda, inbox, matrix, kanban, projects
  const [viewDate, setViewDate] = useState(today);
  const [showAdd, setShowAdd] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [filterProject, setFilterProject] = useState('all');


  // Drag & Drop state
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);


  // Kanban view settings
  const [kanbanColumns, setKanbanColumns] = useState(2);


  // New task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: '',
    priority: 'medium',
    eisenhower: 'q2',
    status: 'todo',
    timeEstimate: 30,
    dueDate: today,
    isDeepWork: false
  });


  // New project
  const [newProject, setNewProject] = useState({
    name: '',
    color: '#8B5CF6',
    description: '',
    objective: '',
    deadline: ''
  });


  // Settings
  const [localSettings, setLocalSettings] = useState({
    showCompleted: data.user.workSettings?.showCompleted ?? true,
    dailyDeepWorkGoal: data.user.workSettings?.dailyDeepWorkGoal || 4
  });


  // ============================================================================
  // DATA
  // ============================================================================
  const workTasks = data.workTasks || [];
  const workProjects = data.workProjects || [];


  // Navigation helpers
  const goToPrevDay = () => setViewDate(getDateOffset(viewDate, -1));
  const goToNextDay = () => setViewDate(getDateOffset(viewDate, 1));
  const goToToday = () => setViewDate(today);
  const isToday = viewDate === today;


  // Filtered tasks
  const getTasksForDate = (date) => workTasks.filter(t => t.dueDate === date || t.scheduledDate === date);
  const dateTasks = getTasksForDate(viewDate);
  const dateTasksPending = dateTasks.filter(t => !t.completed);
  const dateTasksCompleted = dateTasks.filter(t => t.completed);


  // Inbox = sin procesar (no tienen proyecto NI fecha asignada)
  const inboxTasks = workTasks.filter(t => !t.project_id && !t.dueDate && !t.completed);


  // Overdue
  const overdueTasks = workTasks.filter(t => t.dueDate && t.dueDate < today && !t.completed);


  // By Eisenhower quadrant (all pending tasks)
  const allPending = workTasks.filter(t => !t.completed);
  const q1Tasks = allPending.filter(t => t.eisenhower === 'q1'); // Urgente + Importante = HACER YA
  const q2Tasks = allPending.filter(t => t.eisenhower === 'q2'); // Importante = PLANIFICAR
  const q3Tasks = allPending.filter(t => t.eisenhower === 'q3'); // Urgente = DELEGAR
  const q4Tasks = allPending.filter(t => t.eisenhower === 'q4'); // Ninguno = ELIMINAR


  // By Kanban status
  const backlogTasks = allPending.filter(t => !t.status || t.status === 'backlog');
  const todoTasks = allPending.filter(t => t.status === 'todo');
  const doingTasks = allPending.filter(t => t.status === 'doing');
  const doneTasks = workTasks.filter(t => t.completed);


  // Stats
  const completedToday = workTasks.filter(t => t.completedAt?.startsWith(today)).length;
  const deepWorkToday = workTasks
    .filter(t => t.isDeepWork && t.completed && t.completedAt?.startsWith(today))
    .reduce((sum, t) => sum + (t.timeEstimate || 0), 0);


  // ============================================================================
  // ACTIONS
  // ============================================================================
  const addTask = () => {
    if (!newTask.title.trim()) return;


    const task = {
      id: generateId(),
      ...newTask,
      scheduledDate: newTask.dueDate || null,
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null
    };

    setData(prev => ({
      ...prev,
      workTasks: [...(prev.workTasks || []), task]
    }));

    setShowAdd(false);
    setNewTask({
      title: '', description: '', project_id: '', priority: 'medium',
      eisenhower: 'q2', status: 'todo', timeEstimate: 30, dueDate: viewDate, isDeepWork: false
    });
    showToast('✓ Tarea creada');

  };


  const toggleTask = (id) => {
    setData(prev => ({
      ...prev,
      workTasks: prev.workTasks.map(t =>
        t.id === id ? {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : null,
          status: !t.completed ? 'done' : 'todo'
        } : t
      )
    }));
  };


  const deleteTask = (id) => {
    setData(prev => ({ ...prev, workTasks: prev.workTasks.filter(t => t.id !== id) }));
    showToast('Tarea eliminada');
  };


  const updateTask = (id, updates) => {
    setData(prev => ({
      ...prev,
      workTasks: prev.workTasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };


  // DRAG & DROP HANDLERS
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };


  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverTarget(null);
  };


  const handleDragOver = (e, target) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(target);
  };


  const handleDragLeave = () => {
    setDragOverTarget(null);
  };


  // Drop on Eisenhower quadrant
  const handleDropOnQuadrant = (e, quadrant) => {
    e.preventDefault();
    if (draggedTask) {
      updateTask(draggedTask.id, { eisenhower: quadrant });
      showToast(`Movido a ${quadrant === 'q1' ? 'Hacer' : quadrant === 'q2' ? 'Planificar' : quadrant === 'q3' ? 'Delegar' : 'Eliminar'}`);
    }
    setDraggedTask(null);
    setDragOverTarget(null);
  };


  // Drop on Kanban column
  const handleDropOnKanban = (e, status) => {
    e.preventDefault();
    if (draggedTask) {
      const updates = { status };
      if (status === 'done') {
        updates.completed = true;
        updates.completedAt = new Date().toISOString();
      } else if (draggedTask.completed) {
        updates.completed = false;
        updates.completedAt = null;
      }
      updateTask(draggedTask.id, updates);
      showToast(`Movido a ${status === 'backlog' ? 'Backlog' : status === 'todo' ? 'Por hacer' : status === 'doing' ? 'En progreso' : 'Hecho'}`);
    }
    setDraggedTask(null);
    setDragOverTarget(null);
  };


  // Drop on Project
  const handleDropOnProject = (e, projectId) => {
    e.preventDefault();
    if (draggedTask) {
      updateTask(draggedTask.id, { project_id: projectId });
      const project = workProjects.find(p => p.id === projectId);
      showToast(`Asignado a ${project?.name || 'Sin proyecto'}`);
    }
    setDraggedTask(null);
    setDragOverTarget(null);
  };


  // Drop on Date (in agenda)
  const handleDropOnDate = (e, date) => {
    e.preventDefault();
    if (draggedTask) {
      updateTask(draggedTask.id, { dueDate: date, scheduledDate: date });
      showToast(`Programado para ${formatDate(date)}`);
    }
    setDraggedTask(null);
    setDragOverTarget(null);
  };


  // Process inbox item (assign project + date + quadrant)
  const processInboxItem = (task) => {
    setShowTaskDetail(task);
  };


  const addProject = () => {
    if (!newProject.name.trim()) return;
    setData(prev => ({
      ...prev,
      workProjects: [...(prev.workProjects || []), {
        id: generateId(),
        ...newProject,
        status: 'active',
        createdAt: new Date().toISOString()
      }]
    }));
    setShowProjectModal(false);
    setNewProject({ name: '', color: '#8B5CF6', description: '', objective: '', deadline: '' });
    showToast('Proyecto creado');
  };


  const deleteProject = (id) => {
    setData(prev => ({
      ...prev,
      workProjects: prev.workProjects.filter(p => p.id !== id),
      workTasks: prev.workTasks.map(t => t.project_id === id ? { ...t, project_id: '' } : t)
    }));
    showToast('Proyecto eliminado');
  };


  const saveSettings = () => {
    setData(prev => ({ ...prev, user: { ...prev.user, workSettings: localSettings } }));
    setShowSettings(false);
    showToast('Guardado');
  };


  // ============================================================================
  // HELPERS
  // ============================================================================
  const formatTime = (min) => min < 60 ? `${min}m` : `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`;
  const getProject = (id) => workProjects.find(p => p.id === id);


  const priorityStyles = {
    high: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-400', label: '🔴 Alta' },
    medium: { border: 'border-amber-500', bg: 'bg-amber-500', text: 'text-amber-400', label: '🟡 Media' },
    low: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-400', label: '🔵 Baja' }
  };


  const quadrantInfo = {
    q1: { label: '🔥 HACER', desc: 'Urgente + Importante', color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    q2: { label: '📅 PLANIFICAR', desc: 'Importante (no urgente)', color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    q3: { label: '👤 DELEGAR', desc: 'Urgente (no importante)', color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    q4: { label: '🗑️ ELIMINAR', desc: 'Ni urgente ni importante', color: 'gray', bg: 'bg-zinc-800', border: 'border-white/10' }
  };


  const statusInfo = {
    backlog: { label: '📋 Backlog', desc: 'Ideas pendientes' },
    todo: { label: '📌 Por hacer', desc: 'Listo para empezar' },
    doing: { label: '🔄 En progreso', desc: 'Trabajando ahora' },
    done: { label: '✅ Hecho', desc: 'Completado' }
  };


  // ============================================================================
  // DRAGGABLE TASK CARD
  // ============================================================================
  const DraggableTask = ({ task, compact = false, showProject = true, showDate = false }) => {
    const project = getProject(task.project_id);
    const priority = priorityStyles[task.priority] || priorityStyles.medium;
    const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
    const isDragging = draggedTask?.id === task.id;


    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        className={`cursor-grab active:cursor-grabbing transition-all ${isDragging ? 'opacity-50 scale-95' : ''}`}
      >
        <Card
          className={`${task.completed ? 'opacity-50' : ''} ${isOverdue ? 'border-red-500/50' : ''} ${compact ? 'py-2 px-3' : ''} hover:bg-white/10`}
          onClick={() => setShowTaskDetail(task)}
        >
          <div className="flex gap-3">
            {/* Checkbox */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : priority.border
                }`}
            >
              {task.completed && <Check className="w-3 h-3" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`${compact ? 'text-sm' : 'font-medium'} ${task.completed ? 'line-through text-white/40' : ''}`}>
                {task.title}
              </p>

              {!compact && task.description && (
                <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{task.description}</p>
              )}

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {showProject && project && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: project.color + '30', color: project.color }}>
                    {project.name}
                  </span>
                )}
                {task.timeEstimate && (
                  <span className="text-[10px] text-white/40 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />{formatTime(task.timeEstimate)}
                  </span>
                )}
                {task.isDeepWork && <Brain className="w-3 h-3 text-violet-400" />}
                {showDate && task.dueDate && (
                  <span className={`text-[10px] ${isOverdue ? 'text-red-400' : 'text-white/40'}`}>
                    📅 {formatDate(task.dueDate)}
                  </span>
                )}
                {isOverdue && <span className="text-[10px] text-red-400">⚠️ Vencida</span>}
              </div>
            </div>

            {/* Drag handle indicator */}
            <div className="text-white/20 self-center">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>
    );

  };


  // ============================================================================
  // VIEW: AGENDA (Navigate by day)
  // ============================================================================
  const AgendaView = () => {
    const weekDays = [];
    for (let i = -3; i <= 3; i++) weekDays.push(getDateOffset(viewDate, i));


    return (
      <div className="space-y-4">
        {/* Date Navigator */}
        <Card className="py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={goToPrevDay} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <div className="text-center">
              <p className="text-lg font-bold">{isToday ? 'Hoy' : formatDate(viewDate)}</p>
              <p className="text-xs text-white/50">{new Date(viewDate).toLocaleDateString('es', { weekday: 'long' })}</p>
            </div>
            <button onClick={goToNextDay} className="p-2 hover:bg-white/10 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>

          {/* Week strip - droppable */}
          <div className="flex justify-between">
            {weekDays.map(date => {
              const isSelected = date === viewDate;
              const isCurrent = date === today;
              const dayTasks = getTasksForDate(date).filter(t => !t.completed);
              const isDropTarget = dragOverTarget === `date-${date}`;

              return (
                <div
                  key={date}
                  onClick={() => setViewDate(date)}
                  onDragOver={(e) => handleDragOver(e, `date-${date}`)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropOnDate(e, date)}
                  className={`w-10 h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-violet-500' :
                    isDropTarget ? 'bg-violet-500/30 ring-2 ring-violet-500' :
                      isCurrent ? 'bg-white/10 ring-1 ring-violet-500' : 'hover:bg-white/5'
                    }`}
                >
                  <span className="text-[10px] text-white/50">{new Date(date).toLocaleDateString('es', { weekday: 'short' }).charAt(0).toUpperCase()}</span>
                  <span className="text-sm font-bold">{new Date(date).getDate()}</span>
                  {dayTasks.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />}
                </div>
              );
            })}
          </div>

          {!isToday && (
            <button onClick={goToToday} className="w-full mt-2 py-1.5 text-xs text-violet-400 hover:bg-violet-500/10 rounded-lg">
              Ir a hoy
            </button>
          )}
        </Card>

        {/* Day stats */}
        {dateTasks.length > 0 && (
          <div className="flex gap-3">
            <Card className="flex-1 py-2 text-center">
              <p className="text-2xl font-bold">{dateTasksCompleted.length}/{dateTasks.length}</p>
              <p className="text-[10px] text-white/40">completadas</p>
            </Card>
            <Card className="flex-1 py-2 text-center">
              <p className="text-2xl font-bold">{dateTasks.length > 0 ? Math.round((dateTasksCompleted.length / dateTasks.length) * 100) : 0}%</p>
              <p className="text-[10px] text-white/40">progreso</p>
            </Card>
          </div>
        )}

        {/* Overdue warning */}
        {overdueTasks.length > 0 && isToday && (
          <Card className="bg-red-500/10 border-red-500/30 py-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{overdueTasks.length} tarea{overdueTasks.length > 1 ? 's' : ''} vencida{overdueTasks.length > 1 ? 's' : ''}</span>
            </div>
          </Card>
        )}

        {/* Tasks */}
        {dateTasksPending.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-white/40">Pendientes ({dateTasksPending.length})</p>
            {dateTasksPending.map(task => <DraggableTask key={task.id} task={task} />)}
          </div>
        )}

        {localSettings.showCompleted && dateTasksCompleted.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-white/40">✓ Completadas ({dateTasksCompleted.length})</p>
            {dateTasksCompleted.map(task => <DraggableTask key={task.id} task={task} />)}
          </div>
        )}

        {dateTasks.length === 0 && (
          <EmptyState
            icon={Calendar}
            title={`Sin tareas para ${isToday ? 'hoy' : 'este día'}`}
            description="Arrastra tareas aquí o crea una nueva"
            action="Nueva tarea"
            onAction={() => { setNewTask(p => ({ ...p, dueDate: viewDate })); setShowAdd(true); }}
          />
        )}

        <button
          onClick={() => { setNewTask(p => ({ ...p, dueDate: viewDate })); setShowAdd(true); }}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/40 hover:border-violet-500 hover:text-violet-400 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Añadir tarea
        </button>
      </div>
    );

  };


  // ============================================================================
  // VIEW: INBOX (GTD - Captura y procesa)
  // ============================================================================
  const InboxView = () => {
    const [quickInput, setQuickInput] = useState('');


    const quickAdd = () => {
      if (!quickInput.trim()) return;
      const task = {
        id: generateId(),
        title: quickInput,
        description: '',
        project_id: '',
        priority: 'medium',
        eisenhower: 'q2',
        status: 'backlog',
        timeEstimate: 30,
        dueDate: '',
        scheduledDate: '',
        isDeepWork: false,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setData(prev => ({ ...prev, workTasks: [...(prev.workTasks || []), task] }));
      setQuickInput('');
      showToast('Capturado en Inbox');
    };

    return (
      <div className="space-y-4">
        {/* Explanation */}
        <Card className="bg-amber-500/10 border-amber-500/20">
          <div className="flex gap-3">
            <div className="text-2xl">📥</div>
            <div>
              <p className="font-medium text-amber-400">¿Qué es el Inbox?</p>
              <p className="text-xs text-white/60 mt-1">
                <strong>Captura rápida</strong>: Anota todo lo que te venga a la mente sin pensar dónde va.
                <br /><strong>Procesa después</strong>: Asigna proyecto, fecha y prioridad a cada tarea.
                <br /><strong>Regla 2 min</strong>: Si tarda menos de 2 min, hazlo ya.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick capture */}
        <Card>
          <div className="flex gap-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && quickAdd()}
              placeholder="Captura rápida... (Enter)"
              className="flex-1 bg-transparent outline-none"
            />
            <button onClick={quickAdd} disabled={!quickInput.trim()} className="px-4 py-2 bg-violet-500 rounded-lg disabled:opacity-50">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Inbox items */}
        {inboxTasks.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-white/40">{inboxTasks.length} sin procesar</p>
            {inboxTasks.map(task => (
              <Card key={task.id} className="border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-400/50" />
                  <div className="flex-1">
                    <p>{task.title}</p>
                    <p className="text-[10px] text-white/30">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => processInboxItem(task)}
                    className="px-3 py-1.5 bg-violet-500 rounded-lg text-xs"
                  >
                    Procesar
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState icon={Target} title="Inbox vacío" description="¡Genial! Todo está procesado" />
        )}
      </div>
    );

  };


  // ============================================================================
  // VIEW: MATRIX (Eisenhower) - Long press + drag in one gesture
  // ============================================================================
  const MatrixView = () => {
    const [dragTask, setDragTask] = useState(null);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [currentDropZone, setCurrentDropZone] = useState(null);
    const pressTimer = useRef(null);
    const startPos = useRef({ x: 0, y: 0 });


    const quadrants = [
      { id: 'q1', ...quadrantInfo.q1, tasks: q1Tasks },
      { id: 'q2', ...quadrantInfo.q2, tasks: q2Tasks },
      { id: 'q3', ...quadrantInfo.q3, tasks: q3Tasks },
      { id: 'q4', ...quadrantInfo.q4, tasks: q4Tasks }
    ];

    const activateDrag = (task, x, y) => {
      setDragTask(task);
      setDragPosition({ x, y });
      if (navigator.vibrate) navigator.vibrate(50);
    };

    const handlePointerDown = (e, task) => {
      // Don't prevent default - let scroll work
      const x = e.clientX || e.touches?.[0]?.clientX;
      const y = e.clientY || e.touches?.[0]?.clientY;
      startPos.current = { x, y };

      pressTimer.current = setTimeout(() => {
        activateDrag(task, x, y);
      }, 400);
    };

    const handlePointerMove = (e) => {
      const x = e.clientX || e.touches?.[0]?.clientX;
      const y = e.clientY || e.touches?.[0]?.clientY;

      if (!dragTask && pressTimer.current) {
        const dx = Math.abs(x - startPos.current.x);
        const dy = Math.abs(y - startPos.current.y);
        if (dx > 8 || dy > 8) {
          clearTimeout(pressTimer.current);
          pressTimer.current = null;
        }
      }

      if (dragTask) {
        e.preventDefault?.(); // Only prevent when dragging
        setDragPosition({ x, y });
        const elements = document.elementsFromPoint(x, y);
        const dropZone = elements.find(el => el.dataset.quadrant);
        setCurrentDropZone(dropZone?.dataset.quadrant || null);
      }
    };

    const handlePointerUp = (e) => {
      const x = e.clientX || e.changedTouches?.[0]?.clientX;
      const y = e.clientY || e.changedTouches?.[0]?.clientY;

      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
      }

      if (dragTask) {
        if (currentDropZone && currentDropZone !== dragTask.eisenhower) {
          updateTask(dragTask.id, { eisenhower: currentDropZone });
          if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
          showToast(`→ ${quadrantInfo[currentDropZone].label}`);
        }
        setDragTask(null);
        setCurrentDropZone(null);
      } else {
        const dx = Math.abs(x - startPos.current.x);
        const dy = Math.abs(y - startPos.current.y);
        if (dx < 10 && dy < 10) {
          const elements = document.elementsFromPoint(x, y);
          const taskEl = elements.find(el => el.dataset.taskId);
          if (taskEl) {
            const task = workTasks.find(t => t.id === taskEl.dataset.taskId);
            if (task) setShowTaskDetail(task);
          }
        }
      }
    };

    useEffect(() => {
      if (dragTask) {
        const onMove = (e) => handlePointerMove(e);
        const onEnd = (e) => handlePointerUp(e);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);

        return () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onEnd);
          window.removeEventListener('touchmove', onMove);
          window.removeEventListener('touchend', onEnd);
        };
      }
    }, [dragTask, currentDropZone]);

    return (
      <div className="space-y-3">
        {/* Matrix 2x2 grid */}
        <div className="grid grid-cols-2 gap-2">
          {quadrants.map(q => {
            const isDropping = currentDropZone === q.id;
            const colorClass = q.color === 'red' ? 'text-red-400 border-red-500/40' :
              q.color === 'blue' ? 'text-blue-400 border-blue-500/40' :
                q.color === 'amber' ? 'text-amber-400 border-amber-500/40' :
                  'text-white/40 border-white/20';

            return (
              <div
                key={q.id}
                data-quadrant={q.id}
                className={`rounded-2xl p-3 min-h-[200px] transition-all duration-200 border-2 ${q.bg} ${isDropping ? 'ring-2 ring-violet-400 scale-[1.02] bg-violet-500/20 border-violet-400' : colorClass
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className={`text-xs font-bold ${colorClass.split(' ')[0]}`}>{q.label}</p>
                    <p className="text-[9px] text-white/40">{q.desc}</p>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
                    {q.tasks.length}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto" data-quadrant={q.id}>
                  {q.tasks.map(task => {
                    const isDragging = dragTask?.id === task.id;

                    return (
                      <div
                        key={task.id}
                        data-task-id={task.id}
                        onMouseDown={(e) => handlePointerDown(e, task)}
                        onTouchStart={(e) => handlePointerDown(e, task)}
                        className={`p-2 bg-black/40 rounded-lg text-[11px] flex items-center gap-2 select-none transition-all
                        ${isDragging ? 'opacity-30 scale-95' : 'hover:bg-black/60'}
                        cursor-pointer`}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                          className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-500' :
                            priorityStyles[task.priority]?.border || 'border-white/30'
                            }`}
                        >
                          {task.completed && <Check className="w-2.5 h-2.5" />}
                        </button>
                        <span className={`truncate flex-1 ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </span>
                        {task.isDeepWork && <Brain className="w-3 h-3 text-violet-400 flex-shrink-0" />}
                      </div>
                    );
                  })}
                  {q.tasks.length === 0 && (
                    <div className={`flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed transition-all ${isDropping ? 'border-violet-400 bg-violet-500/10' : 'border-white/10'
                      }`}>
                      <span className="text-2xl mb-1 opacity-50">{q.label.split(' ')[0]}</span>
                      <p className="text-[10px] text-white/30">Suelta aquí</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] px-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-red-500/50" />
            <span className="text-white/50">Urgente + Importante</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-blue-500/50" />
            <span className="text-white/50">Importante (planificar)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-amber-500/50" />
            <span className="text-white/50">Urgente (delegar)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-zinc-600" />
            <span className="text-white/50">Eliminar</span>
          </div>
        </div>

        {/* Floating drag preview */}
        {dragTask && (
          <div
            className="fixed pointer-events-none z-50 p-2 bg-violet-600 rounded-lg shadow-2xl shadow-violet-500/50 max-w-[140px]"
            style={{
              left: dragPosition.x - 70,
              top: dragPosition.y - 20,
              transform: 'rotate(3deg) scale(1.05)'
            }}
          >
            <p className="text-xs font-medium truncate">{dragTask.title}</p>
          </div>
        )}

        <p className="text-[10px] text-white/30 text-center">
          Toca = editar · Mantén y arrastra = mover
        </p>
      </div>
    );

  };


  // ============================================================================
  // ============================================================================
  // ============================================================================
  // ============================================================================
  // ============================================================================
  // ============================================================================
  // ============================================================================
  // VIEW: KANBAN - Simple native drag
  // ============================================================================
  const KanbanView = () => {
    const scrollRef = useRef(null);
    const [draggedId, setDraggedId] = useState(null);
    const [overCol, setOverCol] = useState(null);


    const columns = [
      { id: 'backlog', ...statusInfo.backlog, tasks: filterProject === 'all' ? backlogTasks : backlogTasks.filter(t => t.project_id === filterProject) },
      { id: 'todo', ...statusInfo.todo, tasks: filterProject === 'all' ? todoTasks : todoTasks.filter(t => t.project_id === filterProject) },
      { id: 'doing', ...statusInfo.doing, tasks: filterProject === 'all' ? doingTasks : doingTasks.filter(t => t.project_id === filterProject) },
      { id: 'done', ...statusInfo.done, tasks: (filterProject === 'all' ? doneTasks : doneTasks.filter(t => t.project_id === filterProject)).slice(0, 20) }
    ];

    const getColumnStyle = () => {
      switch (kanbanColumns) {
        case 1: return { width: '100%', minWidth: '280px' };
        case 2: return { width: 'calc(50% - 6px)', minWidth: '160px' };
        case 3: return { width: 'calc(33.333% - 6px)', minWidth: '120px' };
        default: return { width: 'calc(50% - 6px)', minWidth: '160px' };
      }
    };

    const compact = kanbanColumns === 3;

    const handleDrop = (colId) => {
      const task = workTasks.find(t => t.id === draggedId);
      if (task && colId !== task.status) {
        const updates = { status: colId };
        if (colId === 'done') {
          updates.completed = true;
          updates.completedAt = new Date().toISOString();
        } else if (task.completed) {
          updates.completed = false;
          updates.completedAt = null;
        }
        updateTask(task.id, updates);
        showToast('→ ' + (statusInfo[colId]?.label || colId));

        // Scroll to target column after re-render
        setTimeout(() => {
          const targetCol = document.querySelector(`[data-colid="${colId}"]`);
          if (targetCol) {
            targetCol.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
          }
        }, 50);
      }
      setDraggedId(null);
      setOverCol(null);
    };

    return (
      <div
        className="space-y-3"
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragLeave={(e) => { e.stopPropagation(); }}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setFilterProject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex-shrink-0 ${filterProject === 'all' ? 'bg-violet-500' : 'bg-white/10'}`}
            >
              Todos
            </button>
            {workProjects.map(p => (
              <button
                key={p.id}
                onClick={() => setFilterProject(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${filterProject === p.id ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setKanbanColumns(v => v >= 3 ? 1 : v + 1)}
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center gap-0.5"
          >
            {[...Array(kanbanColumns)].map((_, i) => (
              <div key={i} className="w-1.5 h-4 bg-violet-400 rounded-sm" />
            ))}
          </button>
        </div>

        {/* Columns */}
        <div
          ref={scrollRef}
          className={`flex ${compact ? 'gap-2' : 'gap-3'} overflow-x-auto -mx-4 px-4 pb-4`}
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {columns.map(col => {
            const isOver = overCol === col.id;

            return (
              <div
                key={col.id}
                data-colid={col.id}
                className="flex-shrink-0"
                style={getColumnStyle()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'move'; setOverCol(col.id); }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDragLeave={(e) => { e.stopPropagation(); setOverCol(null); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'move'; handleDrop(col.id); }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold truncate ${compact ? 'text-xs' : 'text-sm'}`}>{col.label}</span>
                  <span className={`text-white/40 bg-white/10 rounded-full flex items-center justify-center ${compact ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'}`}>
                    {col.tasks.length}
                  </span>
                </div>

                <div className={`rounded-2xl min-h-[350px] transition-all ${compact ? 'p-1.5' : 'p-2.5'} ${isOver ? 'bg-violet-500/30 ring-2 ring-violet-400' : 'bg-white/5'
                  }`}>
                  <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
                    {col.tasks.map(task => {
                      const project = getProject(task.project_id);
                      const isDragging = draggedId === task.id;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', task.id);
                            setDraggedId(task.id);
                          }}
                          onDragEnd={(e) => { e.stopPropagation(); e.preventDefault(); setDraggedId(null); setOverCol(null); }}
                          onClick={() => setShowTaskDetail(task)}
                          className={`bg-zinc-800 rounded-xl border-l-4 select-none cursor-grab active:cursor-grabbing
                          ${compact ? 'p-2' : 'p-3'}
                          ${isDragging ? 'opacity-40' : ''}
                          ${task.completed ? 'opacity-50' : ''}`}
                          style={{ borderColor: project?.color || '#666' }}
                        >
                          <p className={`font-medium leading-snug ${compact ? 'text-xs line-clamp-2' : 'text-sm'} ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </p>
                          {!compact && task.description && (
                            <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{task.description}</p>
                          )}
                          <div className={`flex items-center gap-1 flex-wrap ${compact ? 'mt-1' : 'mt-2'}`}>
                            {!compact && project && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: project.color + '25', color: project.color }}>
                                {project.name}
                              </span>
                            )}
                            {task.priority === 'high' && <span className="text-[8px]">🔴</span>}
                            {task.priority === 'medium' && <span className="text-[8px]">🟡</span>}
                            {task.isDeepWork && <Brain className="w-2.5 h-2.5 text-violet-400" />}
                          </div>
                        </div>
                      );
                    })}
                    {col.tasks.length === 0 && (
                      <div className={`flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed ${isOver ? 'border-violet-400 bg-violet-500/10' : 'border-white/10'
                        }`}>
                        <LayoutGrid className="w-5 h-5 mb-1 text-white/20" />
                        <p className="text-[10px] text-white/30">Soltar aquí</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-white/30 text-center">
          Arrastra tareas entre columnas · Toca para editar
        </p>
      </div>
    );

  };


  // VIEW: PROJECTS (Expandable with tasks, droppable)
  // ============================================================================
  const ProjectsView = () => {
    const toggleExpand = (id) => setExpandedProjects(p => ({ ...p, [id]: !p[id] }));
    const orphanTasks = workTasks.filter(t => !t.project_id && !t.completed);


    return (
      <div className="space-y-3">
        {/* Explanation */}
        <Card className="bg-emerald-500/10 border-emerald-500/20 py-2">
          <div className="flex gap-3">
            <div className="text-xl">📁</div>
            <div>
              <p className="text-sm font-medium text-emerald-400">Proyectos</p>
              <p className="text-[10px] text-white/50">Agrupa tareas relacionadas. Arrastra tareas a un proyecto para asignarlas.</p>
            </div>
          </div>
        </Card>

        {/* Add project */}
        <button
          onClick={() => setShowProjectModal(true)}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/40 hover:border-violet-500 hover:text-violet-400 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo proyecto
        </button>

        {/* Projects list */}
        {workProjects.filter(p => p.status === 'active').map(project => {
          const tasks = workTasks.filter(t => t.project_id === project.id);
          const pending = tasks.filter(t => !t.completed);
          const done = tasks.filter(t => t.completed);
          const progress = tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;
          const expanded = expandedProjects[project.id];
          const isDropTarget = dragOverTarget === `project-${project.id}`;

          return (
            <Card
              key={project.id}
              onDragOver={(e) => handleDragOver(e, `project-${project.id}`)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDropOnProject(e, project.id)}
              className={`transition-all ${isDropTarget ? 'ring-2 ring-violet-500 bg-violet-500/10' : ''}`}
            >
              <button onClick={() => toggleExpand(project.id)} className="w-full text-left">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full mt-0.5" style={{ backgroundColor: project.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{project.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">{progress}%</span>
                        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {project.objective && <p className="text-xs text-violet-400 mt-0.5">🎯 {project.objective}</p>}
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: project.color }} />
                    </div>
                    <div className="flex gap-4 mt-1.5 text-xs text-white/40">
                      <span>{pending.length} pendientes</span>
                      <span>{done.length} hechas</span>
                    </div>
                  </div>
                </div>
              </button>

              {expanded && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  {pending.map(task => <DraggableTask key={task.id} task={task} showProject={false} compact />)}
                  {pending.length === 0 && <p className="text-xs text-white/30 text-center py-4">Sin tareas pendientes</p>}

                  {done.length > 0 && (
                    <p className="text-[10px] text-emerald-400/50 pt-2">✓ {done.length} completadas</p>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); setNewTask(p => ({ ...p, project_id: project.id })); setShowAdd(true); }}
                    className="w-full py-2 border border-dashed border-white/20 rounded-lg text-xs text-white/40 hover:border-violet-500 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />Añadir tarea
                  </button>
                </div>
              )}
            </Card>
          );
        })}

        {/* Orphan tasks - droppable to remove from project */}
        {orphanTasks.length > 0 && (
          <Card
            onDragOver={(e) => handleDragOver(e, 'project-none')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDropOnProject(e, '')}
            className={`border-white/10 ${dragOverTarget === 'project-none' ? 'ring-2 ring-violet-500' : ''}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-white/20" />
              <span className="text-sm text-white/50">Sin proyecto</span>
              <span className="text-xs text-white/30">({orphanTasks.length})</span>
            </div>
            <div className="space-y-2">
              {orphanTasks.slice(0, 5).map(task => <DraggableTask key={task.id} task={task} showProject={false} compact />)}
              {orphanTasks.length > 5 && <p className="text-xs text-white/30 text-center">+{orphanTasks.length - 5} más</p>}
            </div>
          </Card>
        )}

        {workProjects.length === 0 && (
          <EmptyState icon={Briefcase} title="Sin proyectos" description="Crea proyectos para organizar tareas" action="Crear" onAction={() => setShowProjectModal(true)} />
        )}
      </div>
    );

  };


  // ============================================================================
  // VIEWS & TABS
  // ============================================================================
  const views = {
    agenda: <AgendaView />,
    inbox: <InboxView />,
    matrix: <MatrixView />,
    kanban: <KanbanView />,
    projects: <ProjectsView />
  };


  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: Calendar, badge: null },
    { id: 'inbox', label: 'Inbox', icon: Target, badge: inboxTasks.length || null },
    { id: 'matrix', label: 'Matriz', icon: Grid, badge: null },
    { id: 'kanban', label: 'Kanban', icon: LayoutGrid, badge: null },
    { id: 'projects', label: 'Proyectos', icon: Briefcase, badge: null }
  ];


  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <AnimatedMount>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trabajo</h1>
            <p className="text-white/50 text-sm">{allPending.length} pendientes · {completedToday} hoy</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(true)} className="p-2 hover:bg-white/10 rounded-full">
              <BookOpen className="w-5 h-5 text-white/50" />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded-full">
              <Settings className="w-5 h-5 text-white/50" />
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-violet-500 rounded-full p-2.5">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AnimatedMount>


      {/* Tabs */}
      <AnimatedMount delay={50}>
        <div className="flex gap-0.5 p-1 bg-white/5 rounded-xl overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[10px] font-medium whitespace-nowrap relative transition-all ${view === tab.id ? 'bg-violet-500' : 'text-white/50 hover:text-white'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-0 w-4 h-4 bg-amber-500 rounded-full text-[8px] flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </AnimatedMount>

      {/* Current View */}
      <AnimatedMount delay={100}>
        {views[view]}
      </AnimatedMount>

      {/* ========== MODALS ========== */}

      {/* ADD TASK MODAL */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nueva tarea">
        <div className="space-y-4">
          <input
            type="text" placeholder="¿Qué necesitas hacer?" value={newTask.title}
            onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-4 outline-none text-lg" autoFocus
          />

          <textarea
            placeholder="Notas (opcional)" value={newTask.description}
            onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm h-20 resize-none"
          />

          {/* Project */}
          <div>
            <p className="text-xs text-white/40 mb-2">Proyecto</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setNewTask(p => ({ ...p, project_id: '' }))} className={`px-3 py-2 rounded-lg text-sm ${!newTask.project_id ? 'bg-white/20' : 'bg-white/5'}`}>
                Ninguno
              </button>
              {workProjects.map(p => (
                <button key={p.id} onClick={() => setNewTask(prev => ({ ...prev, project_id: p.id }))}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${newTask.project_id === p.id ? 'bg-white/20' : 'bg-white/5'}`}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />{p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Priority + Quadrant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/40 mb-2">Prioridad</p>
              <div className="flex gap-1">
                {Object.entries(priorityStyles).map(([k, v]) => (
                  <button key={k} onClick={() => setNewTask(p => ({ ...p, priority: k }))}
                    className={`flex-1 py-2 rounded-lg text-xs ${newTask.priority === k ? v.bg : 'bg-white/10'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-2">Cuadrante</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(quadrantInfo).map(([k, v]) => (
                  <button key={k} onClick={() => setNewTask(p => ({ ...p, eisenhower: k }))}
                    className={`py-1.5 rounded-lg text-[9px] ${newTask.eisenhower === k ? 'bg-violet-500' : 'bg-white/10'}`}>
                    {v.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/40 mb-2">Fecha</p>
              <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-2">Duración</p>
              <div className="flex gap-1">
                {[15, 30, 60, 120].map(t => (
                  <button key={t} onClick={() => setNewTask(p => ({ ...p, timeEstimate: t }))}
                    className={`flex-1 py-3 rounded-lg text-xs ${newTask.timeEstimate === t ? 'bg-violet-500' : 'bg-white/10'}`}>
                    {formatTime(t)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Work + Status */}
          <div className="flex gap-3">
            <button onClick={() => setNewTask(p => ({ ...p, isDeepWork: !p.isDeepWork }))}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${newTask.isDeepWork ? 'bg-violet-500' : 'bg-white/10'}`}>
              <Brain className="w-4 h-4" />Deep Work
            </button>
            <select value={newTask.status} onChange={(e) => setNewTask(p => ({ ...p, status: e.target.value }))}
              className="flex-1 bg-white/10 rounded-xl px-3 outline-none text-sm">
              <option value="backlog">📋 Backlog</option>
              <option value="todo">📌 Por hacer</option>
              <option value="doing">🔄 En progreso</option>
            </select>
          </div>

          <button onClick={addTask} disabled={!newTask.title}
            className={`w-full py-4 rounded-xl font-bold text-lg ${newTask.title ? 'bg-violet-500' : 'bg-white/10 text-white/30'}`}>
            Crear tarea
          </button>
        </div>
      </Modal>

      {/* TASK DETAIL MODAL */}
      <Modal isOpen={!!showTaskDetail} onClose={() => setShowTaskDetail(null)} title="Detalle">
        {showTaskDetail && (
          <div className="space-y-4">
            <input type="text" value={showTaskDetail.title} onChange={(e) => setShowTaskDetail(p => ({ ...p, title: e.target.value }))}
              className="w-full bg-white/10 rounded-xl p-4 outline-none text-lg font-medium" />

            <textarea placeholder="Notas..." value={showTaskDetail.description || ''} onChange={(e) => setShowTaskDetail(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm h-24 resize-none" />

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {showTaskDetail.completed && <span className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">✓ Completada</span>}
              {showTaskDetail.isDeepWork && <span className="text-sm bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full">🧠 Deep Work</span>}
              {showTaskDetail.dueDate && showTaskDetail.dueDate < today && !showTaskDetail.completed && (
                <span className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full">⚠️ Vencida</span>
              )}
            </div>

            {/* Project */}
            <div>
              <p className="text-xs text-white/40 mb-2">Proyecto</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowTaskDetail(p => ({ ...p, project_id: '' }))}
                  className={`px-3 py-2 rounded-lg text-sm ${!showTaskDetail.project_id ? 'bg-white/20' : 'bg-white/5'}`}>
                  Sin proyecto
                </button>
                {workProjects.map(p => (
                  <button key={p.id} onClick={() => setShowTaskDetail(prev => ({ ...prev, project_id: p.id }))}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${showTaskDetail.project_id === p.id ? 'bg-white/20' : 'bg-white/5'}`}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />{p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs text-white/40 mb-2">Prioridad</p>
              <div className="flex gap-2">
                {Object.entries(priorityStyles).map(([k, v]) => (
                  <button key={k} onClick={() => setShowTaskDetail(p => ({ ...p, priority: k }))}
                    className={`flex-1 py-3 rounded-xl text-sm ${showTaskDetail.priority === k ? v.bg : 'bg-white/10'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Eisenhower */}
            <div>
              <p className="text-xs text-white/40 mb-2">Cuadrante Eisenhower</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(quadrantInfo).map(([k, v]) => (
                  <button key={k} onClick={() => setShowTaskDetail(p => ({ ...p, eisenhower: k }))}
                    className={`py-2 rounded-xl text-xs ${showTaskDetail.eisenhower === k ? 'bg-violet-500' : 'bg-white/10'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-white/40 mb-2">Estado Kanban</p>
              <div className="grid grid-cols-4 gap-1">
                {Object.entries(statusInfo).map(([k, v]) => (
                  <button key={k} onClick={() => setShowTaskDetail(p => ({
                    ...p, status: k, completed: k === 'done', completedAt: k === 'done' ? new Date().toISOString() : null
                  }))}
                    className={`py-2 rounded-xl text-[10px] ${(showTaskDetail.status === k || (k === 'done' && showTaskDetail.completed)) ? 'bg-violet-500' : 'bg-white/10'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-white/40 mb-2">Fecha</p>
                <input type="date" value={showTaskDetail.dueDate || ''} onChange={(e) => setShowTaskDetail(p => ({ ...p, dueDate: e.target.value, scheduledDate: e.target.value }))}
                  className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none" />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-2">Duración</p>
                <div className="flex gap-1">
                  {[15, 30, 60, 120].map(t => (
                    <button key={t} onClick={() => setShowTaskDetail(p => ({ ...p, timeEstimate: t }))}
                      className={`flex-1 py-3 rounded-lg text-[10px] ${showTaskDetail.timeEstimate === t ? 'bg-violet-500' : 'bg-white/10'}`}>
                      {formatTime(t)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Deep Work */}
            <button onClick={() => setShowTaskDetail(p => ({ ...p, isDeepWork: !p.isDeepWork }))}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${showTaskDetail.isDeepWork ? 'bg-violet-500' : 'bg-white/10'}`}>
              <Brain className="w-4 h-4" />Deep Work
            </button>

            {/* Meta */}
            <div className="text-xs text-white/30 pt-2 border-t border-white/10">
              <p>Creada: {new Date(showTaskDetail.createdAt).toLocaleString('es')}</p>
              {showTaskDetail.completedAt && <p>Completada: {new Date(showTaskDetail.completedAt).toLocaleString('es')}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => { updateTask(showTaskDetail.id, showTaskDetail); setShowTaskDetail(null); showToast('Guardado'); }}
                className="flex-1 py-4 bg-violet-500 rounded-xl font-bold">Guardar</button>
              <button onClick={() => { toggleTask(showTaskDetail.id); setShowTaskDetail(null); }}
                className={`py-4 px-5 rounded-xl ${showTaskDetail.completed ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                {showTaskDetail.completed ? '↩️' : '✓'}
              </button>
              <button onClick={() => { if (confirm('¿Eliminar?')) { deleteTask(showTaskDetail.id); setShowTaskDetail(null); } }}
                className="py-4 px-5 bg-red-500/20 text-red-400 rounded-xl"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </Modal>

      {/* PROJECT MODAL */}
      <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="Nuevo proyecto">
        <div className="space-y-4">
          <input type="text" placeholder="Nombre" value={newProject.name} onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-4 outline-none text-lg" autoFocus />

          <textarea placeholder="Descripción" value={newProject.description} onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm h-16 resize-none" />

          <input type="text" placeholder="🎯 Objetivo (opcional)" value={newProject.objective} onChange={(e) => setNewProject(p => ({ ...p, objective: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none text-sm" />

          <div className="flex gap-3">
            {['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#06B6D4'].map(c => (
              <button key={c} onClick={() => setNewProject(p => ({ ...p, color: c }))}
                className={`w-10 h-10 rounded-full ${newProject.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>

          <input type="date" value={newProject.deadline} onChange={(e) => setNewProject(p => ({ ...p, deadline: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none" placeholder="Fecha límite" />

          <button onClick={addProject} disabled={!newProject.name}
            className={`w-full py-4 rounded-xl font-bold ${newProject.name ? 'bg-violet-500' : 'bg-white/10 text-white/30'}`}>
            Crear proyecto
          </button>
        </div>
      </Modal>

      {/* HELP MODAL */}
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Guía del sistema">
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-violet-400 mb-1">📅 Agenda</p>
            <p className="text-white/60">Navega día a día. Arrastra tareas a fechas en el calendario semanal.</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-amber-400 mb-1">📥 Inbox (GTD)</p>
            <p className="text-white/60">Captura ideas rápido sin pensar. Después "procesa": asigna proyecto, fecha y cuadrante.</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-red-400 mb-1">📊 Matriz (Eisenhower)</p>
            <p className="text-white/60">
              <strong>Q1 🔥 Hacer</strong>: Urgente + Importante (crisis)<br />
              <strong>Q2 📅 Planificar</strong>: Importante (crecimiento)<br />
              <strong>Q3 👤 Delegar</strong>: Urgente (interrupciones)<br />
              <strong>Q4 🗑️ Eliminar</strong>: Ninguno (distracciones)<br />
              <em>Objetivo: pasar 80% del tiempo en Q1+Q2</em>
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-blue-400 mb-1">📋 Kanban</p>
            <p className="text-white/60">
              <strong>Backlog</strong>: Ideas sin fecha<br />
              <strong>Por hacer</strong>: Listo para empezar<br />
              <strong>En progreso</strong>: Trabajando ahora<br />
              <strong>Hecho</strong>: Completado
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-emerald-400 mb-1">📁 Proyectos</p>
            <p className="text-white/60">Agrupa tareas relacionadas. Ve el progreso de cada proyecto.</p>
          </div>

          <div className="p-3 bg-violet-500/20 rounded-xl">
            <p className="font-bold mb-1">🖱️ Drag & Drop</p>
            <p className="text-white/60">Arrastra tareas entre: fechas, cuadrantes, columnas kanban, y proyectos.</p>
          </div>
        </div>
      </Modal>

      {/* SETTINGS MODAL */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Configuración"
        footer={<button onClick={saveSettings} className="w-full py-4 bg-violet-500 rounded-xl font-bold">Guardar</button>}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <span>Mostrar completadas</span>
            <button onClick={() => setLocalSettings(p => ({ ...p, showCompleted: !p.showCompleted }))}
              className={`w-12 h-7 rounded-full ${localSettings.showCompleted ? 'bg-violet-500' : 'bg-white/20'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.showCompleted ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div>
            <p className="mb-2">Meta Deep Work diaria</p>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map(h => (
                <button key={h} onClick={() => setLocalSettings(p => ({ ...p, dailyDeepWorkGoal: h }))}
                  className={`flex-1 py-3 rounded-xl ${localSettings.dailyDeepWorkGoal === h ? 'bg-violet-500' : 'bg-white/10'}`}>
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Template Selection Modal */}
      <Modal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} title="Seleccionar Plantilla">
        <div className="space-y-4">
          {/* Available templates - always has routines with defaults */}
          <div className="space-y-2">
            <p className="text-sm text-white/50 mb-3">Elige una rutina para empezar:</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {routines.map(routine => (
                <button
                  key={routine.id}
                  onClick={() => {
                    // Create workout from routine/template
                    const newWorkout = {
                      id: `workout-${Date.now()}`,
                      day_id: viewDate,
                      name: routine.name,
                      started_at: null,
                      is_completed: false,
                      templateId: routine.id,
                      exercises: (routine.exercises || []).map(e => ({
                        id: `ex-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        exerciseId: e.exerciseId || e.id,
                        name: e.name || 'Ejercicio',
                        targetSets: e.sets || e.targetSets || 3,
                        targetReps: e.reps || e.targetReps || '8',
                        restSeconds: e.restSeconds || 90,
                        notes: e.notes || '',
                        sets: Array.from({ length: e.sets || e.targetSets || 3 }, () => ({
                          id: `set-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                          weight: null,
                          reps: null,
                          rpe: null,
                          setType: 'normal',
                          completed: false
                        }))
                      }))
                    };
                    setData(prev => ({
                      ...prev,
                      workouts: [...(prev.workouts || []), newWorkout]
                    }));
                    setShowTemplateModal(false);
                    showToast(`${routine.name} iniciado 💪`);
                  }}
                  className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium">{routine.name}</p>
                      <p className="text-xs text-white/50">{routine.exercises?.length || 0} ejercicios</p>
                    </div>
                  </div>
                  <Play className="w-5 h-5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => {
                setShowTemplateModal(false);
                setScreen('workout');
              }}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear nueva plantilla
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


export default WorkScreen;
