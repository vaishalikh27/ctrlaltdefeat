# FinSight AI

**Autonomous multi-agent financial intelligence for Indian retail investors.**

A hackathon prototype demonstrating how independent AI agents — Technical,
Fundamental, and Sentiment — can each analyze the same stock in parallel,
then have a synthesis layer reconcile their views into one personalized,
explainable BUY/HOLD/AVOID recommendation. Fully interactive, deterministic,
mock-data driven — no backend required.

## What it demonstrates

- **Multi-agent architecture, made visible.** Three agent cards plus a live
  orchestration diagram (Market Data → 3 parallel agents → Synthesis Agent →
  Personalized Recommendation) so it reads as a pipeline, not three copies of
  one AI response.
- **Personalization on identical data.** Switching Conservative ↔ Aggressive
  changes the synthesis weighting, confidence, risk framing, and the final
  recommendation — while the three agents' raw verdicts stay the same, since
  they're reasoning over the same market data.
- **Explainability over black-box labels.** Every agent's "Why? View
  reasoning" expands into evidence, a reasoning chain, and source
  attribution (NSE Market Data, SEBI Filing, Earnings Report, FII/DII Flow
  Data, Market News).
- **Graceful degradation.** "Simulate Feed Failure" takes the NSE feed
  offline, drops the Technical agent's confidence, and lowers overall
  recommendation confidence — without crashing or losing source attribution.
- **Position-aware.** A portfolio panel and watchlist show the system
  reasoning in the context of existing holdings, not just an isolated quote.

## Stack

React + TypeScript + Tailwind CSS v4 (Vite). All data is simulated and
deterministic (seeded), so every run and every demo is repeatable.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
build; `npm run preview` serves it locally.
