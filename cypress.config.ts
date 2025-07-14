import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
    env: {
        ...process.env,
    },
});
