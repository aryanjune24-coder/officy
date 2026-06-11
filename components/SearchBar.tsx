"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <motion.div
      className="officy-search"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Search
        size={20}
        className="officy-search__icon"
      />
      <input
        type="text"
        placeholder="Search by object, room, or material..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="officy-search__input"
      />
    </motion.div>
  );
}
