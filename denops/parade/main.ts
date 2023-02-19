import type { Denops } from "https://deno.land/x/denops_std@v4.0.0/mod.ts";
import {
  assertNumber,
  assertString,
  ensureObject,
} from "https://deno.land/x/unknownutil@v2.0.0/mod.ts";
import { setConfig } from "./config.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    setConfig(newConfig: unknown): Promise<void> {
      const error = setConfig(ensureObject(newConfig));
      if (error) {
        denops.call("parade#_internal#print_error", error);
      }
      return Promise.resolve();
    },
    detectBuffer(uri: unknown, bufnr: unknown, winid: unknown): Promise<void> {
      assertString(uri);
      assertNumber(bufnr);
      assertNumber(winid);
      console.log({ uri, bufnr, winid });
      return Promise.resolve();
    },
  };
  await Promise.resolve(denops);
}
