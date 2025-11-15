import { success } from "@/response/base-result";
import { Hono } from "hono";

type Variables = {
  success: (data: string) => Promise<Response>;
};

const kirby = new Hono<{ Variables: Variables }>();

kirby.get("/", (c) => {
  return c.json(success("Kirby"));
});

export { kirby };
