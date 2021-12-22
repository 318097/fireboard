import cn from "classnames";

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

export default Button;
