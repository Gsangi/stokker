import Link from "next/link";
import React from "react";
import SearchInput from "../SearchInput";
import styles from "./styles.module.css";

export default function Navbar() {


  return (
    <nav className={styles["navbar"]}>
      <Link href="/" className={styles["link-stokker"]}>
        <span>Stokker</span>
        <img src="/logo-stokker.svg" />
      </Link>
      <SearchInput className={styles["navbar-search"]}/>
    </nav>
  );
}
