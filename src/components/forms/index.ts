/**
 * Form Components - Reusable RHF-integrated form elements
 *
 * These are "dumb" presentational components that:
 * - Integrate with React Hook Form via Controller
 * - Handle dark/light theming
 * - Display validation errors
 * - Provide accessibility (aria-labels, describedby)
 *
 * Usage:
 * ```tsx
 * import { FormInput, FormTextarea, FormSelect } from '@/components/forms';
 *
 * <FormInput control={control} name="email" label="Email" />
 * ```
 */

export { FormInput, type FormInputProps } from "./FormInput";
export { FormTextarea, type FormTextareaProps } from "./FormTextarea";
export { FormSelect, type FormSelectProps, type SelectOption } from "./FormSelect";
export { FormCheckbox, type FormCheckboxProps } from "./FormCheckbox";
