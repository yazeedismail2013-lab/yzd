import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://yzdz.netlify.app',
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [react(), sitemap()],
    adapter: netlify({
        devFeatures: {
            environmentVariables: true
        }
    })
});
