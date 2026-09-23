import React, { useState } from "react";
import {
  calcEvaluate,
  decimalToFraction,
  fractionToString,
  solveNewton,
} from "../engine/engine";

const MODES = [
  "COMP",
  "CMPLX",
  "STAT",
  "BASE-N",
  "EQN",
  "MATRIX",
  "TABLE",
  "VECTOR",
];

function preprocess(expr) {
  // Turn Casio-style infix "5 nCr 2" / "5 nPr 2" into function-call form nCr(5,2)/nPr(5,2)
  const opPattern = /([\w.]+|\([^()]*\))\s*(nCr|nPr)\s*([\w.]+|\([^()]*\))/g;
  let prev;
  let out = expr;
  let guard = 0;
  do {
    prev = out;
    out = out.replace(opPattern, (m, a, op, b) => `${op}(${a},${b})`);
    guard++;
  } while (out !== prev && guard < 10);
  return out;
}

export default function Calculator({
  mode,
  setMode,
  angleUnit,
  setAngleUnit,
  onResult,
}) {
  const [expr, setExpr] = useState("");
  const [cursor, setCursor] = useState(0);
  const [display, setDisplay] = useState("0");
  const [Ans, setAns] = useState(0);
  const [M, setM] = useState(0);
  const [shiftActive, setShiftActive] = useState(false);
  const [alphaActive, setAlphaActive] = useState(false);
  const [hypActive, setHypActive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [fractionView, setFractionView] = useState(false);
  const [localHistory, setLocalHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [error, setError] = useState(false);

  const complexMode = mode === "CMPLX";

  function insert(text) {
    const newExpr = expr.slice(0, cursor) + text + expr.slice(cursor);
    setExpr(newExpr);
    setCursor(cursor + text.length);
  }

  function backspace() {
    if (cursor === 0) return;
    setExpr(expr.slice(0, cursor - 1) + expr.slice(cursor));
    setCursor(cursor - 1);
  }

  function clearAll() {
    setExpr("");
    setCursor(0);
    setDisplay("0");
    setError(false);
  }

  function fullReset() {
    clearAll();
    setAns(0);
    setM(0);
    setMode("COMP");
    setAngleUnit("DEG");
    setShiftActive(false);
    setAlphaActive(false);
    setHypActive(false);
    setFractionView(false);
  }

  function pushHistory(e, r) {
    const entry = { expression: e, result: String(r), mode, angleUnit };
    setLocalHistory((h) => [entry, ...h].slice(0, 100));
    setHistIdx(-1);
    onResult && onResult(entry);
  }

  function doEvaluate() {
    try {
      const clean = preprocess(expr || "0");
      const result = calcEvaluate(clean, {
        mode: angleUnit,
        complexMode,
        Ans,
        M,
      });
      const shown =
        typeof result === "object" && result.toString
          ? result.toString()
          : result;
      setDisplay(String(shown));
      setAns(typeof result === "number" ? result : Ans);
      setError(false);
      pushHistory(expr, shown);
    } catch (e) {
      setDisplay("Math ERROR");
      setError(true);
    }
  }

  function doSolve() {
    try {
      let target = expr;
      if (target.includes("=")) {
        const [l, r] = target.split("=");
        target = `(${l})-(${r})`;
      }
      const root = solveNewton(preprocess(target), Ans || 1, {
        mode: angleUnit,
      });
      setDisplay(`X = ${Math.round(root * 1e9) / 1e9}`);
      setAns(root);
      pushHistory(`SOLVE: ${expr}`, root);
      setError(false);
    } catch (e) {
      setDisplay("Can't Solve");
      setError(true);
    }
  }

  function toggleFractionView() {
    const num = parseFloat(display);
    if (Number.isNaN(num)) return;
    if (!fractionView) {
      setDisplay(fractionToString(decimalToFraction(num)));
    } else {
      setDisplay(String(num));
    }
    setFractionView(!fractionView);
  }

  function consumeModifiers(mainFn, shiftFn, hypFn, hypShiftFn) {
    let fn = mainFn;
    if (hypActive && shiftActive && hypShiftFn) fn = hypShiftFn;
    else if (hypActive && hypFn) fn = hypFn;
    else if (shiftActive && shiftFn) fn = shiftFn;
    fn && fn();
    setShiftActive(false);
    setHypActive(false);
  }

  function press(btn) {
    if (btn.id === "SHIFT") {
      setShiftActive((v) => !v);
      return;
    }
    if (btn.id === "ALPHA") {
      setAlphaActive((v) => !v);
      return;
    }
    if (btn.id === "HYP") {
      setHypActive((v) => !v);
      return;
    }

    if (alphaActive && btn.alpha) {
      insert(btn.alpha);
      setAlphaActive(false);
      return;
    }

    if (btn.id === "LEFT") {
      setCursor((c) => Math.max(0, c - 1));
      return;
    }
    if (btn.id === "RIGHT") {
      setCursor((c) => Math.min(expr.length, c + 1));
      return;
    }
    if (btn.id === "UP") {
      const idx = Math.min(histIdx + 1, localHistory.length - 1);
      if (localHistory[idx]) {
        setExpr(localHistory[idx].expression);
        setCursor(localHistory[idx].expression.length);
        setHistIdx(idx);
      }
      return;
    }
    if (btn.id === "DOWN") {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      if (idx === -1) {
        setExpr("");
        setCursor(0);
      } else {
        setExpr(localHistory[idx].expression);
        setCursor(localHistory[idx].expression.length);
      }
      return;
    }
    if (btn.id === "MENU") {
      if (shiftActive) {
        // SHIFT+MENU = SETUP -> cycle angle unit
        setAngleUnit((u) =>
          u === "DEG" ? "RAD" : u === "RAD" ? "GRAD" : "DEG",
        );
        setShiftActive(false);
      } else {
        setShowMenu((v) => !v);
      }
      return;
    }
    if (btn.id === "ON") {
      fullReset();
      return;
    }
    if (btn.id === "AC") {
      clearAll();
      return;
    }
    if (btn.id === "DEL") {
      backspace();
      return;
    }
    if (btn.id === "CALC" || btn.id === "EQ") {
      shiftActive && btn.id === "CALC"
        ? (doSolve(), setShiftActive(false))
        : doEvaluate();
      return;
    }
    if (btn.id === "SD") {
      toggleFractionView();
      return;
    }

    if (btn.id === "STO") {
      try {
        const v = calcEvaluate(preprocess(expr || String(Ans)), {
          mode: angleUnit,
          complexMode,
          Ans,
          M,
        });
        setM(v);
        setDisplay(`M = ${v}`);
        clearAll();
      } catch {
        setDisplay("Math ERROR");
      }
      return;
    }
    if (btn.id === "MPLUS") {
      try {
        const v = calcEvaluate(preprocess(expr || String(Ans)), {
          mode: angleUnit,
          complexMode,
          Ans,
          M,
        });
        setM((m) => m + v);
        setDisplay(`M = ${M + v}`);
        clearAll();
      } catch {
        setDisplay("Math ERROR");
      }
      return;
    }
    if (btn.id === "MMINUS") {
      try {
        const v = calcEvaluate(preprocess(expr || String(Ans)), {
          mode: angleUnit,
          complexMode,
          Ans,
          M,
        });
        setM((m) => m - v);
        setDisplay(`M = ${M - v}`);
        clearAll();
      } catch {
        setDisplay("Math ERROR");
      }
      return;
    }

    if (btn.id === "SIN")
      return consumeModifiers(
        () => insert("sin("),
        () => insert("asin("),
        () => insert("sinh("),
        () => insert("asinh("),
      );
    if (btn.id === "COS")
      return consumeModifiers(
        () => insert("cos("),
        () => insert("acos("),
        () => insert("cosh("),
        () => insert("acosh("),
      );
    if (btn.id === "TAN")
      return consumeModifiers(
        () => insert("tan("),
        () => insert("atan("),
        () => insert("tanh("),
        () => insert("atanh("),
      );

    if (shiftActive && btn.shift) {
      insert(btn.shift);
      setShiftActive(false);
      return;
    }
    if (btn.main) insert(btn.main);
  }

  const rows = [
    [
      { id: "SHIFT", main: "SHIFT", cls: "k-shift" },
      { id: "ALPHA", main: "ALPHA", cls: "k-alpha" },
      { id: "LEFT", main: "◀", cls: "k-nav" },
      { id: "UP", main: "▲", cls: "k-nav" },
      { id: "MENU", main: "MODE", shift: "SETUP", cls: "k-fn" },
    ],
    [
      { id: "RIGHT", main: "▶", cls: "k-nav" },
      { id: "DOWN", main: "▼", cls: "k-nav" },
      { id: "OPTN", main: "OPTN", cls: "k-fn" },
      { id: "CALC", main: "CALC", shift: "SOLVE", cls: "k-fn" },
      { id: "ON", main: "ON", cls: "k-on" },
    ],
    [
      {
        id: "SQRT",
        main: "sqrt(",
        shift: "cbrt(",
        cls: "k-fn",
        label: "√",
        shiftLabel: "∛",
      },
      {
        id: "SQ",
        main: "^2",
        shift: "^3",
        cls: "k-fn",
        label: "x²",
        shiftLabel: "x³",
      },
      {
        id: "POW",
        main: "^",
        shift: "^(-1)",
        cls: "k-fn",
        label: "x^y",
        shiftLabel: "x⁻¹",
      },
      {
        id: "LOG",
        main: "log10(",
        shift: "10^(",
        cls: "k-fn",
        label: "log",
        shiftLabel: "10ˣ",
      },
      {
        id: "LN",
        main: "ln(",
        shift: "exp(",
        cls: "k-fn",
        label: "ln",
        shiftLabel: "eˣ",
      },
    ],
    [
      {
        id: "NEG",
        main: "-",
        cls: "k-fn",
        label: "(-)",
        alpha: "A",
        alphaLabel: "[A]",
      },
      {
        id: "FACT",
        main: "!",
        cls: "k-fn",
        label: "x!",
        alpha: ",",
        alphaLabel: "[,]",
      },
      {
        id: "SIN",
        label: "sin",
        shiftLabel: "sin⁻¹",
        alphaLabel: "[D]",
        cls: "k-fn",
      },
      {
        id: "COS",
        label: "cos",
        shiftLabel: "cos⁻¹",
        alphaLabel: "[E]",
        cls: "k-fn",
      },
      {
        id: "TAN",
        label: "tan",
        shiftLabel: "tan⁻¹",
        alphaLabel: "[F]",
        cls: "k-fn",
      },
    ],
    [
      { id: "HYP", main: "hyp", cls: "k-fn" },
      {
        id: "NCR",
        main: " nCr ",
        cls: "k-fn",
        label: "nCr",
        shiftLabel: "nPr",
      },
      { id: "NPR", main: " nPr ", cls: "k-fn", label: "nPr", shiftLabel: "π" },
      { id: "PI", main: "pi", cls: "k-fn", label: "π", shiftLabel: "e" },
      { id: "E", main: "e", cls: "k-fn", label: "e", shiftLabel: "i" },
    ],
    [
      { id: "RCL", main: "M", cls: "k-fn", label: "RCL" },
      { id: "STO", main: "", cls: "k-fn", label: "STO" },
      { id: "LP", main: "(", cls: "k-fn" },
      { id: "RP", main: ")", alpha: "X", cls: "k-fn" },
      { id: "MPLUS", main: "", cls: "k-fn", label: "M+" },
    ],
    [
      {
        id: "DMS",
        main: "dms(",
        cls: "k-fn",
        label: "°'\"",
        alpha: "B",
        alphaLabel: "[B]",
      },
      { id: "PCT", main: "/100", cls: "k-fn", label: "%", shiftLabel: "," },
      {
        id: "RAN",
        main: "Ran()",
        cls: "k-fn",
        label: "Ran#",
        shiftLabel: "RanInt",
      },
      { id: "MMINUS", main: "", cls: "k-fn", label: "M-" },
      { id: "SD", main: "", cls: "k-fn", label: "S⇔D" },
    ],
    [
      { id: "7", main: "7", topLabel: "CONST", cls: "k-num" },
      { id: "8", main: "8", topLabel: "CONV", cls: "k-num" },
      { id: "9", main: "9", topLabel: "CLR", cls: "k-num" },
      { id: "DEL", main: "", topLabel: "INS", cls: "k-del" },
      { id: "AC", main: "", topLabel: "OFF", cls: "k-ac" },
    ],
    [
      { id: "4", main: "4", topLabel: "MATRIX", cls: "k-num" },
      { id: "5", main: "5", topLabel: "VECTOR", cls: "k-num" },
      { id: "6", main: "6", topLabel: "BASE-N", cls: "k-num" },
      { id: "MUL", main: "*", topLabel: "nPr", cls: "k-op", label: "×" },
      { id: "DIV", main: "/", topLabel: "nCr", cls: "k-op", label: "÷" },
    ],
    [
      { id: "1", main: "1", topLabel: "STAT", cls: "k-num" },
      { id: "2", main: "2", topLabel: "CMPLX", cls: "k-num" },
      { id: "3", main: "3", topLabel: "BASE", cls: "k-num" },
      { id: "ADD", main: "+", topLabel: "Pol", cls: "k-op" },
      { id: "SUB", main: "-", topLabel: "Rec", cls: "k-op", label: "−" },
    ],
    [
      { id: "0", main: "0", topLabel: "Rnd", cls: "k-num" },
      { id: "DOT", main: ".", topLabel: "Ran#", cls: "k-num" },
      {
        id: "EXP10",
        main: "*10^",
        topLabel: "RanInt",
        cls: "k-fn",
        label: "×10ˣ",
      },
      { id: "ANS", main: "Ans", topLabel: "DRG▶", cls: "k-fn" },
      { id: "EQ", main: "", cls: "k-eq", label: "=" },
    ],
  ];

  return (
    <div className="calc-body">
      <div className="calc-display">
        <div className="status-row">
          <span className={shiftActive ? "active" : ""}>S</span>
          <span className={alphaActive ? "active" : ""}>A</span>
          <span className={hypActive ? "active" : ""}>HYP</span>
          <span>{mode}</span>
          <span>{angleUnit}</span>
          {M !== 0 && <span className="active">M</span>}
        </div>
        <div className="expr-line">
          {expr.slice(0, cursor)}
          <span className="caret" />
          {expr.slice(cursor)}
        </div>
        <div className={`result-line ${error ? "err" : ""}`}>{display}</div>
        {showMenu && (
          <div className="mode-overlay">
            {MODES.map((m) => (
              <div
                key={m}
                className="mode-item"
                onClick={() => {
                  setMode(m);
                  setShowMenu(false);
                  clearAll();
                }}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="keypad">
        {rows.flat().map((btn) => (
          <button
            key={btn.id}
            className={`key ${btn.cls || ""} ${btn.disabled ? "disabled" : ""}`}
            disabled={btn.disabled}
            onClick={() => press(btn)}
          >
            {btn.topLabel && <span className="top-label">{btn.topLabel}</span>}
            {btn.shiftLabel && (
              <span className="shift-label">{btn.shiftLabel}</span>
            )}
            {btn.alphaLabel && (
              <span className="alpha-label">{btn.alphaLabel}</span>
            )}
            <span className="main-label">
              {btn.label !== undefined
                ? btn.label
                : btn.main === ""
                  ? btn.id
                  : btn.main.replace(/\($/, "")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
