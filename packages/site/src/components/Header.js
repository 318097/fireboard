import DATA from "../DATA";
const { name, description, tagline, menu = [] } = DATA;

export default function Header() {
  return (
    <section className="relative w-full px-8 text-gray-700 bg-white body-font">
      <div
        className="
          container
          flex flex-col flex-wrap
          items-center
          justify-between
          py-5
          mx-auto
          md:flex-row
          max-w-7xl
        "
      >
        <a
          href="#"
          className="
            relative
            z-10
            flex
            items-center
            w-auto
            text-2xl
            font-extrabold
            leading-none
            text-black
            select-none
          "
        >
          {name}
        </a>

        <nav
          className="
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
            md:-ml-5 md:py-0 md:absolute
          "
        >
          {menu.map((item) => {
            return (
              <a
                key={item.value}
                href={`#${item.value}`}
                className="
              relative
              font-medium
              leading-6
              text-gray-600
              transition
              duration-150
              ease-out
              hover:text-gray-900
            "
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
      </div>
    </section>
  );
}
