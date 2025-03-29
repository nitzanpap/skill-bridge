@echo off
echo Starting SkillBridge backend server...

REM Activate virtual environment
call .venv\Scripts\activate

REM Start the server
echo Server starting at http://localhost:8000
echo API documentation available at http://localhost:8000/docs
python -m app.main 
