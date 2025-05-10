"use client";

import React, { Suspense } from "react";
import styles from "./page.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import topGainerLosers from "../sample/topGainerLosers.json";

export const TAB_ITEMS_MAP = [
  {
    label: "Top Gainers",
    status: "top_gainers",
  },
  {
    label: "Top Losers",
    status: "top_losers",
  },
];

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "top_gainers";
  const mockData = topGainerLosers[tab];

  const handleTabChange = (e) => {
    const tabValue = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    current.set("tab", tabValue);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  return (
    <div className={styles["top-container"]}>
      <div
        className={styles["toggle-stocks"]}
        role="radiogroup"
        onChange={handleTabChange}
      >
        {TAB_ITEMS_MAP.map(({ label, status }) => {
          return (
            <label key={label}>
              <input
                hidden
                type="radio"
                value={status}
                name="tab"
                defaultChecked={tab === status}
              />
              {label}
            </label>
          );
        })}
      </div>
      <div className={styles["top-stock-container"]}>
        {mockData.map((r) => {
          return (
            <div
              role="button"
              key={r.ticker}
              className={styles["stock-card"]}
              onClick={() => router.push(`/company/${r.ticker}`)}
            >
              <div className={styles["stock-symbol"]}></div>
              <span>{r.ticker}</span>
              <p>{"$" + r.price}</p>
              <p data-diff={r.change_amount > 0 ? 1 : -1}>
                {r.change_percentage}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
