# 💰 LifeOS Finance - Implementation Roadmap

> Ordenado de **más fácil a más difícil** y de **interno a externo**

---

## 🟢 BLOQUE A: 100% INTERNO

### TIER 1 — Quick Wins ✅ COMPLETADO
- [x] A1.1 Transacciones mejoradas (tags, notes)
- [x] A1.2 Edición masiva
- [x] A1.3 Reglas de categorización automática
- [x] A1.4 Alertas internas básicas

---

### TIER 2 — Medium ✅ COMPLETADO
- [x] A2.1 Billeteras / Wallets
- [x] A2.2 Split de transacciones
- [x] A2.3 Gastos no mensuales (prorrateo)
- [x] A2.4 Net Worth manual
- [x] A2.5 Weekly/Monthly Review

---

### TIER 3 — Advanced ✅ COMPLETADO
- [x] A3.1 Gastos compartidos (Splitwise)
- [x] A3.2 Dashboard configurable
- [x] A3.3 Copiloto IA (datos internos)
- [x] A3.4 Reglas de ahorro automático

---

### TIER 4 — Estratega Financiero 🆕

#### A4.1 Income Streams Tracker
**Dificultad:** ⭐⭐ | **Impacto:** ⭐⭐⭐⭐⭐
```
IncomeStream:
├─ id, name, type (freelance/passive/investment/business)
├─ monthlyTarget, actualEarnings: [{ month, amount }]
├─ timeInvested (horas/mes)
├─ roiPerHour (calculado)
└─ status: exploring | active | scaling | retired
```
- [ ] CRUD de fuentes de ingreso
- [ ] Track ingresos mensuales por fuente
- [ ] Calcular €/hora por proyecto
- [ ] Gráfico de diversificación de ingresos
- [ ] Meta de ingresos pasivos vs activos
- [ ] Dashboard card con resumen

---

#### A4.2 Financial Simulator ("¿Qué pasa si...?")
**Dificultad:** ⭐⭐⭐ | **Impacto:** ⭐⭐⭐⭐⭐
```
Scenario:
├─ id, name
├─ baselineData (current finances snapshot)
├─ adjustments: { income: +500, expenses.rent: -200, savings: +100 }
├─ projectedMonths: 12 | 60 | 120
└─ results: { netWorth[], savingsRate, monthsToGoal }
```
- [ ] Crear escenario con ajustes
- [ ] "¿Qué pasa si gano 500€ más?"
- [ ] "¿Cuánto ahorraría si corto Netflix + Gym?"
- [ ] Proyección patrimonio a 1/5/10 años
- [ ] Comparar escenarios lado a lado
- [ ] Gráfico de proyección temporal

---

#### A4.3 Financial Challenges (Gamificación)
**Dificultad:** ⭐⭐ | **Impacto:** ⭐⭐⭐⭐
```
Challenge:
├─ id, type, name
├─ rules: { maxSpend?, category?, duration }
├─ startDate, endDate
├─ progress, streak, completed
└─ linkedGoal? (opcional)
```
**Tipos de retos:**
- [ ] No-Spend Week (semana sin gastos innecesarios)
- [ ] 52-Week Savings (ahorra 1€ semana 1, 2€ semana 2...)
- [ ] Category Diet (reduce 50% en una categoría)
- [ ] Debt Snowball (paga X extra a deudas)
- [ ] Streak counter + logros desbloqueables
- [ ] Notificaciones de motivación

---

#### A4.4 Financial Calendar
**Dificultad:** ⭐⭐ | **Impacto:** ⭐⭐⭐
- [ ] Vista calendario mensual
- [ ] Mostrar transacciones por día
- [ ] Días de cobro destacados
- [ ] Gastos recurrentes proyectados
- [ ] Cash flow diario visual
- [ ] Click en día → ver detalle

---

#### A4.5 Debt Payoff Calculator
**Dificultad:** ⭐⭐⭐ | **Impacto:** ⭐⭐⭐⭐
```
Debt:
├─ id, name, type (credit/loan/mortgage)
├─ balance, interestRate (APR)
├─ minPayment, extraPayment
├─ strategy: 'snowball' | 'avalanche'
└─ history: [{ date, payment, principal, interest, remaining }]
```
- [ ] Lista de deudas con saldos
- [ ] Calcular fecha de libertad de deudas
- [ ] Comparar Snowball vs Avalanche
- [ ] Visualizar progreso de payoff
- [ ] Simular pagos extra
- [ ] Motivación: "Te ahorras X€ en intereses"

---

## 🔴 BLOQUE B: CONEXIONES EXTERNAS

### TIER 5 — Preparar Arquitectura (futuro)
- [ ] `TransactionSource: 'manual' | 'bank' | 'import'`
- [ ] `externalId` para evitar duplicados
- [ ] `pendingReview` para transacciones importadas
- [ ] Interfaz abstracta `BankProvider`

---

### TIER 6 — Integraciones Externas (NO implementar)

| Feature | Riesgo | Alternativa Interna |
|---------|--------|---------------------|
| Agregación bancaria | Alto | Import CSV ✅ |
| Detección suscripciones | Medio | Lista manual ✅ |
| Pagos Bizum/SEPA | Muy alto | Settle up manual ✅ |
| Inversiones/Brokers | Muy alto | Net worth manual ✅ |

---

## 📊 Resumen de Progreso

| Tier | Estado | Features |
|------|--------|----------|
| 1 | ✅ | Tags, edición masiva, reglas, alertas |
| 2 | ✅ | Wallets, splits, gastos periódicos, net worth, review |
| 3 | ✅ | Shared expenses, dashboard config, copiloto IA, ahorro auto |
| 4 | 🆕 | Income streams, simulador, retos, calendario, debt payoff |
| 5+ | ⏳ | Integraciones externas (futuro) |

---

## 🎯 Siguiente Paso Recomendado

**A4.1 Income Streams** → Complementa tracking de gastos con tracking de ingresos
