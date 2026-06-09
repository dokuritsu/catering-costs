import { CreateDishRequest, Dish, DishRow } from "../types";

// Transform db Dish type to frontend Dish type
export function toClientDish(row: DishRow): Dish{
    return {
        id: row.id,
        dishName: row.dish_name,
        unitType: row.unit_type,
        baselineCostPerUnit: row.baseline_cost_per_unit
    };
}

// Transform frontend Dish type to db Dish type
export function toDatabaseDish(data: Partial<CreateDishRequest>): Record<string, unknown>{
    const updates: Record<string, unknown> = {};

    if(data.dishName){
        updates.dish_name = data.dishName;
    }

    if(data.unitType){
        updates.unit_type = data.unitType;
    }

    if(data.baselineCostPerUnit){
        updates.baseline_cost_per_unit = data.baselineCostPerUnit;
    }

    return updates;
}
    