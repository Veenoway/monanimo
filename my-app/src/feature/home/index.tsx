"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CharacterSelector } from "./components/character-selector";

export const Home = () => {
  const [isStepOne, setIsStepOne] = useState(true);
  return (
    <main
      className={`w-screen h-screen flex  ${
        isStepOne ? "flex-col pt-[100px]" : "justify-center"
      } items-center bg-[url('/background/main.png')] bg-cover bg-no-repeat`}
    >
      <Link href="/create">YOYOYOYOYO</Link>
      <button
        className="absolute left-5 top-5 bg-red-500 text-4xl"
        onClick={() => setIsStepOne((prev) => !prev)}
      >
        Change
      </button>
      {isStepOne ? (
        <>
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
              Customize your monanimal and share with nads
            </h1>
            <button
              className="h-[54px] px-7 text-white font-medium 
            text-2xl flex justify-center items-center bg-[#836EF9] w-[185px] rounded-full mt-[10vh]"
              onClick={() => setIsStepOne(false)}
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <CharacterSelector />
      )}
    </main>
  );
};
