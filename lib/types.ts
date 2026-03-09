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