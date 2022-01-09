import { MdOutlineAutorenew } from "react-icons/md";
import { AiFillRobot } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import { CgSandClock } from "react-icons/cg";
import { BsCheck } from "react-icons/bs";

const getIcon = ({ type }) => {
  switch (type) {
    case "robot":
      return <AiFillRobot />;
    case "automatic":
      return <MdOutlineAutorenew />;
    case "time":
      return <BiTimeFive />;
    case "timeline":
      return <CgSandClock />;
    case "check":
      return <BsCheck />;
  }
};

export { getIcon };
