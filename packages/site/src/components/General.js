import DATA from "../DATA";
import { getIcon } from "../lib/icons";
import { Heading, Button } from "../lib/tailwind";
const { platforms } = DATA;
const { list = [] } = platforms;

export default function General() {
  return (
    <section className="w-full bg-white pt-7 pb-7 md:pt-20 md:pb-24 flex flex-col gap-8">
      <Heading title="Platforms" />
      <Section {...list[0]} />
      <Section {...list[1]} direction="reverse" />
    </section>
  );
}

const Section = ({
  src,
  title,
  description,
  ctaHref,
  ctaLabel,
  points = [],
  direction = "row",
}) => {
  const classes = {
    container: `
      w-full
      box-border
      flex 
      flex-col
      items-center
      content-center
      px-8
      mx-auto
      leading-6
      text-black
      border-0 
      border-gray-300 
      border-solid
      max-w-7xl
      lg:px-16
      ${direction === "reverse" ? "md:flex-row-reverse" : "md:flex-row"}
    `,
    imageWrapper: `
      box-border
      relative
      w-full
      max-w-md
      px-4
      mt-5
      mb-4
      -ml-5
      text-center
      bg-no-repeat 
      bg-contain
      border-solid
      md:ml-0 
      md:mt-0 
      md:max-w-none
      lg:mb-0
      md:w-1/2
      xl:pl-10
    `,
    image: "p-2 pl-6 pr-5 xl:pl-16 xl:pr-20",
    content: `
      box-border
      order-first
      w-full
      text-black
      border-solid
      md:w-1/2 md:pl-10 md:order-none
    `,
    title: `
      m-0
      text-lg
      font-semibold
      leading-tight
      border-0 
      border-gray-300
      lg:text-2xl
      md:text-xl
    `,
    description: `
      pt-1
      pb-8
      m-0
      leading-7
      text-gray-700
      border-0 border-gray-300
      sm:pr-12
      xl:pr-32
      lg:text-lg
    `,
    pointsWrapper: "p-0 m-0 leading-6 border-0 border-gray-300",
    point: `
      box-border
      relative
      py-1
      pl-0
      text-left text-gray-500
      border-solid`,
    pointIcon: `
      inline-flex
      items-center
      justify-center
      w-6
      h-6
      mr-2
      text-white
      bg-secondary
      rounded-full
    `,
  };

  return (
    <div id="general" className={classes.container}>
      <div className={classes.imageWrapper}>
        <img src={src} className={classes.image} />
      </div>
      <div className={classes.content}>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.description}>{description}</p>
        <ul className={classes.pointsWrapper}>
          {points.map((point, idx) => (
            <li key={idx} className={classes.point}>
              <span className={classes.pointIcon}>
                <span className="text-sm font-bold">
                  {getIcon({ type: "check" })}
                </span>
              </span>
              {point.title}
            </li>
          ))}
        </ul>
        <div className="mt-4 inline-block">
          <Button href={ctaHref} variant="default">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
