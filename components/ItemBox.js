import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function ItemBox({ ...props }) {
  const session = useSession();
  const role = session?.data?.data?.role;

  return (
    <>
      <div className="w-[300px] h-[140px] bg-white mx-5 my-2 rounded-lg flex border shadow-md hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform">
        {props.options ? (
          <>
            <div className="w-[90%] h-full">
              <Link href={props.href} className="flex w-full h-full">
                <div className="w-[40%] h-full flex place-items-center place-content-center">
                  <Image
                    className="size-[110px] rounded-md"
                    src={`/api/item/image/${
                      props.ID
                    }?timestamp=${Date.now()}`}
                    alt="item"
                    width="110"
                    height="110"
                  ></Image>
                </div>
                <div className="w-[60%] ml-2 h-full flex flex-col place-content-between">
                  <h4 className="w-auto h-auto mt-2 break-words whitespace-normal text-black text-left text-lg font-bold font-['Sarabun'] overflow-y-auto">
                    {props.text}
                  </h4>
                  <div className="mb-2">
                    {role && (role[0] === "m" || role[5] === "f") && (
                      <h5 className="text-black text-left text-sm font-['Sarabun']">
                        ราคาซื้อ:{props.costPrice}, ขาย:{props.salePrice}
                      </h5>
                    )}
                    <h5 className="text-black text-left text-sm font-['Sarabun']">
                      จำนวน: {props.amount}
                    </h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="w-[10%] h-full flex flex-col place-content-between">
              <div
                className="py-2 w-full h-full hover:bg-[#3D5A80] hover:rounded-tr-lg"
                onClick={props.favourite ? props.favourite : null}
              >
                {props.isFavourite === true ? (
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="yellow"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.9994 3.125L11.1787 10.9238L2.5 12.1812L8.78688 18.3275L7.28375 26.875L15 22.7625L22.7156 26.875L21.225 18.3281L27.5 12.1819L18.8694 10.9238L14.9994 3.125Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.9994 3.125L11.1787 10.9238L2.5 12.1812L8.78688 18.3275L7.28375 26.875L15 22.7625L22.7156 26.875L21.225 18.3281L27.5 12.1819L18.8694 10.9238L14.9994 3.125Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div className="py-2 w-full h-full hover:bg-[#EE6C4D] hover:rounded-br-lg">
                <Link href={`/item/edit/${props.ID}`}>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.75 21.2663L14.2662 21.2475L26.3062 9.3225C26.7787 8.85 27.0387 8.2225 27.0387 7.555C27.0387 6.8875 26.7787 6.26 26.3062 5.7875L24.3237 3.805C23.3787 2.86 21.73 2.865 20.7925 3.80125L8.75 15.7288V21.2663ZM22.5562 5.5725L24.5425 7.55125L22.5462 9.52875L20.5637 7.5475L22.5562 5.5725ZM11.25 16.7713L18.7875 9.305L20.77 11.2875L13.2337 18.7513L11.25 18.7575V16.7713Z"
                      fill="black"
                    />
                    <path
                      d="M6.25 26.25H23.75C25.1288 26.25 26.25 25.1288 26.25 23.75V12.915L23.75 15.415V23.75H10.1975C10.165 23.75 10.1313 23.7625 10.0988 23.7625C10.0575 23.7625 10.0163 23.7513 9.97375 23.75H6.25V6.25H14.8088L17.3088 3.75H6.25C4.87125 3.75 3.75 4.87125 3.75 6.25V23.75C3.75 25.1288 4.87125 26.25 6.25 26.25Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="w-[100%] h-full">
            <Link href={props.href} className="flex w-full h-full">
              <div className="w-[40%] h-full flex place-items-center place-content-center">
                <Image
                  className="w-[110px] h-[110px] rounded-md"
                  src="/box.png"
                  alt="item"
                  width="1000"
                  height="1000"
                ></Image>
              </div>
              <div className="w-[60%] ml-2 h-full flex flex-col place-content-between">
                <h4 className="w-auto h-auto mt-2 break-words whitespace-normal text-black text-left text-lg font-bold font-['Sarabun'] overflow-y-auto">
                  {props.text}
                </h4>
                <div className="mb-2">
                  <h5 className="text-black text-left text-sm font-['Sarabun']">
                    ราคา: {props.costPrice}
                  </h5>
                  <h5 className="text-black text-left text-sm font-['Sarabun']">
                    จำนวน: {props.amount}
                  </h5>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
