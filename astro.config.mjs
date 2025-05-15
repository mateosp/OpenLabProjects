import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless'; // <- usa "serverless"

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
});