"use client";
import { Search as SearchIcon } from "lucide-react";

export default function Search({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative flex w-full content-center items-center">
      <input
        className="peer block w-full rounded-2xl bg-primary-50 text-lg py-1 pl-9 text-md placeholder:text-primary-200 text-primary-300 shadow-sm"
        placeholder={placeholder}
      />
      <SearchIcon className="absolute text-primary-200 peer-focus:text-primary-300 size-6 content-center left-2" />
    </div>
  );
}
