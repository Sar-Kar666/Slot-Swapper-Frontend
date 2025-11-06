# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# SlotSwapper

A React-based web application that allows users to manage their schedules and swap time slots with others. Built with React, TypeScript, Tailwind CSS, and Vite.

## Overview

SlotSwapper provides a platform where users can:
- Create and manage their calendar events
- Mark slots as swappable
- Browse available slots from other users
- Send and receive swap requests
- Manage notifications and swap requests

### Design Choices

- **Authentication**: Implemented using JWT tokens with secure storage in localStorage
- **UI Framework**: Used Tailwind CSS for rapid development and consistent styling
- **Icons**: Integrated Lucide React for modern, scalable icons
- **Routing**: React Router v6 for client-side routing
- **API Integration**: Centralized API calls in a dedicated module

## Setup Instructions

1. Clone the repository:
```sh
git clone <repository-url>
cd slotswapper
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory:
```sh
VITE_API_URL=https://slot-swapper-backend-pxie.onrender.com/api
```

4. Start the development server:
```sh
npm run dev
```

5. Build for production:
```sh
npm run build
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login existing user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all user events |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### Swaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/swaps/swappable-slots` | Get available slots |
| POST | `/api/swaps/swap-request` | Create swap request |
| GET | `/api/swaps/incoming` | Get incoming requests |
| GET | `/api/swaps/outgoing` | Get outgoing requests |
| POST | `/api/swaps/swap-response/:id` | Respond to swap request |

## Authentication

All API endpoints except `/auth/login` and `/auth/signup` require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Assumptions & Challenges

### Assumptions
- Users can only have one active swap request per slot
- Events can only be marked as either BUSY or SWAPPABLE
- Users cannot swap slots with themselves

### Technical Challenges
- Managing complex state between swap requests and events
- Implementing real-time updates for swap request statuses
- Handling date/time zones consistently across the application

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router v6
- Lucide React for icons

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
