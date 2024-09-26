"use client";

import QRcode from "qrcode";
import { useEffect, useRef } from "react";

export default function GenQRcode({ ...props }) {
  const componentRef = useRef();

  useEffect(() => {
    if (componentRef.current) {
      QRcode.toCanvas(componentRef.current, props.encrypted, {
        scale: 1.8, // actual size is ~1.7-1.8 cm, ~85px
        // margin: 1,
        // errorCorrectionLevel: "L"
        // https://github.com/soldair/node-qrcode?tab=readme-ov-file#options-9
      });
    }
  }, [props.encrypted]);

  return (
    <div className="relative">
      <div className="w-[75px] h-auto flex flex-col place-items-center place-content-center">
        <canvas ref={componentRef}></canvas>
      </div>
      <div className="absolute top-[77px] left-2 z-50">
        <h1 className="text-black text-[6px] font-normal font-['Sarabun']">{props.value}</h1>
      </div>
    </div>
  );
}
