import { fail } from "@/response/base-result";
import { BaseResultCode } from "@/response/code";
import dayjs from "dayjs";
import { Bot } from "grammy";
import { Hono } from "hono";

const sms = new Hono();

class ContentWrapper {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  private replaceSymbol(): ContentWrapper {
    this.value = this.value
      .replace(/\_/g, "\\_")
      .replace(/\*/g, "\\*")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\~/g, "\\~")
      .replace(/\`/g, "\\`")
      .replace(/\>/g, "\\>")
      .replace(/\#/g, "\\#")
      .replace(/\+/g, "\\+")
      .replace(/\-/g, "\\-")
      .replace(/\=/g, "\\=")
      .replace(/\|/g, "\\|")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\./g, "\\.")
      .replace(/\!/g, "\\!");
    return this;
  }

  private replaceDigit(): ContentWrapper {
    const digitPattern = /\b(\d{4,6})\b/g;
    this.value = this.value.replace(digitPattern, "`$1`");
    return this;
  }

  private replaceLink(): ContentWrapper {
    const linkPattern = /(?:https?|ftp):\/\/[\n\S]+/g;
    this.value = this.value.replace(linkPattern, (match: string) => {
      return `[${match}](${match})`;
    });
    return this;
  }

  toString(): string {
    return this.replaceSymbol().replaceDigit().replaceLink().value;
  }
}

sms.get("/", async (c) => {
  const { user, token, from, content, device, time } = c.req.query();

  if (!token) {
    return c.json<BaseResponse<null>>(
      fail(null, BaseResultCode.INVALID_PARAMS, `token is required`),
      400
    );
  }

  if (!user) {
    return c.json<BaseResponse<null>>(
      fail(null, BaseResultCode.INVALID_PARAMS, `user is required`),
      400
    );
  }

  const bot = new Bot(token);

  bot.start();

  try {
    await bot.api
      .sendMessage(
        user,
        `
来自： ||${from}||
内容： ${new ContentWrapper(content).toString()}
设备： ${device}
时间： ${dayjs(time).format("YYYY/MM/DD HH:mm:ss")}
      `.trim(),
        {
          parse_mode: "MarkdownV2",
        }
      )
      .then(() => {
        return bot.stop();
      });
  } catch (err) {
    return c.json(fail(null, BaseResultCode.FAIL, String(err)), 400);
  }

  return new Response(null, { status: 204 });
});

export { sms };
