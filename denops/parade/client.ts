import {
  createClient,
  type EventEmittedEvents,
  type MatrixClient,
  type MatrixEvent,
} from "npm:matrix-js-sdk@23.3.0";
import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { open } from "https://deno.land/x/open@v0.0.5/index.ts";
import { config } from "./config.ts";

export async function resolveUserId(
  userId: string,
): Promise<{ baseUrl: string; username: string }> {
  if (!userId.startsWith("@") || !userId.includes(":")) {
    throw new TypeError(`Invalid userId: ${userId}`);
  }
  const [user, server] = userId.split(":");
  return {
    username: user.slice(1),
    baseUrl: await fetch(`https://${server}/.well-known/matrix/client`)
      .then((response) => response.json())
      .then((value) => value["m.homeserver"].base_url),
  };
}

export async function loginWithSso(
  client: MatrixClient,
  // deno-lint-ignore no-inferrable-types
  port: number = 8689,
): Promise<Record<string, unknown>> {
  return await new Promise((resolve) => {
    fetch(
      new URL(
        "/_matrix/client/r0/login/sso/redirect?" +
          new URLSearchParams({ redirectUrl: `http://localhost:${port}` })
            .toString(),
        client.baseUrl,
      ),
    )
      .then(({ url }: Response) => open(url));
    serve(
      async (req: Request): Promise<Response> => {
        const loginToken = new URL(req.url).searchParams.get("loginToken");
        if (loginToken) {
          const result = await client.loginWithToken(loginToken);
          resolve(result);
          return Response.json(result, { status: 200 });
        }
        return new Response("Bad Request", { status: 400 });
      },
      { hostname: "localhost", port },
    );
  });
}

const baseUrl = await resolveUserId(config.userId)
  .then((result) => result.baseUrl);

const client = createClient({
  baseUrl,
  userId: config.userId,
  accessToken: config.token,
});
// console.log(await client.loginWithToken(config.token));
// console.log(await loginWithSso(client));

client.once(
  "sync" as EventEmittedEvents,
  (state: string, _prevState: unknown, _res: unknown) => {
    console.log(state);
    for (const room of client.getRooms()) {
      console.log({ name: room.name, roomId: room.roomId });
    }
  },
);
client.on("event" as EventEmittedEvents, (event: MatrixEvent) => {
  console.log(event.getType());
  console.log(event);
});

await client.startClient();
