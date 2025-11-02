# EduGen AI Frontend

A modern, sleek React + Tailwind frontend for an educational AI agent interface.

## Features

- 🎨 Minimalist, modern UI with TailwindCSS
- 📚 Collapsible sections for organized content
- 📊 Mermaid diagram rendering
- 🧮 Math equation rendering with KaTeX
- 🔄 Smooth navigation with React Router
- ⚡ Fast loading with Vite
- 📱 Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## API Configuration

The app expects a backend API endpoint at `/demo` (POST request). You can configure the proxy target in `vite.config.js` if your backend runs on a different port.

Default configuration proxies `/demo` to `http://localhost:8000`.

## Project Structure

```
src/
├── components/
│   ├── Landing.jsx          # Landing page with query input
│   ├── Session.jsx           # Main session page with content
│   ├── CollapsibleSection.jsx # Collapsible content sections
│   ├── MermaidChart.jsx      # Mermaid diagram renderer
│   ├── MathRenderer.jsx      # KaTeX math renderer
│   ├── LoadingDots.jsx       # Loading animation
│   └── ErrorCard.jsx         # Error display component
├── App.jsx                   # Main app with routing
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## Usage

1. Enter a question on the landing page
2. Click "Generate" to create a new session
3. View the generated educational content with collapsible sections
4. Click on "Further Questions" chips to explore related topics
5. Use the sidebar navigation to jump between sections
