export type UnitType = "plate" | "tray";
export type Dish = {
    dishName: string;
    unitType: UnitType;
    baselineCostPerUnit: number;
}

export type Quote = {
    id: string;
    savedAt: string;
    dishName: string;
    quantity: number;
    pricePerUnit: number;
    grocerySpend: number;
    laborHours: number;
    marginPct: string;
    totalCost: number;
    revenue: number;
    profit: number;
}