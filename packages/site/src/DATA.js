const DATA = {
  appId: "FIREBOARD",
  name: "Fireboard",
  tagline: "Track daily work with a simple interface",
  description:
    "Track your daily work along with timeline previews, daily tasks and more",
  // previewURL: "https://cdn.devdojo.com/images/november2020/hero-image.jpeg",
  previewURL: "/preview.png",
  // videoURL: "https://youtube.com/embed/ze9KtYe3f48",
  webAppURL: "https://web.fireboardapp.com?utm_source=fireboard_landing",
  extensionURL: "https://web.fireboardapp.com?utm_source=fireboard_landing",
  sponser: "https://www.buymeacoffee.com/mehullakhanpal",
  carouselList: [
    {
      path: "/preview/1A.png",
      legend: "View all the tasks",
    },
    {
      path: "/preview/1B.png",
      legend: "View pending tasks only",
    },
    {
      path: "/preview/2A.png",
      legend: "View all the work done today",
    },
    {
      path: "/preview/3A.png",
      legend: "Work timeline",
    },
    {
      path: "/preview/4B.png",
      legend: "Settings - create/select, see all the features from a project",
    },
  ],
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
        src: "/chrome-extension.png",
        description: "Recommended for web developers",
        ctaHref: "https://web.fireboardapp.com?utm_source=fireboard_landing",
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
        src: "/web-app.png",
        description:
          "Not a developer? No worries. Got a web version with similar features",
        ctaHref: "https://web.fireboardapp.com?utm_source=fireboard_landing",
        ctaLabel: "Use",
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
  showAboutPage: false,
  showOtherProducts: false,
};

const getMenu = ({ src } = {}) => {
  const { platforms, features, videoURL, carouselList } = DATA;
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
      renderComponent: !!carouselList && carouselList.length,
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
