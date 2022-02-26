import DATA, { getMenu } from "../DATA";
const { appName } = DATA;

const classes = {
  headerWrapper: `
  relative
  flex 
  flex-col 
  flex-wrap
  items-center
  justify-between
  py-5
  md:flex-row
  `,
  appName: `
    app-name
    z-10
    select-none
  `,
  nav: `
    top-0
    left-0
    z-0
    flex
    items-center
    justify-center
    w-full
    h-full
    py-5
    -ml-0
    space-x-5
    text-base
    md:-ml-5 
    md:py-0 
    md:absolute
  `,
  navItem: `
    relative
    font-medium
    leading-6
    text-gray-500
    transition
    duration-150
    ease-out
    hover:text-gray-900
  `,
};

export default function Header() {
  return (
    <header className={classes.headerWrapper}>
      <a href="#" className={classes.appName}>
        {appName}
      </a>

      <nav className={classes.nav}>
        {getMenu({ src: "nav" }).map((item) => {
          return (
            <a
              key={item.value}
              href={`#${item.value}`}
              className={classes.navItem}
            >
              <span className="block">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* <div
          className="
            relative
            z-10
            inline-flex
            items-center
            space-x-3
            md:ml-5
            lg:justify-end
          "
        >
          <a
            href="#"
            className="
              inline-flex
              items-center
              justify-center
              px-4
              py-2
              text-base
              font-medium
              leading-6
              text-gray-600
              whitespace-no-wrap
              bg-white
              border border-gray-200
              shadow-sm
              hover:bg-gray-50
              focus:outline-none focus:shadow-none
              rounded-none rounded-sm
            "
          >
            Sign in
          </a>
        </div> */}
    </header>
  );
}
