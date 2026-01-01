"use client";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface PriceFilterProps {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMaxPriceChange?: (price: string) => void;
  onMinPriceChange?: (price: string) => void;
}
export const formatAsCurrency = (price: string) => {
  const numaricValue = price.replace(/[^0-9.]/g, "");
  const parts = numaricValue.split(".");
  const formatedValue =
    parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");
  if (!formatedValue) return "";
  const numberValue = parseFloat(formatedValue);
  if (isNaN(numberValue)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};
export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMaxPriceChange,
  onMinPriceChange,
}: PriceFilterProps) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange?.(numericValue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange?.(numericValue);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className=" flex flex-col gap-2">
        <Label htmlFor="min-price" className=" font-medium text-base">
          Minimum Price
        </Label>
        <Input
          type="text"
          id="min-price"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
          placeholder="$0"
        />
      </div>
      <div className=" flex flex-col gap-2">
        <Label htmlFor="max-price" className=" font-medium text-base">
          Maximum Price
        </Label>
        <Input
          type="text"
          id="max-price"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
          placeholder="∞"
        />
      </div>
    </div>
  );
};
