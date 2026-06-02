# 🏆 Polla del CEO · 30X · Mundial 2026

Minijuego funcional donde founders apuestan el Mundial como CEOs. 
Andrés Bilbao (AI) analiza cada portafolio.

## 🚀 Deploy en Vercel (paso a paso)

### 1. Crear repositorio en GitHub
```bash
# En tu terminal, navega a esta carpeta
cd polla-ceo

# Inicializa git
git init
git add .
git commit -m "Polla del CEO - v1"

# Crea un repo nuevo en github.com (botón verde "New")
# Nombre sugerido: polla-ceo-30x
# Déjalo público o privado, como prefieras

# Conecta y sube
git remote add origin https://github.com/TU-USUARIO/polla-ceo-30x.git
git branch -M main
git push -u origin main
```

### 2. Conectar Vercel
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Selecciona `polla-ceo-30x`
4. En "Framework Preset" selecciona **Vite**
5. En "Environment Variables" agrega:
   - Key: `ANTHROPIC_API_KEY`
   - Value: tu API key de Anthropic (empieza con `sk-ant-...`)
6. Click **Deploy**

### 3. Obtener API Key de Anthropic
1. Ve a [console.anthropic.com](https://console.anthropic.com/)
2. Crea cuenta o inicia sesión
3. Ve a "API Keys" → "Create Key"
4. Copia la key y pégala en Vercel

## 🛠 Desarrollo local

```bash
npm install
cp .env.example .env.local
# Edita .env.local con tu API key
npm run dev
```

## 📁 Estructura
```
polla-ceo/
├── api/
│   └── analyze.js      ← Serverless function (proxy a Anthropic)
├── public/
│   └── andres.png       ← Foto de Andrés
├── src/
│   ├── App.jsx          ← Todo el juego
│   └── main.jsx         ← Entry point
├── index.html           ← HTML con fonts y meta tags
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

---
*Una propuesta de Daniel para Andrés Bilbao · 30X · 2026*
