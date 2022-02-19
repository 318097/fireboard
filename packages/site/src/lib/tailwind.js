import { Fragment } from "react";
import cn from "classnames";

const Heading = ({ title, subTitle }) => {
  return (
    <div className="flex flex-col items-center pb-8">
      <h2>{title}</h2>
      {!!subTitle && (
        <p className="mt-2 text-lg text-center text-gray-600">
          {subTitle}
          {/* Check out our list of awesome features. */}
        </p>
      )}
    </div>
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
