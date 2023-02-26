import {
  AssertError,
  assertString,
} from "https://deno.land/x/unknownutil@v2.0.0/mod.ts";

// NOTE: this logic is based on
// https://github.com/vim-skk/skkeleton/blob/7474ea38c4/denops/skkeleton/config.ts

export const config = {
  token: "dummyToken",
  userId: "@someone:matrix.org",
};

type Validators = {
  [P in keyof typeof config]: (x: unknown) => asserts x is typeof config[P];
};

const validators: Validators = {
  token: assertString,
  userId: assertString,
};

export function setConfig(newConfig: Record<string, unknown>): string | null {
  const cfg = config as Record<string, unknown>;
  const val = validators as Record<string, (x: unknown) => void>;
  for (const k in newConfig) {
    try {
      if (val[k]) {
        val[k](newConfig[k]);
        cfg[k] = newConfig[k];
      } else {
        return `Unknown option detected: ${k}`;
      }
    } catch (error: unknown) {
      if (error instanceof AssertError) {
        return `Illegal option detected: ${error}`;
      }
      throw error;
    }
  }
  return null;
}
