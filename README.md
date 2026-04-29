# MatKoll 🍎

AI-powered matspårningsapp där du tar ett foto och får omedelbar information om kalorier, protein och fett.

## Features

- 📸 **AI Matigenkänning** - Ta ett foto och få näringsvärden automatiskt
- 📊 **Makrospårning** - Följ kalorier, protein och fett
- 📅 **Historik** - Se alla dina måltider
- 🎯 **Målsättning** - Sätt och följ dina dagliga mål

## Tech Stack

- **Framework:** React Native med Expo
- **AI:** MiniMax Vision API
- **Backend:** Supabase
- **Språk:** Svenska

## Kom igång

### 1. Klona projektet

```bash
git clone https://github.com/adrianfolkeson/matkoll.git
cd matkoll
```

### 2. Installera dependencies

```bash
npm install
```

### 3. Konfigurera miljövariabler

Kopiera `.env.example` till `.env` och fyll i dina värden:

```bash
cp .env.example .env
```

Fyll i:
- `EXPO_PUBLIC_SUPABASE_URL` - Från Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Från Supabase
- `EXPO_PUBLIC_MINIMAX_API_KEY` - Från MiniMax

### 4. Sätt upp Supabase

Följ instruktionerna i [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 5. Starta appen

```bash
# För iOS (kräver Mac med Xcode)
npm run ios

# För Android
npm run android

# För web
npm run web
```

## Projektstruktur

```
matkoll/
├── app/                    # Expo Router sidor
│   ├── (tabs)/           # Tab navigation
│   │   ├── index.tsx     # Hem (Dashboard)
│   │   ├── scan.tsx      # Skanna mat
│   │   ├── history.tsx    # Historik
│   │   └── profile.tsx    # Profil
│   └── meal/
│       └── [id].tsx      # Måltidsdetaljer
├── components/            # UI komponenter
├── context/               # React Context
├── lib/                   # Utilities
│   ├── supabase.ts        # Supabase client
│   ├── minimax.ts         # MiniMax API
│   └── constants.ts       # Konstanter
├── types/                 # TypeScript types
└── hooks/                 # Custom hooks
```

## Licens

MIT
