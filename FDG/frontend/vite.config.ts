import { defineConfig } from "vite";

export default defineConfig({
    base: "/Wikidata-Entity-Graph-Visualiser/",
    server: {
        proxy: {
            "/api": "http://localhost:5000",
        },
    },
    build: {
        outDir: "../../docs",
        emptyOutDir: true,
    },
});
