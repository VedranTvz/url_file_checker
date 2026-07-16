import crypto from "crypto";

export function hashFile(buffer) {
  return crypto.createHash("sha-256").update(buffer).digest("hex");
}

export function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}