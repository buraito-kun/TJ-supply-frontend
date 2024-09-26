"use client";

export default function Popup({ children }) {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen z-50">{children}</div>
      <div className="fixed top-0 left-0 bg-black opacity-50 w-screen h-screen z-40"></div>
    </>
  );
}
