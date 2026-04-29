# Supabase Setup för MatKoll

## 1. Skapa ett Supabase-projekt

1. Gå till https://supabase.com
2. Skapa ett nytt projekt
3. Kopiera **Project URL** och **anon public** nyckeln

## 2. Skapa tabeller

Kör dessa SQL-frågor i Supabase SQL Editor:

```sql
-- Skapa users-tabell
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT DEFAULT 'Användare',
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal INTEGER DEFAULT 150,
  daily_fat_goal INTEGER DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa meals-tabell
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  calories DECIMAL,
  protein DECIMAL,
  fat DECIMAL,
  image_url TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Policy för users - användare kan bara se sin egen data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy för meals - användare kan bara se/lägga till/ta bort sina egna måltider
CREATE POLICY "Users can view own meals" ON public.meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals" ON public.meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON public.meals
  FOR DELETE USING (auth.uid() = user_id);
```

## 3. Skapa en trigger för att skapa användarprofil vid registrering

```sql
-- Skapa funktion för att skapa användarprofil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Skapa trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 4. Lägg till i .env

Kopiera värdena till din `.env` fil:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGcOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Konfigurera Supabase Auth

I Supabase Dashboard:
1. Gå till **Authentication** > **Settings**
2. Under **Site URL**, lägg till: `matkoll://`
3. Under **Redirect URLs**, lägg till: `matkoll://`

## 6. Testa

Starta appen med:
```bash
npm start
```
