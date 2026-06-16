# PetCare

## Opis projektu

PetCare to aplikacja mobilna stworzona w React Native i Expo, która pomaga właścicielom zwierząt zarządzać informacjami o swoich pupilach.

Użytkownik może:

- rejestrować konto i logować się,
- dodawać profile zwierząt,
- edytować dane zwierząt,
- dodawać zdjęcia pupili,
- zarządzać przypomnieniami,
- przeglądać harmonogram opieki nad zwierzętami,
- przechowywać dane w chmurze za pomocą Supabase.

---

## Technologie

- React Native
- Expo
- Expo Router
- TypeScript
- Redux Toolkit
- Supabase
- Expo Secure Store
- Expo Image Picker
- Expo Camera
- Expo Notifications
- Jest

---

## Architektura projektu

Projekt wykorzystuje Redux Toolkit do zarządzania globalnym stanem aplikacji.

### Struktura projektu

```text
features/
├── auth
├── pets
├── reminders
├── profile
└── petPhotos

services/
├── supabase
└── secureStorage

store/
├── store.ts
└── hooks.ts
```

---

## Funkcjonalności

### Autoryzacja

- Rejestracja użytkownika
- Logowanie użytkownika
- Automatyczne logowanie po ponownym uruchomieniu aplikacji
- Wylogowanie
- Chronione ekrany

### Zarządzanie zwierzętami

- Dodawanie zwierząt
- Edycja danych
- Usuwanie zwierząt
- Dodawanie zdjęć

### Harmonogram

- Tworzenie przypomnień
- Oznaczanie przypomnień jako wykonane
- Przegląd harmonogramu

---

## Funkcje natywne

Aplikacja wykorzystuje natywne funkcje urządzenia:

- Kamera (Expo Camera)
- Galeria zdjęć (Expo Image Picker)
- Bezpieczne przechowywanie sesji (Expo Secure Store)
- Powiadomienia lokalne (Expo Notifications)
- Haptic Feedback (Expo Haptics)

---

## Testy

Projekt zawiera testy jednostkowe napisane przy użyciu Jest.

Uruchomienie testów:

```bash
npm test
```

---

## Instalacja

### 1. Sklonuj repozytorium

```bash
git clone <repository-url>
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Utwórz plik `.env`

```env
EXPO_PUBLIC_SUPABASE_URL=YOUR_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_KEY
```

### 4. Uruchom projekt

```bash
npx expo start
```

Następnie uruchom aplikację w Expo Go lub emulatorze.

---

## Build aplikacji

Android Preview Build:

```bash
eas build --platform android --profile preview
```

---

## Autors

Kristina Kondratiuk, Karina Maksymenko