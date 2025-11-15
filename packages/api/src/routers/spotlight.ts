import { fail } from "@/response/base-result";
import { BaseResultCode } from "@/response/code";
import { Hono, Context, Next } from "hono";

type Variables = {
  resolution: string;
  random: string;
  format: string;
};

const url =
  "https://assets.msn.cn/resolver/api/resolve/v3/config/?expType=AppConfig&expInstance=default&apptype=edgeChromium&v=20250321.466&targetScope={%22audienceMode%22:%22adult%22,%22browser%22:{%22browserType%22:%22edgeChromium%22,%22version%22:%22136%22,%22ismobile%22:%22false%22},%22deviceFormFactor%22:%22desktop%22,%22domain%22:%22ntp.msn.cn%22,%22locale%22:{%22content%22:{%22language%22:%22zh%22,%22market%22:%22cn%22},%22display%22:{%22language%22:%22zh%22,%22market%22:%22cn%22}},%22os%22:%22windows%22,%22platform%22:%22web%22}";

const imageUrlPrefix = "https://img-s.msn.cn/tenant/amp/entityid/";

const resolutionList = ["100", "240", "720", "1080", "1440", "2160"];

const formatList = ["image", "url"];

const spotlight = new Hono<{ Variables: Variables }>();

const validateQuery = async (
  c: Context<{ Variables: Variables }>,
  next: Next
) => {
  const resolution = c.req.query("resolution") || "1080";
  const random = c.req.query("random") || "false";
  const format = c.req.query("format") || "image";

  if (!resolutionList.includes(resolution)) {
    return c.json(
      fail(
        null,
        BaseResultCode.INVALID_PARAMS,
        `Invalid resolution, must be one of ${resolutionList.join(", ")}`
      ),
      400
    );
  }

  if (!formatList.includes(format)) {
    return c.json(
      fail(
        null,
        BaseResultCode.INVALID_PARAMS,
        `Invalid format, must be one of ${formatList.join(", ")}`
      ),
      400
    );
  }

  if (random !== "true" && random !== "false") {
    return c.json(
      fail(
        null,
        BaseResultCode.INVALID_PARAMS,
        `Invalid random, must be true or false`
      ),
      400
    );
  }

  c.set("resolution", resolution);
  c.set("random", random);
  c.set("format", format);

  await next();
};

spotlight.get("/", validateQuery, async (c) => {
  const idList = await getImageIdList(c.get("resolution"));

  const imageId = c.get("random")
    ? idList[Math.floor(Math.random() * idList.length)]
    : idList[idList.length - 1];

  if (c.get("format") === "url") {
    const imageUrl = `${imageUrlPrefix}${imageId}`;
    return c.text(imageUrl);
  } else {
    const image = await fetch(`${imageUrlPrefix}${imageId}`);
    c.header("Content-Type", image.headers.get("Content-Type") ?? "image/JPEG");
    return new Response(image.body, {
      headers: c.res.headers,
    });
  }
});

const getImageIdList = async (resolution: string) => {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as Record<string, any>;

    const originalImageId =
      data["configs"]["BackgroundImageWC/default"].properties.simpleImages.data;

    if (Array.isArray(originalImageId)) {
      return (
        originalImageId as {
          attribution: string;
          image: {
            k: string;
            [key: `i${string}`]: string;
          };
        }[]
      ).map((item) => {
        return item.image[`i${resolution}`];
      });
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

export { spotlight };
