import DATA from "../DATA";
// import Image from "next/image";
import { Button } from "../lib/tailwind";
const { description, tagline, previewURL, webAppURL, extensionURL } = DATA;

export default function Intro() {
  const classes = {
    wrapper:
      "flex flex-col items-center justify-between gap-8 md:flex-row md:items-start",
    leftSection: `
      flex
      flex-col
      align-center
      gap-4
    `,
    tagline: `
    font-extrabold
    text-gray-900
    text-2xl
    md:text-3xl
    lg:text-4xl
    `,
    description: `
      text-base 
      text-gray-500
      lg:text-xl
    `,
    buttonWrapper: "flex flex-col sm:flex-row gap-4",
    imageWrapper: "h-auto overflow-hidden shadow-xl rounded-sm min-w-fit",
  };

  return (
    <section id="intro">
      <div className={classes.wrapper}>
        <div className={classes.leftSection}>
          <h1 className={classes.tagline}>{tagline}</h1>
          <p className={classes.description}>{description}</p>
          <div className={classes.buttonWrapper}>
            <Button href={extensionURL}>Download extension</Button>
            <Button href={webAppURL} variant="default">
              Try web app
            </Button>
          </div>
        </div>
        <div className={classes.imageWrapper}>
          <img src={previewURL} className="" />
        </div>
      </div>
    </section>
  );
}
