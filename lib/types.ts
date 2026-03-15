export type UnitType = "plate" | "tray";
export type Dish = {
    id: string,
    dishName: string;
    unitType: UnitType;
    baselineCostPerUnit: number;
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

export type DishRow = {
    id: string,
    dish_name: string,
    unit_type: UnitType,
    baseline_cost_per_unit: number
}