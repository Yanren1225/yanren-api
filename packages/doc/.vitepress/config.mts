import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yanren Api Doc",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      {
        text: "API 示例",
        link: "/api-examples/",
        activeMatch: "/api-examples/*",
      },
    ],

    sidebar: {
      "/api-examples/": [
        {
          text: "bing",
          base: "/api-examples/bing/",
          items: [{ text: "/wallpaper", link: "wallpaper" }],
        },
        {
          text: "sms",
          base: "/api-examples/sms/",
          items: [{ text: "/", link: "/" }],
        },
        {
          text: "spotlight",
          base: "/api-examples/spotlight/",
          items: [
            { text: "/", link: "/" },
            { text: "/json", link: "/json" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Yanren1225/yanren-api" },
    ],
  },
});
