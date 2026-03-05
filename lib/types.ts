export type UnitType = "plate" | "tray";
export type Dish = {
    dishName: string;
    unitType: UnitType;
    baselineCostPerUnit: number;
}