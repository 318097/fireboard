import DATA from "../DATA";
import Button from "../UIComponents/Button";
const { name, description, tagline, previewURL, webAppURL, extensionURL } =
  DATA;

export default function Intro() {
  return (
    <section className="px-2 py-32 bg-white md:px-0" id="intro">
      <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
        <div className="flex flex-wrap items-center sm:-mx-3">
          <div className="w-full md:w-1/2 md:px-3">
            <div
              className="
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
              "
            >
              <h1
                className="
                  text-4xl
                  font-extrabold
                  tracking-tight
                  text-gray-900
                  sm:text-5xl
                  md:text-4xl
                  lg:text-5xl
                  xl:text-6xl
                "
              >
                {tagline}
                {/* <span className="block text-indigo-600 xl:inline">
                  Tell Your Story!
                </span> */}
              </h1>
              <p
                className="
                  mx-auto
                  text-base text-gray-500
                  sm:max-w-md
                  lg:text-xl
                  md:max-w-3xl
                "
              >
                {description}
              </p>
              <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                <a
                  href={webAppURL}
                  className="
                    flex
                    items-center
                    w-full
                    px-6
                    py-3
                    sm:w-auto
                    rounded-sm
                    text-lg text-white
                    bg-indigo-600
                    hover:bg-indigo-700
                  "
                >
                  Download extension
                </a>
                <Button href={extensionURL}>Try web app</Button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div
              className="
                w-full
                h-auto
                overflow-hidden
                shadow-xl
                rounded-sm
              "
            >
              <img src={previewURL} className="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
