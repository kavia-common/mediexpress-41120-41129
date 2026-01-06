import React, { useEffect, useRef, useState } from "react";

// PUBLIC_INTERFACE
export default function SearchBar({ placeholder = "Search medicines…", onSearch }) {
  /** Navbar search bar; calls onSearch(query) on submit and debounce-like on Enter. */
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd+K focuses the search input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form className="searchWrap" role="search" aria-label="Search medicines" onSubmit={submit}>
      <svg className="searchIcon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 4a6 6 0 1 1 3.63 10.78l4.3 4.3a1 1 0 0 1-1.42 1.42l-4.3-4.3A6 6 0 0 1 10 4Zm0 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8Z"
        />
      </svg>
      <input
        ref={inputRef}
        className="searchInput"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search by medicine name"
      />
      <span className="searchHint" aria-hidden="true">
        <span className="kbd">Ctrl</span> <span className="kbd">K</span>
      </span>
    </form>
  );
}
