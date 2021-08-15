import React, { useState } from "react";
import { formatDate } from "@codedrops/lib";
import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const MetaInfo = ({ label, value, defaultView }) => {
  const [showDate, setShowDate] = useState(defaultView === "DATE");

  const now = dayjs();
  value = dayjs(value);
  const remainingTime = value.from(now);
  return (
    <div className="meta-info-item">
      <span className="label">{showDate ? `${label}:` : label}</span>
      <span className="value" onClick={() => setShowDate((prev) => !prev)}>
        {showDate ? formatDate(value) : remainingTime}
      </span>
    </div>
  );
};

export default MetaInfo;
