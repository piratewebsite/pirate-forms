// Seals a recipient address so a page can carry it without showing it: only the receiver
// holds the key that opens it. This runs at build time, and the plain address is never
// rendered. Sealing is not permission: the receiver sends nothing to an address until that
// address has confirmed by email for the site in question.

// Public key of the receiver at forms.piratesocial.app (RSA 2048, SPKI, base64). A site that
// posts to a different receiver gives that receiver's key in PUBLIC_FORMS_KEY.
const RECEIVER_KEY =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA31SD+Em7al3mkcqa4OvqLB0nF1jRqdNFVOjDenxPc3wcbgEoO3yHs6Pj22YzQ0nd/m8lpQzndXK2lB7LdhFFoyAnCmTS450iUjIKIVT5SCy3uyweAxIb0T2ujk0ulESx3J3Whx4YyuH6vraeqX6TxTwbMvmSdxRZBUQfdgKTm1ahyonhS7SQZie+4M/AOfgwBsnWSUO+TxB5IWE7Y684LAsOylAnwJWUkeNjBCCRYBGu09gOBzv09LEiZrvnPuTYgFaDipHG6isYf40j87Uz0GrSaXN4SHPuBTGYW1wfRns6g+RdqFz0kwQm/s3+iTqvuUxYdZQYRSxnVJ++6CmNQwIDAQAB";

export const isEmailAddress = (value: string) => /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(value.trim());

/** Returns the sealed form of an email address ("v1." + ciphertext). A value that is already sealed is returned as is. */
export async function sealRecipient(address: string, key?: string): Promise<string> {
  const value = address.trim();
  if (value.startsWith("v1.")) return value;
  if (!isEmailAddress(value)) throw new Error(`pirate-forms: "${value}" is not an email address`);
  const der = Uint8Array.from(atob(key || RECEIVER_KEY), (c) => c.charCodeAt(0));
  const publicKey = await crypto.subtle.importKey("spki", der, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, new TextEncoder().encode(value.toLowerCase())));
  return "v1." + btoa(String.fromCharCode(...sealed)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
