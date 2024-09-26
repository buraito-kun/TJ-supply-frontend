import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Footer() {
  const session = useSession();
  const role = session?.data?.data?.role;

  useEffect(() => {
    if (session?.status === "authenticated") {
      const checkIsUserExist = async () => {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + `user/${session?.data?.data?.ID}`,
          { method: "GET" }
        );
        if (!res.ok) {
          signOut();
        }
      };
      checkIsUserExist();
    }
  }, [session, role]);

  return (
    // <h2 className="text-center text-xs text-black mt-[50px]">©2022 - {new Date().getFullYear()} Storage Management@Naresuan University v.0.0.2. All rights reserved.</h2>
    <h2 className="text-center text-xs text-black mt-[50px]">
      ©{new Date().getFullYear()} Storage Management@Naresuan University
      v.0.0.2. All rights reserved.
    </h2>
  );
}
