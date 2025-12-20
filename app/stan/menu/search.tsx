"use client";

import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";

type Props = {
  url: string;
  search: string;
};

const SearchInput = ({ url, search }: Props) => {
  const [keyword, setKeyword] = useState<string>(search);
  const router = useRouter();

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    router.push(`${url}?search=${keyword}`);
  };

  return (
    <input
      type="text"
      id="keyword"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className={`w-full rounded-xl border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
      placeholder="Cari menu..."
      onKeyUp={handleSearch}
    />
  );
};
export default SearchInput;
