# Definitely Not Wordle

A fullstack Wordle clone built for the GoLinks 2026 Fullstack Intern Project.

Guess the 5-letter word in 6 tries. Green = right spot, yellow = wrong spot, gray = not in word.

## Stack
- **Frontend:** React + TypeScript (Vite), hosted on Vercel
- **Backend:** FastAPI (Python), hosted on Railway

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
