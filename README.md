# FinSight AI

**Autonomous multi-agent financial intelligence for Indian retail investors.**

A hackathon prototype demonstrating how independent AI agents — Technical,
Fundamental, and Sentiment — can each analyze the same stock in parallel,
then have a synthesis layer reconcile their views into one personalized,
explainable BUY/HOLD/AVOID recommendation. Fully interactive, no backend
required — runs entirely client-side, with optional live Gemini reasoning
(falls back to deterministic mock data if no key is configured, so it never
breaks a demo).

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

By default this runs on built-in mock agent data — fully functional, no
setup needed. To enable **live Gemini-generated agent reasoning**, see below.

## Enabling live AI (Gemini)

Each of the three agents can call Gemini directly from the browser instead
of using the built-in mock reasoning. Agent cards show a green **AI** badge
when live, or a gray **Mock** badge when falling back (missing key, or the
call failed/timed out — the app never breaks either way).

1. Get a free key at **https://aistudio.google.com/app/apikey**
2. Copy `.env.example` to a new file named `.env.local` (this file is
   git-ignored — it's never committed, so your key stays local):
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste in your key:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   VITE_GEMINI_MODEL=gemini-flash-lite-latest
   ```
4. Restart the dev server (`npm run dev`) — Vite only picks up new env vars
   on a fresh start, not via hot reload.

**Model note:** `gemini-flash-lite-latest` is used because it's fast (~1-2s
per call) and has a workable free-tier quota. Some other models — including
ones the Gemini API's own error messages may suggest — either require a
paid plan, have very low daily free-tier limits (as low as 20 requests/day
on one we tried), or default to slow multi-second "thinking" mode. If you
change `VITE_GEMINI_MODEL`, check its free-tier quota first.

**Sharing one key across a team:** the key itself isn't in git, so share it
with teammates directly (chat, not a commit) and have each person paste the
same value into their own local `.env.local`. Everyone's usage then counts
against that one account's quota — fine for a demo, worth knowing if
several people run it at once.
