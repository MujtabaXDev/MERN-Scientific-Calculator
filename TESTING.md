# TESTING.md

## Testing Guide for MERN Calculator

### Unit Tests & Verification

#### 1. Backend Health Check
```bash
curl http://localhost:5000/api/health
```
**Expected Response:**
```json
{ "status": "ok" }
```

#### 2. History API Tests

**Fetch all history:**
```bash
curl http://localhost:5000/api/history
```

**Add a calculation:**
```bash
curl -X POST http://localhost:5000/api/history \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "2+2",
    "result": "4",
    "mode": "COMP",
    "angleUnit": "DEG"
  }'
```

**Delete all history:**
```bash
curl -X DELETE http://localhost:5000/api/history
```

---

### 2. Calculator Feature Tests

#### COMP Mode (Basic Arithmetic)
- ✅ `2 + 2 = 4`
- ✅ `10 - 3 = 7`
- ✅ `5 × 6 = 30`
- ✅ `20 ÷ 4 = 5`
- ✅ `(-5) = -5` (negation)

#### Powers & Roots
- ✅ `2²= 4` (x²)
- ✅ `2³ = 8` (x³)
- ✅ `2^3 = 8` (x^y)
- ✅ `√16 = 4`
- ✅ `∛27 = 3`

#### Trigonometry
- ✅ `sin(90°) = 1` (DEG mode)
- ✅ `cos(0°) = 1`
- ✅ `tan(45°) = 1`
- ✅ Switch to RAD/GRAD modes

#### Logarithms
- ✅ `log(100) = 2`
- ✅ `ln(e) = 1`
- ✅ `10^2 = 100`
- ✅ `e^1 = e`

#### Combinatorics
- ✅ `5! = 120`
- ✅ `5 nCr 2 = 10`
- ✅ `5 nPr 2 = 20`

#### Complex Mode (CMPLX)
- ✅ `√(-4) = 2i`
- ✅ `(1+2i) + (3+4i) = 4+6i`

#### STAT Mode
- Add data: `1, 2, 3`
- Verify: n=3, Σx=6, mean=2

#### BASE-N Mode
- ✅ `10 (DEC) = 1010 (BIN)`
- ✅ `255 (DEC) = FF (HEX)`
- ✅ `A AND B = A (bitwise)`

#### EQN Mode
- ✅ 2×2 linear system solver
- ✅ Quadratic equation solver
- ✅ Cubic equation solver

#### MATRIX Mode
- ✅ 2×2 and 3×3 matrices
- ✅ Matrix addition/subtraction
- ✅ Matrix multiplication
- ✅ Determinant & inverse

#### VECTOR Mode
- ✅ 2D and 3D vectors
- ✅ Dot product
- ✅ Cross product
- ✅ Magnitude

#### TABLE Mode
- ✅ Generate table for f(x) = x² from 0 to 10

#### S⇔D (Fraction Toggle)
- ✅ `1/3 ↔ 0.333...`
- ✅ Continued fraction approximations

#### SOLVE Mode
- ✅ `SHIFT+CALC`: numeric root finder
- ✅ Solve `X² - 4 = 0` → X = 2 or -2

#### Memory Functions
- ✅ `M+`: add to memory
- ✅ `M−`: subtract from memory
- ✅ `STO`: store value
- ✅ `RCL`: recall value

#### Constants
- ✅ π = 3.14159...
- ✅ e = 2.71828...
- ✅ Ran# (random 0-1)

---

### 3. UI/UX Tests

- ✅ All buttons respond to clicks
- ✅ Keyboard input works (numbers, operators, functions)
- ✅ SHIFT/ALPHA/HYP keys toggle properly
- ✅ Mode switching works (MENU button)
- ✅ History panel shows/hides
- ✅ Display updates in real-time
- ✅ Cursor navigation (◄/►)
- ✅ ▲/▼ replay of calculation history

---

### 4. Database Tests

**Verify history is saved to MongoDB:**
```bash
mongosh
use casio_calculator
db.histories.find().pretty()
```

**Check MongoDB indexes:**
```bash
db.histories.getIndexes()
```

---

### 5. Performance Tests

- ✅ Load time < 2 seconds
- ✅ Calculation response < 100ms
- ✅ History retrieval < 500ms
- ✅ No memory leaks (DevTools → Performance tab)

---

### 6. Regression Tests (Run After Each Update)

```bash
# Clear all tests
npm test

# If using Jest or Mocha, add:
npm run test -- --coverage
```

---

### 7. Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

### 8. Mobile/Responsive Tests

- ✅ Layout adapts to tablet (iPad)
- ✅ Layout adapts to mobile (iPhone 12)
- ✅ Touch input works (no hover states broken)

---

## Continuous Integration (Optional)

Create `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -ws
      - run: npm run lint -ws
      - run: npm run test -ws
```

---

## Known Limitations & Edge Cases

1. **Very large numbers**: mathjs may lose precision for numbers > 10^15
2. **Nested parentheses**: deeply nested expressions may cause stack overflow
3. **Memory persistence**: M+ / M- are per-session (not saved to DB)
4. **INEQ mode**: not implemented
5. **Natural Display**: not implemented (linear notation used instead)

---

## Support

For issues, see the main README.md or create a GitHub issue.
