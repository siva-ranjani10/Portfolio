# Sivaranjani J — Portfolio

React + Vite + Tailwind CSS v4 + Framer Motion.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build at http://localhost:4173
```

## Edit content

All text, links, stats, projects, experience and design-gallery items are in [`src/data.js`](src/data.js).
Images live in `public/img/` (WebP), and the resume is `public/sivaranjani-j-resume.pdf`.

## Contact form

Messages are sent with [Web3Forms](https://web3forms.com) (free, works on any host and on localhost):

1. Go to web3forms.com, enter `sivaranjani1071@gmail.com` and click *Create Access Key* — the key arrives by email.
2. Paste it into `contactForm.web3formsKey` in [`src/data.js`](src/data.js) and rebuild.

Until a key is added, submitting the form opens the visitor's email app with their message filled in.

## Deploy

- **Netlify** — connect the repo or drag-and-drop the `dist/` folder. `netlify.toml` already sets the build command and publish directory.
- **Vercel** — import the project; it detects Vite automatically.
