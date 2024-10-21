"use client";

import SubmitButton from "@/components/SubmitButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

export default function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();
  const role = session?.data?.data?.role;

  useEffect(() => {
    if (session?.status === "authenticated") {
      Swal.fire({
        title: "Login success",
        position: "bottom-end",
        timer: 1000,
        showConfirmButton: false,
        icon: "success",
        width: "20rem",
      });

      if (role[0] === "m") redirect("/dashboard");
      else if (role[4] === "a") redirect("/user")
      else if (role[1] === "s" || role[3] === "w" || role[5] === "f") redirect("/item");
      else if (role[2] === "t") redirect("/qc");
    } else if (session?.status === "unauthenticated") {
      Swal.fire({
        title: "Login failed",
        position: "bottom-end",
        timer: 1000,
        showConfirmButton: false,
        icon: "error",
        width: "20rem",
      });
    }
  }, [session, role]);

  const fetchData = async () => {
    try {
      await signIn("credentials", { username: username, password: password });
    } catch (err) {}
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  return (
    <>
      <div className="w-screen h-screen relative bg-white">
        <div className="w-[579px] h-[579px] left-[384px] top-[253px] absolute bg-white rounded-[15px] border-2 border-black"></div>
        <Image
          className="w-auto h-screen right-[0px] top-0 absolute"
          src="/irons.png"
          width={571}
          height={945}
          alt="irons"
        />
        <div className="w-auto h-auto left-[445px] top-[274px] absolute text-center">
          <span className="text-black text-[32px] font-bold font-['Sarabun']">
            ยินดีต้อนรับสู่ระบบจัดการคลังสินค้า
            <br />
            <br />
          </span>
          <span className="text-black text-2xl font-bold font-['Sarabun']">
            ลงชื่อเข้าใช้บัญชีของคุณ
          </span>
        </div>
        <Image
          className="w-[254px] h-[60px] left-[80px] top-[80px] absolute"
          src="/logo.png"
          width={254}
          height={60}
          alt="logo"
        />
        <div className="w-[118px] h-[49px] left-[452px] top-[444px] absolute text-left text-black text-xl font-normal font-['Sarabun']">
          ชื่อผู้ใช้งาน
        </div>
        <div className="w-[118px] h-[49px] left-[452px] top-[559px] absolute text-left text-black text-xl font-normal font-['Sarabun']">
          รหัสผ่าน
        </div>
        <div className="w-[441px] h-[50px] left-[452px] top-[493px] absolute">
          <input
            className="w-[441px] h-[50px] left-0 top-0 absolute bg-white rounded-md border border-black text-black text-2xl px-3 font-normal font-['Sarabun']"
            type="text"
            placeholder="ชื่อผู้ใช้งาน"
            onChange={(e) => setusername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="w-[441px] h-[50px] left-[452px] top-[608px] absolute">
          <input
            className="w-[441px] h-[50px] left-0 top-0 absolute bg-white rounded-md border border-black text-black text-2xl px-3 font-normal font-['Sarabun']"
            type="password"
            placeholder="รหัสผ่าน"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <SubmitButton
          text="เข้าสู่ระบบ"
          className="left-[692px] top-[696px] absolute"
          onClick={fetchData}
        />
        <div className="w-auto h-auto left-[411px] top-[794px] absolute text-neutral-500 text-[13px] font-normal font-['Zen Kaku Gothic Antique'] leading-snug">
          ต้องการความช่วยเหลือ?
        </div>
        <div className="w-auto h-auto left-[454px] top-[658px] absolute text-zinc-500 text-[13px] font-normal font-['Zen Kaku Gothic Antique'] leading-snug">
          ลืมรหัสผ่าน?
        </div>
        <div className="w-auto h-auto left-[80px] bottom-[10px] absolute justify-center items-center inline-flex">
          <div className="text-neutral-400 text-[12.80px] font-normal font-['Zen Kaku Gothic Antique'] leading-snug">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
