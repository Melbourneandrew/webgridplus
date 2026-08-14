import argon2 from "argon2";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(password: string) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export function verifyPasswordHash(hash: string, password: string) {
  if (!hash.startsWith("$argon2id$")) return Promise.resolve(false);
  return argon2.verify(hash, password);
}
