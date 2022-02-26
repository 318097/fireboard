import { Fragment } from "react";
import _ from "lodash";
import DATA from "../DATA";
const { appName, tagline, sponser, showAboutPage, showOtherProducts } = DATA;

const getCopyright = () =>
  `© ${new Date().getFullYear()} ${appName} - ${tagline}`;

export default function Footer({ otherProducts = [] }) {
  const classes = {
    container: `
      flex 
      flex-col
      items-center
      px-8
      py-12
      max-w-screen-xl 
      mx-auto
    `,
    row1: "flex items-center flex-col md:flex-row text-center",
    appName: "font-black text-gray-900 select-none",
    copyright: `
      text-sm 
      text-gray-500
      sm:ml-4
      sm:pl-4 
      sm:border-l 
      sm:border-gray-200 
      sm:mt-0
    `,
    productContainer: "flex items-center md:gap-1 flex-wrap justify-center",
    row2: "flex items-center gap-1",
    link: "text-sm text-gray-500",
  };

  return (
    <footer className="bg-slate-50">
      <div id="footer-wrapper" className={classes.container}>
        <div className={classes.row1}>
          <a href="#_" className={classes.appName}>
            {appName}
          </a>
          <p className={classes.copyright}>{getCopyright()}</p>
        </div>

        {showOtherProducts && (
          <div className={classes.productContainer}>
            <span className="text-sm font-black">Other apps - </span>
            {otherProducts.map(({ name, links, tagline }, idx) => (
              <Fragment key={idx}>
                <a
                  title={tagline}
                  className="text-sm text-gray-500"
                  href={links.product.url}
                  // href={appendQueryParams(
                  //   links.product.url,
                  //   "utm_source=fireboard_landing&utm_medium=footer"
                  // )}
                >
                  {name}
                </a>
                {idx < otherProducts.length - 1 && <span>•</span>}
              </Fragment>
            ))}
          </div>
        )}

        <div className={classes.row2}>
          <a href={sponser} target="_blank" className={classes.link}>
            Sponser
          </a>
        </div>
      </div>
    </footer>
  );
}
