# R3F Starter

A small, plain-JavaScript starter for React, Vite, React Three Fiber, Drei, and Rapier physics.

## Start developing

```bash
nvm use
npm install
npm run dev
```

Then open the local address printed in the terminal.

## Commands

- `npm run dev` — start the development server
- `npm run build` — create a production build in `dist`
- `npm run preview` — preview the production build
- `npm run lint` — check the source for common mistakes

## Project structure

```text
src/
  App.jsx          # React shell, Canvas, and HTML overlay
  main.jsx         # Browser entry point
  styles.css       # Full-screen layout and HUD styles
  scene/
    Scene.jsx      # Lights, camera controls, physics, and 3D objects
```

The orange cube is a Rapier rigid body. Click it to apply an impulse. The teal shape and camera controls use Drei helpers.
