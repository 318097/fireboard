import DATA, { getMenuLabel } from "../DATA";
import { getIcon } from "../lib/icons";
import { Heading, Button } from "../lib/tailwind";
const { platforms } = DATA;
const { list = [] } = platforms;

const { label } = getMenuLabel("general");

export default function General() {
  return (
    <section id="general">
      <Heading title={label} />
      <div className="flex flex-col gap-8">
        <Section {...list[0]} />
        <Section {...list[1]} direction="reverse" />
      </div>
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
      flex 
      flex-col
      items-center
      ${direction === "reverse" ? "md:flex-row-reverse" : "md:flex-row"}
    `,
    imageWrapper: `
      box-border
      relative
      bg-no-repeat 
      bg-contain
      md:max-w-none
      md:w-1/2
      max-w-sm
    `,
    content: `
    w-full
    text-black
    md:w-1/2 
    order-first
    md:order-none
    `,
    title: `
    font-semibold
    text-lg
      lg:text-2xl
      md:text-xl
    `,
    description: `
      pt-1
      pb-8
      text-gray-700
      lg:text-lg
    `,
    point: `
      py-1
      text-left 
      text-gray-500
      flex
      align-center
      `,
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
