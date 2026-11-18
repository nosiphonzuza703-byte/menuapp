# # The Gather Table Menu App

A restaurant menu app built with Expo, React Native, and TypeScript. It includes a searchable menu, separate course screens, shared order state, and a local checkout preview.

## Features

- Home screen with search and menu management (add, edit, and remove dishes).
- Separate screens for Starters, Mains, Desserts, and Beverages, with 20 dishes in each category.
- Shared basket with quantity controls across menu screens.
- Order screen with dine-in or delivery selection, cost summary, and the `SUMMER5` promo code.
- Restaurant contact details:
  - Email: gatherhere207@gmail.com
  - Address: 54 Saints Georges Drive

## Requirements

- Node.js and npm

## Getting started

From the project directory, install dependencies and start Expo:

```bash
npm install
npm start
```

Use the Expo terminal menu to open the app on a device or emulator. You can also start a platform directly:

```bash
npm run web
npm run android
npm run ios
```

## Validation and web export

Type-check the project:

```bash
npm run typecheck
```

Create a static web export:

```bash
npx expo export --platform web
```

## Checkout note

Checkout currently creates a local order preview only. It does not submit orders to a restaurant, process payments, or connect to a live ordering backend.
