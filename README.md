# fx-991ES PLUS — MERN Clone

A MongoDB + Express + React + Node app that recreates the Casio fx-991ES PLUS scientific calculator, with a persistent calculation history stored in MongoDB.

I tested the math engine (35+ checks against known correct values), built the React client (`vite build` succeeds cleanly), and boot-tested the Express server, including its no-database fallback. I could not run a real MongoDB instance inside this sandbox (its download domain isn't reachable here), so the full save/load-history flow is verified by code review + a live no-DB run, not an end-to-end DB test — please confirm that part works on your machine on first run.

## What's implemented (COMP mode + all major secondary modes)

- **Basic arithmetic**: `+ − × ÷`, parentheses, negation, `%` (implemented as ÷100 — see note below)
- **Powers/roots**: `x²`, `x³`, `x^y`, `x⁻¹` (via `x^y` then `-1`), `√`, `∛`
- **Logs/exponentials**: `log` (base 10), `ln`, `10^x`, `eˣ`
- **Trig**: `sin cos tan` and inverses (`SHIFT`+key), plus `hyp` for `sinh/cosh/tanh` and their inverses — DEG/RAD/GRAD switchable via `SHIFT+MENU` (SETUP)
- **Combinatorics**: `nCr`, `nPr`, `x!`
- **Constants**: `π`, `e`, `Ran#`
- **Memory**: `M+`, `M−`, `STO`, `RCL`
- **Ans**, cursor navigation, and a `▲/▼` replay of your last calculations
- **S⇔D**: decimal ⇄ simple-fraction toggle (continued-fraction approximation)
- **SOLVE** (`SHIFT+CALC`): numeric root finder for `f(X)=0` or `left=right` expressions
- **CMPLX mode**: complex-number arithmetic (powered by mathjs, e.g. `sqrt(-4)` → `2i`)
- **STAT mode**: n, Σx, Σx², mean, population SD, sample SD for a data list
- **BASE-N mode**: BIN/OCT/DEC/HEX conversion + AND/OR/XOR/NOT/shifts
- **EQN mode**: 2- and 3-unknown linear systems, quadratic and cubic solvers
- **MATRIX mode**: add/subtract/multiply/determinant/inverse/transpose for 2×2 and 3×3
- **VECTOR mode**: add/subtract/dot/cross/magnitude for 2D and 3D
- **TABLE mode**: generates a table of f(X) over a range
- **Pol()/Rec()** conversion panel

## Honest limitations (things I deliberately simplified or left out)

- **INEQ mode is not implemented** — everything else on the mode menu is.
- **No "Natural Display" (textbook) rendering.** Fractions, roots, and powers are shown as plain text/linear notation, not the real device's stacked textbook typesetting.
- **`%` is a straight ÷100.** The real device's `%` key is contextual (e.g. "increase by X%"); this covers the common case but not every nuance.
- **`x⁻¹` requires two keystrokes** (`x^y` then `-1`) instead of one dedicated key, to keep the keypad size reasonable.
- **`nCr`/`nPr` as infix** (e.g. `5 nCr 2`) is supported via text preprocessing that handles simple numbers or one level of parentheses around each operand — deeply nested expressions on both sides of `nCr`/`nPr` may need extra parentheses.
- The physical button layout is a functional recreation, not a pixel-identical copy of the photo.

## Project structure

```
mern-calculator/
  server/   Express + Mongoose API (calculation history)
  client/   React + Vite frontend (all calculator logic, via mathjs)
```

## Running it locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run dev                # or: npm start
```
Requires a MongoDB instance reachable at `MONGO_URI` (local `mongod`, Docker, or Atlas). If MongoDB isn't reachable, the server still starts (health check works) but history save/load will error — the calculator itself still works fully.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
Open the printed local URL (default `http://localhost:5173`). Vite proxies `/api` calls to `http://localhost:5000`.

### 3. Production build
```bash
cd client && npm run build
```
Serve the resulting `client/dist` folder with any static host, or wire it into `server.js` with `express.static`.

## Quick usage notes

- `SHIFT` then a key uses that key's secondary (yellow) function; `ALPHA` then `)` inserts `X` (used by SOLVE/TABLE).
- `MENU` opens the mode list (COMP, CMPLX, STAT, BASE-N, EQN, MATRIX, TABLE, VECTOR).
- `SHIFT+MENU` cycles the angle unit (DEG → RAD → GRAD).
- `SHIFT+CALC` runs SOLVE on the current expression.
