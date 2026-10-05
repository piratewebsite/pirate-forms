export type FieldOption = string | { value: string; label?: string };

export interface FieldProps {
  /** The name the value is sent under, and what the email calls it. */
  name: string;
  type?:
    | "text" | "email" | "tel" | "url" | "number" | "date" | "time" | "datetime-local" | "month" | "week" | "color" | "range"
    | "textarea" | "select" | "radio" | "checkbox" | "checkboxes" | "hidden";
  /** Shown above the control. Defaults to the name, tidied up. */
  label?: string;
  required?: boolean;
  placeholder?: string;
  /** Starting value; for "checkboxes", the options ticked at the start. */
  value?: string | number | (string | number)[];
  /** Choices for "select", "radio" and "checkboxes". */
  options?: FieldOption[];
  /** A line of guidance under the control. */
  help?: string;
  /** Height of a "textarea" in lines. */
  rows?: number;
  class?: string;
  /** Anything else (min, max, pattern, maxlength, autocomplete, ...) goes onto the control itself. */
  [attribute: string]: unknown;
}
