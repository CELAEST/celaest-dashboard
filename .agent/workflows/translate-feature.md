---
description: Translate and Localize a Dashboard Component (CELAEST i18n Standard)
---

# Deep Localization Workflow (CELAEST i18n Standard)

This workflow outlines the precise procedure for fully translating a specific feature, tab, or component to support multi-language (English and Spanish) via `next-intl`. When invoked, the AI must ensure that absolutely **zero hardcoded English strings** remain in the target component, including hidden or deep elements like placeholders, dropdown options, and empty states.

## 1. Scope Analysis & Extraction
1. **Target Identification:** Analyze the requested file(s) for the feature.
2. **Deep Scan:** Identify all static text, including:
   - Form `<FormLabel>`, placeholders, and `<FormMessage>` validation texts.
   - Modal `<DialogTitle>`, headers, descriptions, and action buttons.
   - Filter dropdowns (`<SelectItem>`), table column headers, and empty states.
   - Inner card metrics, chart tooltips, and badges.
   - Toasts and `sonner` notifications.

## 2. Namespace & Key Management
1. **Select Namespace:** Determine the correct module namespace (`settings`, `billing`, `users`, `licensing`, `marketplace`, `releases`, or `common`).
2. **Key Creation:** Create highly descriptive, snake_case keys (e.g., `save_configuration`, `add_payment_method`).
3. **Dictionary Update:** Append the new keys to the corresponding namespace blocks in **both** `src/messages/en.json` and `src/messages/es.json`.
   - *Requirement:* Ensure precise, context-aware translations in Spanish (e.g., "Customer" -> "Cliente", "Settings" -> "Ajustes" o "Configuración").

## 3. Component Refactoring
1. **Import Hook:** Inject `import { useTranslations } from "next-intl";` at the top of the file.
2. **Initialize:** Call `const t = useTranslations("namespace");` at the top of the component or custom hook.
3. **Replace Hardcoded Text:** Replace all identified English strings with their respective `t("key")`.
   - For strings with variables, use interpolation: `t("showing_items", { current: 10, total: 50 })`.
   - If a component is a deeply nested pure component (no hooks allowed), pass `t` or the translated strings as props from the parent.

## 4. Verification Protocol
1. **Type Safety:** Ensure the component passes TypeScript compilation.
2. **Visual Consistency:** Ensure that using `t("...")` hasn't broken any layout constraints (especially flexbox or grid layouts that might shift with longer Spanish text).
