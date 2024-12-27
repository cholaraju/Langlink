"use client";

import React, { useState } from "react";
import Loading from "../common/Loading";

export default function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };
  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="relative w-full md:w-[500px]">
        <input
          type="url"
          className="w-full md:w-[500px] h-12 rounded-lg bg-muted border  border-pink-400 border-dashed  p-2 outline-none "
          placeholder="Enter Your Podcast URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        
         { loading && <div className="absolute right-2 top-2.5">
            <Loading  />
          </div>}
        
      </form>
    </div>
  );
}
