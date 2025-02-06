"use client";
import Image from "next/image";

export const CharacterSelector = () => {
  return (
    <div className="w-[95vw] h-[92vh] z-10 bg-[rgba(105,103,103,0.37)] p-[50px] backdrop-blur-[8px] rounded-[48px] overflow-hidden">
      <Image
        src="/logo/monanimo.png"
        alt="logo monanimo"
        height={30}
        width={286}
        className="h-[50px] w-[390px]"
      />
      <div
        className="max-w-6xl w-[90%] flex items-center justify-center flex-col"
        style={{
          height: "calc(100% - 200px)",
        }}
      >
        <h1 className="text-7xl [text-shadow:_0_0_10px_rgb(0_0_0_/_0.5)] text-center font-bold text-white">
          Choose your monanimal to customize
        </h1>
        <button
          className="h-[54px] px-7 text-white font-medium 
                text-2xl flex justify-center items-center bg-[#836EF9] w-[185px] rounded-full mt-[10vh]"
          //   onClick={() => setIsStepOne(false)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
