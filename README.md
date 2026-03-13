# TecnoAMF

Projeto completo, App de gerenciamento de vídeos com Django + React Native.

## Sobre o Projeto

Aplicação para cadastro de vídeos, temas e trechos importantes, com autenticação e permissões de acesso.

## Estrutura

- `/backend` - API REST desenvolvida em Django
- `/frontend` - App mobile em React Native (Expo)

## Tecnologias

### Backend
- Django
- Django REST Framework
- Token Authentication
- SQLite (desenvolvimento)

### Frontend
- React Native
- Expo
- TypeScript
- Expo Router

## Como executar

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
