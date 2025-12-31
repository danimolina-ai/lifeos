// SleepInput - Sleep hours and quality input component
import React, { useState } from 'react';

export const SleepInput = ({ hours, quality, onSave }) => {
    const [h, setH] = useState(hours || 7);
    const [q, setQ] = useState(quality || 3);

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Horas de sueño</span>
                    <span className="font-bold">{h}h</span>
                </div>
                <input
                    type="range" min="0" max="12" step="0.5" value={h}
                    onChange={(e) => setH(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>
            <div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Calidad</span>
                    <span className="text-white/40 text-xs">{['', 'Muy mal', 'Mal', 'Normal', 'Bien', 'Excelente'][q]}</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <button
                            key={i}
                            onClick={() => setQ(i)}
                            className={`flex-1 h-10 rounded-lg transition-all ${i <= q ? 'bg-blue-500' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>
            <button
                onClick={() => onSave?.({ hours: h, quality: q })}
                className="w-full bg-blue-500 py-3 rounded-xl font-medium"
            >
                Guardar
            </button>
        </div>
    );
};

export default SleepInput;
