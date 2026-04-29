# MatKoll - AI Matspårningsapp

## Koncept & Vision

**MatKoll** är en intelligent matspårningsapp där användare enkelt tar ett foto av sin mat och får omedelbar information om kalorier, protein och fett. Appen känns som en premium-träningsapp – ren, professionell och motiverande. Den kombinerar kraften av AI med en intuitiv, minimalistisk design.

## Design Language

### Färgpalett
- **Primary:** `#10B981` (Grön - hälsa, energi)
- **Secondary:** `#6366F1` (Indigo - premium-känsla)
- **Accent:** `#F59E0B` (Gul - highlights, kalorier)
- **Background:** `#FAFAFA` (Vitt, ren bas)
- **Surface:** `#FFFFFF` (Kort, modals)
- **Text Primary:** `#1F2937` (Mörkgrå)
- **Text Secondary:** `#6B7280` (Medium grå)
- **Success:** `#10B981` (Grön)
- **Warning:** `#F59E0B` (Gul)
- **Error:** `#EF4444` (Röd)

### Typografi
- **Font Family:** System default (San Francisco på iOS)
- **Headings:** Bold/Semibold, 24-32px
- **Body:** Regular, 14-16px
- **Captions:** Regular, 12px

### Spacing
- Base unit: 4px
- Standard padding: 16px (4 units)
- Section spacing: 24px (6 units)
- Card padding: 16px

### Motion
- Micro-interactions: 200ms ease-out
- Page transitions: 300ms slide
- Loading states: Subtle pulse animation
- Success feedback: Scale bounce (1.0 → 1.05 → 1.0)

## Layout & Struktur

### Navigation
- **Bottom Tab Bar** med 4 flikar:
  1. **Hem** - Dagens översikt
  2. **Lägg till** - Kamera för att ta foto
  3. **Historik** - Tidigare måltider
  4. **Profil** - Mål och inställningar

### Skärmar

#### 1. Hem (Dashboard)
- Välkomstmeddelande med tid på dygnet
- Dagens mål progress (circular progress)
- Trevligaste måltiden hittills idag
- Snabbåtkomst till kamera
- Veckoprogress mini-widget

#### 2. Lägg till (Camera)
- Stor kameraikon/knapp
- Alternativ att ladda upp från galleri
- Senaste skanningar för snabb återanvändning
- Resultat visas som ett snyggt kort med makros

#### 3. Historik
- Kalender-vy för att välja datum
- Lista med måltider för valt datum
- Filter: Frukost, Lunch, Middag, Snack
- Totals per dag

#### 4. Profil
- Användarinformation
- Dagliga mål (kalorier, protein, fett)
- Progress charts (vecka/månad)
- Inställningar

## Features & Interactions

### Kärnfeatures

#### 📸 Fotogenkänning (MiniMax AI)
- Användaren tar ett foto
- MiniMax API analyserar bilden
- Returnerar: Maträtt + beräknade makros
- Användaren kan bekräfta/redigera
- Spara till historik

#### 📊 Makronutrient-spårning
- **Kalorier:** kcal per dag
- **Protein:** gram per dag
- **Fett:** gram per dag
- Visas med tydliga progress-bars

#### 📅 Historik
- Alla skannade måltider sparas
- Filtrera per dag/typ
- Visa total för dag

#### 🎯 Målsättning
- Användaren sätter dagliga mål
- Följa progress mot mål
- Veckovis sammanfattning

### Interactions

#### Kamera-flow
1. Tryck på kamera → öppnar camera
2. Ta foto → visar loading spinner
3. AI analyserar → visar resultat
4. Användaren kan redigera portionsstorlek
5. Välj måltidstyp (frukost/lunch/middag/snack)
6. Spara → bekräftelse → tillbaka till Hem

#### Felhantering
- Om bild inte känns igen → "Kunde inte identifiera maten, försök igen"
- Om API nere → "Tjänsten är tillfälligt nere, försök senare"
- Om ingen internet → "Kräver internetanslutning"

## Component Inventory

