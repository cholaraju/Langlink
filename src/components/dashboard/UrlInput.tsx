"use client";

import React, { useState } from "react";
import Loading from "../common/Loading";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { useRouter } from "next/navigation";

export default function UrlInput({ user }: { user: CustomUser }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErros] = useState<AddUrlErrorType>({});
  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);
      const { data } = await axios.post("/api/add-url", {
        url: url,
        user_id: user.id,
      });

      const summary: SummaryType = data?.data;
      if (summary) {
        toast.success("URL is correct redirecting you to summarize page");
        router.push(`/summarize/?id=${summary.id}`)
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErros(error.response.data.errors);
        } else {
          toast.error(error.response?.data?.message);
        }
      }
    }
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

        {loading && (
          <div className="absolute right-2 top-2.5">
            <Loading />
          </div>
        )}
        <span className="text-red-500">{errors.url}</span>
      </form>
    </div>
  );
}
