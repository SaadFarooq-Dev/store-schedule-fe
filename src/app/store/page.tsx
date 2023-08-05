"use client";

import StoreCard from "@/components/StoreCard";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

async function getAllStores() {
  try {
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
    const store = await fetch(`${process.env.BASE_URL}/store`, {
      headers: { "x-auth-token": `${token}` },
    }).then((res) => res.json());

    return store;
  } catch (error) {
    return;
  }
}

export default function page() {
  const { isLoading, isError, data, error } = useQuery(
    ["stores"],
    getAllStores
  );

  return (
    <>
      <div className="flex mb-5 flex-row-reverse">
        <Link
          href={"/store/create"}
          className="font-medium inline-flex gap-3 items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 shadow-lg "
        >
          <span>Create</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </div>
      <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl mb-3">
          Welcome{" "}
        </h1>
        <h2 className="text-2xl text-center mb-10">
          Browse through the Stores
        </h2>
      </div>

      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <div>...Loading</div>
          ) : (
            data?.stores?.map((store: any) => (
              <StoreCard
                title={store.name}
                user={store.User.name}
                storeId={store.id}
                key={store.id}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
