import type { Denops } from "https://deno.land/x/denops_std@v4.0.0/mod.ts";
import {
  assertNumber,
  assertString,
  ensureObject,
} from "https://deno.land/x/unknownutil@v2.0.0/mod.ts";
import { setConfig } from "./config.ts";

interface Context {
  denops: Denops;
  bufnr: number;
  winid: number;
  param: Record<string, string>;
}

const patterns: Record<string, (ctx: Context) => Promise<void>> = {
  "/room/(?<domain>[^/]+)/(?<roomAlias>[^/]+)": (ctx) => {
    console.log(ctx);
    return Promise.resolve();
  },
  "/user/(?<domain>[^/]+)/(?<userName>[^/]+)": (ctx) => {
    console.log(ctx);
    return Promise.resolve();
  },
};

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
      for (const [pattern, callback] of Object.entries(patterns)) {
        const matches = new RegExp(`^parade:/${pattern}$`).exec(uri);
        if (matches) {
          callback({ denops, bufnr, winid, param: matches.groups ?? {} });
          return Promise.resolve();
        }
      }
      denops.call("parade#_internal#print_error", `Invaild URI: ${uri}`);
      return Promise.resolve();
    },
  };
  await Promise.resolve(denops);
}
