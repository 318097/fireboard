import { Fragment } from "react";

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

export { Heading };
