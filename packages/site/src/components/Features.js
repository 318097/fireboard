import { Heading } from "../lib/tailwind";
import DATA from "../DATA";
const { features } = DATA;
const { subTitle, list = [] } = features;
import { getIcon } from "../lib/icons";
import cn from "classnames";

export default function Features() {
  const classes = {
    container: "container max-w-3xl mx-auto",
    listContainer: cn(
      "mx-auto max-w-screen-lg grid gap-8 mt-10 sm:px-8 xl:px-0 grid-cols-1",
      list.length === 4 ? "sm:grid-cols-8" : "sm:grid-cols-12"
    ),
    listItem:
      "relative flex  flex-col items-center col-span-4 px-8 py-12 space-y-4 overflow-hidden bg-gray-100 rounded-sm",
    icon: "p-3 text-white bg-primary rounded-sm text-2xl",
    listItemTitle: "text-xl font-medium text-gray-700",
    listItemDescription: "text-base text-center text-gray-500 h-28",
  };

  return (
    <section id="features">
      <div className={classes.container}>
        <Heading title="Features" subTitle={subTitle} />
        <div className={classes.listContainer}>
          {list.map(({ title, description, id, iconType }) => {
            return (
              <div key={id} className={classes.listItem}>
                <div className={classes.icon}>
                  {getIcon({ type: iconType })}
                </div>
                <h4 className={classes.listItemTitle}>{title}</h4>
                <p className={classes.listItemDescription}>{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
