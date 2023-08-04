"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CancelButtonIcon } from "@/assets/Constants";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Length must be greater than 2 characters"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function FormDialog({
  id,
  updateFn,
}: {
  id: string;
  updateFn: () => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function updateStore({ id, data }: { id: string; data: any }) {
    try {
      const token = localStorage.getItem("token");
      const store = await fetch(`${process.env.BASE_URL}/store/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "x-auth-token": `${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      return store;
    } catch (error) {
      return;
    }
  }

  const mutation = useMutation({
    mutationFn: updateStore,
    onSuccess: (res) => {
      console.log("Sucessfully updated Store");
      console.log(res);
      setOpen(false);
      updateFn();
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    mutation.mutate({ id, data });
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="font-medium inline-flex gap-3 items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-green-600 hover:bg-green-700 px-3 py-2 shadow-lg">
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
          Edit
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/10 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-black m-0 text-[17px] font-medium">
              Edit Store Name
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Make changes to your store name here. Click save when you're done.
            </Dialog.Description>
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label
                  className="text-black w-[90px] text-right text-[15px]"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="text-black shadow-gray-400 focus:shadow-gray-600 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="name"
                  {...register("name")}
                  required
                />
              </fieldset>
              <div className="mt-[25px] flex justify-end">
                <button
                  className="font-medium inline-flex gap-3 items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-green-600 hover:bg-green-700 px-3 py-2 shadow-lg"
                  type="submit"
                >
                  Save changes
                </button>
              </div>
            </form>

            <Dialog.Close asChild>
              <button
                className="text-black focus:shadow-gray-400 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                {CancelButtonIcon}
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
