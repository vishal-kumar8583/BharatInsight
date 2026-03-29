# BharatInsight

A data analytics dashboard for Indian government public data, powered by Gemini AI. Explore state-wise metrics across 6 departments with interactive charts, filters, and AI-driven insights.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

## Features

- 6 department dashboards — Health, Agriculture, Finance, Education, Energy, Water
- Interactive charts with state/year filters and detailed insights
- Gemini AI panel with streaming responses and markdown rendering
- Light/dark theme toggle
- Virtualized data grid for large datasets
- Command palette (Ctrl+K) for quick navigation
- Fully responsive layout

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Charts** — Recharts
- **State** — Zustand
- **Animations** — Framer Motion
- **AI** — Google Gemini API (`@google/generative-ai`)
- **Search** — Fuse.js

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
git clone https://github.com/your-username/bharat-insight.git
cd bharat-insight
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open :- https://bharat-insight-iota.vercel.app/



## Project Structure

```
├── app/
│   ├── api/ai/route.ts      # Gemini streaming API route
│   ├── dashboard/page.tsx   # Dashboard page
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── components/
│   ├── dashboard/           # Dashboard UI components
│   ├── landing/             # Landing page sections
│   └── ui/                  # Shared UI primitives
├── lib/
│   ├── data.ts              # Mock dataset generator
│   ├── departments.ts       # Department config
│   └── utils.ts
└── store/
    └── dashboard-store.ts   # Zustand global state
```

## License

MIT
