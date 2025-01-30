# Armoire

A digital wardrobe management application built with React and Vite.

## Features
- Secure user authentication
- Personal digital closet management
- Create and catalog clothing items
- Responsive design with dark/light mode

## Tech Stack
- React + Vite
- Chakra UI for component styling
- Redux for state management
- React Router for navigation
- MongoDB & Express backend

## Project Structure
/src
  /components      # Reusable UI components like ItemCard
  /pages          # Main pages (Home, Create, Closet)
  /store          # Redux and Zustand state management
  App.jsx         # Main application component
  main.jsx        # Entry point

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Project Status
Currently in development with core features implemented.

ARMOIRE
backend
  config
    cloudinary.js
    db.js
  contorllers
    auth.controller.js/
    item.controller.js
  middleware
    authMiddleware.js/
    passport.js/
  models
    item.model.js/
    user.model.js/
  routes
    auth.route.js/
    item.route.js/
  uploads
  utility
    cleanup.js
  nodemon.json
  server.js
frontend
  dist
  node_modules/
  public/
    favicon.ico
    vite.svg
  src
    components
      itemcard.jsx
      MobileNav.jsx
      NavBar.jsx
      RegisterModal.jsx
      TagInputs.jsx
    pages
      ClosetPage.jsx
      CreatePage.jsx
      HomePage.jsx
    store
      item.js
      store.js
      user.js
  App.jsx
  main.jsx
  .gitignore
  eslint.config.js
  index.html
  package-lock.json
  package.json
  README.md
  vite.config.js
  
# ARMOIRE

## Backend
```./backend/
├── config/
│   ├── [cloudinary.js](./backend/config/cloudinary.js)
│   └── [db.js](./backend/config/db.js)
├── controllers/
│   ├── [auth.controller.js](./backend/controllers/auth.controller.js)
│   └── [item.controller.js](./backend/controllers/item.controller.js)
├── middleware/
│   ├── [authMiddleware.js](./backend/middleware/authMiddleware.js)
│   └── [passport.js](./backend/middleware/passport.js)
├── models/
│   ├── [item.model.js](./backend/models/item.model.js)
│   └── [user.model.js](./backend/models/user.model.js)
├── routes/
│   ├── [auth.route.js](./backend/routes/auth.route.js)
│   └── [item.route.js](./backend/routes/item.route.js)
├── uploads/
├── utility/
│   └── [cleanup.js](./backend/utility/cleanup.js)
├── [nodemon.json](./backend/nodemon.json)
└── [server.js](./backend/server.js)


## Frontend
```frontend/
├── dist/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ItemCard.jsx
│   │   ├── MobileNav.jsx
│   │   ├── NavBar.jsx
│   │   ├── RegisterModal.jsx
│   │   └── TagInputs.jsx
│   ├── pages/
│   │   ├── ClosetPage.jsx
│   │   ├── CreatePage.jsx
│   │   └── HomePage.jsx
│   └── store/
│       ├── item.js
│       ├── store.js
│       └── user.js
├── App.jsx
├── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js