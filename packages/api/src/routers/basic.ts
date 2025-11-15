import { Hono } from "hono";

const basic = new Hono();

basic.get("/ip", (c) => {
  return c.json({
    ip: c.req.header("x-forwarded-for"),
  });
});

export { basic };
