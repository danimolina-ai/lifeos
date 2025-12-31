// BodyScreen - Extracted from AppPage.jsx
// Life OS v5.2

import React, { useState } from 'react';
import { Scale, TrendingUp, TrendingDown, Plus, Trash2, Camera, ChevronLeft, BookOpen, Trophy } from 'lucide-react';
import { getToday, getDateOffset, formatDate, formatShortDate, generateId } from '../utils/date';
import { Card, Modal, AnimatedMount, MiniChart, ProgressBar, EmptyState, SwipeableItem } from '../components/ui';


const BodyScreen = ({ data, setData, showToast }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [newEntry, setNewEntry] = useState({ weight: '', bodyFat: '', notes: '' });

  const metrics = (data.bodyMetrics || []).sort((a, b) => b.date.localeCompare(a.date));
  const weights = metrics.map(m => m.weight).reverse();
  const latest = metrics[0];
  const oldest = metrics[metrics.length - 1];
  const change = latest && oldest ? (latest.weight - oldest.weight).toFixed(1) : 0;

  const saveEntry = () => {
    if (!newEntry.weight) return;
    setData(prev => ({
      ...prev,
      bodyMetrics: [...(prev.bodyMetrics || []), {
        id: generateId(),
        date: getToday(),
        weight: parseFloat(newEntry.weight),
        bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : null,
        notes: newEntry.notes
      }]
    }));
    setShowAdd(false);
    setNewEntry({ weight: '', bodyFat: '', notes: '' });
    showToast('Peso registrado');
  };

  const deleteEntry = (id) => {
    setData(prev => ({ ...prev, bodyMetrics: prev.bodyMetrics.filter(m => m.id !== id) }));
    showToast('Registro eliminado');
  };

  return (
    <div className="space-y-4 pb-24">
      <AnimatedMount>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cuerpo</h1>
            <p className="text-white/50 text-sm">Métricas y progreso</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(true)} className="p-3 hover:bg-white/10 rounded-full">
              <BookOpen className="w-5 h-5 text-white/50" />
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-violet-500 rounded-full p-3">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AnimatedMount>

      {latest && (
        <AnimatedMount delay={50}>
          <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-white/40">Peso actual</p>
                <p className="text-3xl font-bold">{latest.weight} kg</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">Cambio total</p>
                <p className={`text-xl font-bold ${parseFloat(change) < 0 ? 'text-emerald-400' : parseFloat(change) > 0 ? 'text-red-400' : 'text-white/60'}`}>
                  {parseFloat(change) > 0 ? '+' : ''}{change} kg
                </p>
              </div>
            </div>
            {weights.length > 1 && <MiniChart data={weights} color="#10B981" height={60} />}
          </Card>
        </AnimatedMount>
      )}

      {metrics.length > 0 ? (
        <AnimatedMount delay={100}>
          <Card>
            <p className="font-medium mb-3">Historial</p>
            <div className="space-y-2">
              {metrics.slice(0, 10).map(m => (
                <SwipeableItem key={m.id} onDelete={() => deleteEntry(m.id)}>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">
                        {m.weight} kg
                        {m.bodyFat && <span className="text-white/40 ml-2">· {m.bodyFat}% grasa</span>}
                      </p>
                      <p className="text-xs text-white/40">{formatShortDate(m.date)}</p>
                    </div>
                  </div>
                </SwipeableItem>
              ))}
            </div>
          </Card>
        </AnimatedMount>
      ) : (
        <EmptyState icon={Scale} title="Sin registros" description="Empieza a trackear tu peso" action="Añadir peso" onAction={() => setShowAdd(true)} />
      )}

      {data.personalRecords?.length > 0 && (
        <AnimatedMount delay={150}>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">Personal Records</span>
            </div>
            <div className="space-y-2">
              {[...new Set(data.personalRecords.map(p => p.exercise))].map(ex => {
                const pr = data.personalRecords.filter(p => p.exercise === ex).sort((a, b) => b.weight - a.weight)[0];
                return (
                  <div key={ex} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-sm">{ex}</span>
                    <span className="text-sm font-bold text-yellow-400">{pr.weight}kg x{pr.reps}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </AnimatedMount>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Registrar peso">
        <input
          type="number"
          placeholder="Peso (kg)"
          value={newEntry.weight}
          onChange={(e) => setNewEntry(p => ({ ...p, weight: e.target.value }))}
          className="w-full bg-white/10 rounded-xl p-4 outline-none mb-3"
          step="0.1"
          autoFocus
        />
        <input
          type="number"
          placeholder="% Grasa corporal (opcional)"
          value={newEntry.bodyFat}
          onChange={(e) => setNewEntry(p => ({ ...p, bodyFat: e.target.value }))}
          className="w-full bg-white/10 rounded-xl p-4 outline-none mb-3"
          step="0.1"
        />
        <input
          type="text"
          placeholder="Notas (opcional)"
          value={newEntry.notes}
          onChange={(e) => setNewEntry(p => ({ ...p, notes: e.target.value }))}
          className="w-full bg-white/10 rounded-xl p-4 outline-none mb-4"
        />
        <button
          onClick={saveEntry}
          disabled={!newEntry.weight}
          className={`w-full py-4 rounded-xl font-medium ${newEntry.weight ? 'bg-violet-500' : 'bg-white/10 text-white/30'}`}
        >
          Guardar
        </button>
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Guía de Cuerpo">
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <p className="font-bold text-emerald-400 mb-1">⚖️ Seguimiento de peso</p>
            <p className="text-white/60">Pésate siempre en las mismas condiciones: mañana, en ayunas, después de ir al baño.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-blue-400 mb-1">📈 Tendencia vs día a día</p>
            <p className="text-white/60">El peso fluctúa 1-2kg al día por agua/comida. Fíjate en la media semanal, no en cada día.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-amber-400 mb-1">🎯 Ritmo saludable</p>
            <p className="text-white/60">
              <strong>Perder</strong>: 0.5-1% peso/semana<br />
              <strong>Ganar</strong>: 0.25-0.5% peso/semana<br />
              Más rápido = pérdida muscular o grasa innecesaria
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="font-bold text-violet-400 mb-1">📊 % Grasa corporal</p>
            <p className="text-white/60">Más útil que el peso. Hombres: 10-20% saludable. Mujeres: 18-28% saludable.</p>
          </div>
          <div className="p-3 bg-violet-500/20 rounded-xl">
            <p className="font-bold mb-1">💡 Tips</p>
            <p className="text-white/60">
              • Registra aunque no te guste el número<br />
              • Mínimo 3 veces/semana para ver tendencia<br />
              • Usa notas para contexto (comida, sueño, estrés)
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BodyScreen;
