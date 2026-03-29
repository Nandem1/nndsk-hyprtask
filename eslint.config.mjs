import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
