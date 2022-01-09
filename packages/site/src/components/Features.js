import { Heading } from "../tailwind";
import DATA from "../DATA";
const { features } = DATA;
const { subTitle, list = [] } = features;
import { getIcon } from "../icons";
import cn from "classnames";

export default function Features() {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container max-w-3xl mx-auto">
        <Heading title="Features" subTitle={subTitle} />
        <div
          className={cn(
            "mx-auto max-w-screen-lg grid  gap-8 mt-10 sm:px-8 xl:px-0 grid-cols-1",
            list.length === 4 ? "sm:grid-cols-8" : "sm:grid-cols-12"
          )}
        >
          {list.map(({ title, description, id, iconType }) => {
            return (
              <div
                key={id}
                className="
                  relative
                  flex 
                  flex-col
                  items-center
                  col-span-4
                  px-8
                  py-12
                  space-y-4
                  overflow-hidden
                  bg-gray-100
                  rounded-sm
                "
              >
                <div className="p-3 text-white bg-primary rounded-sm text-2xl">
                  {getIcon({ type: iconType })}
                </div>
                <h4 className="text-xl font-medium text-gray-700">{title}</h4>
                <p className="text-base text-center text-gray-500 h-28">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
