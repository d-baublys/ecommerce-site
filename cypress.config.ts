import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
    env: {
        adminUsername: process.env.ADMIN_USERNAME,
        adminPassword: process.env.ADMIN_PASSWORD,
    },
});
