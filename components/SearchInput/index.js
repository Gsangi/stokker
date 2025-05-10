"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import tickerSearch from "../../sample/tickerSearch.json";

/**
 *
 * @param {{ className: string }} props
 * @returns
 */
export default function SearchInput({ className }) {
  const [anotherSearch, setAnotherSearch] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const labelRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (!open) return;
      //   if (e.target !== labelRef.current) setOpen(false);
    };

    window.addEventListener("click", clickOutside);
    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, [open]);

  const handleTextChange = (e) => {
    setText(e.target.value);

    // Perform search (consider debouncing for performance)
    setLoading(true); // Simulate search in progress
    setTimeout(() => {
      const filtered = tickerSearch.bestMatches.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(text.toLowerCase()),
      );
      setResults(filtered);
      setLoading(false);
    }, 500); // Simulate delay
  };

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
  };

  return (
    <label
      ref={labelRef}
      className={clsx(
        styles["search-input"],
        open && styles["search-input-open"],
        className,
      )}
      onClick={handleOpen}
    >
      {!open && (
        <div className={styles["search-button"]}>
          <img src="/icon-search.svg" />
          <span>Search stocks & etfs</span>
        </div>
      )}
      {open && (
        <>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Search..."
          />
          {text && (
            <button
              className={clsx(styles["clear-button"], "clear-button")}
              onClick={() => setText("")} /* Clears text value */
            >
              <img src="/icon-close.svg" alt="Clear" />
            </button>
          )}
        </>
      )}
      {open && loading && (
        <div className={styles["search-loading"]}>Searching...</div>
      )}
      {open && results.length > 0 && !loading && (
        <ul className={styles["search-results"]}>
          {results.map((item) => (
            <li key={item} className={styles["search-result-item"]}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && !loading && (
        <p className={styles["search-no-results"]}>No results found</p>
      )}
    </label>
  );
}
