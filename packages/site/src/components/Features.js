import { Heading } from "../lib/tailwind";
import DATA, { getMenuLabel } from "../DATA";
const { features } = DATA;
const { subTitle, list = [] } = features;
import { getIcon } from "../lib/icons";
import cn from "classnames";

const { label } = getMenuLabel("features");

export default function Features() {
  const classes = {
    listContainer: cn(
      "grid gap-8 grid-cols-1 max-w-3xl mx-auto",
      list.length === 4 ? "sm:grid-cols-8" : "sm:grid-cols-12"
    ),
    listItem:
      "flex flex-col items-center col-span-4 px-8 py-12 space-y-4 overflow-hidden bg-gray-100 rounded-sm",
    icon: "p-3 text-white bg-primary rounded-sm text-2xl",
    listItemTitle: "text-xl font-medium text-gray-700",
    listItemDescription: "text-base text-center text-gray-500 h-28",
  };

  return (
    <section id="features">
      <Heading title={label} subTitle={subTitle} />
      <div className={classes.listContainer}>
        {list.map(({ title, description, id, iconType }) => {
          return (
            <div key={id} className={classes.listItem}>
              <div className={classes.icon}>{getIcon({ type: iconType })}</div>
              <h4 className={classes.listItemTitle}>{title}</h4>
              <p className={classes.listItemDescription}>{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
