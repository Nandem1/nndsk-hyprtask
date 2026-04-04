import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ── FSD Boundaries ──────────────────────────────────────────────────────────
  {
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["src/**/*", "app/**/*"],
      "boundaries/elements": [
        { type: "shared",   pattern: "src/shared/**/*" },
        { type: "entities", pattern: "src/entities/**/*" },
        { type: "features", pattern: "src/features/**/*" },
        { type: "store",    pattern: "src/store/**/*" },
        { type: "widgets",  pattern: "src/widgets/**/*" },
        { type: "views",    pattern: "src/views/**/*" },
        { type: "app",      pattern: "app/**/*" },
      ],
    },
    rules: {
      "boundaries/dependencies": ["error", {
        default: "disallow",
        rules: [
          // shared: solo puede importar de shared
          { from: { type: "shared" },   allow: { to: { type: "shared" } } },
          // entities: puede importar de shared
          { from: { type: "entities" }, allow: { to: { type: "shared" } } },
          // features: puede importar de shared + entities
          { from: { type: "features" }, allow: { to: { type: ["shared", "entities"] } } },
          // store: puede importar de shared + entities (solo tipos)
          { from: { type: "store" },    allow: { to: { type: ["shared", "entities"] } } },
          // widgets: puede importar de shared, entities, features, store
          { from: { type: "widgets" },  allow: { to: { type: ["shared", "entities", "features", "store"] } } },
          // views (FSD pages layer): puede importar de shared, entities, features, store, widgets
          { from: { type: "views" },    allow: { to: { type: ["shared", "entities", "features", "store", "widgets"] } } },
          // app (Next.js routes): puede importar de views, widgets, shared
          { from: { type: "app" },      allow: { to: { type: ["views", "widgets", "shared"] } } },
        ],
      }],
    },
  },

  // ── Overrides existentes ─────────────────────────────────────────────────────
  {
    rules: {
      // Desactivar regla estricta de setState en useEffect - es un patrón común válido
      "react-hooks/set-state-in-effect": "off",
      // Permitir any en props específicas (formProps en vistas)
      "@typescript-eslint/no-explicit-any": ["warn", { ignoreRestArgs: true }],
    },
  },
]);

export default eslintConfig;
