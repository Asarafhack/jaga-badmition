import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
vite: {},
tanstackStart: {
server: {
entry: "server",
preset: "netlify",
},
},
});
