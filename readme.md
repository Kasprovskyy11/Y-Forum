# Y forum
Inspired by X

## Team and roles
- Kacper Banucha - Frontend
- Piotr Jarocha - Backend
- Kamil Gałek - Full stack observer

## Technologies
- React used with Typescript (for frontend):
  Used with: Tanstack Router, TailwindCSS
- PHP (for backend)

## Configuration
In case of changing path to your server, get in frontend/src/config.js and change path value
Get in dane_do_bazy.php in server directory and change database acces data 

## Frontend
Routes:
  - index.tsx -> Main page
  - register.tsx -> Register page
  - login.tsx -> Login page
  - /users/$user -> dynamic rendered route with user view
  - /posts/$post -> dynamic rendered route with post view

Components:
  - forms:
    - CustomButton.tsx -> Customized and styled HTML button
    - CustomInput.tsx -> Customized and styled HTML Input
  - posts:
    - MainPostCreate.tsx -> Post creating element displayed only on mobile devices
    - Post.tsx -> Post component rendering post data
    - PostLayout.tsx -> Post layout used on main site. Fetching post data and rendering it with Post.tsx
  - UI:
    - MobileMain.tsx -> Top header displayed only on mobile devices
    - DesktopUI:
      - LeftPanel.tsx -> Panel with tabs, displayed only on desktops
      - RightPanel.tsx -> Panel with searchbar, displayed only on desktops
    - MobileUIComponents:
      - Tabs.tsx -> "For you" and "Followed" tabs (used in desktop and mobile)
      - LowerPanel.tsx -> Panel displayed as footer on mobile devices

Contexts:
  - userContext.tsx -> Context storing user data after fetching it in LoginPage
