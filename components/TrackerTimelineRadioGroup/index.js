"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export const TIMELINES = [
  { label: "1D" },
  { label: "1W" },
  { label: "1M" },
  { label: "3M" },
  // { label: "6M" },
  // { label: "1Y" },
];

const TrackerTimelineRadioGroup = ({ className, defaultValue = "1D", onChange }) => {
  const [current, setCurrent] = useState(defaultValue ?? "1D");

  const handleChange = (e) => {
    setCurrent(e.target.value);
  };

  useEffect(() => {
    onChange?.(current);
  }, [current])

  return (
    <div
      role="radiogroup"
      className={clsx(styles["timeline-group"], className)}
      onChange={handleChange}
    >
      {TIMELINES.map(({ label }, index) => (
        <label key={index}>
          <input
            hidden
            type="radio"
            name="timeline"
            value={label}
            defaultChecked={current === label}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default TrackerTimelineRadioGroup;
