"use client";

import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: string().min(3),
});

type FormType = z.infer<typeof schema>;

async function createStore(data: FormType) {
  try {
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
    const store = await fetch(`${process.env.BASE_URL}/store`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-auth-token": `${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    return store.json();
  } catch (error) {
    return;
  }
}

export default function page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: createStore,
    onSuccess: (res) => {
      console.log("Sucessfully created store");
      console.log(res);
      router.push("/store");
    },
  });

  const onSubmit = (data: FormType) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="flex mb-5">
        <Link
          href={"/store"}
          className="font-medium inline-flex gap-3 items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 shadow-lg "
        >
          <svg
            className="w-3 h-3 fill-current text-white flex-shrink-0 ml-2 -mr-1 rotate-180"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
              fillRule="nonzero"
            />
          </svg>
          <span>Back</span>
        </Link>
      </div>
      <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
          Create A Store{" "}
        </h1>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl text-center mb-10">Choose Your Store's Name</h2>
        {/* Form */}
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <input
                  className="bg-white border border-gray-300 focus:border-gray-500 rounded placeholder-gray-500 py-3 px-4 w-full text-gray-800"
                  placeholder="Enter your store name"
                  required
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-600 my-1">{errors.name?.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mt-6">
              <div className="w-full px-3">
                <button
                  className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-blue-600 hover:bg-blue-700 px-8 py-3 shadow-lg w-full"
                  type="submit"
                >
                  {"Create Store"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
