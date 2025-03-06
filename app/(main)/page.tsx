"use client";

import useUserContext from "@/store/context/users/hooks";

export default function Home() {
  const { user } = useUserContext();

  return <pre>{user.me?.email}</pre>;
}
