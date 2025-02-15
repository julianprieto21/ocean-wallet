"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GreetingsDict } from "@/lib/types";
import { Locale } from "@/i18n/routing";

export default function Greetings({
  locale,
  dict,
}: {
  locale: Locale;
  dict: GreetingsDict;
}) {
  const getGreeting = (hour: number) => {
    if (hour < 12) {
      return dict.morning;
    } else if (hour < 20) {
      return dict.afternoon;
    } else {
      return dict.evening;
    }
  };

  const [time, setTime] = useState(new Date());
  const [date] = useState(new Date());
  const [greeting, setGreeting] = useState<string>(
    getGreeting(time.getHours())
  );
  const { data: session } = useSession();
  const username = session?.user.name;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 3600000);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    const hour = time.getHours();
    setGreeting(getGreeting(hour));
  }, [time]);

  return (
    <p className="w-full text-2xl flex flex-col justify-end text-primary-500 pl-4">
      {greeting}, {username?.split(" ")[0]}!
      <span className="text-lg text-primary-300">
        {new Intl.DateTimeFormat(locale, {
          weekday: "long",
          month: "short",
          day: "2-digit",
        }).format(date)}
      </span>
    </p>
  );
}
