const DATA = {
  name: "Fireboard",
  tagline: "Task tracker for developers",
  description:
    "Track your daily work along with timeline previews, daily tasks and more",
  featuresSubtitle: "Focus on your work, we take care of tracking.",
  // menu: [
  //   { label: "Intro", value: "intro" },
  //   { label: "About", value: "about" },
  // ],
  features: [
    {
      id: 1,
      title: "Always with you",
      description: `Extension mode works right in your local project environment`,
    },
    {
      id: 2,
      title: "Auto detect project",
      description:
        "Auto detect project by storing the project id in meta tag of your project or in local storage",
    },
    {
      id: 3,
      title: "Controls & Actions",
      description: "Track start/end of a feature, add deadline for todos",
    },
    {
      id: 4,
      title: "Today & Timeline",
      description: "Checkout the work done today or glance the work timeline",
    },
  ],
  platforms: [
    {
      title: "Chrome extension",
      src: "https://cdn.devdojo.com/images/december2020/productivity.png",
      description: "Recommended for Web Developers",
      ctaHref: "https://web.fireboardapp.com?utm_source=fireboard_landing",
      buttonLabel: "Download",
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
      src: "https://cdn.devdojo.com/images/december2020/settings.png",
      description: "Good for users from any background",
      ctaHref: "https://web.fireboardapp.com?utm_source=fireboard_landing",
      buttonLabel: "Use",
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
};

export default DATA;
