"use client";
import html2canvas from "html2canvas";
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
  const targetRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const assetsRef = useRef<HTMLButtonElement | null>(null);
  const backgroundsRef = useRef<HTMLButtonElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeBackground, setActiveBackground] = useState("japanese-city.png");
  const [activeAssets, setActiveAssets] = useState("hat");
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [images, setImages] = useState<string[]>([
    "/assets/sari.png",
    "/logo/monanimo.png",
  ]);
  const [activeTab, setActiveTab] = useState<"assets" | "backgrounds">(
    "assets"
  );
  const [backgrounds, setBackgrounds] = useState<string[]>([
    "japanese-city.png",
    "nature-city.png",
  ]);

  useEffect(() => {
    const updateUnderline = () => {
      const btn =
        activeTab === "assets" ? assetsRef.current : backgroundsRef.current;
      if (btn) {
        setUnderlineStyle({ width: btn.offsetWidth, left: btn.offsetLeft });
      }
    };
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  const handleLayerSelect = (id: number, e?: any) => {
    e?.stopPropagation();
    setLayers((prev) => {
      const maxZ = Math.max(...prev.map((l) => l.zIndex));
      return prev.map((l) => (l.id === id ? { ...l, zIndex: maxZ + 1 } : l));
    });
    setSelectedId(id);
  };

  const handleAddImageLayer = (imgUrl: string) => {
    const maxZIndex = Math.max(0, ...layers.map((l) => l.zIndex));
    const newLayer = {
      id: Date.now(),
      image: imgUrl,
      flipX: false,
      flipY: false,
      zIndex: maxZIndex + 1,
    };
    setLayers((prev) => [...prev, newLayer]);
    setTimeout(() => {
      setSelectedId(newLayer.id);
    }, 0);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (activeTab === "assets") {
        setImages((prev) => [...prev, url]);
        handleAddImageLayer(url);
      } else {
        setBackgrounds((prev) => [...prev, url]);
        setActiveBackground(url);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBackgroundClick = () => {
    setSelectedId(null);
  };

  const handleDeleteLayer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) => prev.filter((l) => l.id !== id));
    setSelectedId(null);
  };

  const handleFlip = (id: number, axis: "x" | "y", e: React.MouseEvent) => {
    e.stopPropagation();
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            flipX: axis === "x" ? !l.flipX : l.flipX,
            flipY: axis === "y" ? !l.flipY : l.flipY,
          };
        }
        return l;
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
      const current = prev.find((l) => l.id === id);
      if (!current) return prev;
      const others = prev.filter((l) => l.id !== id);
      if (direction === "up") {
        const maxZ = Math.max(...prev.map((l) => l.zIndex));
        return [...others, { ...current, zIndex: maxZ + 1 }];
      } else {
        const minZ = Math.min(...prev.map((l) => l.zIndex));
        return [...others, { ...current, zIndex: minZ - 1 }];
      }
    });
  };

  const handleDownload = async () => {
    if (containerRef.current) {
      try {
        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: null,
          useCORS: true,
        });
        const link = document.createElement("a");
        link.download = "mon-animo-composition.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePlusMouseDown = () => {
    setLongPressTriggered(false);
    pressTimerRef.current = setTimeout(() => {
      setLongPressTriggered(true);
      if (fileInputRef.current) fileInputRef.current.click();
    }, 600);
  };

  const handlePlusMouseUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (!longPressTriggered) {
      if (fileInputRef.current) fileInputRef.current.click();
    }
  };

  const currentBgUrl = backgrounds.includes(activeBackground)
    ? `/background/${activeBackground}`
    : activeBackground;

  return (
    <main
      className="w-screen h-screen flex justify-center items-center bg-[url('/background/creator.png')] bg-cover bg-no-repeat"
      onClick={handleBackgroundClick}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileChange}
      />
      <div className="w-[95vw] h-[92vh] flex z-10 bg-[#200052] p-[40px] backdrop-blur-[8px] rounded-[48px] overflow-hidden">
        <div
          ref={containerRef}
          className="relative rounded-2xl w-[40%] h-full overflow-hidden"
          style={{
            backgroundImage: `url(${currentBgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {layers.map((layer) => (
            <React.Fragment key={layer.id}>
              <div
                ref={(el) => (targetRefs.current[layer.id] = el)}
                className="absolute cursor-pointer w-[100px] h-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `scale(${layer.flipX ? -1 : 1}, ${
                    layer.flipY ? -1 : 1
                  })`,
                  zIndex: layer.zIndex,
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={layer.image}
                    fill
                    alt=""
                    className="object-contain"
                  />
                  {selectedId === layer.id && (
                    <div className="absolute -top-6 -right-6 flex gap-2">
                      <button
                        onClick={(e) => handleChangeOrder(layer.id, "up", e)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white shadow-lg transition-colors"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={(e) => handleChangeOrder(layer.id, "down", e)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white shadow-lg transition-colors"
                      >
                        <MoveDown size={16} />
                      </button>
                      <button
                        onClick={(e) => handleFlip(layer.id, "x", e)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg transition-colors"
                      >
                        <FlipHorizontal size={16} />
                      </button>
                      <button
                        onClick={(e) => handleFlip(layer.id, "y", e)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg transition-colors"
                      >
                        <FlipVertical size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteLayer(layer.id, e)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Moveable
                target={targetRefs.current[layer.id]}
                draggable
                resizable={selectedId === layer.id}
                rotatable={selectedId === layer.id}
                keepRatio={false}
                origin={false}
                onDragStart={(e) => handleLayerSelect(layer.id, e.inputEvent)}
                onDrag={({ target, transform }) => {
                  if (target) target.style.transform = transform;
                }}
                onResize={({ target, width, height, drag }) => {
                  if (target) {
                    target.style.width = `${width}px`;
                    target.style.height = `${height}px`;
                    target.style.transform = drag.transform;
                  }
                }}
                onRotate={({ target, transform }) => {
                  if (target) target.style.transform = transform;
                }}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="w-[60%] ml-[50px] flex flex-col">
          <Image
            src="/logo/monanimo-p.png"
            alt=""
            height={30}
            width={286}
            className="h-[42px] w-[370px] mx-auto mt-5 mb-[30px]"
          />
          <div className="flex items-center h-fit relative border-b-2 border-[rgba(255,255,255,0.2)] w-full mb-5">
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
              style={{ width: underlineStyle.width, left: underlineStyle.left }}
            />
          </div>
          <div className="flex mt-2">
            {activeTab === "assets" && (
              <div className="mr-5">
                <div
                  className={`${
                    activeAssets === "tshirt" ? "" : "opacity-60"
                  } flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/tshirt.png`}
                    alt=""
                    className="h-[70px] w-[70px]"
                    onClick={() => setActiveAssets("tshirt")}
                  />
                  <p className="text-white -mt-2.5">Tops</p>
                </div>
                <div
                  className={`${
                    activeAssets === "pant" ? "" : "opacity-60"
                  } flex flex-col mt-3 items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/pant.png`}
                    alt=""
                    className="h-[75px] w-[75px]"
                    onClick={() => setActiveAssets("pant")}
                  />
                  <p className="text-white -mt-2.5">Bottoms</p>
                </div>
                <div
                  className={`${
                    activeAssets === "hat" ? "" : "opacity-60"
                  } flex flex-col items-center mt-7 justify-center transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/hat.png`}
                    alt=""
                    className="h-[25px] w-auto"
                    onClick={() => setActiveAssets("hat")}
                  />
                  <p className="text-white mt-2">Hats</p>
                </div>
                <div
                  className={`${
                    activeAssets === "shoe" ? "" : "opacity-60"
                  } flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <PiBootThin
                    className="text-[40px] mb-5 mt-6 cursor-pointer"
                    onClick={() => setActiveAssets("shoe")}
                  />
                  <p className="text-white -mt-4">Shoes</p>
                </div>
                <div
                  className={`${
                    activeAssets === "accessories" ? "" : "opacity-60"
                  } flex flex-col items-center justify-center mt-6 transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/accesories.png`}
                    alt=""
                    className="h-[40px] w-[40px] mb-2 cursor-pointer"
                    onClick={() => setActiveAssets("accessories")}
                  />
                  <p className="text-white -mt-2">Accessories</p>
                </div>
                <div
                  className={`${
                    activeAssets === "others" ? "" : "opacity-60"
                  } flex flex-col items-center justify-center mt-3 transition-all duration-300 ease-in-out`}
                >
                  <Image
                    height={30}
                    width={30}
                    src={`/icons/others.png`}
                    alt=""
                    className="h-[75px] w-[75px] mb-2 cursor-pointer"
                    onClick={() => setActiveAssets("others")}
                  />
                  <p className="text-white -mt-5">Others</p>
                </div>
              </div>
            )}
            <div
              className={`flex flex-wrap gap-6 ${
                activeTab === "assets" ? "ml-5" : ""
              }`}
            >
              {activeTab === "assets" ? (
                <>
                  <div
                    className="cursor-pointer hover:opacity-80 transition-opacity border border-dashed flex items-center justify-center border-white rounded-2xl overflow-hidden object-cover object-center h-[100px] w-[100px]"
                    onMouseDown={handlePlusMouseDown}
                    onMouseUp={handlePlusMouseUp}
                  >
                    <FiPlus className="text-4xl" />
                  </div>
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="cursor-pointer hover:opacity-80 transition-opacity border border-white rounded-2xl overflow-hidden object-cover object-center h-[100px] w-[100px]"
                      onClick={() => handleAddImageLayer(img)}
                    >
                      <Image
                        height={130}
                        width={130}
                        src={img}
                        alt=""
                        className="object-contain"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div
                    className="cursor-pointer hover:opacity-80 transition-opacity border border-dashed flex items-center justify-center border-white rounded-2xl overflow-hidden object-cover object-center h-[140px] w-[100px]"
                    onMouseDown={handlePlusMouseDown}
                    onMouseUp={handlePlusMouseUp}
                  >
                    <FiPlus className="text-4xl" />
                  </div>
                  {backgrounds.map((bg, i) => (
                    <div
                      key={i}
                      className={`cursor-pointer hover:border-[#836EF9] ${
                        activeBackground === bg
                          ? "border-[#836EF9]"
                          : "border-transparent"
                      } border-2 rounded-2xl overflow-hidden object-cover object-center h-[140px] w-[100px] transition-all duration-300 ease-in-out`}
                      onClick={() => setActiveBackground(bg)}
                      onMouseEnter={() => setHoverState(bg)}
                      onMouseLeave={() => setHoverState(null)}
                    >
                      <Image
                        height={140}
                        width={130}
                        src={
                          backgrounds.includes(bg) ? `/background/${bg}` : bg
                        }
                        alt=""
                        className={`object-cover h-[140px] transition-all duration-300 ease-in-out ${
                          hoverState === bg ? "scale-105" : ""
                        }`}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="mt-auto mb-5 flex justify-center">
            <button
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
