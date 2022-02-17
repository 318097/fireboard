import { Fragment } from "react";
import cn from "classnames";

const Heading = ({ title, subTitle }) => {
  return (
    <Fragment>
      <h2>{title}</h2>
      {!!subTitle && (
        <p className="mt-2 text-lg text-center text-gray-600">
          {subTitle}
          {/* Check out our list of awesome features. */}
        </p>
      )}
    </Fragment>
  );
};

const Button = ({ children, as = "link", variant = "primary", ...others }) => {
  const classNames = cn("btn", {
    [variant]: true,
  });
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
