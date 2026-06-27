# Portfolio + Microserviço de Notificações

Projeto acadêmico composto por dois serviços independentes:

- **Portfolio** (`lucasdev`) — roda na porta **8000**
- **Microserviço de Notificações** (`notificacao_ms`) — roda na porta **8001**

---

## Pré-requisitos

- Python 3.10+
- pip

---

## 1. Microserviço de Notificações (porta 8001)

```bash
# Clonar o repositório
git clone https://github.com/LucasAlvesDk/Projeto-WEB-Notificacoes.git
cd Projeto-WEB-Notificacoes

# Criar e ativar o ambiente virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Instalar dependências
pip install django djangorestframework django-cors-headers

# Aplicar migrações
python manage.py migrate

# Criar superusuário (para acessar o admin)
python manage.py createsuperuser

# Rodar o servidor
python manage.py runserver 8001
```

Acesse o admin em: http://127.0.0.1:8001/admin/

### Configuração inicial no Admin

1. Crie uma **Empresa** (ex: `Portfolio LucasDev`) — o hash é gerado automaticamente
2. Anote o hash gerado — ele é a API Key
3. Crie **Notificações** para testar (o Target é criado automaticamente na primeira requisição do portfolio)

---

## 2. Portfolio (porta 8000)

```bash
# Clonar o repositório
git clone https://github.com/LucasAlvesDk/Projeto-WEB-Portfolio.git
cd Projeto-WEB-Portfolio

# Criar e ativar o ambiente virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Instalar dependências
pip install django djangorestframework djangorestframework-simplejwt

# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar o servidor
python manage.py runserver
```

Acesse em: http://127.0.0.1:8000/

### Configuração

No arquivo `lucasdev/settings.py`, atualize com o hash gerado no admin do microserviço:

```python
NOTIFICACAO_MS_URL = 'http://127.0.0.1:8001'
NOTIFICACAO_MS_API_KEY = 'seu_hash_aqui'  # hash da Empresa criada no admin
```

---

## Rodando os dois juntos

Abra **dois terminais** simultaneamente:

**Terminal 1 — Microserviço:**
```bash
cd Projeto-WEB-Notificacoes
source venv/bin/activate
python manage.py runserver 8001
```

**Terminal 2 — Portfolio:**
```bash
cd Projeto-WEB-Portfolio
source venv/bin/activate
python manage.py runserver
```

---

## Como testar o sino de notificações

1. Acesse o portfolio em http://127.0.0.1:8000/
2. Faça login pelo modal **Editar Perfil** — o `user_id` será salvo automaticamente
3. O sino aparece no menu e consulta o microserviço a cada **5 segundos**
4. Crie uma notificação no admin do microserviço (http://127.0.0.1:8001/admin/)
5. Em até 5 segundos o badge do sino atualiza automaticamente

### Estados do badge

| Badge | Cor | Significado |
|-------|-----|-------------|
| `X` | Cinza | Sem conexão com o microserviço |
| `0` | Verde | Conectado, sem notificações não lidas |
| `N` | Vermelho | N notificações não lidas |

---

## Estrutura dos projetos

```
notificacao_ms/
├── notificacao_ms/         # Configurações do projeto
│   ├── settings.py
│   └── urls.py
└── notificacoes/           # App principal
    ├── models.py           # Empresa, Target, Notification
    ├── views.py            # 4 endpoints REST
    ├── serializers.py
    ├── authentication.py   # Validação via X-Api-Key e X-User-Id
    ├── admin.py
    └── urls.py

lucasdev/
├── lucasdev/               # Configurações do projeto
│   ├── settings.py         # NOTIFICACAO_MS_URL e NOTIFICACAO_MS_API_KEY
│   └── urls.py
└── core/                   # App principal
    ├── models.py           # Technology, Project, Pessoal
    ├── views.py
    ├── serializers.py
    ├── context_processors.py
    └── templates/
        ├── core/
        │   ├── base.html   # Sino de notificações + JavaScript polling
        │   ├── home.html
        │   └── projects.html
        └── _partials/
            ├── _navbar.html
            ├── _login_modal.html
            └── _edit_modal.html
```

---

## Endpoints do Microserviço

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/notificacoes/nao-lidas/` | Contagem de não lidas |
| `GET` | `/api/notificacoes/` | Lista todas as notificações |
| `PATCH` | `/api/notificacoes/<id>/lida/` | Marca como lida |
| `POST` | `/api/notificacoes/criar/` | Cria uma notificação |

Todas as requisições exigem os headers:
- `X-Api-Key` — hash da empresa
- `X-User-Id` — ID do usuário (exceto no POST de criação)
