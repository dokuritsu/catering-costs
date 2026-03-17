import { Database } from "./database.types";

export const UNIT_TYPES = ["plate", "tray"] as const;
export type UnitType = typeof UNIT_TYPES[number];
export type Dish = {
    id: string,
    dishName: string;
    unitType: UnitType;
    baselineCostPerUnit: number;
}

export type CreateDishRequest = {
    dishName: string,
    unitType: string,
    baselineCostPerUnit: number
}

export type Quote = {
    id: string;
    dishId: string,
    savedAt: string;
    dishName: string;
    quantity: number;
    laborHours: number,
    laborRate: number,
    packagingCost: number,
    deliveryCost: number,
    miscCost: number,
    marginPct: number;
    pricePerUnit: number;
    grocerySpend: number;
    miles: number,
    ratePerMile: number,
    totalCost: number;
    revenue: number;
    profit: number;
}

export type DishRow = Database["public"]["Tables"]["dishes"]["Row"]