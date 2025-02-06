"use client";
import {
  FlipHorizontal,
  FlipVertical,
  MoveDown,
  MoveUp,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { PiBootThin } from "react-icons/pi";
import Moveable from "react-moveable";

type Layer = {
  id: number;
  image: string;
  flipX: boolean;
  flipY: boolean;
  zIndex: number;
};

export const Create = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const targetRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const images = ["/assets/sari.png", "/logo/monanimo.png"];
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeTab, setActiveTab] = useState("assets");
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const assetsRef = useRef(null);
  const backgroundsRef = useRef(null);
  const backgrounds = ["japanese-city.png", "nature-city.png"];
  const [activeBackground, setActiveBackground] = useState("japanese-city.png");
  const [activeAssets, setActiveAssets] = useState("hat");

  useEffect(() => {
    const updateUnderline = () => {
      const activeButton =
        activeTab === "assets" ? assetsRef.current : backgroundsRef.current;
      if (activeButton) {
        setUnderlineStyle({
          width: activeButton.offsetWidth,
          left: activeButton.offsetLeft,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  const handleAddImage = (image: string) => {
    const maxZIndex = Math.max(0, ...layers.map((layer) => layer.zIndex));
    const newLayer = {
      id: Date.now(),
      image,
      flipX: false,
      flipY: false,
      zIndex: maxZIndex + 1,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedId(newLayer.id);
  };

  const handleLayerClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
  };

  const handleBackgroundClick = () => {
    setSelectedId(null);
  };

  const handleDeleteLayer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    setSelectedId(null);
  };

  const handleFlip = (id: number, axis: "x" | "y", e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id === id) {
          return {
            ...layer,
            flipX: axis === "x" ? !layer.flipX : layer.flipX,
            flipY: axis === "y" ? !layer.flipY : layer.flipY,
          };
        }
        return layer;
      })
    );
  };

  const handleChangeOrder = (
    id: number,
    direction: "up" | "down",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setLayers((prev) => {
      const currentLayer = prev.find((layer) => layer.id === id);
      if (!currentLayer) return prev;

      const otherLayers = prev.filter((layer) => layer.id !== id);

      if (direction === "up") {
        const maxZIndex = Math.max(...prev.map((layer) => layer.zIndex));
        return otherLayers.concat({ ...currentLayer, zIndex: maxZIndex + 1 });
      } else {
        const minZIndex = Math.min(...prev.map((layer) => layer.zIndex));
        return otherLayers.concat({ ...currentLayer, zIndex: minZIndex - 1 });
      }
    });
  };

  return (
    <main
      className="w-screen h-screen flex justify-center items-center bg-[url('/background/creator.png')] bg-cover bg-no-repeat"
      onClick={handleBackgroundClick}
    >
      <div className="w-[95vw] h-[92vh] flex z-10 bg-[#200052] p-[40px] backdrop-blur-[8px] rounded-[48px] overflow-hidden">
        <div
          ref={containerRef}
          className={`relative rounded-2xl w-[40%] h-full overflow-hidden`}
          style={{
            backgroundImage: `url('/background/${activeBackground}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {layers.map((layer) => (
            <div key={layer.id}>
              <div
                ref={(el) => (targetRefs.current[layer.id] = el)}
                className={`absolute target cursor-pointer w-[100px] h-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  selectedId === layer.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={(e) => handleLayerClick(layer.id, e)}
                style={{
                  position: "absolute",
                  transform: `scale(${layer.flipX ? -1 : 1}, ${
                    layer.flipY ? -1 : 1
                  })`,
                  zIndex: layer.zIndex,
                }}
              >
                <div className="relative w-full h-full group">
                  <Image
                    src={layer.image}
                    fill
                    alt="Layer image"
                    className="object-contain"
                  />
                  {selectedId === layer.id && (
                    <div className="absolute -top-6 -right-6 flex gap-2">
                      <button
                        onClick={(e) => handleChangeOrder(layer.id, "up", e)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white shadow-lg transition-colors"
                        title="Déplacer vers l'avant"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={(e) => handleChangeOrder(layer.id, "down", e)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white shadow-lg transition-colors"
                        title="Déplacer vers l'arrière"
                      >
                        <MoveDown size={16} />
                      </button>
                      <button
                        onClick={(e) => handleFlip(layer.id, "x", e)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg transition-colors"
                        title="Flip horizontalement"
                      >
                        <FlipHorizontal size={16} />
                      </button>
                      <button
                        onClick={(e) => handleFlip(layer.id, "y", e)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg transition-colors"
                        title="Flip verticalement"
                      >
                        <FlipVertical size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteLayer(layer.id, e)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectedId === layer.id && (
                <Moveable
                  target={targetRefs.current[layer.id]}
                  draggable={true}
                  resizable={true}
                  rotatable={true}
                  keepRatio={false}
                  origin={false}
                  onDrag={({ target, transform }) => {
                    if (target) {
                      target.style.transform = transform;
                    }
                  }}
                  onResize={({ target, width, height, drag }) => {
                    if (target) {
                      target.style.width = `${width}px`;
                      target.style.height = `${height}px`;
                      target.style.transform = drag.transform;
                    }
                  }}
                  onRotate={({ target, transform }) => {
                    if (target) {
                      target.style.transform = transform;
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="w-[60%] ml-[50px]">
          <Image
            src="/logo/monanimo-p.png"
            alt="logo monanimo"
            height={30}
            width={286}
            className="h-[42px] w-[370px] mx-auto mt-5 mb-[50px]"
          />
          <div className="flex items-center h-fit relative border-b-2 border-[rgba(255,255,255,0.2)] w-full">
            <button
              ref={assetsRef}
              className={`py-3 text-xl font-medium px-3 relative ${
                activeTab === "assets"
                  ? "text-white"
                  : "text-[rgba(255,255,255,0.6)]"
              } transition-all duration-300 ease-in-out`}
              onClick={() => setActiveTab("assets")}
            >
              Assets
            </button>
            <button
              ref={backgroundsRef}
              className={`py-3 text-xl font-medium px-3 relative ${
                activeTab === "backgrounds"
                  ? "text-white"
                  : "text-[rgba(255,255,255,0.6)]"
              } transition-all duration-300 ease-in-out`}
              onClick={() => setActiveTab("backgrounds")}
            >
              Backgrounds
            </button>
            <div
              className="absolute -bottom-0.5 h-0.5 bg-white transition-all duration-300 ease-in-out"
              style={{
                width: `${underlineStyle.width}px`,
                left: `${underlineStyle.left}px`,
              }}
            />
          </div>
          <div className="flex mt-[50px]">
            {activeTab === "assets" ? (
              <div>
                <div
                  className={`${
                    activeAssets === "tshirt" ? " " : "opacity-60"
                  } flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/tshirt.png`}
                    alt="logo"
                    className={`h-[70px] w-[70px]`}
                    onClick={() => setActiveAssets("tshirt")}
                  />{" "}
                  <p className="text-white -mt-2.5">Tops</p>
                </div>

                <div
                  className={`${
                    activeAssets === "pant" ? " " : "opacity-60"
                  } flex flex-col  mt-3  items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/pant.png`}
                    alt="logo"
                    className={`h-[75px] w-[75px]`}
                    onClick={() => setActiveAssets("pant")}
                  />{" "}
                  <p className="text-white -mt-2.5">Bottoms</p>
                </div>
                <div
                  className={`${
                    activeAssets === "hat" ? " " : "opacity-60"
                  } flex flex-col items-center mt-7 justify-center transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/hat.png`}
                    alt="logo"
                    className={`h-[25px] w-auto`}
                    onClick={() => setActiveAssets("hat")}
                  />
                  <p className="text-white mt-2">Hats</p>{" "}
                </div>
                <div
                  className={`${
                    activeAssets === "shoe" ? " " : "opacity-60"
                  } flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <PiBootThin
                    className={`text-[40px] mb-5 mt-6`}
                    onClick={() => setActiveAssets("shoe")}
                  />{" "}
                  <p className="text-white -mt-4">Shoes</p>
                </div>
                <div
                  className={`${
                    activeAssets === "accessories" ? " " : "opacity-60"
                  } flex flex-col items-center justify-center mt-6 transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/accesories.png`}
                    alt="logo"
                    className={`h-[40px] w-[40px] mb-2`}
                    onClick={() => setActiveAssets("accessories")}
                  />
                  <p className="text-white -mt-2">Accessories</p>
                </div>
                <div
                  className={`${
                    activeAssets === "others" ? " " : "opacity-60"
                  } flex flex-col items-center justify-center mt-3 transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/others.png`}
                    alt="logo"
                    className={`h-[75px] w-[75px] mb-2`}
                    onClick={() => setActiveAssets("others")}
                  />
                  <p className="text-white -mt-5">Others</p>
                </div>
              </div>
            ) : null}
            <div
              className={`flex flex-wrap gap-6 ${
                activeTab === "assets" ? " ml-5" : ""
              }`}
            >
              {activeTab === "assets" ? (
                <>
                  <div className="cursor-pointer hover:opacity-80 transition-opacity border border-dashed flex items-center justify-center border-white rounded-2xl overflow-hidden object-cover object-center h-[100px] w-[100px]">
                    <FiPlus className="text-4xl" />
                  </div>
                  {images.map((image, i) => (
                    <div
                      key={i}
                      className="cursor-pointer hover:opacity-80 transition-opacity border border-white rounded-2xl overflow-hidden object-cover object-center h-[100px] w-[100px]"
                      onClick={() => handleAddImage(image)}
                    >
                      <Image
                        height={130}
                        width={130}
                        src={image}
                        alt="logo"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="cursor-pointer hover:opacity-80 transition-opacity border border-dashed flex items-center justify-center border-white rounded-2xl overflow-hidden object-cover object-center h-[140px] w-[100px]">
                    <FiPlus className="text-4xl" />
                  </div>
                  {backgrounds.map((bg, i) => (
                    <div
                      key={i}
                      className="cursor-pointer hover:opacity-80 transition-opacity border border-white rounded-2xl overflow-hidden object-cover object-center h-[140px] w-[100px]"
                      onClick={() => setActiveBackground(bg)}
                    >
                      <Image
                        height={140}
                        width={130}
                        src={`/background/${bg}`}
                        alt="logo"
                        className="object-cover h-[140px]"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
