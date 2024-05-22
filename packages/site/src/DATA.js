const PRODUCT_URLS = {
  web: {
    label: "Web app",
    url: "https://fireboard.netlify.app?utm_source=fireboard_landing",
  },
  extension: {
    label: "Chrome extension",
    url: "https://chrome.google.com/webstore/detail/fireboard/dcleiepmlcoabfipbcpfjkbgehdmhogk?utm_source=fireboard_landing",
  },
};

const DATA = {
  appId: "FIREBOARD",
  appName: "Fireboard",
  tagline: "A work tracker for software developers",
  description: "Track daily work along with timeline/daily work preview",
  // previewURL: "https://cdn.devdojo.com/images/november2020/hero-image.jpeg",
  previewURL: "/assets/preview.png",
  webAppURL: PRODUCT_URLS.web.url,
  extensionURL: PRODUCT_URLS.extension.url,
  videoURL: "https://youtube.com/embed/NvD6Cv4PiTc",
  sponser: "https://www.buymeacoffee.com/mehullakhanpal",
  carousel: {
    list: [
      {
        path: "/assets/1A.png",
        legend: "View all the tasks",
      },
      {
        path: "/assets/1B.png",
        legend: "View pending tasks only",
      },
      {
        path: "/assets/2A.png",
        legend: "View all the work done today",
      },
      {
        path: "/assets/3A.png",
        legend: "Work timeline",
      },
      {
        path: "/assets/4B.png",
        legend: "Settings - create/select, see all the features from a project",
      },
    ],
  },
  features: {
    subTitle: "Focus on your work, we take care of tracking.",
    list: [
      {
        id: 1,
        iconType: "robot",
        title: "Always with you",
        description: `Extension works right in your local project environment. Open the popup using the shortcut 'Ctrl+U'`,
      },
      {
        id: 2,
        iconType: "automatic",
        title: "Auto detect project",
        description:
          "Auto detect project by storing the 'project id' in 'meta tag' of your project or in 'local storage'",
      },
      {
        id: 3,
        iconType: "time",
        title: "Controls & Actions",
        description: "Track start/end of a feature, add deadline for tasks",
      },
      {
        id: 4,
        iconType: "timeline",
        title: "Today & Timeline",
        description: "Checkout the work done today or glance the work timeline",
      },
    ],
  },
  platforms: {
    title: "Platforms",
    subTitle: "Available as a chrome extension or use web app",
    list: [
      {
        title: "Chrome extension",
        src: "/assets/chrome-extension.png",
        description: "Recommended for web developers",
        ctaHref: PRODUCT_URLS.extension.url,
        ctaLabel: "Download",
        points: [
          {
            title: "Loaded along with your project",
          },
          {
            title: `Auto detect project using meta tag`,
          },
          {
            title: `Auto detect project using local storage`,
          },
          {
            title: `Controls & Actions`,
          },
          {
            title: `Today & Timeline`,
          },
        ],
      },
      {
        title: "Web app",
        src: "/assets/web-app.png",
        description:
          "Not a developer? No worries. Got a web version with similar features",
        ctaHref: PRODUCT_URLS.web.url,
        ctaLabel: "Try web app",
        points: [
          {
            title: `Auto detect project using local storage`,
          },
          {
            title: `Controls & Actions`,
          },
          {
            title: `Today & Timeline`,
          },
        ],
      },
    ],
  },
  showOtherProducts: false,
};

const getMenu = ({ src } = {}) => {
  const { platforms, features, videoURL, carousel } = DATA;
  return [
    { label: "Intro", value: "intro", renderComponent: true, showInNav: true },
    {
      label: "Features",
      value: "features",
      renderComponent: features && features.list,
      showInNav: true,
    },
    {
      label: "Carousel",
      value: "carousel",
      renderComponent: carousel && carousel.list,
      showInNav: false,
    },
    {
      label: "Platforms",
      value: "general",
      renderComponent: platforms && platforms.list,
      showInNav: true,
    },
    {
      label: "Demo",
      value: "demo",
      renderComponent: !!videoURL,
      showInNav: true,
    },
  ]
    .filter((menu) => menu.renderComponent)
    .filter((menu) => (src === "nav" ? menu.showInNav : true));
};

const getMenuLabel = (value) =>
  getMenu().find((menu) => menu.value === value) || {};

export { getMenu, getMenuLabel };

export default DATA;
