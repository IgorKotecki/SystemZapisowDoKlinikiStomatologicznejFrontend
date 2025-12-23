# 🦷 System Zapisów do Kliniki Stomatologicznej - Frontend

System zarządzania zapisami do kliniki stomatologicznej stworzony jako część pracy inżynierskiej. Aplikacja frontend zbudowana przy użyciu React, TypeScript i Vite.

## 📋 Opis projektu

Nowoczesna aplikacja webowa umożliwiająca zarządzanie wizytami w klinice stomatologicznej. System oferuje intuicyjny interfejs użytkownika z funkcjami rezerwacji wizyt, zarządzania pacjentami oraz administracji personelem medycznym.

## 🚀 Technologie

- **React 18.3** - biblioteka do budowy interfejsu użytkownika
- **TypeScript** - typowany JavaScript
- **Vite** - szybkie narzędzie do budowania aplikacji
- **Material-UI (MUI)** - komponenty UI
- **React Router** - routing w aplikacji
- **Axios** - komunikacja z API
- **FullCalendar** - zarządzanie kalendarzem wizyt
- **i18next** - wielojęzyczność aplikacji
- **Framer Motion** - animacje
- **JWT** - autoryzacja użytkowników

## 📁 Struktura projektu

```
src/
├── api/          # Komunikacja z backend API
├── components/   # Komponenty React
├── context/      # Context API (zarządzanie stanem)
├── i18n/         # Tłumaczenia i konfiguracja językowa
├── Interfaces/   # Definicje TypeScript
├── mappers/      # Mapowanie danych
├── pages/        # Strony aplikacji
└── utils/        # Funkcje pomocnicze
```

## 🛠️ Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/IgorKotecki/SystemZapisowDoKlinikiStomatologicznejFrontend.git
cd SystemZapisowDoKlinikiStomatologicznejFrontend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

## 📜 Dostępne skrypty

- `npm run dev` - uruchamia serwer deweloperski
- `npm run build` - buduje aplikację produkcyjną
- `npm run lint` - sprawdza kod pod kątem błędów
- `npm run preview` - podgląd zbudowanej aplikacji

## ✨ Funkcjonalności

- 🔐 System logowania i autoryzacji
- 📅 Kalendarz wizyt z możliwością rezerwacji
- 👥 Zarządzanie pacjentami
- 👨‍⚕️ Panel dla personelu medycznego
- 🌐 Obsługa wielu języków (i18next)
- 📱 Responsywny design
- 🎨 Nowoczesny interfejs użytkownika (Material-UI)

## ⚙️ Konfiguracja

Aplikacja wymaga połączenia z backendem. Upewnij się, że masz skonfigurowane odpowiednie endpointy API w plikach konfiguracyjnych w katalogu `src/api/`.

## 👥 Autorzy

- **Igor Kotecki** - [@IgorKotecki](https://github.com/IgorKotecki)
- **Paweł Szeliga** - [@PawelSzeliga23](https://github.com/PawelSzeliga23)

## 📝 Licencja

Projekt stworzony na potrzeby pracy inżynierskiej.

---

*Frontend systemu zapisów do kliniki stomatologicznej*