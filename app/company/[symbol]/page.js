"use client";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";
import { Line } from "react-chartjs-2";
import TrackerTimelineRadioGroup from "../../../components/TrackerTimelineRadioGroup";
import companyOverview from "../../../sample/compayOverview.json";
import timeSeriesDaily from "../../../sample/timeSeriesDaily.json";
import timeSeriesIntraday from "../../../sample/timeSeriesIntraday.json";
import timeSeriesMonth from "../../../sample/timeSeriesMonth.json";
import timeSeriesWeekly from "../../../sample/timeSeriesWeekly.json";
import { date } from "../../../utils";
import styles from "./page.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Time Series",
    },
  },
};

export const EXTRAS = [
  { key: "MarketCapitalization", text: "Market Cap" },
  { key: "PERatio", text: "P/E Ratio" },
  { key: "Beta", text: "Beta" },
  { key: "DividendYield", text: "Dividend Yield" },
  { key: "ProfitMargin", text: "Profit Margin" },
];

export default function CompanyOverview({ params: { symbol } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const res = await apiInstance.get("/", {
  //   params: { function: "OVERVIEW", symbol: symbol },
  // });
  // const intraDayRes = await apiInstance.get("/", {
  //   params: {
  //     function: "TIME_SERIES_INTRADAY",
  //     interval: "5min",
  //     symbol: symbol,
  //   },
  // });
  // const data = res.data;
  // const intraDayData = intraDayRes.data;
  const data = companyOverview;
  let timelineData = timeSeriesIntraday["Time Series (5min)"];
  const timeline = searchParams.get("timeline");

  if (timeline === "1D") {
    timelineData = timeSeriesIntraday["Time Series (5min)"];
  }
  if (timeline === "1W") {
    timelineData = timeSeriesDaily["Time Series (Daily)"];
  }
  if (timeline === "1M") {
    timelineData = timeSeriesWeekly["Weekly Adjusted Time Series"];
  }
  if (timeline === "3M") {
    timelineData = timeSeriesMonth["Monthly Adjusted Time Series"];
  }

  const getCurrentPricePercentageWRT52Week = () => {
    const diff = data["52WeekHigh"] - data["52WeekLow"];
    const current = data["AnalystTargetPrice"] - data["52WeekLow"];

    return (current / diff) * 100;
  };

  const handleTimelineChange = (timeline) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    current.set("timeline", timeline);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  const timeSeriesDataset = Object.entries(timelineData).reduce(
    (prev, [label, value]) => {
      return {
        labels: [...prev.labels, label],
        datasets: [
          {
            ...prev.datasets[0],
            data: [...prev.datasets[0].data, parseFloat(value["1. open"])],
          },
        ],
      };
    },
    {
      labels: [],
      datasets: [
        {
          label: "Time Series (5min)",
          data: [],
        },
      ],
    },
  );

  if (!data || !!data.Information) return "No data found";
  if (!timelineData) return "No data found";

  return (
    <main className={styles.main}>
      {/* <img height={64} width={64} src="https://api.brandfetch.com/v2/brands/brandfetch.com" /> */}
      <header className={styles["company-header"]}>
        <div className={styles["company-details"]}>
          <h4>{data["Name"]}</h4>
          <p>
            {data["Symbol"]},&nbsp;{data["AssetType"]}
            <br />
            {data["Exchange"]}
          </p>
        </div>
        <div className={styles["company-price"]}>
          {/* TODO: change the price field for AnalystTargetPrice */}
          <p>
            {data["Currency"]} {data["AnalystTargetPrice"]}
          </p>
        </div>
      </header>

      <section className={styles["company-tracker"]}>
        <Line
          options={{
            elements: { point: { radius: 1 }, line: { borderWidth: 2 } },
            scales: {
              x: {
                max: 50,
                ticks: {
                  autoSkip: true,
                  callback(value, index, ticks) {
                    if (index % 20 === 0) {
                      return date.formatDate(
                        this.getLabelForValue(value),
                        timeline === "1D" ? "HH:mm" : "DD/MM",
                      );
                    }
                    return null;
                  },
                },
              },
            },
          }}
          data={timeSeriesDataset}
          className={styles["company-tracker-line-graph"]}
        />
        <TrackerTimelineRadioGroup
          className={styles["company-tracker-timeline-radio"]}
          defaultValue={timeline}
          onChange={handleTimelineChange}
        />
      </section>

      <section className={styles["company-extras"]}>
        <header>
          About&nbsp;<span>{data["Name"]}</span>
        </header>
        <div>
          <p>{data["Description"]}</p>
          <span>Industry:&nbsp;{data["Industry"].toLowerCase()}</span>
          <span>Sector:&nbsp;{data["Sector"].toLowerCase()}</span>
          <div className={styles["company-52-week"]}>
            <div className={styles["company-extra"]}>
              <span>52-Week Low</span>
              <br />
              <span>{data["52WeekLow"]}</span>
            </div>
            <div className={styles["company-52-range-container"]}>
              <span
                className={styles["company-52-range-current-price"]}
                style={{ left: getCurrentPricePercentageWRT52Week() + "%" }}
              >
                Current price:&nbsp;{data["Currency"]}
                {data["AnalystTargetPrice"]}
              </span>
              <hr />
            </div>
            <div
              className={styles["company-extra"]}
              style={{ textAlign: "end" }}
            >
              <span>52-Week High</span>
              <br />
              <span>{data["52WeekHigh"]}</span>
            </div>
          </div>
          <div className={styles["company-extra-container"]}>
            {EXTRAS.map(({ key, text }, index) => (
              <div key={text + index} className={styles["company-extra"]}>
                <span>{text}</span>
                <br />
                <span>{data[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
