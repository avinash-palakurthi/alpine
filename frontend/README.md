# AlpineScope — AI-Native CBAM Compliance Platform

Live: [alpinescope.pro](https://alpinescope.pro)

AlpineScope classifies EU imports against CBAM Annex I,
calculates embedded emissions, and estimates carbon
certificate costs using a LangGraph agent pipeline.

## Stack

- **Backend**: FastAPI + LangGraph + OpenAI + Qdrant
- **Frontend**: Next.js 14 + TailwindCSS
- **Infra**: AWS EC2 + Nginx + S3
- **AI**: RAG over EU regulation PDFs + GPT-4o-mini

## Agent Pipeline

1. Supervisor → routes each import row
2. Classifier → RAG + GPT-4o-mini → CN code
3. Scope → checks CBAM Annex I coverage
4. Emission → looks up tCO2 per tonne
5. ETS → fetches carbon price
6. Cost → calculates CBAM certificate cost
7. Reporting → aggregates results

## Features

- Upload CSV/Excel import files
- AI classifies product descriptions → CN codes
- CBAM coverage check across 6 sectors
- Emission factor lookup from EU default values
- ETS price integration
- PDF compliance report download
- Risk flagging (High/Medium/Low)

## Sectors Covered

Steel · Aluminium · Cement · Fertilizers · Hydrogen · Electricity

## Run Locally

cd backend
uv venv && uv sync
uvicorn main:app --reload --port 8000

cd frontend
npm install && npm run dev
