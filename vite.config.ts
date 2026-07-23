import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path must match the GitHub repository name (case-sensitive).
// GitHub Pages serves the site at https://<user>.github.io/<repo>/
const REPO_NAME = 'Rexi-AI'

export default defineConfig({
  plugins: [react()],
  base: `/${REPO_NAME}/`,
})
