import React, { useState } from "react";
import { formatDate } from "../lib/helpers";
import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const MetaInfo = ({ label, value, defaultView }) => {
  const [showDate, setShowDate] = useState(defaultView === "DATE");

  const now = dayjs();
  value = dayjs(value);
  const isToday = now.isSame(value, "day");
  const remainingTime = value.from(now);

  return (
    <div className="meta-info-item__fb">
      <span className="label__fb">{showDate ? `${label}:` : label}</span>
      <span className="value__fb" onClick={() => setShowDate((prev) => !prev)}>
        {showDate ? (isToday ? "Today" : formatDate(value)) : remainingTime}
      </span>
    </div>
  );
};

export default MetaInfo;
