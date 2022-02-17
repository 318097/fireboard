import DATA from "../DATA";
// import Image from "next/image";
import { Button } from "../lib/tailwind";
const { description, tagline, previewURL, webAppURL, extensionURL } = DATA;

export default function Intro() {
  const classes = {
    container: "px-2 py-32 bg-white md:px-0",
    wrapper: "container items-center max-w-6xl px-8 mx-auto xl:px-5",
    innerWrapper: "flex flex-wrap items-start justify-between sm:-mx-3",
    leftSection: "w-full md:w-1/2 md:px-3",
    leftSectionInner: `
      w-full
      pb-6
      space-y-6
      sm:max-w-md
      lg:max-w-lg
      md:space-y-4
      lg:space-y-8
      xl:space-y-9
      sm:pr-5
      lg:pr-0
      md:pb-0
    `,
    tagline: `
      text-4xl
      font-extrabold
      tracking-tight
      text-gray-900
      sm:text-5xl
      md:text-4xl
      lg:text-5xl
      xl:text-6xl
    `,
    description: `
      mx-auto
      text-base text-gray-500
      sm:max-w-md
      lg:text-xl
      md:max-w-3xl
    `,
    buttonWrapper: "relative flex flex-col sm:flex-row sm:space-x-4",
    imageWrapper: "h-auto overflow-hidden shadow-xl rounded-sm",
  };

  return (
    <section className={classes.container} id="intro">
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <div className={classes.leftSection}>
            <div className={classes.leftSectionInner}>
              <h1 className={classes.tagline}>{tagline}</h1>
              <p className={classes.description}>{description}</p>
              <div className={classes.buttonWrapper}>
                <Button href={webAppURL}>Download extension</Button>
                <Button href={extensionURL} variant="default">
                  Try web app
                </Button>
              </div>
            </div>
          </div>
          <div className={classes.imageWrapper}>
            <img src={previewURL} className="" />
          </div>
        </div>
      </div>
    </section>
  );
}
