// FinancesScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Minus, TrendingUp, TrendingDown, PiggyBank, CreditCard, ChevronRight, ChevronLeft, Edit3, Trash2, Calendar, Target, BarChart3, Settings, DollarSign, ArrowUpRight, ArrowDownLeft, Clock, Filter, MoreHorizontal, Search, Check, Star, RefreshCw, Briefcase, User } from 'lucide-react';
import { getToday, getDateOffset, formatDate, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount, ProgressBar, EmptyState, MiniChart } from '../components/ui';

const FinancesScreen = ({ data, setData, showToast }) => {
  // Mode: 'personal' or 'business'
  const [financeMode, setFinanceMode] = useState('personal');
  const [view, setView] = useState('home');
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddSaving, setShowAddSaving] = useState(false);
  const [showEmergencyFund, setShowEmergencyFund] = useState(false);
  const [showAddEnvelope, setShowAddEnvelope] = useState(false);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    notes: '',
    tags: [],
    date: getToday(),
    client: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [newSavingGoal, setNewSavingGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    icon: '🎯'
  });
  const [newEnvelope, setNewEnvelope] = useState({
    name: '',
    budgetAmount: '',
    icon: '💳'
  });
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
    category: 'streaming',
    nextBillingDate: getToday()
  });

  // Bulk edit state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkTag, setBulkTag] = useState('');

  // Split transaction state
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitTransaction, setSplitTransaction] = useState(null);
  const [splits, setSplits] = useState([{ category: '', amount: '', description: '' }]);

  // Annual/Non-monthly expenses state
  const [showAddAnnualExpense, setShowAddAnnualExpense] = useState(false);
  const [showAnnualExpenses, setShowAnnualExpenses] = useState(false);
  const [newAnnualExpense, setNewAnnualExpense] = useState({
    name: '',
    amount: '',
    frequency: 'yearly', // yearly, quarterly, biannual
    category: 'other',
    nextDueDate: '',
    icon: '📅'
  });
  const annualExpenses = data.finances?.annualExpenses || [];
  const frequencyOptions = [
    { id: 'yearly', name: 'Anual', months: 12 },
    { id: 'biannual', name: 'Semestral', months: 6 },
    { id: 'quarterly', name: 'Trimestral', months: 3 }
  ];

  // Calculate monthly equivalent of annual expenses
  const monthlyEquivalent = annualExpenses.reduce((sum, exp) => {
    const freq = frequencyOptions.find(f => f.id === exp.frequency);
    return sum + (exp.amount / (freq?.months || 12));
  }, 0);

  // Net Worth state
  const [showNetWorth, setShowNetWorth] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', value: '', category: 'cash', icon: '💰' });
  const [newLiability, setNewLiability] = useState({ name: '', value: '', category: 'debt', icon: '💳' });

  const assets = data.finances?.assets || [];
  const liabilities = data.finances?.liabilities || [];
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const assetCategories = [
    { id: 'cash', name: 'Efectivo', icon: '💵' },
    { id: 'savings', name: 'Ahorros', icon: '🏦' },
    { id: 'investments', name: 'Inversiones', icon: '📈' },
    { id: 'property', name: 'Inmuebles', icon: '🏠' },
    { id: 'vehicle', name: 'Vehículos', icon: '🚗' },
    { id: 'other', name: 'Otros', icon: '📦' }
  ];

  const liabilityCategories = [
    { id: 'credit', name: 'Tarjetas', icon: '💳' },
    { id: 'loan', name: 'Préstamos', icon: '🏦' },
    { id: 'mortgage', name: 'Hipoteca', icon: '🏠' },
    { id: 'other', name: 'Otros', icon: '📋' }
  ];

  // Categorization rules
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ keyword: '', category: '', caseSensitive: false });
  const categorizationRules = data.finances?.categorizationRules || [];

  // Weekly/Monthly Review state
  const [showReview, setShowReview] = useState(false);
  const [reviewPeriod, setReviewPeriod] = useState('week'); // 'week' or 'month'

  // ========== A3.1 SHARED EXPENSES (Splitwise-style) ==========
  const [showSharedExpenses, setShowSharedExpenses] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddSharedExpense, setShowAddSharedExpense] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showSettleUp, setShowSettleUp] = useState(false);

  const expenseGroups = data.finances?.expenseGroups || [];
  const [newGroup, setNewGroup] = useState({ name: '', icon: '👥', members: [] });
  const [newMemberName, setNewMemberName] = useState('');
  const [newSharedExpense, setNewSharedExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitType: 'equal',
    splits: [],
    date: getToday()
  });

  const groupIcons = ['👥', '🏠', '✈️', '💑', '🎉', '🍽️', '🚗', '🎓', '💼', '👨‍👩‍👧‍👦'];

  const addExpenseGroup = () => {
    if (!newGroup.name || newGroup.members.length < 2) return;
    const group = {
      id: generateId(),
      name: newGroup.name,
      icon: newGroup.icon,
      members: newGroup.members.map((name, i) => ({ id: `m${i}`, name, avatar: name[0].toUpperCase() })),
      expenses: [],
      settlements: [],
      createdAt: getToday()
    };
    setData(prev => ({
      ...prev,
      finances: { ...prev.finances, expenseGroups: [...(prev.finances?.expenseGroups || []), group] }
    }));
    setNewGroup({ name: '', icon: '👥', members: [] });
    setShowAddGroup(false);
    showToast('Grupo creado');
  };

  const deleteExpenseGroup = (groupId) => {
    setData(prev => ({
      ...prev,
      finances: { ...prev.finances, expenseGroups: (prev.finances?.expenseGroups || []).filter(g => g.id !== groupId) }
    }));
    setSelectedGroup(null);
    showToast('Grupo eliminado');
  };

  const addSharedExpense = () => {
    if (!selectedGroup || !newSharedExpense.description || !newSharedExpense.amount || !newSharedExpense.paidBy) return;
    const amount = parseFloat(newSharedExpense.amount);
    const members = selectedGroup.members;
    let splits = [];
    if (newSharedExpense.splitType === 'equal') {
      const splitAmount = amount / members.length;
      splits = members.map(m => ({ memberId: m.id, amount: splitAmount }));
    } else if (newSharedExpense.splitType === 'percent') {
      splits = newSharedExpense.splits.map(s => ({ memberId: s.memberId, amount: (amount * s.percent) / 100 }));
    } else {
      splits = newSharedExpense.splits;
    }
    const expense = { id: generateId(), description: newSharedExpense.description, amount, paidBy: newSharedExpense.paidBy, splitType: newSharedExpense.splitType, splits, date: newSharedExpense.date };
    setData(prev => ({
      ...prev,
      finances: { ...prev.finances, expenseGroups: (prev.finances?.expenseGroups || []).map(g => g.id === selectedGroup.id ? { ...g, expenses: [...g.expenses, expense] } : g) }
    }));
    setSelectedGroup(prev => ({ ...prev, expenses: [...prev.expenses, expense] }));
    setNewSharedExpense({ description: '', amount: '', paidBy: '', splitType: 'equal', splits: [], date: getToday() });
    setShowAddSharedExpense(false);
    showToast('Gasto añadido');
  };

  const calculateBalances = (group) => {
    if (!group) return {};
    const balances = {};
    group.members.forEach(m => { balances[m.id] = 0; });
    group.expenses.forEach(exp => {
      exp.splits.forEach(split => {
        if (split.memberId !== exp.paidBy) {
          balances[exp.paidBy] = (balances[exp.paidBy] || 0) + split.amount;
          balances[split.memberId] = (balances[split.memberId] || 0) - split.amount;
        }
      });
    });
    (group.settlements || []).forEach(s => {
      balances[s.from] = (balances[s.from] || 0) + s.amount;
      balances[s.to] = (balances[s.to] || 0) - s.amount;
    });
    return balances;
  };

  const getDebts = (group) => {
    const balances = calculateBalances(group);
    const debts = [];
    const positive = [], negative = [];
    group.members.forEach(m => {
      const bal = balances[m.id] || 0;
      if (bal > 0.01) positive.push({ member: m, amount: bal });
      else if (bal < -0.01) negative.push({ member: m, amount: Math.abs(bal) });
    });
    positive.forEach(creditor => {
      let remaining = creditor.amount;
      negative.forEach(debtor => {
        if (remaining > 0.01 && debtor.amount > 0.01) {
          const payment = Math.min(remaining, debtor.amount);
          debts.push({ from: debtor.member, to: creditor.member, amount: payment });
          remaining -= payment;
          debtor.amount -= payment;
        }
      });
    });
    return debts;
  };

  const recordSettlement = (groupId, fromId, toId, amount) => {
    const settlement = { id: generateId(), from: fromId, to: toId, amount, date: getToday() };
    setData(prev => ({
      ...prev,
      finances: { ...prev.finances, expenseGroups: (prev.finances?.expenseGroups || []).map(g => g.id === groupId ? { ...g, settlements: [...(g.settlements || []), settlement] } : g) }
    }));
    if (selectedGroup?.id === groupId) setSelectedGroup(prev => ({ ...prev, settlements: [...(prev.settlements || []), settlement] }));
    showToast('Pago registrado');
  };
  // ========== END SHARED EXPENSES ==========

  // ========== A3.2 CONFIGURABLE DASHBOARD ==========
  const [showDashboardSettings, setShowDashboardSettings] = useState(false);

  // Default widget configuration
  const defaultWidgets = [
    { id: 'balance', name: 'Balance General', icon: '💰', visible: true, order: 0 },
    { id: 'actions', name: 'Acciones Rápidas', icon: '⚡', visible: true, order: 1 },
    { id: 'transactions', name: 'Transacciones Recientes', icon: '📝', visible: true, order: 2 },
    { id: 'budgets', name: 'Presupuestos', icon: '📊', visible: true, order: 3 },
    { id: 'goals', name: 'Metas de Ahorro', icon: '🎯', visible: true, order: 4 },
    { id: 'annual', name: 'Gastos Anuales', icon: '📅', visible: true, order: 5 },
    { id: 'review', name: 'Resumen Financiero', icon: '📈', visible: true, order: 6 },
    { id: 'networth', name: 'Patrimonio Neto', icon: '💎', visible: true, order: 7 },
    { id: 'shared', name: 'Gastos Compartidos', icon: '👥', visible: true, order: 8 },
    { id: 'finscore', name: 'FinScore', icon: '🏆', visible: true, order: 9 },
    { id: 'alerts', name: 'Alertas', icon: '🔔', visible: true, order: 10 },
  ];

  const dashboardWidgets = data.finances?.dashboardWidgets || defaultWidgets;
  const sortedWidgets = [...dashboardWidgets].sort((a, b) => a.order - b.order);

  const toggleWidgetVisibility = (widgetId) => {
    const updated = dashboardWidgets.map(w => w.id === widgetId ? { ...w, visible: !w.visible } : w);
    setData(prev => ({ ...prev, finances: { ...prev.finances, dashboardWidgets: updated } }));
  };

  const moveWidget = (widgetId, direction) => {
    const sorted = [...dashboardWidgets].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(w => w.id === widgetId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = sorted[idx].order;
    sorted[idx].order = sorted[swapIdx].order;
    sorted[swapIdx].order = temp;
    setData(prev => ({ ...prev, finances: { ...prev.finances, dashboardWidgets: sorted } }));
  };

  const resetDashboardLayout = () => {
    setData(prev => ({ ...prev, finances: { ...prev.finances, dashboardWidgets: defaultWidgets } }));
    showToast('Dashboard restaurado');
  };

  const isWidgetVisible = (widgetId) => {
    const widget = dashboardWidgets.find(w => w.id === widgetId);
    return widget ? widget.visible : true;
  };
  // ========== END CONFIGURABLE DASHBOARD ==========

  // ========== A3.3 AI COPILOT ==========
  const [showCopilot, setShowCopilot] = useState(false);

  // Generate AI suggestions based on spending patterns
  const getAICopilotSuggestions = () => {
    const suggestions = [];
    const allTransactions = [...personalTransactions, ...businessTransactions];
    const expenses = allTransactions.filter(t => t.type === 'expense');
    const incomes = allTransactions.filter(t => t.type === 'income');

    if (expenses.length === 0) {
      return [{ type: 'info', icon: '💡', title: 'Bienvenido', text: 'Registra tus primeras transacciones para recibir análisis y sugerencias personalizadas.' }];
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

    const currentMonthExpenses = expenses.filter(t => t.date?.startsWith(currentMonth));
    const lastMonthExpenses = expenses.filter(t => t.date?.startsWith(lastMonth));

    const currentTotal = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const lastTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Spending trend analysis
    if (lastTotal > 0 && currentTotal > lastTotal * 1.2) {
      const increase = ((currentTotal - lastTotal) / lastTotal * 100).toFixed(0);
      suggestions.push({
        type: 'warning',
        icon: '📈',
        title: 'Gasto en aumento',
        text: `Tus gastos aumentaron ${increase}% vs mes pasado. Revisa tus categorías.`,
        action: () => setView('list')
      });
    } else if (lastTotal > 0 && currentTotal < lastTotal * 0.8) {
      suggestions.push({
        type: 'success',
        icon: '💪',
        title: '¡Excelente control!',
        text: 'Tus gastos bajaron significativamente. Considera ahorrar la diferencia.'
      });
    }

    // Category analysis - find highest spending category
    const categorySpending = {};
    currentMonthExpenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const [topCat, topAmount] = sortedCategories[0];
      const pctOfTotal = (topAmount / currentTotal * 100).toFixed(0);
      if (pctOfTotal > 40) {
        suggestions.push({
          type: 'insight',
          icon: '🔍',
          title: `${topCat} domina tus gastos`,
          text: `El ${pctOfTotal}% de tus gastos van a ${topCat}. ¿Puedes optimizar aquí?`
        });
      }
    }

    // Recurring expense detection
    const descriptionCounts = {};
    expenses.slice(-50).forEach(t => {
      if (t.description) {
        const key = t.description.toLowerCase().substring(0, 20);
        descriptionCounts[key] = (descriptionCounts[key] || 0) + 1;
      }
    });
    const recurring = Object.entries(descriptionCounts).filter(([_, count]) => count >= 3);
    if (recurring.length > 0) {
      suggestions.push({
        type: 'info',
        icon: '🔄',
        title: 'Gastos recurrentes detectados',
        text: `Detectamos ${recurring.length} patrones de gastos repetidos. Considera automatizarlos.`
      });
    }

    // Savings potential
    const totalIncome = incomes.filter(t => t.date?.startsWith(currentMonth)).reduce((sum, t) => sum + t.amount, 0);
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - currentTotal) / totalIncome * 100).toFixed(0);
      if (savingsRate > 20) {
        suggestions.push({
          type: 'success',
          icon: '🎯',
          title: 'Gran capacidad de ahorro',
          text: `Estás ahorrando ~${savingsRate}% de tus ingresos. ¡Sigue así!`
        });
      } else if (savingsRate > 0 && savingsRate < 10) {
        suggestions.push({
          type: 'warning',
          icon: '💰',
          title: 'Aumenta tus ahorros',
          text: `Solo ahorras ${savingsRate}%. Intenta llegar al 20% para una salud financiera óptima.`
        });
      } else if (savingsRate <= 0) {
        suggestions.push({
          type: 'error',
          icon: '🚨',
          title: 'Gastas más de lo que ganas',
          text: 'Revisa urgentemente tu presupuesto. Tus gastos superan tus ingresos.'
        });
      }
    }

    // Budget compliance suggestions
    Object.entries(categoryBudgets).forEach(([cat, budget]) => {
      const spent = categorySpending[cat] || 0;
      const remaining = budget - spent;
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const dayOfMonth = new Date().getDate();
      const daysRemaining = daysInMonth - dayOfMonth;

      if (remaining > 0 && daysRemaining > 0) {
        const dailyBudget = (remaining / daysRemaining).toFixed(0);
        if (parseFloat(dailyBudget) < 10) {
          suggestions.push({
            type: 'warning',
            icon: '⏰',
            title: `Presupuesto de ${cat} ajustado`,
            text: `Te quedan ${remaining.toFixed(0)}${currency} para ${daysRemaining} días (${dailyBudget}${currency}/día).`
          });
        }
      }
    });

    // If no specific suggestions, provide general tip
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        icon: '✨',
        title: 'Todo en orden',
        text: 'Tus finanzas lucen saludables. Mantén el buen trabajo.'
      });
    }

    return suggestions.slice(0, 6);
  };
  // ========== END AI COPILOT ==========

  // ========== A3.4 AUTOMATIC SAVINGS RULES ==========
  const [showSavingsRules, setShowSavingsRules] = useState(false);
  const [showAddSavingsRule, setShowAddSavingsRule] = useState(false);

  const savingsRules = data.finances?.savingsRules || [];
  const [newSavingsRule, setNewSavingsRule] = useState({
    name: '',
    type: 'fixed', // 'fixed', 'percentage', 'roundup'
    amount: '',
    frequency: 'monthly', // 'daily', 'weekly', 'monthly', 'per-income'
    goalId: '', // optional: link to savings goal
    active: true
  });

  const addSavingsRule = () => {
    if (!newSavingsRule.name || !newSavingsRule.amount) {
      showToast('Completa nombre y monto');
      return;
    }
    const rule = {
      id: generateId(),
      ...newSavingsRule,
      amount: parseFloat(newSavingsRule.amount),
      createdAt: new Date().toISOString(),
      totalSaved: 0,
      lastExecuted: null
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        savingsRules: [...(prev.finances?.savingsRules || []), rule]
      }
    }));
    setNewSavingsRule({ name: '', type: 'fixed', amount: '', frequency: 'monthly', goalId: '', active: true });
    setShowAddSavingsRule(false);
    showToast('Regla de ahorro creada');
  };

  const toggleSavingsRule = (ruleId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        savingsRules: prev.finances.savingsRules.map(r =>
          r.id === ruleId ? { ...r, active: !r.active } : r
        )
      }
    }));
  };

  const executeSavingsRule = (rule) => {
    // Simulate automatic savings transfer
    if (!rule.active) return;

    const targetGoal = savingsGoals.find(g => g.id === rule.goalId);
    if (targetGoal) {
      // Add to linked goal
      setData(prev => ({
        ...prev,
        finances: {
          ...prev.finances,
          savingsGoals: prev.finances.savingsGoals.map(g =>
            g.id === rule.goalId ? { ...g, current: g.current + rule.amount } : g
          ),
          savingsRules: prev.finances.savingsRules.map(r =>
            r.id === rule.id ? { ...r, totalSaved: r.totalSaved + rule.amount, lastExecuted: new Date().toISOString() } : r
          )
        }
      }));
    } else {
      // Just track the savings
      setData(prev => ({
        ...prev,
        finances: {
          ...prev.finances,
          savingsRules: prev.finances.savingsRules.map(r =>
            r.id === rule.id ? { ...r, totalSaved: r.totalSaved + rule.amount, lastExecuted: new Date().toISOString() } : r
          )
        }
      }));
    }
    showToast(`Ahorro de ${rule.amount}${currency} ejecutado`);
  };

  const deleteSavingsRule = (ruleId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        savingsRules: prev.finances.savingsRules.filter(r => r.id !== ruleId)
      }
    }));
    showToast('Regla eliminada');
  };
  // ========== END AUTOMATIC SAVINGS RULES ==========


  // Get suggested category based on description
  const getSuggestedCategory = (description) => {
    if (!description) return null;
    const lowerDesc = description.toLowerCase();
    for (const rule of categorizationRules) {
      const keyword = rule.caseSensitive ? rule.keyword : rule.keyword.toLowerCase();
      const desc = rule.caseSensitive ? description : lowerDesc;
      if (desc.includes(keyword)) {
        return rule.category;
      }
    }
    // Built-in smart rules
    const smartRules = [
      { keywords: ['uber', 'cabify', 'taxi', 'bolt'], category: 'transport' },
      { keywords: ['netflix', 'spotify', 'hbo', 'disney', 'prime'], category: 'entertainment' },
      { keywords: ['mercadona', 'carrefour', 'lidl', 'supermercado'], category: 'food' },
      { keywords: ['amazon', 'aliexpress', 'zara', 'h&m'], category: 'shopping' },
      { keywords: ['gym', 'fitness', 'crossfit'], category: 'health' },
      { keywords: ['gasolina', 'repsol', 'cepsa', 'parking'], category: 'transport' },
      { keywords: ['farmacia', 'medicina', 'doctor'], category: 'health' },
    ];
    for (const rule of smartRules) {
      if (rule.keywords.some(kw => lowerDesc.includes(kw))) {
        return rule.category;
      }
    }
    return null;
  };

  const today = getToday();
  const currency = data.finances?.currency || '€';

  // Mode settings
  const personalEnabled = data.finances?.personalEnabled ?? true;
  const businessEnabled = data.finances?.businessEnabled ?? false;

  // Wallets system
  const wallets = data.finances?.wallets || [{ id: 'main', name: 'Principal', icon: '💰', color: 'violet', isDefault: true }];
  const [activeWallet, setActiveWallet] = useState('all'); // 'all' or wallet.id
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showWalletManager, setShowWalletManager] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: '', icon: '💰', color: 'violet' });
  const walletIcons = ['💰', '🏦', '💳', '👛', '🎒', '✈️', '🏠', '💼', '🎯', '💎'];
  const walletColors = ['violet', 'emerald', 'blue', 'amber', 'rose', 'cyan', 'orange', 'pink'];

  const addWallet = () => {
    if (!newWallet.name) return;
    const wallet = {
      id: generateId(),
      name: newWallet.name,
      icon: newWallet.icon,
      color: newWallet.color,
      isDefault: wallets.length === 0
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        wallets: [...(prev.finances?.wallets || []), wallet]
      }
    }));
    setNewWallet({ name: '', icon: '💰', color: 'violet' });
    setShowAddWallet(false);
    showToast('Billetera creada');
  };

  const deleteWallet = (walletId) => {
    if (walletId === 'main') return; // Can't delete main wallet
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        wallets: (prev.finances?.wallets || []).filter(w => w.id !== walletId)
      }
    }));
    if (activeWallet === walletId) setActiveWallet('all');
    showToast('Billetera eliminada');
  };

  // Transactions by mode (with wallet filter)
  const personalTransactions = data.finances?.personalTransactions || data.finances?.transactions || [];
  const businessTransactions = data.finances?.businessTransactions || [];
  const allModeTransactions = financeMode === 'personal' ? personalTransactions : businessTransactions;
  const transactions = activeWallet === 'all'
    ? allModeTransactions
    : allModeTransactions.filter(t => t.walletId === activeWallet || (!t.walletId && activeWallet === 'main'));

  // Budgets and savings
  const categoryBudgets = data.finances?.categoryBudgets || {};
  const savingsGoals = data.finances?.savingsGoals || [];

  // Generate review data for weekly/monthly summary
  const getReviewData = () => {
    const now = new Date();
    const periodStart = reviewPeriod === 'week'
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const prevPeriodStart = reviewPeriod === 'week'
      ? new Date(periodStart.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevPeriodEnd = periodStart;

    const currentTransactions = (financeMode === 'personal' ? personalTransactions : businessTransactions)
      .filter(t => new Date(t.date) >= periodStart);
    const prevTransactions = (financeMode === 'personal' ? personalTransactions : businessTransactions)
      .filter(t => new Date(t.date) >= prevPeriodStart && new Date(t.date) < prevPeriodEnd);

    const currentIncome = currentTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const currentExpenses = currentTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevIncome = prevTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExpenses = prevTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    // Top categories
    const categoryTotals = {};
    currentTransactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([catId, total]) => {
        const cat = expenseCategories.find(c => c.id === catId) || { name: catId, icon: '📦' };
        return { ...cat, total };
      });

    // Budget compliance from categoryBudgets object
    const budgetCompliance = Object.entries(categoryBudgets)
      .filter(([_, limit]) => limit > 0)
      .map(([category, limit]) => {
        const spent = currentTransactions
          .filter(t => t.type === 'expense' && t.category === category)
          .reduce((s, t) => s + t.amount, 0);
        const projected = reviewPeriod === 'week' ? (spent / 7) * 30 : spent;
        return { id: category, category, limit, spent, projected, percentage: Math.round((projected / limit) * 100) };
      });

    return {
      currentIncome,
      currentExpenses,
      currentBalance: currentIncome - currentExpenses,
      prevIncome,
      prevExpenses,
      incomeChange: prevIncome > 0 ? Math.round(((currentIncome - prevIncome) / prevIncome) * 100) : 0,
      expenseChange: prevExpenses > 0 ? Math.round(((currentExpenses - prevExpenses) / prevExpenses) * 100) : 0,
      transactionCount: currentTransactions.length,
      topCategories,
      budgetCompliance,
      savingsRate: currentIncome > 0 ? Math.round(((currentIncome - currentExpenses) / currentIncome) * 100) : 0
    };
  };

  // Envelopes (Digital Envelope System)
  const envelopes = data.finances?.envelopes || [];
  const envelopeIcons = ['💳', '🏠', '🍔', '🚗', '🎬', '💊', '👕', '🎁', '📱', '✈️'];

  // Subscriptions tracking
  const subscriptions = data.finances?.subscriptions || [];
  const subscriptionCategories = [
    { id: 'streaming', name: 'Streaming', icon: '📺' },
    { id: 'music', name: 'Música', icon: '🎵' },
    { id: 'software', name: 'Software', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'news', name: 'Noticias', icon: '📰' },
    { id: 'cloud', name: 'Almacenamiento', icon: '☁️' },
    { id: 'other', name: 'Otros', icon: '📦' }
  ];

  // Emergency fund
  const emergencyFund = data.finances?.emergencyFund || { targetMonths: 6, currentAmount: 0 };

  // Tax settings
  const taxSettings = data.finances?.taxSettings || { ivaRate: 21, irpfRate: 15, reservePercentage: 30 };

  // Personal expense categories
  const personalExpenseCategories = [
    { id: 'food', name: 'Comida', icon: '🍽️', color: 'orange' },
    { id: 'transport', name: 'Transporte', icon: '🚗', color: 'blue' },
    { id: 'shopping', name: 'Compras', icon: '🛒', color: 'pink' },
    { id: 'entertainment', name: 'Ocio', icon: '🎬', color: 'purple' },
    { id: 'health', name: 'Salud', icon: '💊', color: 'emerald' },
    { id: 'home', name: 'Hogar', icon: '🏠', color: 'yellow' },
    { id: 'subscriptions', name: 'Suscripciones', icon: '📱', color: 'indigo' },
    { id: 'other', name: 'Otros', icon: '📦', color: 'gray' },
  ];

  const personalIncomeCategories = [
    { id: 'salary', name: 'Salario', icon: '💼', color: 'emerald' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: 'blue' },
    { id: 'investment', name: 'Inversiones', icon: '📈', color: 'green' },
    { id: 'gift', name: 'Regalo', icon: '🎁', color: 'pink' },
    { id: 'other', name: 'Otros', icon: '💰', color: 'gray' },
  ];

  // Business categories
  const businessExpenseCategories = [
    { id: 'software', name: 'Software', icon: '💻', color: 'blue' },
    { id: 'marketing', name: 'Marketing', icon: '📣', color: 'pink' },
    { id: 'equipment', name: 'Equipamiento', icon: '🖥️', color: 'gray' },
    { id: 'training', name: 'Formación', icon: '📚', color: 'purple' },
    { id: 'office', name: 'Oficina', icon: '🏢', color: 'yellow' },
    { id: 'services', name: 'Servicios', icon: '🔧', color: 'orange' },
    { id: 'travel', name: 'Viajes trabajo', icon: '✈️', color: 'cyan' },
    { id: 'taxes', name: 'Impuestos', icon: '🏛️', color: 'red' },
    { id: 'other', name: 'Otros', icon: '📦', color: 'gray' },
  ];

  const businessIncomeCategories = [
    { id: 'project', name: 'Proyecto', icon: '🎯', color: 'emerald' },
    { id: 'consulting', name: 'Consultoría', icon: '💡', color: 'yellow' },
    { id: 'product', name: 'Producto', icon: '📦', color: 'blue' },
    { id: 'recurring', name: 'Recurrente', icon: '🔄', color: 'purple' },
    { id: 'other', name: 'Otros', icon: '💰', color: 'gray' },
  ];

  const expenseCategories = financeMode === 'personal' ? personalExpenseCategories : businessExpenseCategories;
  const incomeCategories = financeMode === 'personal' ? personalIncomeCategories : businessIncomeCategories;
  const savingIcons = ['🎯', '✈️', '🏠', '🚗', '💻', '📚', '💍', '🎓', '🏖️', '💰', '🛡️'];

  // Calculations
  const thisMonth = today.substring(0, 7);
  const lastMonth = getDateOffset(today, -30).substring(0, 7);
  const monthTransactions = transactions.filter(t => t.date?.startsWith(thisMonth));
  const lastMonthTransactions = transactions.filter(t => t.date?.startsWith(lastMonth));
  const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastMonthExpenses = lastMonthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthBalance = monthIncome - monthExpenses;

  // Average monthly expenses (for emergency fund)
  const allMonths = [...new Set(personalTransactions.map(t => t.date?.substring(0, 7)))].filter(Boolean);
  const avgMonthlyExpense = allMonths.length > 0
    ? personalTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / Math.max(allMonths.length, 1)
    : 2000;
  const emergencyMonthsCovered = avgMonthlyExpense > 0 ? emergencyFund.currentAmount / avgMonthlyExpense : 0;

  // Business calculations
  const businessMonthIncome = businessTransactions.filter(t => t.date?.startsWith(thisMonth) && t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const businessMonthExpenses = businessTransactions.filter(t => t.date?.startsWith(thisMonth) && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const taxReserve = businessMonthIncome * (taxSettings.reservePercentage / 100);
  const netProfit = businessMonthIncome - businessMonthExpenses - taxReserve;

  // By category this month
  const expensesByCategory = expenseCategories.map(cat => ({
    ...cat,
    total: monthTransactions.filter(t => t.type === 'expense' && t.category === cat.id).reduce((s, t) => s + t.amount, 0),
    budget: categoryBudgets[cat.id] || 0
  })).filter(c => c.total > 0 || c.budget > 0).sort((a, b) => b.total - a.total);

  // Insights - Enhanced AI-style feedback
  const getInsights = () => {
    const insights = [];

    if (financeMode === 'personal') {
      // Emergency fund alert
      if (emergencyMonthsCovered < emergencyFund.targetMonths && emergencyFund.currentAmount > 0) {
        const toGo = ((emergencyFund.targetMonths - emergencyMonthsCovered) * avgMonthlyExpense).toFixed(0);
        insights.push({
          type: 'info',
          icon: '🛡️',
          text: `Colchón: ${emergencyMonthsCovered.toFixed(1)}/${emergencyFund.targetMonths} meses. Faltan ${toGo}${currency}`
        });
      } else if (emergencyMonthsCovered >= emergencyFund.targetMonths) {
        insights.push({
          type: 'success',
          icon: '🛡️',
          text: `¡Colchón completo! ${emergencyMonthsCovered.toFixed(1)} meses cubiertos`
        });
      }

      // Compare to last month - with call-to-action
      if (lastMonthExpenses > 0) {
        const diff = ((monthExpenses - lastMonthExpenses) / lastMonthExpenses * 100);
        if (diff > 20) {
          insights.push({
            type: 'warning',
            icon: '📈',
            text: `Gastas ${diff.toFixed(0)}% más que el mes pasado`,
            action: { label: 'Ver historial', tab: 'history' }
          });
        } else if (diff < -10) {
          insights.push({ type: 'success', icon: '🎉', text: `¡Gastas ${Math.abs(diff).toFixed(0)}% menos que el mes pasado!` });
        }
      }

      // Unusual single transaction detection
      if (monthTransactions.length > 5) {
        const expenses = monthTransactions.filter(t => t.type === 'expense').map(t => t.amount);
        const avgTransaction = expenses.reduce((a, b) => a + b, 0) / expenses.length;
        const unusualTx = monthTransactions.find(t => t.type === 'expense' && t.amount > avgTransaction * 3 && t.amount > 100);
        if (unusualTx) {
          const cat = getCategoryInfo(unusualTx.category, 'expense');
          insights.push({
            type: 'warning',
            icon: '⚡',
            text: `Gasto inusual: ${unusualTx.amount}${currency} en ${cat.name}`,
            action: { label: 'Revisar', tab: 'history' }
          });
        }
      }

      // Top spending category
      if (expensesByCategory.length > 0) {
        const top = expensesByCategory[0];
        const topPct = monthExpenses > 0 ? ((top.total / monthExpenses) * 100).toFixed(0) : 0;
        if (topPct > 40) {
          insights.push({
            type: 'info',
            icon: top.icon,
            text: `${topPct}% de tus gastos son en ${top.name}: ${top.total.toLocaleString()}${currency}`
          });
        }
      }

      // Daily spending average
      const dayOfMonth = new Date().getDate();
      const avgDaily = monthExpenses / dayOfMonth;
      const projectedMonthTotal = avgDaily * 30;
      if (monthExpenses > 500 && projectedMonthTotal > monthIncome * 1.1) {
        insights.push({
          type: 'warning',
          icon: '📊',
          text: `A este ritmo gastarás ${projectedMonthTotal.toFixed(0)}${currency} este mes (${avgDaily.toFixed(0)}${currency}/día)`
        });
      }

      // Savings rate
      if (monthIncome > 0 && monthExpenses > 0) {
        const savingsRate = ((monthIncome - monthExpenses) / monthIncome * 100);
        if (savingsRate >= 20) {
          insights.push({
            type: 'success',
            icon: '💰',
            text: `Tasa de ahorro: ${savingsRate.toFixed(0)}% ¡Excelente!`
          });
        } else if (savingsRate < 0) {
          insights.push({
            type: 'error',
            icon: '💸',
            text: `Gastas más de lo que ingresas. Déficit: ${Math.abs(monthBalance).toFixed(0)}${currency}`
          });
        }
      }

      // Subscription detection - check for recurring payments
      const subscriptions = personalTransactions.filter(t => t.category === 'subscriptions');
      if (subscriptions.length > 0) {
        const monthlySubCost = monthTransactions.filter(t => t.category === 'subscriptions').reduce((s, t) => s + t.amount, 0);
        if (monthlySubCost > 0) {
          insights.push({
            type: 'info',
            icon: '📱',
            text: `Suscripciones este mes: ${monthlySubCost.toFixed(0)}${currency}. Anual: ${(monthlySubCost * 12).toFixed(0)}${currency}`
          });
        }
      }

      // Weekend spending pattern
      const weekendTransactions = monthTransactions.filter(t => {
        const day = new Date(t.date).getDay();
        return day === 0 || day === 6;
      });
      const weekendTotal = weekendTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      if (weekendTotal > monthExpenses * 0.4 && monthExpenses > 200) {
        insights.push({
          type: 'info',
          icon: '🎭',
          text: `${((weekendTotal / monthExpenses) * 100).toFixed(0)}% de tus gastos son en fines de semana`
        });
      }

    } else {
      // Business insights
      if (businessMonthIncome > 0) {
        insights.push({ type: 'info', icon: '💰', text: `Reserva impuestos: ${taxReserve.toLocaleString()}${currency} (${taxSettings.reservePercentage}%)` });

        // Profit margin
        const margin = ((netProfit / businessMonthIncome) * 100);
        if (margin > 50) {
          insights.push({ type: 'success', icon: '📈', text: `Margen de beneficio: ${margin.toFixed(0)}% ¡Excelente!` });
        } else if (margin < 20 && margin > 0) {
          insights.push({ type: 'warning', icon: '⚠️', text: `Margen bajo: ${margin.toFixed(0)}%. Revisa gastos` });
        }
      }
      if (netProfit > 0) {
        insights.push({ type: 'success', icon: '📊', text: `Beneficio neto: +${netProfit.toLocaleString()}${currency}` });
      } else if (netProfit < 0) {
        insights.push({ type: 'error', icon: '📉', text: `Pérdida este mes: ${netProfit.toLocaleString()}${currency}` });
      }
    }

    // Budget alerts (both modes)
    expensesByCategory.forEach(cat => {
      if (cat.budget > 0) {
        const pct = (cat.total / cat.budget) * 100;
        if (pct >= 100) {
          insights.push({ type: 'error', icon: '🚨', text: `¡Superaste el presupuesto de ${cat.name}! ${cat.total.toFixed(0)}/${cat.budget}${currency}` });
        } else if (pct >= 80) {
          insights.push({ type: 'warning', icon: '⚠️', text: `${cat.name}: ${pct.toFixed(0)}% usado. Quedan ${(cat.budget - cat.total).toFixed(0)}${currency}` });
        }
      }
    });

    return insights.slice(0, 4);
  };

  const insights = getInsights();

  // Toggle mode
  const toggleMode = (mode) => {
    setFinanceMode(mode);
    setView('home');
  };

  // Actions
  const saveTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      showToast('Completa los campos');
      return;
    }
    const transaction = {
      id: generateId(),
      type: transactionType,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      notes: newTransaction.notes,
      tags: newTransaction.tags || [],
      client: newTransaction.client,
      date: newTransaction.date,
      walletId: newTransaction.walletId || (activeWallet !== 'all' ? activeWallet : 'main')
    };

    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: [...(prev.finances?.[transactionKey] || []), transaction]
      }
    }));
    setShowAdd(false);
    setNewTransaction({ amount: '', category: '', description: '', notes: '', tags: [], date: getToday(), client: '', walletId: '' });
    setTagInput('');
    showToast(transactionType === 'expense' ? 'Gasto registrado' : 'Ingreso registrado');
  };

  const deleteTransaction = (id) => {
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].filter(t => t.id !== id)
      }
    }));
    showToast('Eliminado');
  };

  // Split transaction functions
  const openSplitModal = (transaction) => {
    setSplitTransaction(transaction);
    setSplits([{ category: '', amount: '', description: '' }]);
    setShowSplitModal(true);
  };

  const addSplitRow = () => {
    setSplits(prev => [...prev, { category: '', amount: '', description: '' }]);
  };

  const removeSplitRow = (index) => {
    if (splits.length > 1) {
      setSplits(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSplit = (index, field, value) => {
    setSplits(prev => prev.map((split, i) => i === index ? { ...split, [field]: value } : split));
  };

  const saveSplitTransaction = () => {
    if (!splitTransaction) return;
    const validSplits = splits.filter(s => s.category && parseFloat(s.amount) > 0);
    if (validSplits.length === 0) {
      showToast('Añade al menos un split válido');
      return;
    }
    const totalSplit = validSplits.reduce((sum, s) => sum + parseFloat(s.amount), 0);
    if (Math.abs(totalSplit - splitTransaction.amount) > 0.01) {
      showToast(`Total splits (${totalSplit}${currency}) ≠ Original (${splitTransaction.amount}${currency})`);
      return;
    }

    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';

    // Update original transaction with splits array
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].map(t =>
          t.id === splitTransaction.id
            ? { ...t, splits: validSplits.map(s => ({ ...s, amount: parseFloat(s.amount) })) }
            : t
        )
      }
    }));

    setShowSplitModal(false);
    setSplitTransaction(null);
    setSplits([{ category: '', amount: '', description: '' }]);
    showToast('Transacción dividida');
  };

  // Annual expenses CRUD
  const addAnnualExpense = () => {
    if (!newAnnualExpense.name || !newAnnualExpense.amount) {
      showToast('Completa nombre y monto');
      return;
    }
    const expense = {
      id: `annual-${Date.now()}`,
      ...newAnnualExpense,
      amount: parseFloat(newAnnualExpense.amount),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        annualExpenses: [...(prev.finances.annualExpenses || []), expense]
      }
    }));
    setShowAddAnnualExpense(false);
    setNewAnnualExpense({ name: '', amount: '', frequency: 'yearly', category: 'other', nextDueDate: '', icon: '📅' });
    showToast('Gasto no mensual añadido');
  };

  const deleteAnnualExpense = (id) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        annualExpenses: prev.finances.annualExpenses.filter(e => e.id !== id)
      }
    }));
    showToast('Eliminado');
  };

  // Net Worth CRUD
  const addAsset = () => {
    if (!newAsset.name || !newAsset.value) {
      showToast('Completa nombre y valor');
      return;
    }
    const asset = {
      id: `asset-${Date.now()}`,
      ...newAsset,
      value: parseFloat(newAsset.value),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        assets: [...(prev.finances.assets || []), asset]
      }
    }));
    setShowAddAsset(false);
    setNewAsset({ name: '', value: '', category: 'cash', icon: '💰' });
    showToast('Activo añadido');
  };

  const deleteAsset = (id) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        assets: prev.finances.assets.filter(a => a.id !== id)
      }
    }));
    showToast('Eliminado');
  };

  const addLiability = () => {
    if (!newLiability.name || !newLiability.value) {
      showToast('Completa nombre y valor');
      return;
    }
    const liability = {
      id: `liability-${Date.now()}`,
      ...newLiability,
      value: parseFloat(newLiability.value),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        liabilities: [...(prev.finances.liabilities || []), liability]
      }
    }));
    setShowAddLiability(false);
    setNewLiability({ name: '', value: '', category: 'debt', icon: '💳' });
    showToast('Pasivo añadido');
  };

  const deleteLiability = (id) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        liabilities: prev.finances.liabilities.filter(l => l.id !== id)
      }
    }));
    showToast('Eliminado');
  };

  // Bulk edit functions
  const toggleTransactionSelection = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const selectAllTransactions = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  const bulkChangeCategory = () => {
    if (!bulkCategory || selectedTransactions.length === 0) return;
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].map(t =>
          selectedTransactions.includes(t.id) ? { ...t, category: bulkCategory } : t
        )
      }
    }));
    showToast(`Categoría cambiada en ${selectedTransactions.length} transacciones`);
    setSelectedTransactions([]);
    setBulkEditMode(false);
    setShowBulkActions(false);
    setBulkCategory('');
  };

  const bulkAddTag = () => {
    if (!bulkTag || selectedTransactions.length === 0) return;
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].map(t =>
          selectedTransactions.includes(t.id)
            ? { ...t, tags: [...(t.tags || []), bulkTag.toLowerCase()].filter((v, i, a) => a.indexOf(v) === i) }
            : t
        )
      }
    }));
    showToast(`Tag añadido a ${selectedTransactions.length} transacciones`);
    setSelectedTransactions([]);
    setBulkEditMode(false);
    setShowBulkActions(false);
    setBulkTag('');
  };

  const bulkChangeType = (newType) => {
    if (!newType || selectedTransactions.length === 0) return;
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].map(t =>
          selectedTransactions.includes(t.id)
            ? { ...t, type: newType }
            : t
        )
      }
    }));
    showToast(`Tipo cambiado a ${newType === 'income' ? 'Ingreso' : 'Gasto'} en ${selectedTransactions.length} transacciones`);
    setSelectedTransactions([]);
    setBulkEditMode(false);
    setShowBulkActions(false);
  };

  const bulkRemoveTag = (tagToRemove) => {
    if (!tagToRemove || selectedTransactions.length === 0) return;
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].map(t =>
          selectedTransactions.includes(t.id)
            ? { ...t, tags: (t.tags || []).filter(tag => tag !== tagToRemove) }
            : t
        )
      }
    }));
    showToast(`Tag "${tagToRemove}" eliminado de ${selectedTransactions.length} transacciones`);
  };

  const bulkClearTags = () => {
    if (selectedTransactions.length === 0) return;
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].map(t =>
          selectedTransactions.includes(t.id)
            ? { ...t, tags: [] }
            : t
        )
      }
    }));
    showToast(`Tags eliminados de ${selectedTransactions.length} transacciones`);
    setSelectedTransactions([]);
    setBulkEditMode(false);
    setShowBulkActions(false);
  };

  const bulkDeleteTransactions = () => {
    if (selectedTransactions.length === 0) return;
    const transactionKey = financeMode === 'personal' ? 'personalTransactions' : 'businessTransactions';
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        [transactionKey]: prev.finances[transactionKey].filter(t => !selectedTransactions.includes(t.id))
      }
    }));
    showToast(`${selectedTransactions.length} transacciones eliminadas`);
    setSelectedTransactions([]);
    setBulkEditMode(false);
    setShowBulkActions(false);
  };

  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    setSelectedTransactions([]);
    setShowBulkActions(false);
    setBulkCategory('');
    setBulkTag('');
  };

  // Categorization rule handlers
  const addCategorizationRule = () => {
    if (!newRule.keyword || !newRule.category) {
      showToast('Completa keyword y categoría');
      return;
    }
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        categorizationRules: [...(prev.finances?.categorizationRules || []), {
          id: generateId(),
          ...newRule
        }]
      }
    }));
    setNewRule({ keyword: '', category: '', caseSensitive: false });
    setShowAddRule(false);
    showToast('Regla creada');
  };

  const deleteCategorizationRule = (id) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        categorizationRules: prev.finances.categorizationRules.filter(r => r.id !== id)
      }
    }));
    showToast('Regla eliminada');
  };

  const updateCategoryBudget = (categoryId, amount) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        categoryBudgets: {
          ...prev.finances?.categoryBudgets,
          [categoryId]: parseFloat(amount) || 0
        }
      }
    }));
  };

  const addSavingGoal = () => {
    if (!newSavingGoal.name || !newSavingGoal.targetAmount) {
      showToast('Completa nombre y cantidad');
      return;
    }
    const goal = {
      id: generateId(),
      name: newSavingGoal.name,
      icon: newSavingGoal.icon,
      targetAmount: parseFloat(newSavingGoal.targetAmount),
      targetDate: newSavingGoal.targetDate,
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        savingsGoals: [...(prev.finances?.savingsGoals || []), goal]
      }
    }));
    setShowAddSaving(false);
    setNewSavingGoal({ name: '', targetAmount: '', targetDate: '', icon: '🎯' });
    showToast('Meta de ahorro creada');
  };

  const addToSaving = (goalId, amount) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        savingsGoals: prev.finances.savingsGoals.map(g =>
          g.id === goalId ? { ...g, currentAmount: (g.currentAmount || 0) + parseFloat(amount) } : g
        )
      }
    }));
    showToast(`+${amount}${currency} añadido`);
  };

  const deleteSavingGoal = (goalId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        savingsGoals: prev.finances.savingsGoals.filter(g => g.id !== goalId)
      }
    }));
    showToast('Meta eliminada');
  };

  const updateEmergencyFund = (field, value) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        emergencyFund: {
          ...prev.finances?.emergencyFund,
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const addToEmergencyFund = (amount) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        emergencyFund: {
          ...prev.finances?.emergencyFund,
          currentAmount: (prev.finances?.emergencyFund?.currentAmount || 0) + parseFloat(amount)
        }
      }
    }));
    showToast(`+${amount}${currency} añadido al colchón`);
  };

  const updateTaxSettings = (field, value) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        taxSettings: {
          ...prev.finances?.taxSettings,
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  // ===== ENVELOPE SYSTEM HANDLERS =====
  const addEnvelope = () => {
    if (!newEnvelope.name || !newEnvelope.budgetAmount) {
      showToast('Completa nombre y cantidad');
      return;
    }
    const envelope = {
      id: generateId(),
      name: newEnvelope.name,
      icon: newEnvelope.icon,
      budgetAmount: parseFloat(newEnvelope.budgetAmount),
      currentAmount: parseFloat(newEnvelope.budgetAmount), // Start full
      spent: 0
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        envelopes: [...(prev.finances?.envelopes || []), envelope]
      }
    }));
    setShowAddEnvelope(false);
    setNewEnvelope({ name: '', budgetAmount: '', icon: '💳' });
    showToast('Sobre creado');
  };

  const spendFromEnvelope = (envelopeId, amount) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        envelopes: prev.finances.envelopes.map(e =>
          e.id === envelopeId
            ? { ...e, currentAmount: Math.max(0, e.currentAmount - parseFloat(amount)), spent: (e.spent || 0) + parseFloat(amount) }
            : e
        )
      }
    }));
    showToast(`-${amount}${currency}`);
  };

  const refillEnvelope = (envelopeId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        envelopes: prev.finances.envelopes.map(e =>
          e.id === envelopeId
            ? { ...e, currentAmount: e.budgetAmount, spent: 0 }
            : e
        )
      }
    }));
    showToast('Sobre rellenado');
  };

  const deleteEnvelope = (envelopeId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        envelopes: prev.finances.envelopes.filter(e => e.id !== envelopeId)
      }
    }));
    showToast('Sobre eliminado');
  };

  // ===== SUBSCRIPTION HANDLERS =====
  const addSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount) {
      showToast('Completa nombre y cantidad');
      return;
    }
    const subscription = {
      id: generateId(),
      name: newSubscription.name,
      amount: parseFloat(newSubscription.amount),
      billingCycle: newSubscription.billingCycle,
      category: newSubscription.category,
      nextBillingDate: newSubscription.nextBillingDate,
      active: true,
      markedForCancel: false
    };
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        subscriptions: [...(prev.finances?.subscriptions || []), subscription]
      }
    }));
    setShowAddSubscription(false);
    setNewSubscription({ name: '', amount: '', billingCycle: 'monthly', category: 'streaming', nextBillingDate: getToday() });
    showToast('Suscripción añadida');
  };

  const toggleSubscriptionCancel = (subscriptionId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        subscriptions: prev.finances.subscriptions.map(s =>
          s.id === subscriptionId ? { ...s, markedForCancel: !s.markedForCancel } : s
        )
      }
    }));
  };

  const deleteSubscription = (subscriptionId) => {
    setData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        subscriptions: prev.finances.subscriptions.filter(s => s.id !== subscriptionId)
      }
    }));
    showToast('Suscripción eliminada');
  };

  // Calculate subscription costs
  const monthlySubscriptionTotal = subscriptions.filter(s => s.active && !s.markedForCancel).reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.amount;
    if (s.billingCycle === 'yearly') return sum + (s.amount / 12);
    if (s.billingCycle === 'weekly') return sum + (s.amount * 4);
    return sum;
  }, 0);

  const yearlySubscriptionTotal = monthlySubscriptionTotal * 12;

  // ===== FINSCORE CALCULATION =====
  const calculateFinScore = () => {
    let score = 0;
    let factors = [];

    // Factor 1: Savings rate (max 25 points)
    if (monthIncome > 0) {
      const savingsRate = (monthIncome - monthExpenses) / monthIncome;
      const savingsPoints = Math.min(25, Math.max(0, savingsRate * 50));
      score += savingsPoints;
      if (savingsRate >= 0.2) factors.push({ label: 'Tasa ahorro >20%', points: savingsPoints, positive: true });
      else if (savingsRate < 0) factors.push({ label: 'Gastas más que ingresas', points: 0, positive: false });
    } else {
      score += 10; // No income data yet
    }

    // Factor 2: Emergency fund (max 25 points)
    const targetMonths = emergencyFund?.targetMonths || 6;
    const emergencyRelative = targetMonths > 0 ? (emergencyMonthsCovered / targetMonths) : 0;
    const emergencyPoints = Math.min(25, Math.max(0, emergencyRelative * 25));
    score += emergencyPoints;
    if (emergencyPoints >= 20) factors.push({ label: 'Fondo emergencia OK', points: emergencyPoints, positive: true });
    else if (emergencyPoints < 10) factors.push({ label: 'Fondo emergencia bajo', points: emergencyPoints, positive: false });

    // Factor 3: Budget adherence (max 25 points)
    const budgetedCategories = Object.keys(categoryBudgets || {}).filter(k => categoryBudgets[k] > 0);
    if (budgetedCategories.length > 0) {
      let withinBudget = 0;
      budgetedCategories.forEach(catId => {
        const spent = monthTransactions.filter(t => t.type === 'expense' && t.category === catId).reduce((s, t) => s + t.amount, 0);
        if (spent <= categoryBudgets[catId]) withinBudget++;
      });
      const budgetPoints = (withinBudget / budgetedCategories.length) * 25;
      score += budgetPoints;
      if (budgetPoints >= 20) factors.push({ label: 'Presupuestos OK', points: budgetPoints, positive: true });
    } else {
      // Bonus for having budgets set up
      score += 10;
    }

    // Factor 4: Spending trend (max 25 points)
    if (lastMonthExpenses > 0) {
      const trend = (monthExpenses - lastMonthExpenses) / lastMonthExpenses;
      if (trend <= 0) {
        score += 25;
        factors.push({ label: 'Gastos estables/bajando', points: 25, positive: true });
      } else if (trend < 0.2) {
        score += 15;
      } else {
        factors.push({ label: 'Gastos subiendo', points: 0, positive: false });
      }
    } else {
      score += 15; // First month
    }

    return { score: Math.round(Math.min(100, Math.max(0, score))) || 0, factors };
  };

  const finScore = calculateFinScore();

  const getCategoryInfo = (categoryId, type) => {
    const cats = type === 'expense' ? expenseCategories : incomeCategories;
    return cats.find(c => c.id === categoryId) || { icon: '💰', name: categoryId, color: 'gray' };
  };

  // Navigation tabs
  const personalTabs = [
    { id: 'home', label: 'Inicio', icon: '📊' },
    { id: 'envelopes', label: 'Sobres', icon: '💌' },
    { id: 'subscriptions', label: 'Suscripc.', icon: '📱' },
    { id: 'savings', label: 'Ahorros', icon: '🐷' },
    { id: 'history', label: 'Historial', icon: '📋' },
  ];

  const businessTabs = [
    { id: 'home', label: 'Resumen', icon: '📊' },
    { id: 'income', label: 'Ingresos', icon: '💰' },
    { id: 'expenses', label: 'Gastos', icon: '💸' },
    { id: 'taxes', label: 'Impuestos', icon: '🏛️' },
  ];

  const tabs = financeMode === 'personal' ? personalTabs : businessTabs;

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <AnimatedMount>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finanzas</h1>
            <p className="text-white/50 text-sm">{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDashboardSettings(true)} className="p-3 hover:bg-white/10 rounded-full" title="Configurar Dashboard">
              <span className="text-lg">⚙️</span>
            </button>
            <button onClick={() => setShowSettings(true)} className="p-3 hover:bg-white/10 rounded-full">
              <Settings className="w-5 h-5 text-white/50" />
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-violet-500 rounded-full p-3">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AnimatedMount>

      {/* Mode Toggle */}
      {(personalEnabled && businessEnabled) && (
        <AnimatedMount delay={25}>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => toggleMode('personal')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${financeMode === 'personal' ? 'bg-emerald-500' : 'hover:bg-white/10'}`}
            >
              <span>👤</span> Personal
            </button>
            <button
              onClick={() => toggleMode('business')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${financeMode === 'business' ? 'bg-violet-500' : 'hover:bg-white/10'}`}
            >
              <span>💼</span> Empresa
            </button>
          </div>
        </AnimatedMount>
      )}

      {/* Tabs */}
      <AnimatedMount delay={50}>
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${view === tab.id ? 'bg-violet-500' : 'hover:bg-white/10'}`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </AnimatedMount>

      {/* PERSONAL MODE */}
      {financeMode === 'personal' && (
        <>
          {/* HOME VIEW */}
          {view === 'home' && (
            <>
              {/* ═══════════════ HERO: BALANCE PRINCIPAL ═══════════════ */}
              <AnimatedMount delay={50}>
                <div className={`p-6 rounded-2xl mb-6 ${monthBalance >= 0
                  ? 'bg-gradient-to-br from-emerald-600/30 via-emerald-500/20 to-teal-500/10'
                  : 'bg-gradient-to-br from-red-600/30 via-red-500/20 to-orange-500/10'}`}
                  style={{ backdropFilter: 'blur(20px)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60">Balance del mes</span>
                    <span className="text-xs text-white/40">{new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <p className={`text-4xl font-bold tracking-tight ${monthBalance >= 0 ? 'text-white' : 'text-red-300'}`}>
                    {monthBalance >= 0 ? '+' : ''}{monthBalance.toLocaleString()}<span className="text-2xl opacity-60">{currency}</span>
                  </p>

                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm text-white/70">Ingresos</span>
                      <span className="text-sm font-medium text-emerald-400">+{monthIncome.toLocaleString()}{currency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-sm text-white/70">Gastos</span>
                      <span className="text-sm font-medium text-red-400">-{monthExpenses.toLocaleString()}{currency}</span>
                    </div>
                  </div>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10">
                    <button onClick={() => setShowReview(true)} className="text-center hover:bg-white/5 rounded-xl p-2 transition-all">
                      <p className="text-xl font-bold">{finScore.score}</p>
                      <p className="text-[10px] text-white/50">FinScore</p>
                    </button>
                    <button onClick={() => setShowNetWorth(true)} className="text-center hover:bg-white/5 rounded-xl p-2 transition-all">
                      <p className={`text-xl font-bold ${netWorth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {netWorth >= 0 ? '+' : ''}{(netWorth / 1000).toFixed(0)}k
                      </p>
                      <p className="text-[10px] text-white/50">Patrimonio</p>
                    </button>
                    <button onClick={() => setShowEmergencyFund(true)} className="text-center hover:bg-white/5 rounded-xl p-2 transition-all">
                      <p className="text-xl font-bold">{emergencyMonthsCovered.toFixed(1)}</p>
                      <p className="text-[10px] text-white/50">Meses cubiertos</p>
                    </button>
                  </div>
                </div>
              </AnimatedMount>

              {/* ═══════════════ INSIGHTS/ALERTAS ═══════════════ */}
              {insights.length > 0 && (
                <AnimatedMount delay={75}>
                  <div className="mb-4">
                    {insights.slice(0, 2).map((insight, i) => (
                      <div key={i} className={`p-3 rounded-xl flex items-center gap-3 mb-2 ${insight.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                        insight.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                          insight.type === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                            'bg-white/5 border border-white/10'
                        }`}>
                        <span className="text-lg">{insight.icon}</span>
                        <p className="text-sm flex-1 text-white/80">{insight.text}</p>
                        {insight.action && (
                          <button onClick={() => setView(insight.action.tab)} className="text-xs px-2 py-1 bg-white/10 rounded-lg">
                            {insight.action.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </AnimatedMount>
              )}

              {/* ═══════════════ ACCESO RÁPIDO GRID ═══════════════ */}
              <AnimatedMount delay={100}>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { icon: '📊', label: 'Resumen', action: () => setShowReview(true) },
                    { icon: '🤖', label: 'Copiloto', action: () => setShowCopilot(true) },
                    { icon: '👥', label: 'Grupos', action: () => setShowSharedExpenses(true), badge: expenseGroups.length || null },
                    { icon: '💳', label: 'Billeteras', action: () => setShowWalletManager(true) },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="relative flex flex-col items-center py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-[10px] text-white/60">{item.label}</span>
                      {item.badge && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-violet-500 rounded-full text-[9px] flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </AnimatedMount>

              {/* ═══════════════ GASTOS POR CATEGORÍA ═══════════════ */}
              {expensesByCategory.length > 0 && (() => {
                const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
                let cumulativePercent = 0;
                const segments = expensesByCategory.slice(0, 6).map((cat, i) => {
                  const percent = monthExpenses > 0 ? (cat.total / monthExpenses) * 100 : 0;
                  const startPercent = cumulativePercent;
                  cumulativePercent += percent;
                  return { ...cat, percent, startPercent, color: colors[i % colors.length] };
                });

                return (
                  <AnimatedMount delay={125}>
                    <div className="p-4 bg-white/5 rounded-2xl mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-medium text-sm">Gastos por categoría</p>
                        <button onClick={() => setView('budgets')} className="text-xs text-violet-400">
                          Ver presupuestos
                        </button>
                      </div>
                      <div className="flex gap-4">
                        {/* Mini Pie */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                            {segments.map((seg) => (
                              <circle
                                key={seg.id}
                                cx="18" cy="18" r="14"
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth="5"
                                strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
                                strokeDashoffset={100 - seg.startPercent}
                              />
                            ))}
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-medium">{monthExpenses.toLocaleString()}</span>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5">
                          {segments.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                              <span className="text-[10px] text-white/60 truncate flex-1">{cat.name}</span>
                              <span className="text-[10px] font-medium">{cat.percent.toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AnimatedMount>
                );
              })()}

              {/* ═══════════════ HERRAMIENTAS FINANCIERAS ═══════════════ */}
              <AnimatedMount delay={150}>
                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3 px-1">Herramientas</p>
                  <div className="space-y-2">
                    {/* Ahorro Automático */}
                    <button
                      onClick={() => setShowSavingsRules(true)}
                      className="w-full p-3.5 bg-white/5 hover:bg-white/8 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <span className="text-xl">🎯</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Ahorro Automático</p>
                        <p className="text-[10px] text-white/40">
                          {savingsRules.filter(r => r.active).length > 0
                            ? `${savingsRules.filter(r => r.active).length} reglas activas`
                            : 'Configura reglas de ahorro'}
                        </p>
                      </div>
                      {savingsRules.reduce((sum, r) => sum + (r.totalSaved || 0), 0) > 0 && (
                        <span className="text-xs text-emerald-400">{savingsRules.reduce((sum, r) => sum + (r.totalSaved || 0), 0).toLocaleString()}{currency}</span>
                      )}
                    </button>

                    {/* Gastos No Mensuales */}
                    <button
                      onClick={() => annualExpenses.length > 0 ? setShowAnnualExpenses(true) : setShowAddAnnualExpense(true)}
                      className="w-full p-3.5 bg-white/5 hover:bg-white/8 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <span className="text-xl">📅</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Gastos Periódicos</p>
                        <p className="text-[10px] text-white/40">
                          {annualExpenses.length > 0
                            ? `${annualExpenses.length} gastos prorrateados`
                            : 'Añade seguros, impuestos, etc.'}
                        </p>
                      </div>
                      {monthlyEquivalent > 0 && (
                        <span className="text-xs text-amber-400">~{Math.round(monthlyEquivalent)}{currency}/mes</span>
                      )}
                    </button>

                    {/* Dashboard Config */}
                    <button
                      onClick={() => setShowDashboardSettings(true)}
                      className="w-full p-3.5 bg-white/5 hover:bg-white/8 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <span className="text-xl">⚙️</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Personalizar Dashboard</p>
                        <p className="text-[10px] text-white/40">Ordenar y mostrar/ocultar widgets</p>
                      </div>
                    </button>
                  </div>
                </div>
              </AnimatedMount>

              {/* ═══════════════ METAS DE AHORRO ═══════════════ */}
              {savingsGoals.length > 0 && (
                <AnimatedMount delay={175}>
                  <div className="p-4 bg-white/5 rounded-2xl mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-sm">Metas de ahorro</p>
                      <button onClick={() => setView('savings')} className="text-xs text-violet-400">Ver todas</button>
                    </div>
                    <div className="space-y-2.5">
                      {savingsGoals.slice(0, 2).map(goal => {
                        const pct = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                          <div key={goal.id} className="flex items-center gap-3">
                            <span className="text-lg">{goal.icon}</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-white/70">{goal.name}</span>
                                <span className="text-white/40">{pct.toFixed(0)}%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-white/60">
                              {goal.currentAmount.toLocaleString()}/{goal.targetAmount.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedMount>
              )}

              {/* ═══════════════ FONDO DE EMERGENCIA MINI ═══════════════ */}
              <AnimatedMount delay={200}>
                <button
                  onClick={() => setShowEmergencyFund(true)}
                  className="w-full p-4 bg-white/5 rounded-2xl flex items-center gap-4 mb-4 hover:bg-white/8 transition-all"
                >
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15"
                        fill="transparent"
                        stroke={emergencyMonthsCovered >= emergencyFund.targetMonths ? '#10b981' : '#6b7280'}
                        strokeWidth="3"
                        strokeDasharray={`${Math.min((emergencyMonthsCovered / emergencyFund.targetMonths) * 100, 100)} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg">🛡️</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Fondo de Emergencia</p>
                    <p className="text-[10px] text-white/40">
                      {emergencyMonthsCovered.toFixed(1)} de {emergencyFund.targetMonths} meses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{emergencyFund.currentAmount.toLocaleString()}{currency}</p>
                    <p className="text-[10px] text-white/40">Meta: {(avgMonthlyExpense * emergencyFund.targetMonths).toLocaleString()}{currency}</p>
                  </div>
                </button>
              </AnimatedMount>

              {/* Wallet Filter - ahora al final, más discreto */}
              {wallets.length > 1 && (
                <AnimatedMount delay={225}>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-2">Filtrar por billetera</p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      <button
                        onClick={() => setActiveWallet('all')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${activeWallet === 'all' ? 'bg-violet-500/30 text-violet-300' : 'bg-white/5 text-white/50'}`}
                      >
                        <span>📊</span> Todas
                      </button>
                      {wallets.map(wallet => (
                        <button
                          key={wallet.id}
                          onClick={() => setActiveWallet(wallet.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${activeWallet === wallet.id ? 'bg-violet-500/30 text-violet-300' : 'bg-white/5 text-white/50'}`}
                        >
                          <span>{wallet.icon}</span> {wallet.name}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAddWallet(true)}
                        className="px-2 py-1.5 rounded-lg text-xs bg-white/5 text-white/30 border border-dashed border-white/10"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </AnimatedMount>
              )}
            </>
          )}

          {/* BUDGETS VIEW */}
          {view === 'budgets' && (
            <AnimatedMount delay={75}>
              <Card>
                <p className="font-bold mb-1">Presupuestos por categoría</p>
                <p className="text-xs text-white/50 mb-4">Define límites mensuales</p>
                <div className="space-y-3">
                  {personalExpenseCategories.map(cat => {
                    const spent = monthTransactions.filter(t => t.type === 'expense' && t.category === cat.id).reduce((s, t) => s + t.amount, 0);
                    const budget = categoryBudgets[cat.id] || 0;
                    const pct = budget > 0 ? (spent / budget) * 100 : 0;
                    return (
                      <div key={cat.id} className="p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-medium text-sm">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={budget || ''}
                              onChange={(e) => updateCategoryBudget(cat.id, e.target.value)}
                              placeholder="0"
                              className="w-16 bg-white/10 rounded-lg px-2 py-1 text-right text-sm outline-none"
                            />
                            <span className="text-xs text-white/50">{currency}</span>
                          </div>
                        </div>
                        {budget > 0 && (
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </AnimatedMount>
          )}

          {/* ========== ENVELOPES VIEW ========== */}
          {view === 'envelopes' && (
            <>
              <AnimatedMount delay={75}>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Sobres Digitales</p>
                  <button onClick={() => setShowAddEnvelope(true)} className="bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nuevo sobre
                  </button>
                </div>
              </AnimatedMount>

              {/* How it works explainer */}
              {envelopes.length === 0 && (
                <AnimatedMount delay={100}>
                  <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30">
                    <div className="text-center py-4">
                      <p className="text-3xl mb-2">💌</p>
                      <p className="font-bold mb-2">Sistema de sobres</p>
                      <p className="text-sm text-white/60 mb-3">
                        Asigna dinero a "sobres" virtuales para cada categoría de gasto.
                        Cuando el sobre se vacía, ¡no gastas más en esa categoría!
                      </p>
                      <button onClick={() => setShowAddEnvelope(true)} className="bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium">
                        Crear mi primer sobre
                      </button>
                    </div>
                  </Card>
                </AnimatedMount>
              )}

              {/* Envelopes Grid */}
              <AnimatedMount delay={125}>
                <div className="grid grid-cols-2 gap-3">
                  {envelopes.map(envelope => {
                    const pct = envelope.budgetAmount > 0 ? (envelope.currentAmount / envelope.budgetAmount) * 100 : 0;
                    return (
                      <Card key={envelope.id} className={`${pct < 20 ? 'border-red-500/50' : pct < 50 ? 'border-amber-500/50' : 'border-white/10'}`}>
                        <div className="text-center">
                          <span className="text-2xl">{envelope.icon}</span>
                          <p className="font-medium text-sm mt-1">{envelope.name}</p>
                          <p className={`text-xl font-bold ${pct < 20 ? 'text-red-400' : pct < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {envelope.currentAmount.toFixed(0)}{currency}
                          </p>
                          <p className="text-[10px] text-white/40">de {envelope.budgetAmount.toFixed(0)}{currency}</p>

                          {/* Progress bar */}
                          <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          {/* Quick actions */}
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={() => spendFromEnvelope(envelope.id, 10)}
                              className="flex-1 py-1 bg-red-500/20 hover:bg-red-500/40 rounded text-xs"
                            >
                              -10€
                            </button>
                            <button
                              onClick={() => refillEnvelope(envelope.id)}
                              className="flex-1 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 rounded text-xs"
                            >
                              🔄
                            </button>
                            <button
                              onClick={() => deleteEnvelope(envelope.id)}
                              className="py-1 px-2 bg-white/10 hover:bg-white/20 rounded text-xs"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </AnimatedMount>

              {/* Total allocated */}
              {envelopes.length > 0 && (
                <AnimatedMount delay={150}>
                  <Card>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Total en sobres:</span>
                      <span className="font-bold text-lg">{envelopes.reduce((s, e) => s + e.currentAmount, 0).toFixed(0)}{currency}</span>
                    </div>
                  </Card>
                </AnimatedMount>
              )}
            </>
          )}

          {/* ========== SUBSCRIPTIONS VIEW ========== */}
          {view === 'subscriptions' && (
            <>
              <AnimatedMount delay={75}>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Suscripciones</p>
                  <button onClick={() => setShowAddSubscription(true)} className="bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Añadir
                  </button>
                </div>
              </AnimatedMount>

              {/* Summary Card */}
              <AnimatedMount delay={100}>
                <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/50">Coste mensual</p>
                      <p className="text-2xl font-bold text-violet-400">{monthlySubscriptionTotal.toFixed(0)}{currency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/50">Coste anual</p>
                      <p className="text-xl font-bold text-red-400">{yearlySubscriptionTotal.toFixed(0)}{currency}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 mt-2">
                    💡 Revisa suscripciones que no uses para ahorrar dinero
                  </p>
                </Card>
              </AnimatedMount>

              {/* Empty state */}
              {subscriptions.length === 0 && (
                <AnimatedMount delay={125}>
                  <Card>
                    <div className="text-center py-6">
                      <p className="text-3xl mb-2">📱</p>
                      <p className="text-white/60">No tienes suscripciones registradas</p>
                      <button onClick={() => setShowAddSubscription(true)} className="mt-3 bg-violet-500 px-4 py-2 rounded-lg text-sm">
                        Añadir suscripción
                      </button>
                    </div>
                  </Card>
                </AnimatedMount>
              )}

              {/* Subscriptions list */}
              {subscriptions.length > 0 && (
                <AnimatedMount delay={125}>
                  <Card>
                    <div className="space-y-3">
                      {subscriptions.map(sub => {
                        const catInfo = subscriptionCategories.find(c => c.id === sub.category) || { icon: '📦', name: 'Otro' };
                        return (
                          <div key={sub.id} className={`flex items-center gap-3 p-2 rounded-lg ${sub.markedForCancel ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'}`}>
                            <span className="text-xl">{catInfo.icon}</span>
                            <div className="flex-1">
                              <p className={`font-medium ${sub.markedForCancel ? 'line-through text-white/50' : ''}`}>{sub.name}</p>
                              <p className="text-xs text-white/40">
                                {sub.billingCycle === 'monthly' ? 'Mensual' : sub.billingCycle === 'yearly' ? 'Anual' : 'Semanal'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{sub.amount.toFixed(0)}{currency}</p>
                              {sub.billingCycle === 'yearly' && (
                                <p className="text-[10px] text-white/40">{(sub.amount / 12).toFixed(0)}€/mes</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => toggleSubscriptionCancel(sub.id)}
                                className={`p-2 rounded ${sub.markedForCancel ? 'bg-emerald-500/30' : 'bg-amber-500/20'}`}
                                title={sub.markedForCancel ? 'Mantener' : 'Marcar para cancelar'}
                              >
                                {sub.markedForCancel ? '✓' : '✕'}
                              </button>
                              <button
                                onClick={() => deleteSubscription(sub.id)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </AnimatedMount>
              )}

              {/* Marked for cancel summary */}
              {subscriptions.filter(s => s.markedForCancel).length > 0 && (
                <AnimatedMount delay={150}>
                  <Card className="bg-amber-500/10 border-amber-500/30">
                    <p className="text-sm text-amber-300">
                      💡 Cancelando las suscripciones marcadas ahorrarías {subscriptions.filter(s => s.markedForCancel).reduce((s, sub) => {
                        if (sub.billingCycle === 'monthly') return s + sub.amount;
                        if (sub.billingCycle === 'yearly') return s + (sub.amount / 12);
                        return s;
                      }, 0).toFixed(0)}{currency}/mes
                    </p>
                  </Card>
                </AnimatedMount>
              )}
            </>
          )}

          {/* SAVINGS VIEW */}
          {view === 'savings' && (
            <>
              <AnimatedMount delay={75}>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Metas de ahorro</p>
                  {savingsGoals.length > 0 && (
                    <button onClick={() => setShowAddSaving(true)} className="bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Nueva
                    </button>
                  )}
                </div>
              </AnimatedMount>

              {savingsGoals.map((goal, i) => {
                const pct = (goal.currentAmount / goal.targetAmount) * 100;
                const remaining = goal.targetAmount - (goal.currentAmount || 0);
                return (
                  <AnimatedMount key={goal.id} delay={100 + i * 25}>
                    <Card className={pct >= 100 ? 'border-emerald-500/50 bg-emerald-500/10' : ''}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{goal.icon}</span>
                          <div>
                            <p className="font-bold">{goal.name}</p>
                            <p className="text-xs text-white/50">{goal.targetDate ? formatShortDate(goal.targetDate) : 'Sin fecha'}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteSavingGoal(goal.id)} className="p-2 hover:bg-white/10 rounded-lg">
                          <X className="w-4 h-4 text-white/40" />
                        </button>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{(goal.currentAmount || 0).toLocaleString()}{currency}</span>
                          <span className="text-white/50">{goal.targetAmount.toLocaleString()}{currency}</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <p className="text-xs text-white/40 mt-1">{pct >= 100 ? '🎉 ¡Completada!' : `Faltan ${remaining.toLocaleString()}${currency}`}</p>
                      </div>
                      {pct < 100 && (
                        <div className="flex gap-2">
                          {[10, 50, 100].map(amt => (
                            <button key={amt} onClick={() => addToSaving(goal.id, amt)} className="flex-1 py-2 bg-white/10 hover:bg-violet-500/50 rounded-lg text-sm">
                              +{amt}
                            </button>
                          ))}
                        </div>
                      )}
                    </Card>
                  </AnimatedMount>
                );
              })}

              {savingsGoals.length === 0 && (
                <AnimatedMount delay={100}>
                  <Card className="text-center py-8">
                    <span className="text-5xl mb-3 block">🐷</span>
                    <p className="font-bold mb-1">Sin metas de ahorro</p>
                    <p className="text-sm text-white/50 mb-4">Crea objetivos para motivarte</p>
                    <button onClick={() => setShowAddSaving(true)} className="bg-violet-500 px-6 py-3 rounded-xl font-medium">
                      Crear meta
                    </button>
                  </Card>
                </AnimatedMount>
              )}
            </>
          )}

          {/* HISTORY VIEW */}
          {view === 'history' && (
            <AnimatedMount delay={75}>
              {transactions.length > 0 ? (
                <div className="space-y-2">
                  {/* Bulk Edit Header */}
                  <div className="flex items-center justify-between mb-2">
                    {bulkEditMode ? (
                      <>
                        <button onClick={selectAllTransactions} className="text-sm text-violet-400">
                          {selectedTransactions.length === transactions.length ? '✓ Deseleccionar todo' : `☐ Seleccionar todo (${transactions.length})`}
                        </button>
                        <button onClick={cancelBulkEdit} className="text-sm text-white/50">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setBulkEditMode(true)}
                        className="text-sm px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition-all"
                      >
                        ✏️ Edición masiva
                      </button>
                    )}
                  </div>

                  {/* Transaction List */}
                  {transactions.sort((a, b) => b.date.localeCompare(a.date)).map(t => {
                    const cat = getCategoryInfo(t.category, t.type);
                    const isSelected = selectedTransactions.includes(t.id);
                    return bulkEditMode ? (
                      <Card
                        key={t.id}
                        className={`py-3 cursor-pointer ${isSelected ? 'ring-2 ring-violet-500' : ''}`}
                        onClick={() => toggleTransactionSelection(t.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-violet-500' : 'bg-white/10'}`}>
                            {isSelected && <span className="text-white text-sm">✓</span>}
                          </div>
                          <span className="text-xl">{cat.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{t.description || cat.name}</p>
                            <p className="text-xs text-white/40">{formatShortDate(t.date)}</p>
                          </div>
                          <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}{currency}
                          </p>
                        </div>
                      </Card>
                    ) : (
                      <SwipeableItem key={t.id} onDelete={() => deleteTransaction(t.id)}>
                        <Card className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{t.description || cat.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-white/40">{formatShortDate(t.date)}</p>
                                {t.tags && t.tags.length > 0 && (
                                  <div className="flex gap-1">
                                    {t.tags.slice(0, 2).map((tag, i) => (
                                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-violet-500/30 text-violet-300 rounded-full">
                                        #{tag}
                                      </span>
                                    ))}
                                    {t.tags.length > 2 && (
                                      <span className="text-[9px] text-white/40">+{t.tags.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              {t.notes && (
                                <p className="text-[10px] text-white/30 mt-1 line-clamp-1">📝 {t.notes}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}{currency}
                              </p>
                              {t.type === 'expense' && !t.splits && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); openSplitModal(t); }}
                                  className="text-xs px-2 py-1 bg-violet-500/20 hover:bg-violet-500/40 text-violet-300 rounded-lg mt-1 transition-all"
                                >
                                  ✂️ Dividir
                                </button>
                              )}
                              {t.splits && (
                                <span className="text-[10px] text-violet-400 mt-1 block">
                                  ✂️ {t.splits.length} cats
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Expandable Splits */}
                          {t.splits && t.splits.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                              {t.splits.map((split, i) => {
                                const splitCat = getCategoryInfo(split.category, t.type);
                                return (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="text-sm">{splitCat.icon}</span>
                                    <span className="flex-1 text-white/60">{split.description || splitCat.name}</span>
                                    <span className="text-white/80">{split.amount.toLocaleString()}{currency}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </Card>
                      </SwipeableItem>
                    );
                  })}

                  {/* Floating Action Bar */}
                  {bulkEditMode && selectedTransactions.length > 0 && (
                    <div className="fixed bottom-24 left-4 right-4 bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-2xl z-50">
                      <p className="text-sm text-white/60 mb-3">{selectedTransactions.length} seleccionadas</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowBulkActions(true)}
                          className="flex-1 py-3 bg-violet-500 rounded-xl font-medium"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={bulkDeleteTransactions}
                          className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState icon={Wallet} title="Sin transacciones" description="Registra tu primer movimiento" />
              )}
            </AnimatedMount>
          )}
        </>
      )}

      {/* BUSINESS MODE */}
      {financeMode === 'business' && (
        <>
          {/* HOME VIEW */}
          {view === 'home' && (
            <>
              {/* Insights */}
              {insights.length > 0 && (
                <AnimatedMount delay={75}>
                  <div className="space-y-2">
                    {insights.map((insight, i) => (
                      <div key={i} className={`p-3 rounded-xl flex items-center gap-3 ${insight.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                        insight.type === 'warning' ? 'bg-amber-500/20 border border-amber-500/30' :
                          'bg-violet-500/20'
                        }`}>
                        <span className="text-xl">{insight.icon}</span>
                        <p className="text-sm flex-1">{insight.text}</p>
                        {insight.action && (
                          <button
                            onClick={() => setView(insight.action.tab)}
                            className="text-xs px-3 py-1 bg-white/10 rounded-full"
                          >
                            {insight.action.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </AnimatedMount>
              )}

              {/* Business Overview */}
              <AnimatedMount delay={100}>
                <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30">
                  <p className="text-xs text-white/50 mb-2">Este mes</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-emerald-400">+{businessMonthIncome.toLocaleString()}</p>
                      <p className="text-xs text-white/50">Ingresos</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-400">-{businessMonthExpenses.toLocaleString()}</p>
                      <p className="text-xs text-white/50">Gastos</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-amber-400">-{taxReserve.toLocaleString()}</p>
                      <p className="text-xs text-white/50">Impuestos</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between">
                      <span className="font-medium">Beneficio Neto</span>
                      <span className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}{currency}
                      </span>
                    </div>
                  </div>
                </Card>
              </AnimatedMount>

              {/* Recent Business Transactions */}
              <AnimatedMount delay={125}>
                <Section title="ÚLTIMOS MOVIMIENTOS" icon={Clock} iconColor="text-violet-400">
                  {businessTransactions.length > 0 ? (
                    <div className="space-y-2">
                      {businessTransactions.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(t => {
                        const cat = getCategoryInfo(t.category, t.type);
                        return (
                          <div key={t.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{t.description || cat.name}</p>
                              <p className="text-xs text-white/40">{t.client && `${t.client} • `}{formatShortDate(t.date)}</p>
                            </div>
                            <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}{currency}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState icon={Briefcase} title="Sin movimientos" description="Registra ingresos y gastos de tu negocio" />
                  )}
                </Section>
              </AnimatedMount>
            </>
          )}

          {/* INCOME VIEW */}
          {view === 'income' && (
            <AnimatedMount delay={75}>
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold">Ingresos del mes</p>
                  <p className="text-xl font-bold text-emerald-400">+{businessMonthIncome.toLocaleString()}{currency}</p>
                </div>
                {businessTransactions.filter(t => t.type === 'income' && t.date?.startsWith(thisMonth)).length > 0 ? (
                  <div className="space-y-2">
                    {businessTransactions.filter(t => t.type === 'income' && t.date?.startsWith(thisMonth)).sort((a, b) => b.date.localeCompare(a.date)).map(t => {
                      const cat = getCategoryInfo(t.category, 'income');
                      return (
                        <SwipeableItem key={t.id} onDelete={() => deleteTransaction(t.id)}>
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{t.description || cat.name}</p>
                              <p className="text-xs text-white/40">{t.client && `${t.client} • `}{formatShortDate(t.date)}</p>
                            </div>
                            <p className="font-bold text-emerald-400">+{t.amount.toLocaleString()}{currency}</p>
                          </div>
                        </SwipeableItem>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-white/40 py-4">Sin ingresos este mes</p>
                )}
              </Card>
            </AnimatedMount>
          )}

          {/* EXPENSES VIEW */}
          {view === 'expenses' && (
            <AnimatedMount delay={75}>
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold">Gastos del mes</p>
                  <p className="text-xl font-bold text-red-400">-{businessMonthExpenses.toLocaleString()}{currency}</p>
                </div>
                {businessTransactions.filter(t => t.type === 'expense' && t.date?.startsWith(thisMonth)).length > 0 ? (
                  <div className="space-y-2">
                    {businessTransactions.filter(t => t.type === 'expense' && t.date?.startsWith(thisMonth)).sort((a, b) => b.date.localeCompare(a.date)).map(t => {
                      const cat = getCategoryInfo(t.category, 'expense');
                      return (
                        <SwipeableItem key={t.id} onDelete={() => deleteTransaction(t.id)}>
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{t.description || cat.name}</p>
                              <p className="text-xs text-white/40">{formatShortDate(t.date)}</p>
                            </div>
                            <p className="font-bold text-red-400">-{t.amount.toLocaleString()}{currency}</p>
                          </div>
                        </SwipeableItem>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-white/40 py-4">Sin gastos este mes</p>
                )}
              </Card>
            </AnimatedMount>
          )}

          {/* TAXES VIEW */}
          {view === 'taxes' && (
            <AnimatedMount delay={75}>
              <Card>
                <p className="font-bold mb-4">Configuración de Impuestos</p>
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span>% Reserva para impuestos</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={taxSettings.reservePercentage}
                          onChange={(e) => updateTaxSettings('reservePercentage', e.target.value)}
                          className="w-16 bg-white/10 rounded-lg px-2 py-1 text-right outline-none"
                        />
                        <span className="text-white/50">%</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 mt-1">Se reserva automáticamente de cada ingreso</p>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span>IVA</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={taxSettings.ivaRate}
                          onChange={(e) => updateTaxSettings('ivaRate', e.target.value)}
                          className="w-16 bg-white/10 rounded-lg px-2 py-1 text-right outline-none"
                        />
                        <span className="text-white/50">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span>IRPF / Retención</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={taxSettings.irpfRate}
                          onChange={(e) => updateTaxSettings('irpfRate', e.target.value)}
                          className="w-16 bg-white/10 rounded-lg px-2 py-1 text-right outline-none"
                        />
                        <span className="text-white/50">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                  <p className="font-bold text-amber-400 mb-2">Reserva estimada este mes</p>
                  <p className="text-2xl font-bold">{taxReserve.toLocaleString()}{currency}</p>
                  <p className="text-xs text-white/50 mt-1">Basado en {businessMonthIncome.toLocaleString()}{currency} de ingresos</p>
                </div>
              </Card>
            </AnimatedMount>
          )}
        </>
      )}

      {/* Add Transaction Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={`Nueva transacción ${financeMode === 'business' ? '(Empresa)' : ''}`}>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTransactionType('expense')}
            className={`flex-1 py-2 rounded-xl font-medium ${transactionType === 'expense' ? 'bg-red-500' : 'bg-white/10'}`}
          >
            Gasto
          </button>
          <button
            onClick={() => setTransactionType('income')}
            className={`flex-1 py-2 rounded-xl font-medium ${transactionType === 'income' ? 'bg-emerald-500' : 'bg-white/10'}`}
          >
            Ingreso
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Cantidad ({currency})</label>
          <input
            type="number"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction(t => ({ ...t, amount: e.target.value }))}
            placeholder="0.00"
            className="w-full bg-white/10 rounded-xl p-4 text-2xl font-bold text-center outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-white/60 mb-2 block">Categoría</label>
          <div className="grid grid-cols-4 gap-2">
            {(transactionType === 'expense' ? expenseCategories : incomeCategories).slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => setNewTransaction(t => ({ ...t, category: cat.id }))}
                className={`p-2 rounded-xl text-center ${newTransaction.category === cat.id ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                <span className="text-lg block">{cat.icon}</span>
                <span className="text-xs">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {financeMode === 'business' && transactionType === 'income' && (
          <div className="mb-4">
            <label className="text-sm text-white/60 mb-1 block">Cliente (opcional)</label>
            <input
              type="text"
              value={newTransaction.client}
              onChange={(e) => setNewTransaction(t => ({ ...t, client: e.target.value }))}
              placeholder="Nombre del cliente"
              className="w-full bg-white/10 rounded-xl p-3 outline-none"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Descripción (opcional)</label>
          <input
            type="text"
            value={newTransaction.description}
            onChange={(e) => {
              const desc = e.target.value;
              setNewTransaction(t => ({ ...t, description: desc }));
              // Auto-suggest category if none selected
              if (!newTransaction.category) {
                const suggested = getSuggestedCategory(desc);
                if (suggested) {
                  setNewTransaction(t => ({ ...t, category: suggested }));
                }
              }
            }}
            placeholder="Ej: Proyecto web"
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
          {/* Category Suggestion */}
          {newTransaction.description && getSuggestedCategory(newTransaction.description) &&
            newTransaction.category !== getSuggestedCategory(newTransaction.description) && (
              <button
                onClick={() => setNewTransaction(t => ({ ...t, category: getSuggestedCategory(t.description) }))}
                className="mt-2 text-xs text-violet-400 flex items-center gap-1"
              >
                💡 Sugerencia: {getCategoryInfo(getSuggestedCategory(newTransaction.description), transactionType).name}
                <span className="text-white/40">— tap para aplicar</span>
              </button>
            )}
        </div>

        {/* Notes Field */}
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Notas (opcional)</label>
          <textarea
            value={newTransaction.notes}
            onChange={(e) => setNewTransaction(t => ({ ...t, notes: e.target.value }))}
            placeholder="Detalles adicionales, referencias..."
            rows={2}
            className="w-full bg-white/10 rounded-xl p-3 outline-none resize-none"
          />
        </div>

        {/* Tags Field */}
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Etiquetas (opcional)</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {(newTransaction.tags || []).map((tag, i) => (
              <span key={i} className="bg-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                #{tag}
                <button
                  onClick={() => setNewTransaction(t => ({ ...t, tags: t.tags.filter((_, idx) => idx !== i) }))}
                  className="hover:text-white"
                >×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  setNewTransaction(t => ({ ...t, tags: [...(t.tags || []), tagInput.trim().toLowerCase()] }));
                  setTagInput('');
                }
              }}
              placeholder="vacaciones, urgente, recurrente..."
              className="flex-1 bg-white/10 rounded-xl p-2.5 outline-none text-sm"
            />
            <button
              onClick={() => {
                if (tagInput.trim()) {
                  setNewTransaction(t => ({ ...t, tags: [...(t.tags || []), tagInput.trim().toLowerCase()] }));
                  setTagInput('');
                }
              }}
              className="px-4 bg-white/10 rounded-xl text-sm"
            >
              +
            </button>
          </div>
          <div className="flex gap-1 mt-2 overflow-x-auto">
            {['recurrente', 'importante', 'capricho', 'fijo'].map(tag => (
              <button
                key={tag}
                onClick={() => setNewTransaction(t => {
                  const tags = t.tags || [];
                  return { ...t, tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag] };
                })}
                className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap ${(newTransaction.tags || []).includes(tag) ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Selector */}
        {wallets.length > 1 && (
          <div className="mb-4">
            <label className="text-sm text-white/60 mb-2 block">Billetera</label>
            <div className="flex gap-2 overflow-x-auto">
              {wallets.map(wallet => (
                <button
                  key={wallet.id}
                  onClick={() => setNewTransaction(t => ({ ...t, walletId: wallet.id }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap ${(newTransaction.walletId || 'main') === wallet.id ? `bg-${wallet.color}-500` : 'bg-white/10'
                    }`}
                >
                  <span>{wallet.icon}</span>
                  <span className="text-sm">{wallet.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="text-sm text-white/60 mb-1 block">Fecha</label>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction(t => ({ ...t, date: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>

        <button
          onClick={saveTransaction}
          className={`w-full py-4 rounded-xl font-bold ${transactionType === 'expense' ? 'bg-red-500' : 'bg-emerald-500'}`}
        >
          Guardar
        </button>
      </Modal>

      {/* Add Saving Goal Modal */}
      <Modal isOpen={showAddSaving} onClose={() => setShowAddSaving(false)} title="Nueva meta de ahorro">
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-2 block">Icono</label>
          <div className="flex gap-2 flex-wrap">
            {savingIcons.map(icon => (
              <button
                key={icon}
                onClick={() => setNewSavingGoal(g => ({ ...g, icon }))}
                className={`w-10 h-10 rounded-xl text-xl ${newSavingGoal.icon === icon ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Nombre</label>
          <input
            type="text"
            value={newSavingGoal.name}
            onChange={(e) => setNewSavingGoal(g => ({ ...g, name: e.target.value }))}
            placeholder="Ej: Vacaciones"
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Cantidad objetivo</label>
          <input
            type="number"
            value={newSavingGoal.targetAmount}
            onChange={(e) => setNewSavingGoal(g => ({ ...g, targetAmount: e.target.value }))}
            placeholder="1000"
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="text-sm text-white/60 mb-1 block">Fecha límite (opcional)</label>
          <input
            type="date"
            value={newSavingGoal.targetDate}
            onChange={(e) => setNewSavingGoal(g => ({ ...g, targetDate: e.target.value }))}
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <button onClick={addSavingGoal} className="w-full py-4 bg-violet-500 rounded-xl font-bold">
          Crear meta
        </button>
      </Modal>

      {/* Emergency Fund Modal */}
      <Modal isOpen={showEmergencyFund} onClose={() => setShowEmergencyFund(false)} title="Fondo de Emergencia">
        <div className="mb-4 p-4 bg-slate-500/20 rounded-xl text-center">
          <span className="text-5xl mb-2 block">🛡️</span>
          <p className="text-3xl font-bold">{emergencyFund.currentAmount.toLocaleString()}{currency}</p>
          <p className="text-sm text-white/50">{emergencyMonthsCovered.toFixed(1)} meses de gastos cubiertos</p>
        </div>

        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Meses objetivo</label>
          <input
            type="number"
            value={emergencyFund.targetMonths}
            onChange={(e) => updateEmergencyFund('targetMonths', e.target.value)}
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
          <p className="text-xs text-white/40 mt-1">Meta: {(avgMonthlyExpense * emergencyFund.targetMonths).toLocaleString()}{currency}</p>
        </div>

        <p className="text-sm text-white/60 mb-2">Añadir al fondo:</p>
        <div className="flex gap-2 mb-4">
          {[50, 100, 200, 500].map(amt => (
            <button
              key={amt}
              onClick={() => { addToEmergencyFund(amt); setShowEmergencyFund(false); }}
              className="flex-1 py-3 bg-white/10 hover:bg-emerald-500/50 rounded-xl font-medium"
            >
              +{amt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">O cantidad personalizada:</label>
          <div className="flex gap-2">
            <input
              type="number"
              id="customEmergencyAmount"
              placeholder="0"
              className="flex-1 bg-white/10 rounded-xl p-3 outline-none"
            />
            <button
              onClick={() => {
                const input = document.getElementById('customEmergencyAmount');
                if (input.value) {
                  addToEmergencyFund(input.value);
                  setShowEmergencyFund(false);
                }
              }}
              className="px-6 bg-emerald-500 rounded-xl font-medium"
            >
              Añadir
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Envelope Modal */}
      <Modal isOpen={showAddEnvelope} onClose={() => setShowAddEnvelope(false)} title="Nuevo Sobre">
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-2 block">Icono</label>
          <div className="flex gap-2 flex-wrap">
            {envelopeIcons.map(icon => (
              <button
                key={icon}
                onClick={() => setNewEnvelope(e => ({ ...e, icon }))}
                className={`w-10 h-10 rounded-xl text-xl ${newEnvelope.icon === icon ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Nombre del sobre</label>
          <input
            type="text"
            value={newEnvelope.name}
            onChange={(e) => setNewEnvelope(en => ({ ...en, name: e.target.value }))}
            placeholder="Ej: Comida, Ocio, Transporte..."
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="text-sm text-white/60 mb-1 block">Presupuesto mensual</label>
          <input
            type="number"
            value={newEnvelope.budgetAmount}
            onChange={(e) => setNewEnvelope(en => ({ ...en, budgetAmount: e.target.value }))}
            placeholder="200"
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <button onClick={addEnvelope} className="w-full py-4 bg-violet-500 rounded-xl font-bold">
          Crear sobre
        </button>
      </Modal>

      {/* Add Subscription Modal */}
      <Modal isOpen={showAddSubscription} onClose={() => setShowAddSubscription(false)} title="Nueva Suscripción">
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Nombre</label>
          <input
            type="text"
            value={newSubscription.name}
            onChange={(e) => setNewSubscription(s => ({ ...s, name: e.target.value }))}
            placeholder="Ej: Netflix, Spotify..."
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Precio</label>
          <input
            type="number"
            value={newSubscription.amount}
            onChange={(e) => setNewSubscription(s => ({ ...s, amount: e.target.value }))}
            placeholder="9.99"
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-1 block">Frecuencia de pago</label>
          <div className="flex gap-2">
            {['weekly', 'monthly', 'yearly'].map(cycle => (
              <button
                key={cycle}
                onClick={() => setNewSubscription(s => ({ ...s, billingCycle: cycle }))}
                className={`flex-1 py-2 rounded-lg text-sm ${newSubscription.billingCycle === cycle ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                {cycle === 'weekly' ? 'Semanal' : cycle === 'monthly' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="text-sm text-white/60 mb-2 block">Categoría</label>
          <div className="grid grid-cols-4 gap-2">
            {subscriptionCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setNewSubscription(s => ({ ...s, category: cat.id }))}
                className={`p-2 rounded-lg text-center ${newSubscription.category === cat.id ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                <span className="text-xl block">{cat.icon}</span>
                <span className="text-[10px]">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={addSubscription} className="w-full py-4 bg-violet-500 rounded-xl font-bold">
          Añadir suscripción
        </button>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal isOpen={showBulkActions} onClose={() => setShowBulkActions(false)} title={`Editar ${selectedTransactions.length} transacciones`}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Change Type */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Cambiar tipo</label>
            <div className="flex gap-2">
              <button
                onClick={() => bulkChangeType('income')}
                className="flex-1 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              >
                📈 Convertir a Ingreso
              </button>
              <button
                onClick={() => bulkChangeType('expense')}
                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400"
              >
                📉 Convertir a Gasto
              </button>
            </div>
          </div>

          {/* Change Category */}
          <div className="border-t border-white/10 pt-4">
            <label className="text-sm text-white/60 mb-2 block">Cambiar categoría</label>
            <div className="grid grid-cols-4 gap-2">
              {expenseCategories.slice(0, 8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setBulkCategory(cat.id)}
                  className={`p-2 rounded-xl text-center ${bulkCategory === cat.id ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  <span className="text-lg block">{cat.icon}</span>
                  <span className="text-[10px]">{cat.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={bulkChangeCategory}
              disabled={!bulkCategory}
              className={`w-full mt-3 py-3 rounded-xl font-medium ${bulkCategory ? 'bg-violet-500' : 'bg-white/10 text-white/30'}`}
            >
              Aplicar categoría
            </button>
          </div>

          {/* Add Tag */}
          <div className="border-t border-white/10 pt-4">
            <label className="text-sm text-white/60 mb-2 block">Añadir etiqueta</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={bulkTag}
                onChange={(e) => setBulkTag(e.target.value)}
                placeholder="Nueva etiqueta..."
                className="flex-1 bg-white/10 rounded-xl p-3 outline-none"
              />
            </div>
            <div className="flex gap-1 flex-wrap mb-3">
              {['recurrente', 'importante', 'capricho', 'revisar', 'fijo'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setBulkTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full ${bulkTag === tag ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <button
              onClick={bulkAddTag}
              disabled={!bulkTag}
              className={`w-full py-3 rounded-xl font-medium ${bulkTag ? 'bg-emerald-500' : 'bg-white/10 text-white/30'}`}
            >
              Añadir etiqueta
            </button>
          </div>

          {/* Remove/Clear Tags */}
          <div className="border-t border-white/10 pt-4">
            <label className="text-sm text-white/60 mb-2 block">Gestionar etiquetas</label>
            <button
              onClick={bulkClearTags}
              className="w-full py-3 rounded-xl bg-red-500/20 text-red-400"
            >
              🗑️ Eliminar todas las etiquetas
            </button>
          </div>

        </div>
      </Modal>

      {/* Annual Expenses Manager Modal */}
      <Modal isOpen={showAnnualExpenses} onClose={() => setShowAnnualExpenses(false)} title="Gastos no mensuales">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Summary */}
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl">
            <p className="text-xs text-white/50">Equivalente mensual total</p>
            <p className="text-2xl font-bold text-purple-400">~{Math.round(monthlyEquivalent).toLocaleString()}{currency}/mes</p>
            <p className="text-xs text-white/40 mt-1">{annualExpenses.length} gastos prorrateados</p>
          </div>

          {/* List */}
          {annualExpenses.map(exp => {
            const freq = frequencyOptions.find(f => f.id === exp.frequency);
            const monthly = exp.amount / (freq?.months || 12);
            return (
              <SwipeableItem key={exp.id} onDelete={() => deleteAnnualExpense(exp.id)}>
                <Card className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{exp.icon || '📅'}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{exp.name}</p>
                      <p className="text-xs text-white/40">{freq?.name} • {exp.amount.toLocaleString()}{currency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-400">~{Math.round(monthly).toLocaleString()}{currency}</p>
                      <p className="text-[10px] text-white/40">/mes</p>
                    </div>
                  </div>
                </Card>
              </SwipeableItem>
            );
          })}

          {/* Add Button */}
          <button
            onClick={() => { setShowAnnualExpenses(false); setShowAddAnnualExpense(true); }}
            className="w-full py-3 bg-violet-500 rounded-xl font-semibold"
          >
            + Añadir gasto
          </button>
        </div>
      </Modal>

      {/* Add Annual Expense Modal */}
      <Modal isOpen={showAddAnnualExpense} onClose={() => setShowAddAnnualExpense(false)} title="Nuevo gasto no mensual">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Nombre</label>
            <input
              type="text"
              value={newAnnualExpense.name}
              onChange={(e) => setNewAnnualExpense(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Seguro del coche, Netflix anual..."
              className="w-full bg-white/10 rounded-xl p-4 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Monto total</label>
            <input
              type="number"
              value={newAnnualExpense.amount}
              onChange={(e) => setNewAnnualExpense(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
              className="w-full bg-white/10 rounded-xl p-4 outline-none text-2xl font-bold text-center"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Frecuencia</label>
            <div className="grid grid-cols-3 gap-2">
              {frequencyOptions.map(freq => (
                <button
                  key={freq.id}
                  onClick={() => setNewAnnualExpense(prev => ({ ...prev, frequency: freq.id }))}
                  className={`py-3 rounded-xl text-sm ${newAnnualExpense.frequency === freq.id ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  {freq.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Categoría</label>
            <div className="grid grid-cols-4 gap-2">
              {expenseCategories.slice(0, 8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewAnnualExpense(prev => ({ ...prev, category: cat.id, icon: cat.icon }))}
                  className={`p-2 rounded-xl text-center ${newAnnualExpense.category === cat.id ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Próxima fecha de pago</label>
            <input
              type="date"
              value={newAnnualExpense.nextDueDate}
              onChange={(e) => setNewAnnualExpense(prev => ({ ...prev, nextDueDate: e.target.value }))}
              className="w-full bg-white/10 rounded-xl p-4 outline-none"
            />
          </div>

          {/* Preview */}
          {newAnnualExpense.amount && (
            <div className="p-3 bg-purple-500/20 rounded-xl text-center">
              <p className="text-xs text-white/50">Equivalente mensual</p>
              <p className="text-lg font-bold text-purple-400">
                ~{Math.round(parseFloat(newAnnualExpense.amount) / (frequencyOptions.find(f => f.id === newAnnualExpense.frequency)?.months || 12)).toLocaleString()}{currency}/mes
              </p>
            </div>
          )}

          <button
            onClick={addAnnualExpense}
            className="w-full py-4 bg-violet-500 rounded-xl font-bold"
          >
            Guardar
          </button>
        </div>
      </Modal>

      {/* Net Worth Manager Modal */}
      <Modal isOpen={showNetWorth} onClose={() => setShowNetWorth(false)} title="Patrimonio neto">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Summary */}
          <div className={`p-4 rounded-xl bg-gradient-to-r ${netWorth >= 0 ? 'from-teal-500/20 to-cyan-500/20' : 'from-orange-500/20 to-red-500/20'}`}>
            <p className="text-xs text-white/50">Patrimonio neto total</p>
            <p className={`text-3xl font-bold ${netWorth >= 0 ? 'text-teal-400' : 'text-orange-400'}`}>
              {netWorth >= 0 ? '+' : ''}{netWorth.toLocaleString()}{currency}
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-emerald-400">Activos: {totalAssets.toLocaleString()}</span>
              <span className="text-red-400">Pasivos: {totalLiabilities.toLocaleString()}</span>
            </div>
          </div>

          {/* Assets Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">📈 Activos</p>
              <button
                onClick={() => { setShowNetWorth(false); setShowAddAsset(true); }}
                className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg"
              >
                + Añadir
              </button>
            </div>
            {assets.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">Sin activos registrados</p>
            ) : (
              assets.map(asset => {
                const cat = assetCategories.find(c => c.id === asset.category);
                return (
                  <SwipeableItem key={asset.id} onDelete={() => deleteAsset(asset.id)}>
                    <Card className="py-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span>{cat?.icon || '💰'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{asset.name}</p>
                          <p className="text-xs text-white/40">{cat?.name}</p>
                        </div>
                        <p className="text-emerald-400 font-semibold">{asset.value.toLocaleString()}{currency}</p>
                      </div>
                    </Card>
                  </SwipeableItem>
                );
              })
            )}
          </div>

          {/* Liabilities Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">📉 Pasivos</p>
              <button
                onClick={() => { setShowNetWorth(false); setShowAddLiability(true); }}
                className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-lg"
              >
                + Añadir
              </button>
            </div>
            {liabilities.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">Sin pasivos registrados</p>
            ) : (
              liabilities.map(liability => {
                const cat = liabilityCategories.find(c => c.id === liability.category);
                return (
                  <SwipeableItem key={liability.id} onDelete={() => deleteLiability(liability.id)}>
                    <Card className="py-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span>{cat?.icon || '💳'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{liability.name}</p>
                          <p className="text-xs text-white/40">{cat?.name}</p>
                        </div>
                        <p className="text-red-400 font-semibold">-{liability.value.toLocaleString()}{currency}</p>
                      </div>
                    </Card>
                  </SwipeableItem>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* Add Asset Modal */}
      <Modal isOpen={showAddAsset} onClose={() => setShowAddAsset(false)} title="Nuevo activo">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Nombre</label>
            <input
              type="text"
              value={newAsset.name}
              onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Cuenta corriente, Casa, Coche..."
              className="w-full bg-white/10 rounded-xl p-4 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Valor actual</label>
            <input
              type="number"
              value={newAsset.value}
              onChange={(e) => setNewAsset(prev => ({ ...prev, value: e.target.value }))}
              placeholder="0"
              className="w-full bg-white/10 rounded-xl p-4 outline-none text-2xl font-bold text-center"
            />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {assetCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewAsset(prev => ({ ...prev, category: cat.id, icon: cat.icon }))}
                  className={`p-3 rounded-xl text-center ${newAsset.category === cat.id ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <span className="text-xl block">{cat.icon}</span>
                  <span className="text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={addAsset} className="w-full py-4 bg-emerald-500 rounded-xl font-bold">
            Guardar activo
          </button>
        </div>
      </Modal>

      {/* Add Liability Modal */}
      <Modal isOpen={showAddLiability} onClose={() => setShowAddLiability(false)} title="Nuevo pasivo">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Nombre</label>
            <input
              type="text"
              value={newLiability.name}
              onChange={(e) => setNewLiability(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Tarjeta VISA, Préstamo coche..."
              className="w-full bg-white/10 rounded-xl p-4 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Monto pendiente</label>
            <input
              type="number"
              value={newLiability.value}
              onChange={(e) => setNewLiability(prev => ({ ...prev, value: e.target.value }))}
              placeholder="0"
              className="w-full bg-white/10 rounded-xl p-4 outline-none text-2xl font-bold text-center"
            />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {liabilityCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewLiability(prev => ({ ...prev, category: cat.id, icon: cat.icon }))}
                  className={`p-3 rounded-xl text-center ${newLiability.category === cat.id ? 'bg-red-500' : 'bg-white/10'}`}
                >
                  <span className="text-xl block">{cat.icon}</span>
                  <span className="text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={addLiability} className="w-full py-4 bg-red-500 rounded-xl font-bold">
            Guardar pasivo
          </button>
        </div>
      </Modal>

      {/* Weekly/Monthly Review Modal */}
      <Modal isOpen={showReview} onClose={() => setShowReview(false)} title="Resumen financiero">
        {(() => {
          const review = getReviewData();
          return (
            <div className="space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Period Toggle */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <button
                  onClick={() => setReviewPeriod('week')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${reviewPeriod === 'week' ? 'bg-amber-500' : ''}`}
                >
                  Esta semana
                </button>
                <button
                  onClick={() => setReviewPeriod('month')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${reviewPeriod === 'month' ? 'bg-amber-500' : ''}`}
                >
                  Este mes
                </button>
              </div>

              {/* Summary */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${review.currentBalance >= 0 ? 'from-emerald-500/20 to-green-500/20' : 'from-red-500/20 to-orange-500/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-white/50">Balance del período</p>
                    <p className={`text-3xl font-bold ${review.currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {review.currentBalance >= 0 ? '+' : ''}{review.currentBalance.toLocaleString()}{currency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/50">{review.transactionCount} transacciones</p>
                    <p className={`text-sm font-medium ${review.savingsRate >= 20 ? 'text-emerald-400' : review.savingsRate >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {review.savingsRate}% ahorrado
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/40">Ingresos</p>
                    <p className="text-emerald-400 font-semibold">+{review.currentIncome.toLocaleString()}{currency}</p>
                    {review.incomeChange !== 0 && (
                      <p className={`text-xs ${review.incomeChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {review.incomeChange > 0 ? '↑' : '↓'} {Math.abs(review.incomeChange)}% vs anterior
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Gastos</p>
                    <p className="text-red-400 font-semibold">-{review.currentExpenses.toLocaleString()}{currency}</p>
                    {review.expenseChange !== 0 && (
                      <p className={`text-xs ${review.expenseChange < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {review.expenseChange > 0 ? '↑' : '↓'} {Math.abs(review.expenseChange)}% vs anterior
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Top 5 Categories */}
              {review.topCategories.length > 0 && (
                <div>
                  <p className="font-medium mb-2">🏆 Top categorías de gasto</p>
                  <div className="space-y-2">
                    {review.topCategories.map((cat, i) => (
                      <div key={cat.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl">
                        <span className="text-lg w-8 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                        <span className="text-lg">{cat.icon}</span>
                        <span className="flex-1 text-sm">{cat.name}</span>
                        <span className="font-semibold">{cat.total.toLocaleString()}{currency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget Compliance */}
              {review.budgetCompliance.length > 0 && (
                <div>
                  <p className="font-medium mb-2">📈 Cumplimiento de presupuestos</p>
                  <div className="space-y-2">
                    {review.budgetCompliance.map(b => {
                      const cat = expenseCategories.find(c => c.id === b.category);
                      const status = b.percentage <= 80 ? 'good' : b.percentage <= 100 ? 'warning' : 'over';
                      return (
                        <div key={b.id} className="p-3 bg-white/5 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span>{cat?.icon}</span>
                              <span className="text-sm">{cat?.name}</span>
                            </div>
                            <span className={`text-sm font-medium ${status === 'good' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
                              {b.percentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(b.percentage, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-white/40 mt-1">
                            {reviewPeriod === 'week' ? 'Proyección: ' : ''}{Math.round(b.projected).toLocaleString()} / {b.limit.toLocaleString()}{currency}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="p-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl">
                <p className="text-sm font-medium mb-1">💡 Consejo</p>
                <p className="text-xs text-white/70">
                  {review.savingsRate >= 20
                    ? '¡Excelente! Estás ahorrando más del 20% de tus ingresos.'
                    : review.savingsRate >= 10
                      ? 'Buen ritmo de ahorro. Intenta llegar al 20% para acelerar tus metas.'
                      : review.savingsRate >= 0
                        ? 'Considera reducir algunos gastos para aumentar tu capacidad de ahorro.'
                        : 'Atención: estás gastando más de lo que ingresas. Revisa tus gastos prioritarios.'}
                </p>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ========== SHARED EXPENSES MODALS ========== */}
      {/* Main Shared Expenses Modal */}
      <Modal isOpen={showSharedExpenses} onClose={() => { setShowSharedExpenses(false); setSelectedGroup(null); }} title={selectedGroup ? selectedGroup.name : "Gastos Compartidos"}>
        {!selectedGroup ? (
          <div className="space-y-4">
            <button onClick={() => setShowAddGroup(true)} className="w-full py-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl font-medium text-pink-400 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Nuevo grupo
            </button>
            {expenseGroups.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <p className="text-3xl mb-2">👥</p>
                <p>No tienes grupos aún</p>
                <p className="text-xs mt-1">Crea un grupo para compartir gastos</p>
              </div>
            ) : (
              <div className="space-y-2">
                {expenseGroups.map(group => {
                  const debts = getDebts(group);
                  const hasDebts = debts.length > 0;
                  return (
                    <div key={group.id} onClick={() => setSelectedGroup(group)} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{group.icon}</span>
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-xs text-white/40">{group.members.length} personas · {group.expenses.length} gastos</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasDebts && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                          <span className="text-white/30">→</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => setSelectedGroup(null)} className="text-sm text-white/50 hover:text-white flex items-center gap-1">
              ← Volver a grupos
            </button>

            {/* Group Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGroup.icon}</span>
                <div>
                  <p className="font-bold text-lg">{selectedGroup.name}</p>
                  <div className="flex gap-1 mt-1">
                    {selectedGroup.members.map(m => (
                      <span key={m.id} className="w-7 h-7 rounded-full bg-pink-500/30 flex items-center justify-center text-xs font-medium">{m.avatar}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteExpenseGroup(selectedGroup.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>

            {/* Balances */}
            {(() => {
              const balances = calculateBalances(selectedGroup);
              return (
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-2">Balances</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedGroup.members.map(m => {
                      const bal = balances[m.id] || 0;
                      return (
                        <div key={m.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center text-xs">{m.avatar}</span>
                            <span className="text-sm">{m.name}</span>
                          </div>
                          <span className={`text-sm font-medium ${bal > 0 ? 'text-emerald-400' : bal < 0 ? 'text-red-400' : 'text-white/40'}`}>
                            {bal > 0 ? '+' : ''}{bal.toFixed(2)}{currency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Who owes whom */}
            {(() => {
              const debts = getDebts(selectedGroup);
              if (debts.length === 0) return (
                <div className="text-center p-3 bg-emerald-500/10 rounded-xl text-emerald-400 text-sm">✓ Todo saldado</div>
              );
              return (
                <div className="space-y-2">
                  <p className="text-xs text-white/50">Deudas pendientes</p>
                  {debts.map((debt, i) => (
                    <div key={i} className="p-3 bg-amber-500/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{debt.from.name}</span>
                        <span className="text-white/40">debe</span>
                        <span className="font-bold text-amber-400">{debt.amount.toFixed(2)}{currency}</span>
                        <span className="text-white/40">a</span>
                        <span className="font-medium">{debt.to.name}</span>
                      </div>
                      <button onClick={() => recordSettlement(selectedGroup.id, debt.from.id, debt.to.id, debt.amount)} className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-xs text-emerald-400">
                        Pagar
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Add expense button */}
            <button onClick={() => setShowAddSharedExpense(true)} className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Añadir gasto
            </button>

            {/* Expense History */}
            {selectedGroup.expenses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-white/50">Historial</p>
                {selectedGroup.expenses.slice().reverse().map(exp => {
                  const payer = selectedGroup.members.find(m => m.id === exp.paidBy);
                  return (
                    <div key={exp.id} className="p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{exp.description}</p>
                          <p className="text-xs text-white/40">{payer?.name} pagó · {exp.date}</p>
                        </div>
                        <span className="font-bold">{exp.amount.toLocaleString()}{currency}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Group Modal */}
      <Modal isOpen={showAddGroup} onClose={() => setShowAddGroup(false)} title="Nuevo grupo">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/50 mb-1 block">Nombre del grupo</label>
            <input type="text" value={newGroup.name} onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))} placeholder="Ej: Viaje a París, Casa, Pareja..." className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none" />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Icono</label>
            <div className="flex flex-wrap gap-2">
              {groupIcons.map(icon => (
                <button key={icon} onClick={() => setNewGroup(prev => ({ ...prev, icon }))} className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center ${newGroup.icon === icon ? 'bg-pink-500' : 'bg-white/10 hover:bg-white/20'}`}>{icon}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Miembros ({newGroup.members.length})</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Nombre" className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none" onKeyDown={e => { if (e.key === 'Enter' && newMemberName.trim()) { setNewGroup(prev => ({ ...prev, members: [...prev.members, newMemberName.trim()] })); setNewMemberName(''); } }} />
              <button onClick={() => { if (newMemberName.trim()) { setNewGroup(prev => ({ ...prev, members: [...prev.members, newMemberName.trim()] })); setNewMemberName(''); } }} className="px-4 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl text-pink-400">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newGroup.members.map((m, i) => (
                <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {m}
                  <button onClick={() => setNewGroup(prev => ({ ...prev, members: prev.members.filter((_, idx) => idx !== i) }))} className="text-white/40 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            {newGroup.members.length < 2 && <p className="text-xs text-amber-400 mt-2">Añade al menos 2 personas</p>}
          </div>
          <button onClick={addExpenseGroup} disabled={!newGroup.name || newGroup.members.length < 2} className="w-full py-3 bg-pink-500 disabled:opacity-50 rounded-xl font-medium">Crear grupo</button>
        </div>
      </Modal>

      {/* Add Shared Expense Modal */}
      <Modal isOpen={showAddSharedExpense} onClose={() => setShowAddSharedExpense(false)} title="Añadir gasto compartido">
        {selectedGroup && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/50 mb-1 block">Descripción</label>
              <input type="text" value={newSharedExpense.description} onChange={e => setNewSharedExpense(prev => ({ ...prev, description: e.target.value }))} placeholder="Ej: Cena, Hotel, Taxi..." className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">Importe</label>
              <input type="number" value={newSharedExpense.amount} onChange={e => setNewSharedExpense(prev => ({ ...prev, amount: e.target.value }))} placeholder="0.00" className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none text-xl font-bold" />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">¿Quién pagó?</label>
              <div className="grid grid-cols-2 gap-2">
                {selectedGroup.members.map(m => (
                  <button key={m.id} onClick={() => setNewSharedExpense(prev => ({ ...prev, paidBy: m.id }))} className={`p-3 rounded-xl text-left ${newSharedExpense.paidBy === m.id ? 'bg-pink-500' : 'bg-white/10 hover:bg-white/20'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-pink-500/30 flex items-center justify-center">{m.avatar}</span>
                      <span>{m.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-white/50 mb-1 block">Dividir</label>
              <div className="flex bg-white/10 rounded-xl p-1">
                {['equal', 'percent', 'amount'].map(type => (
                  <button key={type} onClick={() => setNewSharedExpense(prev => ({ ...prev, splitType: type, splits: type === 'equal' ? [] : selectedGroup.members.map(m => ({ memberId: m.id, [type === 'percent' ? 'percent' : 'amount']: type === 'percent' ? 100 / selectedGroup.members.length : 0 })) }))} className={`flex-1 py-2 rounded-lg text-sm ${newSharedExpense.splitType === type ? 'bg-pink-500' : ''}`}>
                    {type === 'equal' ? '÷ Igual' : type === 'percent' ? '% Porcentaje' : '€ Importe'}
                  </button>
                ))}
              </div>
            </div>
            {newSharedExpense.splitType !== 'equal' && (
              <div className="space-y-2">
                {selectedGroup.members.map(m => {
                  const split = newSharedExpense.splits.find(s => s.memberId === m.id) || {};
                  return (
                    <div key={m.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl">
                      <span className="w-8 h-8 rounded-full bg-pink-500/30 flex items-center justify-center text-sm">{m.avatar}</span>
                      <span className="flex-1 text-sm">{m.name}</span>
                      <input type="number" value={newSharedExpense.splitType === 'percent' ? split.percent || '' : split.amount || ''} onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setNewSharedExpense(prev => ({
                          ...prev,
                          splits: prev.splits.map(s => s.memberId === m.id ? { ...s, [newSharedExpense.splitType === 'percent' ? 'percent' : 'amount']: val } : s)
                        }));
                      }} className="w-20 bg-white/10 rounded-lg px-2 py-1 text-right outline-none" placeholder="0" />
                      <span className="text-xs text-white/40">{newSharedExpense.splitType === 'percent' ? '%' : currency}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={addSharedExpense} disabled={!newSharedExpense.description || !newSharedExpense.amount || !newSharedExpense.paidBy} className="w-full py-3 bg-pink-500 disabled:opacity-50 rounded-xl font-medium">Añadir gasto</button>
          </div>
        )}
      </Modal>
      {/* ========== END SHARED EXPENSES MODALS ========== */}

      {/* ========== DASHBOARD SETTINGS MODAL ========== */}
      <Modal isOpen={showDashboardSettings} onClose={() => setShowDashboardSettings(false)} title="Configurar Dashboard">
        <div className="space-y-4">
          <p className="text-sm text-white/50">Personaliza qué widgets mostrar y su orden</p>

          <div className="space-y-2">
            {sortedWidgets.map((widget, idx) => (
              <div key={widget.id} className={`p-3 rounded-xl flex items-center gap-3 ${widget.visible ? 'bg-white/10' : 'bg-white/5'}`}>
                <span className="text-xl">{widget.icon}</span>
                <span className={`flex-1 text-sm ${widget.visible ? '' : 'text-white/40'}`}>{widget.name}</span>

                {/* Move buttons */}
                <div className="flex gap-1">
                  <button onClick={() => moveWidget(widget.id, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30 text-sm">
                    ▲
                  </button>
                  <button onClick={() => moveWidget(widget.id, 'down')} disabled={idx === sortedWidgets.length - 1} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30 text-sm">
                    ▼
                  </button>
                </div>

                {/* Visibility toggle */}
                <button onClick={() => toggleWidgetVisibility(widget.id)} className={`w-10 h-6 rounded-full transition-colors ${widget.visible ? 'bg-emerald-500' : 'bg-white/20'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${widget.visible ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={resetDashboardLayout} className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
            🔄 Restaurar configuración predeterminada
          </button>
        </div>
      </Modal>
      {/* ========== END DASHBOARD SETTINGS MODAL ========== */}

      {/* ========== A3.3 AI COPILOT MODAL ========== */}
      <Modal isOpen={showCopilot} onClose={() => setShowCopilot(false)} title="🤖 Copiloto Financiero">
        <div className="space-y-4">
          <p className="text-sm text-white/60">Análisis inteligente basado en tus patrones de gasto</p>

          <div className="space-y-3">
            {getAICopilotSuggestions().map((suggestion, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${suggestion.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  suggestion.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                    suggestion.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                      suggestion.type === 'insight' ? 'bg-purple-500/10 border-purple-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                  }`}
                onClick={suggestion.action}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    <p className="text-sm text-white/70 mt-1">{suggestion.text}</p>
                  </div>
                  {suggestion.action && (
                    <span className="text-white/40 text-xs">→</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => { setShowCopilot(false); setShowSavingsRules(true); }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-medium"
            >
              🎯 Configurar Ahorro Automático
            </button>
          </div>
        </div>
      </Modal>
      {/* ========== END AI COPILOT MODAL ========== */}

      {/* ========== A3.4 AUTOMATIC SAVINGS RULES MODAL ========== */}
      <Modal isOpen={showSavingsRules} onClose={() => setShowSavingsRules(false)} title="🎯 Reglas de Ahorro Automático">
        <div className="space-y-4">
          {savingsRules.length === 0 && !showAddSavingsRule ? (
            <div className="text-center py-8">
              <span className="text-4xl">🐷</span>
              <p className="mt-3 text-white/60">No tienes reglas de ahorro</p>
              <p className="text-sm text-white/40 mt-1">Automatiza tus ahorros para alcanzar tus metas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savingsRules.map(rule => (
                <div key={rule.id} className={`p-4 rounded-xl ${rule.active ? 'bg-white/10' : 'bg-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {rule.type === 'fixed' ? '💰' : rule.type === 'percentage' ? '📊' : '🔄'}
                      </span>
                      <div>
                        <p className={`font-medium ${rule.active ? '' : 'text-white/40'}`}>{rule.name}</p>
                        <p className="text-sm text-white/50">
                          {rule.type === 'fixed' && `${rule.amount}${currency} ${rule.frequency === 'monthly' ? '/mes' : rule.frequency === 'weekly' ? '/semana' : '/día'}`}
                          {rule.type === 'percentage' && `${rule.amount}% de cada ingreso`}
                          {rule.type === 'roundup' && 'Redondeo de gastos'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSavingsRule(rule.id)}
                      className={`w-12 h-7 rounded-full transition-colors ${rule.active ? 'bg-emerald-500' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-1 ${rule.active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-white/40">
                      Total ahorrado: <span className="text-emerald-400">{rule.totalSaved?.toLocaleString() || 0}{currency}</span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => executeSavingsRule(rule)}
                        disabled={!rule.active}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs disabled:opacity-40"
                      >
                        Ejecutar
                      </button>
                      <button
                        onClick={() => deleteSavingsRule(rule.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddSavingsRule ? (
            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
              <input
                type="text"
                placeholder="Nombre de la regla"
                value={newSavingsRule.name}
                onChange={(e) => setNewSavingsRule(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20"
              />

              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'fixed', icon: '💰', label: 'Fijo' },
                  { type: 'percentage', icon: '📊', label: '%' },
                  { type: 'roundup', icon: '🔄', label: 'Redondeo' }
                ].map(t => (
                  <button
                    key={t.type}
                    onClick={() => setNewSavingsRule(prev => ({ ...prev, type: t.type }))}
                    className={`p-3 rounded-xl text-center ${newSavingsRule.type === t.type ? 'bg-emerald-500' : 'bg-white/10'}`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <p className="text-xs mt-1">{t.label}</p>
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder={newSavingsRule.type === 'percentage' ? 'Porcentaje (ej: 10)' : 'Monto'}
                value={newSavingsRule.amount}
                onChange={(e) => setNewSavingsRule(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full p-3 bg-white/10 rounded-xl border border-white/20"
              />

              {newSavingsRule.type !== 'roundup' && (
                <select
                  value={newSavingsRule.frequency}
                  onChange={(e) => setNewSavingsRule(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  {newSavingsRule.type === 'percentage' && <option value="per-income">Por ingreso</option>}
                </select>
              )}

              {savingsGoals.length > 0 && (
                <select
                  value={newSavingsRule.goalId}
                  onChange={(e) => setNewSavingsRule(prev => ({ ...prev, goalId: e.target.value }))}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20"
                >
                  <option value="">Sin meta vinculada</option>
                  {savingsGoals.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              )}

              <div className="flex gap-2">
                <button onClick={() => setShowAddSavingsRule(false)} className="flex-1 py-3 bg-white/10 rounded-xl">
                  Cancelar
                </button>
                <button onClick={addSavingsRule} className="flex-1 py-3 bg-emerald-500 rounded-xl font-medium">
                  Crear Regla
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddSavingsRule(true)}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-medium"
            >
              + Nueva Regla de Ahorro
            </button>
          )}
        </div>
      </Modal>
      {/* ========== END AUTOMATIC SAVINGS RULES MODAL ========== */}

      {/* Split Transaction Modal */}
      <Modal isOpen={showSplitModal} onClose={() => setShowSplitModal(false)} title="Dividir transacción">
        {splitTransaction && (
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm text-white/60">Transacción original</p>
              <p className="font-bold text-lg">-{splitTransaction.amount.toLocaleString()}{currency}</p>
              <p className="text-sm text-white/40">{splitTransaction.description || getCategoryInfo(splitTransaction.category, 'expense').name}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/60">Dividir en:</label>
                <span className="text-xs text-white/40">
                  Total: {splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0).toLocaleString()}{currency}
                </span>
              </div>

              {splits.map((split, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Split {index + 1}</span>
                    {splits.length > 1 && (
                      <button
                        onClick={() => removeSplitRow(index)}
                        className="text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={split.category}
                      onChange={(e) => updateSplit(index, 'category', e.target.value)}
                      className="col-span-2 bg-white/10 rounded-lg p-2 text-sm outline-none"
                    >
                      <option value="">Categoría</option>
                      {expenseCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={split.amount}
                      onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                      placeholder="0"
                      className="bg-white/10 rounded-lg p-2 text-sm outline-none text-right"
                    />
                  </div>
                  <input
                    type="text"
                    value={split.description}
                    onChange={(e) => updateSplit(index, 'description', e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="w-full bg-white/10 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              ))}

              <button
                onClick={addSplitRow}
                className="w-full py-2 bg-white/5 rounded-xl text-sm text-white/60 border border-dashed border-white/20"
              >
                + Añadir otra división
              </button>
            </div>

            {/* Validation message */}
            {splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0) !== splitTransaction.amount && (
              <p className="text-xs text-amber-400 text-center">
                ⚠️ El total de splits debe ser igual al monto original ({splitTransaction.amount}{currency})
              </p>
            )}

            <button
              onClick={saveSplitTransaction}
              disabled={splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0) !== splitTransaction.amount}
              className={`w-full py-4 rounded-xl font-bold ${splits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0) === splitTransaction.amount
                ? 'bg-violet-500'
                : 'bg-white/10 text-white/30'
                }`}
            >
              Guardar división
            </button>
          </div>
        )}
      </Modal>

      {/* Add Wallet Modal */}
      <Modal isOpen={showAddWallet} onClose={() => setShowAddWallet(false)} title="Nueva billetera">
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-2 block">Nombre</label>
          <input
            type="text"
            value={newWallet.name}
            onChange={(e) => setNewWallet(w => ({ ...w, name: e.target.value }))}
            placeholder="Ej: Vacaciones, Gastos casa..."
            className="w-full bg-white/10 rounded-xl p-3 outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-white/60 mb-2 block">Icono</label>
          <div className="flex gap-2 flex-wrap">
            {walletIcons.map(icon => (
              <button
                key={icon}
                onClick={() => setNewWallet(w => ({ ...w, icon }))}
                className={`w-10 h-10 rounded-xl text-xl ${newWallet.icon === icon ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="text-sm text-white/60 mb-2 block">Color</label>
          <div className="flex gap-2 flex-wrap">
            {walletColors.map(color => (
              <button
                key={color}
                onClick={() => setNewWallet(w => ({ ...w, color }))}
                className={`w-10 h-10 rounded-xl bg-${color}-500 ${newWallet.color === color ? 'ring-2 ring-white' : ''}`}
              />
            ))}
          </div>
        </div>
        <button
          onClick={addWallet}
          disabled={!newWallet.name}
          className={`w-full py-4 rounded-xl font-bold ${newWallet.name ? 'bg-violet-500' : 'bg-white/10 text-white/30'}`}
        >
          Crear billetera
        </button>
      </Modal>

      {/* Wallet Manager Modal */}
      <Modal isOpen={showWalletManager} onClose={() => setShowWalletManager(false)} title="Gestionar billeteras">
        <div className="space-y-3">
          {wallets.map(wallet => (
            <div key={wallet.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl bg-${wallet.color}-500/20 flex items-center justify-center text-xl`}>
                  {wallet.icon}
                </span>
                <div>
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-xs text-white/40">
                    {allModeTransactions.filter(t => t.walletId === wallet.id || (!t.walletId && wallet.id === 'main')).length} transacciones
                  </p>
                </div>
              </div>
              {wallet.id !== 'main' && (
                <button
                  onClick={() => deleteWallet(wallet.id)}
                  className="text-red-400 text-sm px-3 py-1 bg-red-500/10 rounded-lg"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => { setShowWalletManager(false); setShowAddWallet(true); }}
            className="w-full py-3 bg-white/10 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            + Añadir billetera
          </button>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Configuración Finanzas">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Modos activos</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>Personal</span>
                </div>
                <button
                  onClick={() => setData(prev => ({ ...prev, finances: { ...prev.finances, personalEnabled: !personalEnabled } }))}
                  className={`w-12 h-6 rounded-full transition-all ${personalEnabled ? 'bg-emerald-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${personalEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>💼</span>
                  <span>Empresa/Autónomo</span>
                </div>
                <button
                  onClick={() => setData(prev => ({ ...prev, finances: { ...prev.finances, businessEnabled: !businessEnabled } }))}
                  className={`w-12 h-6 rounded-full transition-all ${businessEnabled ? 'bg-violet-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${businessEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Moneda</label>
            <div className="flex gap-2">
              {['€', '$', '£', '¥'].map(c => (
                <button
                  key={c}
                  onClick={() => setData(prev => ({ ...prev, finances: { ...prev.finances, currency: c } }))}
                  className={`flex-1 py-3 rounded-xl text-xl ${currency === c ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Manager */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-white/60">Billeteras</label>
                <p className="text-xs text-white/40">{wallets.length} billeteras activas</p>
              </div>
              <button
                onClick={() => { setShowSettings(false); setShowWalletManager(true); }}
                className="text-xs px-3 py-2 bg-violet-500/20 text-violet-400 rounded-lg"
              >
                Gestionar
              </button>
            </div>
          </div>

          {/* Categorization Rules */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/60">Reglas de categorización</label>
              <button
                onClick={() => setShowAddRule(!showAddRule)}
                className="text-xs text-violet-400"
              >
                + Añadir regla
              </button>
            </div>

            {showAddRule && (
              <div className="p-3 bg-white/5 rounded-xl mb-3 space-y-2">
                <input
                  type="text"
                  value={newRule.keyword}
                  onChange={(e) => setNewRule(r => ({ ...r, keyword: e.target.value }))}
                  placeholder="Palabra clave (ej: uber)"
                  className="w-full bg-white/10 rounded-lg p-2 text-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  {expenseCategories.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewRule(r => ({ ...r, category: cat.id }))}
                      className={`px-2 py-1 rounded-lg text-xs ${newRule.category === cat.id ? 'bg-violet-500' : 'bg-white/10'}`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={addCategorizationRule}
                  className="w-full py-2 bg-violet-500 rounded-lg text-sm"
                >
                  Guardar regla
                </button>
              </div>
            )}

            {categorizationRules.length > 0 ? (
              <div className="space-y-1">
                {categorizationRules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">"{rule.keyword}"</span>
                      <span className="text-xs">→</span>
                      <span className="text-xs">{getCategoryInfo(rule.category, 'expense').icon}</span>
                    </div>
                    <button
                      onClick={() => deleteCategorizationRule(rule.id)}
                      className="text-xs text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/40">Las reglas asignan categorías automáticamente según la descripción</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};


// ============================================================================
// PERSONAL SCREEN - Simple life tasks management
// ============================================================================


export default FinancesScreen;
