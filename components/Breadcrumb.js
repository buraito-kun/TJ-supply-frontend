"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Translator from "@/translator";
import { useSession } from "next-auth/react";

export default function Breadcrumb() {
  const session = useSession();
  const role = session?.data?.data?.role;
  var currentUrl = usePathname().split("/");
  currentUrl.shift();
  var i = 0;
  var link = "/";

  return (
    <div className="bg-white w-full h-14 whitespace-nowrap overflow-x-auto border-b border-black">
      <div className="w-full h-full flex place-items-center">
        <div className="ml-5"></div>
        {role ? (
          <>
            <Link
              href={
                role[0] === "m"
                  ? "/dashboard"
                  : role[1] === "s" || role[3] === "w"
                  ? "/item"
                  : "/qc"
              }
            >
              <h3 className="ml-2 text-black text-2xl font-normal font-['Sarabun']">
                หน้าหลัก
              </h3>
            </Link>
            <h3 className="ml-2 text-black text-3xl font-bold font-['Sarabun']">
              /
            </h3>
          </>
        ) : null}
        {currentUrl.map((path) => {
          try {
            link += path + "/";
            if (path === currentUrl[currentUrl.length - 1]) {
              return (
                <Link key={path} href={link}>
                  <h3 className="ml-2 text-black text-2xl font-normal font-['Sarabun']">
                    {Translator[path].name}
                  </h3>
                </Link>
              );
            } else {
              return (
                <div key={path} className="flex">
                  <Link href={link}>
                    <h3 className="ml-2 text-black text-2xl font-normal font-['Sarabun']">
                      {Translator[path].name}
                    </h3>
                  </Link>
                  <h3 className="ml-2 text-black text-3xl font-bold font-['Sarabun']">
                    /
                  </h3>
                </div>
              );
            }
          } catch (err) {}
        })}
      </div>
    </div>
  );
}
