import { Database } from "./database.types";

export const UNIT_TYPES = ["plate", "tray"] as const;
export type UnitType = typeof UNIT_TYPES[number];
export type Dish = {
    id: string,
    dishName: string,
    unitType: UnitType,
    baselineCostPerUnit: number
}

export type CreateDishRequest = {
    dishName: string,
    unitType: UnitType,
    baselineCostPerUnit: number
}

export type Errors = {
    [errorMsg in keyof CreateDishRequest]?: string;
};

export type Quote = {
    id: string,
    dishId: string | null, 
    savedAt: string,
    dishNameSnapshot: string,
    quantity: number,
    marginPct: number,
    baselineCostSnapshot: number,
    laborHours: number,
    laborRate: number,
    ratePerMile: number,
    miles: number,
    packagingCost: number
}

export type DishRow = Database["public"]["Tables"]["dishes"]["Row"]
export type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"]