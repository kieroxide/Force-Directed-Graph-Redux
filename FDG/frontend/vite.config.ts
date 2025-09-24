import { defineConfig } from "vite";

export default defineConfig({
    base: '/Force-Directed-Graph-Redux/',
    server: {
        proxy: {
            "/api": "http://localhost:5000",
        },
    },
});
