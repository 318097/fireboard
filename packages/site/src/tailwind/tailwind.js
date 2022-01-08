import { Fragment } from "react";
import cn from "classnames";

const Heading = ({ title, subTitle }) => {
  return (
    <Fragment>
      <h2 className="text-4xl font-bold tracking-tight text-center">{title}</h2>
      {!!subTitle && (
        <p className="mt-2 text-lg text-center text-gray-600">
          {subTitle}
          {/* Check out our list of awesome features. */}
        </p>
      )}
    </Fragment>
  );
};

const Button = ({ children, as = "link", ...others }) => {
  const classNames = cn(
    "flex items-center px-6 py-3 text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-600 rounded-sm"
  );
  return as === "link" ? (
    <a className={classNames} {...others}>
      {children}
    </a>
  ) : (
    <button className={classNames} {...others}>
      {children}
    </button>
  );
};

export { Heading, Button };
