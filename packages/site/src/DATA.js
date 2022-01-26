const DATA = {
  appId: "FIREBOARD",
  name: "Fireboard",
  tagline: "Track daily work with a simple interface",
  description:
    "Track your daily work along with timeline previews, daily tasks and more",
  // previewURL: "https://cdn.devdojo.com/images/november2020/hero-image.jpeg",
  previewURL: "/demo.png",
  // videoURL: "https://youtube.com/embed/ze9KtYe3f48",
  webAppURL: "https://web.fireboardapp.com?utm_source=fireboard_landing",
  extensionURL: "https://web.fireboardapp.com?utm_source=fireboard_landing",
  sponser: "https://www.buymeacoffee.com/mehullakhanpal",
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
};

const getMenu = () => {
  const { platforms, features, videoURL } = DATA;
  return [
    { label: "Intro", value: "intro", visible: true },
    {
      label: "Features",
      value: "features",
      visible: features && features.list,
    },
    {
      label: "Platforms",
      value: "general",
      visible: platforms && platforms.list,
    },
    { label: "Demo", value: "demo", visible: !!videoURL },
  ].filter((menu) => menu.visible);
};

export { getMenu };

export default DATA;
