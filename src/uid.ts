// Ids that stay unique across every field rendered in a build, so two forms on one
// page can both have an "email" field without their labels pointing at each other.
let n = 0;
export const nextId = () => (++n).toString(36);
