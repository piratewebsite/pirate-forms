# pirate-forms

Forms for static Astro sites, and an optional plugin for the
[pirate theme](https://github.com/piratewebsite/pirate).

`Form` and `Field` render a plain HTML form: no framework, works on any host, works
without script. The form posts to a forms receiver, a separate service that stores each
submission and emails it to the site's owner. Who receives a form is decided on the
receiver, never in the page, so no email address appears in a site's HTML.

There are two ways to say who receives a form:

- **`recipient`**: the site names the address itself. It is sealed at build time, so the
  page carries only ciphertext, and the receiver emails that address a confirmation link
  the first time. Nothing is delivered until the address confirms; messages sent in the
  meantime are kept and delivered afterwards.
- **`id`**: the form is registered on the receiver by its operator, with the recipient
  kept there. The receiver accepts that ID only from that site's address.

## Using it on a site

Install from the repository:

```bash
npm install github:piratewebsite/pirate-forms
```

Write the fields as children:

```astro
---
import { Form, Field } from "pirate-forms";
---
<Form recipient="you@example.org">
  <Field name="name" required />
  <Field name="email" type="email" required help="Only used to reply to you." />
  <Field name="topic" type="select" placeholder="Pick one" options={["Booking", "Press", "Other"]} />
  <Field name="message" type="textarea" required />
</Form>
```

Or as data:

```astro
<Form id="newsletter" submitLabel="Sign me up" redirect="/thanks/"
  fields={[{ name: "name" }, { name: "email", type: "email", required: true }]} />
```

With `id` instead of `recipient`, the form uses the ID the site was given on the receiver:

```astro
<Form id="pirate-contact"> ... </Form>
```

The address given as `recipient` is in your source (and so in your repository), just not in
the built page. To keep it out of the source too, seal it once with `sealRecipient()` and
use the result, which starts with `v1.`, as the `recipient`.

### Form props

| Prop | Default | What it does |
|---|---|---|
| `recipient` | none | The address that receives the form; sealed in the page, confirmed by email |
| `id` | `inbox` with `recipient`, otherwise required | The form's id on the receiver |
| `endpoint` | `PUBLIC_FORMS_ENDPOINT`, then `https://forms.piratesocial.app` | Receiver address |
| `fields` | none | Fields as an array of `Field` props |
| `submitLabel`, `sendingLabel` | "Send", "Sending…" | Button text |
| `successMessage`, `errorMessage` | built in | Shown under the button |
| `fallbackEmail` | none | Offered as a mail link when the form cannot be sent |
| `redirect` | none | Page to go to after sending (a path, or a full address on the same site) |
| `submitClass` | none | Use the site's own button class instead of the built-in style |
| `turnstileSiteKey` | none | Adds a Cloudflare Turnstile check (the receiver must hold the matching secret for this form) |

A `submit` slot replaces the button entirely. The form fires a `pf:sent` event after a
successful send.

### Field props

`name` (required), `type`, `label`, `required`, `placeholder`, `value`, `options`, `help`,
`rows`, `class`. Anything else (`min`, `pattern`, `maxlength`, `autocomplete`, ...) goes
onto the control.

Types: `text` (default), `email`, `tel`, `url`, `number`, `date`, `time`,
`datetime-local`, `month`, `week`, `color`, `range`, `textarea`, `select`, `radio`,
`checkbox`, `checkboxes`, `hidden`. File uploads are not supported.

### Styling

Fonts and text colour come from the page. The rest is set with custom properties on the
form or any ancestor:

`--pf-accent`, `--pf-accent-text`, `--pf-radius`, `--pf-border`, `--pf-bg`, `--pf-gap`,
`--pf-pad`, `--pf-label-gap`, `--pf-label-weight`, `--pf-ok`, `--pf-error`

## As a plugin for the pirate theme

The theme's contact form uses Netlify Forms by default. It switches to this package when
both of these are true for a site:

1. `pirate-forms` is installed (the theme lists it as a dependency).
2. A form ID is set, either as **Pirate Forms ID** in Keystatic's Form Settings or as the
   `PUBLIC_PIRATE_FORMS_ID` environment variable.

The theme then renders [pirate/ContactForm.astro](pirate/ContactForm.astro) with its own
Form Settings, so the same fields appear (name, email, phone, the two extra fields,
message). The upload field and reCAPTCHA belong to Netlify Forms and are left out. If an
ID is set but the package is missing, the build prints a warning and keeps Netlify Forms.

The form ID must be registered on the receiver for the site's address.
