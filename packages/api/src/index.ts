import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { fail, success } from "./response/base-result";
import { BaseResultCode } from "./response/code";
import { basic } from "./routers/basic";
import { bing } from "./routers/bing";
import { kirby } from "./routers/kirby";
import { sms } from "./routers/sms";
import { spotlight } from "./routers/spotlight";

const hono = new Hono();

hono.use("*", poweredBy());

// Logger
hono.use("*", logger());

hono.use("*", cors());

hono.all("/", (c) => {
  const userAgent = c.req.header("User-Agent") || "";

  // 检查是否为浏览器访问
  const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge|Opera/i.test(userAgent);

  if (isBrowser) {
    return c.redirect("https://doc.api.imyan.ren");
  } else {
    return c.json(
      success(
        "Welcome to Yanren API Service, see https://doc.api.imyan.ren for more information."
      )
    );
  }
});

hono.onError((err, c) => {
  console.error("Error:", err);
  return c.json(
    fail(null, BaseResultCode.FAIL, err.message || "Internal Server Error"),
    500
  );
});

// 404
hono.notFound((c) => {
  const path = c.req.path;
  return c.json(fail(`Not Found ${path}`, BaseResultCode.NOT_FOUND));
});

hono.route("/", basic);

hono.route("/sms", sms);
hono.route("/bing", bing);
hono.route("/kirby", kirby);
hono.route("/spotlight", spotlight);

console.log("Listening on port 8000");

export default hono;
