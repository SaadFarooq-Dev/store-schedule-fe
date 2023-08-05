"use client";

import FormDialog from "@/components/FormDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function getStoreSchedules(id: string) {
  try {
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
    const store = await fetch(
      `${process.env.BASE_URL}/store/${id}/openinghours`,
      {
        headers: { "x-auth-token": `${token}` },
      }
    ).then((res) => res.json());

    return store;
  } catch (error) {
    return;
  }
}

async function getStore(id: string) {
  try {
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
    const store = await fetch(`${process.env.BASE_URL}/store/${id}`, {
      headers: { "x-auth-token": `${token}` },
    }).then((res) => res.json());

    return store;
  } catch (error) {
    return;
  }
}

async function deleteStoreSchedule({
  id,
  data,
}: {
  id: string;
  data: {
    dayOfWeek: number;
  };
}) {
  try {
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
    const store = await fetch(
      `${process.env.BASE_URL}/store/${id}/openinghours`,
      {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
          "x-auth-token": `${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    return store;
  } catch (error) {
    return;
  }
}

async function deleteStore({ id }: { id: string }) {
  try {
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
    const store = await fetch(`${process.env.BASE_URL}/store/${id}`, {
      method: "DELETE",
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

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const storeQuery = useQuery(["storeId"], () => getStore(params.id));
  const schedulesQuery = useQuery(["schedules"], () =>
    getStoreSchedules(params.id)
  );

  const storeScheduleMutation = useMutation({
    mutationFn: deleteStoreSchedule,
    onSuccess: (res) => {
      console.log("Sucessfully deleted schedule");
      schedulesQuery.refetch();
    },
  });

  const storeMutation = useMutation({
    mutationFn: deleteStore,
    onSuccess: (res) => {
      console.log("Sucessfully deleted store");
      router.push(`/store`);
    },
  });

  const handleScheduleDelete = (data: number) => {
    const payload = {
      dayOfWeek: data,
    };

    storeScheduleMutation.mutate({ id: params.id, data: payload });
  };

  const handleDelete = () => {
    storeMutation.mutate({ id: params.id });
  };

  const deleteStoreButton = (
    <button
      className="font-medium inline-flex gap-3 items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out text-white bg-red-600 hover:bg-red-700 px-3 py-2 shadow-lg"
      onClick={handleDelete}
    >
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
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
      Delete
    </button>
  );

  return (
    <>
      <div className="flex mb-5 gap-3 flex-row-reverse">
        <Link
          href={`/store/${params.id}/schedule`}
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
        {deleteStoreButton}
        <FormDialog id={params.id} updateFn={storeQuery.refetch} />
      </div>
      <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl mb-3">
          {storeQuery?.data?.store?.name}
        </h1>
      </div>

      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Day
                </th>
                <th scope="col" className="px-6 py-3">
                  Opening Times
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {schedulesQuery.data &&
                schedulesQuery?.data?.openingHours.map((day: any) => {
                  return (
                    <tr className="bg-white border-b" key={day.dayOfWeek}>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {dayNames[day.dayOfWeek]}
                      </td>
                      <td className="px-6 py-4">
                        {day?.schedule?.map((hour: any, scheduleIndex: any) => {
                          return (
                            <p key={scheduleIndex}>
                              {hour.startTime} - {hour.endTime}
                            </p>
                          );
                        })}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          className="font-medium text-blue-600 hover:underline"
                          onClick={() => handleScheduleDelete(day.dayOfWeek)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
