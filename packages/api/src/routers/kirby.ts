import { success } from "@/response/base-result";
import { Hono } from "hono";

type Variables = {
  success: (data: string) => Promise<Response>;
};

const kirby = new Hono<{ Variables: Variables }>();

// kirby.use('*', async (c, next) => {
//   // deno-lint-ignore require-await
//   c.set('success', async (data: string) => {
//     return c.json(data, 200)
//   })
//   await next()
// })

kirby.get("/", (c) => {
  return c.json(success("Kirby"));
});

export { kirby };
