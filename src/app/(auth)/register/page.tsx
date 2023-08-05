"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const schema = z.object({
  name: string().min(3),
  email: string().email(),
  password: string().min(8),
});

type FormType = z.infer<typeof schema>;

async function registerUser(data: FormType) {
  console.log(process.env.BASE_URL);

  const res = await fetch(`${process.env.BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Registeration Failed");
  }
  const responseJson = await res.json();
  return responseJson;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      toast.success("Sucessfully registered");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: FormType) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl">
          Welcome. We exist to make your business easier.
        </h1>
      </div>
      <div className="max-w-sm mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <label
                className="block text-gray-800 text-sm font-medium mb-1"
                htmlFor="name"
              >
                Name <span className="text-red-600">*</span>
              </label>
              <input
                className="bg-white border border-gray-300 focus:border-gray-500 rounded placeholder-gray-500 py-3 px-4 w-full text-gray-800"
                placeholder="Enter your email address"
                required
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 my-1">{errors.name?.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <label
                className="block text-gray-800 text-sm font-medium mb-1"
                htmlFor="email"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                className="bg-white border border-gray-300 focus:border-gray-500 rounded placeholder-gray-500 py-3 px-4 w-full text-gray-800"
                placeholder="Enter your email address"
                required
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 my-1">{errors.email?.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <label
                className="block text-gray-800 text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password <span className="text-red-600">*</span>
              </label>
              <input
                className="bg-white border border-gray-300 focus:border-gray-500 rounded placeholder-gray-500 py-3 px-4 w-full text-gray-800"
                placeholder="Enter your password"
                required
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-600 my-1">{errors.password?.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mt-6">
            <div className="w-full px-3">
              <button
                className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-blue-600 hover:bg-blue-700 px-8 py-3 shadow-lg w-full"
                type="submit"
                disabled = {mutation.isLoading}
              >
                {"Sign up"}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 text-center mt-3">
            By creating an account, you agree to the{" "}
            <a className="underline" href="#0">
              terms & conditions
            </a>
            , and our{" "}
            <a className="underline" href="#0">
              privacy policy
            </a>
            .
          </div>
        </form>
        <div className="text-gray-600 text-center mt-6">
          Already using Stores?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline transition duration-150 ease-in-out"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
