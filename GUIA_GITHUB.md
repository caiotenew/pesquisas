# Passo a passo: Git → Supabase → Render → GitHub Pages

Seu site final: **https://caiotenew.github.io/ponde-pesquisas/**
Ordem: (1) GitHub · (2) Supabase (banco) · (3) Render (API) · (4) ligar o site à API · (5) primeiro acesso.
Todos os comandos são para o **terminal do VS Code** (PowerShell), com a **pasta `ponde_pesquisas`** aberta (`Arquivo > Abrir Pasta…`, depois `Ctrl + '`).

---
## 1) Subir para o GitHub

1. Em https://github.com/new crie o repositório:
   - Nome: `ponde-pesquisas` · **Public** · **sem** README, .gitignore ou licença (vazio).
2. No terminal:

```powershell
git init
git add .
git status
```
Confira que **nenhum `.env` aparece** na lista (ele é ignorado de propósito). Depois:

```powershell
git commit -m "Ponde Pesquisas - versão inicial"
git branch -M main
git remote add origin https://github.com/caiotenew/ponde-pesquisas.git
git push -u origin main
```
> Primeira vez usando Git? Rode antes: `git config --global user.name "Seu Nome"` e `git config --global user.email "seu@email.com"`. Se o push pedir login, entre pela janela do navegador que abrir.

3. No GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
4. Aba **Actions** > "Deploy frontend to GitHub Pages" > **Run workflow** (a execução do primeiro push pode ter falhado por o Pages ainda não estar ativado; é normal).
5. Abra https://caiotenew.github.io/ponde-pesquisas/ — a tela de login deve aparecer (ainda sem conseguir entrar).

---
## 2) Criar o banco no Supabase

1. https://supabase.com > **New project**: nome `ponde-pesquisas`, escolha a região mais próxima (ex.: South America / São Paulo) e crie uma **Database Password**.
   **Use só letras e números** na senha (símbolos quebram a string de conexão). **Anote a senha.**
2. Espere o projeto terminar de criar. Clique em **Connect** (topo do painel).
3. Escolha **Session pooler** e copie a string. Ela é parecida com:

```
postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```
4. Troque `[YOUR-PASSWORD]` pela sua senha (sem os colchetes). **Guarde essa string final**: ela vai nas duas variáveis do Render.

> Por quê *Session pooler* e não "Direct connection"? A conexão direta do Supabase usa IPv6 e o Render gratuito só tem IPv4. O Session pooler (porta **5432**) funciona nos dois casos e aceita o `prisma db push`.
> Você **não** precisa criar tabelas: o deploy faz isso sozinho.

---
## 3) Publicar a API no Render

1. https://render.com > entre com sua conta do GitHub > **New + > Web Service** > escolha o repositório `ponde-pesquisas` (autorize o acesso se pedir).
2. Preencha:

| Campo | Valor |
|---|---|
| Name | `ponde-pesquisas-api` |
| Language | Node |
| Branch | `main` |
| **Root Directory** | `backend` |
| Build Command | `npm install && npx prisma generate && npx prisma db push && npx prisma db seed` |
| Start Command | `npm start` |
| Instance Type | Free |

3. Em **Environment Variables** adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a string do Session pooler (passo 2) |
| `DIRECT_URL` | **a mesma** string |
| `JWT_SECRET` | um texto longo e aleatório (30+ caracteres) |
| `ALLOWED_ORIGINS` | `https://caiotenew.github.io` (**sem** `/ponde-pesquisas` e **sem** barra no final) |
| `ADMIN_EMAIL` | `damascenocaio311@gmail.com` |
| `ADMIN_NAME` | `Caio Damasceno` |
| `ADMIN_PASSWORD` | a senha inicial que você quiser (se deixar vazio, será `1234`) |

4. Clique em **Create Web Service** e acompanhe os **Logs**. No build deve aparecer `Administrador criado: damascenocaio311@gmail.com` e depois a API sobe.
5. Copie a URL do serviço (topo da página), algo como `https://ponde-pesquisas-api.onrender.com`.
6. Teste no navegador: `https://SUA-URL.onrender.com/api/health` → deve mostrar `"status":"ok"`.

> **Plano Free:** o Render "dorme" após ~15 min sem uso; o primeiro acesso depois disso pode levar cerca de 1 minuto. Se o login mostrar "Não foi possível conectar", aguarde e tente de novo.

---
## 4) Ligar o site à API

1. No VS Code, abra `frontend/js/config.js` e troque **só esta linha**:

```js
var PRODUCTION_API_URL = 'https://ponde-pesquisas-api.onrender.com';
```
(use a URL real que o Render mostrou, **sem barra no final**)

2. Envie:

```powershell
git add .
git commit -m "Configura URL da API"
git push
```
3. Aguarde a aba **Actions** ficar verde (1–2 min) e abra https://caiotenew.github.io/ponde-pesquisas/ (use `Ctrl + F5` para limpar o cache).

---
## 5) Primeiro acesso

1. Entre com `damascenocaio311@gmail.com` e a senha definida em `ADMIN_PASSWORD` (ou `1234`).
2. Se a senha for curta, o sistema abre **Alterar senha**: troque agora (este e-mail está público no repositório).
3. Menu **Gerenciar Usuários**: aprove pedidos de Gestão, redefina senhas, desative contas.
4. Menu **Jovens online**: veja quem está conectado e quanto cada jovem coletou hoje.

Esqueceu a senha do administrador? Em `backend`, com um `.env` local apontando para o mesmo banco:
```powershell
npm run admin:reset -- "NovaSenha123"
```

---
## Atualizações futuras

Qualquer mudança: edite, depois `git add .`, `git commit -m "descrição"`, `git push`.
O GitHub Pages republica o site sozinho; o Render republica a API sozinho (e aplica mudanças no banco no build).

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Login: "Não foi possível conectar ao servidor" | API dormindo (aguarde ~1 min) ou `PRODUCTION_API_URL` errada em `config.js` |
| Erro de CORS no console do navegador | `ALLOWED_ORIGINS` com barra no final, com `/ponde-pesquisas`, ou diferente de `https://caiotenew.github.io` |
| Build do Render falha em `prisma db push` (P1001/P1000) | String do Supabase errada: use **Session pooler**, senha correta e sem símbolos |
| `/api/health` mostra erro de banco | `DATABASE_URL` incorreta ou projeto Supabase pausado (reative no painel) |
| Site no Pages mostra 404 | Pages não está em **Source: GitHub Actions** ou o workflow não rodou |
| Quero testar no meu PC | `cd backend`, `copy .env.example .env`, preencha, `npm install`, `npx prisma generate`, `npx prisma db push`, `npx prisma db seed`, `npm start`; abra `frontend/index.html` com o Live Server (porta 5500) |

## Trocar a fonte do sistema
Variável `--font-provida` no topo de `frontend/css/style.css` e o `<link>` do Google Fonts no `<head>` de `frontend/index.html`.
