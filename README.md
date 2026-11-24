# BALAKRISHNA: Cinematic Studio Portfolio
Windows / VS Code terminal:  npm install  then  npm run dev   (build: npm run build)

## Edit everything in src/data/portfolioData.js
Put files in public/media and use "/media/filename".
- profileImage: portrait (hero, About, optional ScrollExpand media)
- showreel.url / thumbnail / expandMedia ('video' or 'image'), projects[] (video, thumbnail, title, description), services, about, skills, contact.

## Real ScrollExpand
Overwrite src/components/ScrollExpand/ScrollExpand.jsx and .css with your React Bits files.
src/components/sections/ShowreelExpand.jsx passes all your props.

## How the 3D connects the page
src/lib/sections.js lists a pose for the camera lens per section; edit KF to move it. Phones/reduced-motion get CSS fallbacks.

## Deploy on Vercel
Push to GitHub, import at vercel.com (Vite, build npm run build, output dist).

## Cinematic background
src/components/CinematicBackground/ (CinematicBackground.jsx, CinematicBackground.css, CinematicScene.jsx).
Lens poses per section: src/lib/sections.js (KF). Film strips: STRIPS in CinematicScene.jsx.
Timeline/beam/fog/grain layers are CSS/SVG. Phones and reduced-motion users get the CSS layers only.
