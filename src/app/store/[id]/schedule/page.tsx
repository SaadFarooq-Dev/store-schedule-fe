"use client";

import { DigitalClock } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type SelectedDaysType = {
  [key: string]: boolean;
};

async function createStoreSchedule({ id, data }: { id: string; data: any }) {
  const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;
  const res = await fetch(`${process.env.BASE_URL}/store/${id}/openinghours`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "x-auth-token": `${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Overlapping Hours");
  }
  return await res.json();
}

export default function page({ params }: { params: { id: string } }) {
  const [openingTime, setOpeningTime] = useState<Dayjs | null>(null);
  const [closingTime, setClosingTime] = useState<Dayjs | null>(null);

  const router = useRouter();

  const initialSelectedDays = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };

  const [selectedDays, setSelectedDays] = useState<SelectedDaysType>(initialSelectedDays);

  const handleOpeningChange = (time: Dayjs | null) => {
    setOpeningTime(time);
  };
  const handleClosingChange = (time: Dayjs | null) => {
    setClosingTime(time);
  };

  const mutation = useMutation({
    mutationFn: createStoreSchedule,
    onSuccess: (res) => {
      router.push(`/store/${params.id}`);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = () => {
    if (!openingTime || !closingTime) {
      toast.error("Please select both opening and closing times");
      return;
    }

    const selectedDaysWithHours = [];

    let atLeastOneDaySelected = false;

    for (const [index, [day, isSelected]] of Object.entries(
      Object.entries(selectedDays)
    )) {
      if (isSelected) {
        atLeastOneDaySelected = true;
        if (
          openingTime.isSame(closingTime) ||
          openingTime.isAfter(closingTime)
        ) {
          toast.error("Opening time should be earlier than closing time");
          return;
        }

        selectedDaysWithHours.push({
          dayOfWeek: parseInt(index),
          startTime: openingTime.format("HH:00"),
          endTime: closingTime.format("HH:00"),
        });
      }
    }

    if (!atLeastOneDaySelected) {
      toast.error("Please select at least one day");

      return;
    }

    mutation.mutate({ id: params.id, data: selectedDaysWithHours });
  };

  const dayOptions = [
    { id: 1, day: "Monday" },
    { id: 2, day: "Tuesday" },
    { id: 3, day: "Wednesday" },
    { id: 4, day: "Thursday" },
    { id: 5, day: "Friday" },
    { id: 6, day: "Saturday" },
    { id: 7, day: "Sunday" },
  ];

  return (
    <>
      <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl">
          {"Manage Your Store's Schedule"}
        </h1>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl text-center mb-4">Choose Day of the Week</h2>
        <div className="flex justify-center">
          <ul className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="Select All"
                id="Select All"
                checked={Object.values(selectedDays).every((value) => value)}
                onChange={(e) => {
                  const { checked } = e.target;
                  if (checked) {
                    const updatedSelectedDays = {
                      ...initialSelectedDays,
                    };
                    for (const day in updatedSelectedDays) {
                      // @ts-ignore
                      updatedSelectedDays[day] = true;
                    }
                    setSelectedDays(updatedSelectedDays);
                  } else {
                    setSelectedDays(initialSelectedDays);
                  }
                }}
              />
              <label htmlFor="Select All">Select All</label>

              <input
                type="checkbox"
                name="Select Weekdays"
                id="selectWeekdays"
                checked={Object.values(selectedDays)
                  .slice(0, 5)
                  .every((value) => value)}
                onChange={(e) => {
                  const { checked } = e.target;
                  const weekdays = Object.keys(selectedDays).slice(0, 5);
                  setSelectedDays((prevSelectedDays) => ({
                    ...prevSelectedDays,
                    ...weekdays.reduce(
                      (acc, day) => ({
                        ...acc,
                        [day]: checked,
                      }),
                      {}
                    ),
                  }));
                }}
              />
              <label htmlFor="Select Weekdays">Select Weekdays</label>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              {dayOptions.map((option) => (
                <li key={option.id} className="flex mx-2 gap-1">
                  <input
                    type="checkbox"
                    name={option.day}
                    id={option.day}
                    value={option.day}
                    checked={selectedDays[option.day] }
                    onChange={(e) => {
                      const { checked } = e.target;
                      setSelectedDays((prevSelectedDays) => ({
                        ...prevSelectedDays,
                        [option.day]: checked,
                      }));
                    }}
                  />
                  <label htmlFor={option.day}>{option.day}</label>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>
      <div className="flex justify-center flex-col sm:flex-row gap-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="">Choose Opening Time</h2>
          <DigitalClock
            skipDisabled
            timeStep={60}
            className="bg-slate-200"
            ampm={false}
            value={openingTime}
            maxTime={dayjs().set("h", 23)}
            onChange={handleOpeningChange}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h2 className="">Choose Closing Time</h2>
          <DigitalClock
            skipDisabled
            timeStep={60}
            className="bg-slate-200"
            ampm={false}
            value={closingTime}
            maxTime={dayjs().set("h", 23)}
            onChange={handleClosingChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-20">
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
}
