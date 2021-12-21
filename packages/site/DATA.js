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
      id: 1,
      title: "Chrome extension",
      subtitle: "Good for web developers",
      href: "https://web.fireboardapp.com?utm_source=fireboard_landing",
      isRecommended: true,
      buttonText: "Download",
      features: [
        {
          id: 1,
          isAvailable: true,
          title: "Loaded along with your project",
        },
        {
          id: 2,
          isAvailable: true,
          title: `Auto detect project using meta tag`,
        },
        {
          id: 3,
          isAvailable: true,
          title: `Auto detect project using local storage`,
        },
        {
          id: 4,
          isAvailable: true,
          title: `Controls & Actions`,
        },
        {
          id: 5,
          isAvailable: true,
          title: `Today & Timeline`,
        },
      ],
    },
    {
      id: 2,
      title: "Web app",
      subtitle: "Good for users from any background",
      href: "https://web.fireboardapp.com?utm_source=fireboard_landing",
      isRecommended: false,
      buttonText: "Go",
      features: [
        {
          id: 1,
          isAvailable: false,
          title: "Loaded along with your project",
        },
        {
          id: 2,
          isAvailable: false,
          title: `Auto detect project using meta tag`,
        },
        {
          id: 3,
          isAvailable: true,
          title: `Auto detect project using local storage`,
        },
        {
          id: 4,
          isAvailable: true,
          title: `Controls & Actions`,
        },
        {
          id: 5,
          isAvailable: true,
          title: `Today & Timeline`,
        },
      ],
    },
  ],
};

export default DATA;
