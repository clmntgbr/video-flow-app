"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface ColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

export function ColorPicker({ defaultColor = "#FFFFFF", onChange }: ColorPickerProps) {
  const [color, setColor] = useState(defaultColor);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  return <Picker color={color} setColor={handleColorChange} />;
}

function Picker({ color, setColor }: { color: string; setColor: (color: string) => void }) {
  const solids = [
    "#E2E2E2",
    "#FF75C3",
    "#FFA647",
    "#FFE83F",
    "#9FFF5B",
    "#70E2FF",
    "#CD93FF",
    "#09203F",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFF5",
    "#F5FF33",
    "#5733FF",
    "#FF3380",
    "#33FF80",
    "#8033FF",
    "#FF8033",
    "#33A1FF",
    "#A1FF33",
    "#803380",
    "#80FF33",
    "#3380FF",
    "#F033FF",
    "#33F0FF",
    "#F0FF33",
    "#FF3300",
    "#3300FF",
    "#00FF33",
    "#330033",
    "#0033FF",
    "#FF0033",
    "#33FF00",
    "#FF3333",
    "#33FF33",
    "#3333FF",
    "#FF33FF",
    "#33FFFF",
    "#FFFF33",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FF00FF",
    "#00FFFF",
    "#FFFF00",
    "#F5A623",
    "#D0021B",
    "#4A90E2",
    "#9013FE",
    "#B8E986",
    "#50E3C2",
    "#FF6F61",
    "#6B4226",
    "#F7C59F",
    "#E94F37",
    "#FFFFFF",
    "#000000",
    "#5A352A",
    "#E0A899",
    "#4B4E6D",
    "#1C1D21",
    "#A8A9AD",
    "#383B43",
    "#E1BEE7",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="w-full">
          {color ? <div className="h-4 w-4 rounded !bg-center !bg-cover border transition-all" style={{ background: color }}></div> : <></>}
          <div className="truncate flex-1 text-left">{color}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-wrap gap-1 mt-0">
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className="rounded-md border h-6 w-6 cursor-pointer active:scale-105"
              onClick={() => setColor(s)}
            />
          ))}
        </div>

        <Input id="custom" value={color} className="col-span-2 h-8 mt-4" onChange={(e) => setColor(e.currentTarget.value)} />
      </PopoverContent>
    </Popover>
  );
}