### 1. BottomTabBar
- 4 ikoner med labels
- Aktiv flik: grön, inaktiv: grå
- Safe area för iPhone notch

### 2. CircularProgress
- Ring som fylls baserat på %
- Visar aktuellt/mål
- Färg baserat på mål (grön = bra, röd = överskridit)

### 3. MacroCard
- Icon + Label + Value
- Progress bar under
- Bakgrundsfärg kan variera

### 4. MealCard
- Tid + Måltidstyp
- Lista med mat + kalorier
- Kompakt design för historik

### 5. CameraButton
- Stor rund knapp
- Kameraikon i mitten
- Pulse-animation på hover

### 6. ResultCard
- Matbild (om tillgänglig)
- Lista med identifierad mat
- Macro-summary
- Redigera/Spara-knappar

### 7. DatePicker
- Kalender-widget
- Välj datum
- Visa markerad dag

## Teknisk Arkitektur

### Stack
- **Framework:** React Native med Expo
- **AI:** MiniMax Vision API
- **Backend:** Supabase (databas, auth)
- **State:** React Context + useState

### Databasstruktur (Supabase)

#### Tabeller

**users**
```sql
id (uuid)
email (text)
name (text)
daily_calorie_goal (int, default: 2000)
daily_protein_goal (int, default: 150)
daily_fat_goal (int, default: 65)
created_at (timestamp)
```

**meals**
```sql
id (uuid)
user_id (uuid, FK)
meal_type (enum: breakfast, lunch, dinner, snack)
food_name (text)
calories (float)
protein (float)
fat (float)
image_url (text, nullable)
scanned_at (timestamp)
created_at (timestamp)
```

**food_items** (cache för återanvändning)
```sql
id (uuid)
name (text)
calories_per_100g (float)
protein_per_100g (float)
fat_per_100g (float)
portion_default (int, default: 100)
```

### API-slutpunkter

**POST /api/scan**
- Input: base64 image
- Output: { food_name, calories, protein, fat, confidence }

**GET /api/meals?date=YYYY-MM-DD**
- Output: Lista med måltider för datum

**POST /api/meals**
- Input: meal data
- Output: Sparad måltid

**GET /api/user/goals**
- Output: Användarens mål

**PUT /api/user/goals**
- Input: nya mål
- Output: Uppdaterade mål

## Projektstruktur

```
matkoll/
├── app/                    # Expo Router (app directory)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx     # Hem
│   │   ├── scan.tsx      # Lägg till
│   │   ├── history.tsx    # Historik
│   │   └── profile.tsx    # Profil
│   ├── meal/
│   │   └── [id].tsx       # Måltidsdetaljer
│   └── _layout.tsx        # Root layout
├── components/            # UI components
│   ├── CircularProgress.tsx
│   ├── MacroCard.tsx
│   ├── MealCard.tsx
│   ├── CameraButton.tsx
│   └── ResultCard.tsx
├── lib/                   # Utilities
│   ├── supabase.ts        # Supabase client
│   ├── minimax.ts         # MiniMax API
│   └── constants.ts        # App constants
├── hooks/                 # Custom hooks
├── context/               # React Context
└── types/                 # TypeScript types
```

## MiniMax Integration

### API-anrop
```typescript
// POST till MiniMax Vision API
{
  model: "minimax-vision",
  messages: [{
    role: "user",
    content: [{
      type: "image_url",
      image_url: { url: "data:image/jpeg;base64,..." }
    }, {
      type: "text",
      text: "Analysera denna mat och ge kalorier, protein och fett per 100g"
    }]
  }]
}
```

### Svarhantering
MiniMax returnerar en textbeskrivning som vi parsar för att extrahera:
- Maträttens namn
- Kalorier per 100g
- Protein per 100g
- Fett per 100g

## Framtida Features (ej i MVP)

- Barcode scanner
- Recept-skapare
- Offline-läge
- Apple Watch / Wear OS integration
- Delning på sociala medier
- Avancerade charts (vecka/månad/år)
