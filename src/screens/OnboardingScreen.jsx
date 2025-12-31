// OnboardingScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Target, Zap, Heart, Brain, Dumbbell, Utensils, Wallet, Users } from 'lucide-react';
import { getToday, generateId } from '../utils/date';
import { Card, AnimatedMount } from '../components/ui';

const OnboardingScreen = ({ data, setData, onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goals, setGoals] = useState({ calories: 2200, protein: 180, water: 8 });
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [mantra, setMantra] = useState('');

  const steps = ['¿Cómo te llamas?', 'Tus objetivos', 'Elige hábitos', 'Tus proyectos', 'Tu mantra'];

  const handleComplete = () => {
    const today = getToday();
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        name,
        onboardingComplete: true,
        goals: { ...prev.user.goals, ...goals },
        mantra
      },
      days: {
        [today]: {
          id: today,
          energy_level: 3,
          sleep_hours: 0,
          sleep_quality: 0,
          water_glasses: 0,
          focus_note: ''
        }
      },
      habits: selectedHabits.map(h => ({
        id: generateId(),
        ...h,
        created_at: today
      })),
      habitLogs: [],
      projects: selectedProjects.map(p => ({ id: generateId(), ...p, active: true })),
      workoutTemplates: WORKOUT_TEMPLATES.map(t => ({ ...t, id: generateId() })),
    }));
    onComplete();
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleComplete();
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return goals.calories > 0;
    if (step === 2) return selectedHabits.length >= 1;
    return true;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />
      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-violet-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Title */}
        <AnimatedMount key={step}>
          <h1 className="text-3xl font-bold mb-2">{steps[step]}</h1>
          <p className="text-white/50 mb-8">
            {step === 0 && 'Personalicemos tu experiencia'}
            {step === 1 && 'Define tus metas diarias'}
            {step === 2 && 'Construye tu identidad'}
            {step === 3 && 'Organiza tu trabajo'}
            {step === 4 && 'Una frase que te impulse'}
          </p>
        </AnimatedMount>

        {/* Content */}
        <AnimatedMount key={`content-${step}`} delay={100} className="flex-1">
          {step === 0 && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl outline-none focus:border-violet-500 transition-colors"
            />
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Calorías diarias</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="1200" max="4000" step="50"
                    value={goals.calories}
                    onChange={(e) => setGoals(g => ({ ...g, calories: parseInt(e.target.value) }))}
                    className="flex-1 accent-violet-500"
                  />
                  <span className="text-2xl font-bold w-24 text-right">{goals.calories}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Proteína (g)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="50" max="300" step="5"
                    value={goals.protein}
                    onChange={(e) => setGoals(g => ({ ...g, protein: parseInt(e.target.value) }))}
                    className="flex-1 accent-violet-500"
                  />
                  <span className="text-2xl font-bold w-24 text-right">{goals.protein}g</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Vasos de agua</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="4" max="12" step="1"
                    value={goals.water}
                    onChange={(e) => setGoals(g => ({ ...g, water: parseInt(e.target.value) }))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-2xl font-bold w-24 text-right">{goals.water} 💧</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {SAMPLE_HABITS.map(h => (
                <button
                  key={h.name}
                  onClick={() => setSelectedHabits(prev =>
                    prev.find(x => x.name === h.name)
                      ? prev.filter(x => x.name !== h.name)
                      : [...prev, h]
                  )}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all
                    ${selectedHabits.find(x => x.name === h.name)
                      ? 'bg-violet-500/20 border-2 border-violet-500'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'}
                  `}
                >
                  <span className="text-2xl">{h.icon}</span>
                  <span className="flex-1 text-left">{h.name}</span>
                  {selectedHabits.find(x => x.name === h.name) && (
                    <Check className="w-5 h-5 text-violet-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {SAMPLE_PROJECTS.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedProjects(prev =>
                    prev.find(x => x.name === p.name)
                      ? prev.filter(x => x.name !== p.name)
                      : [...prev, p]
                  )}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all
                    ${selectedProjects.find(x => x.name === p.name)
                      ? 'bg-white/10 border-2 border-white/30'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'}
                  `}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 text-left">{p.name}</span>
                  {selectedProjects.find(x => x.name === p.name) && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <textarea
                value={mantra}
                onChange={(e) => setMantra(e.target.value)}
                placeholder="Ej: Disciplina es libertad..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-lg outline-none focus:border-violet-500 resize-none"
              />
              <p className="text-sm text-white/40">
                Este mantra aparecerá cada día para recordarte tu propósito.
              </p>
            </div>
          )}
        </AnimatedMount>

        {/* Navigation */}
        <div className="flex gap-3 pt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Atrás
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
              ${canProceed()
                ? 'bg-violet-500 hover:bg-violet-600'
                : 'bg-white/10 text-white/30 cursor-not-allowed'}
            `}
          >
            {step === 4 ? (
              <><Sparkles className="w-5 h-5" />Empezar</>
            ) : (
              <>Siguiente<ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TODAY SCREEN - COMMAND CENTER
// ============================================================================


export default OnboardingScreen;
