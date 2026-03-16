import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Dish, DishRow, UNIT_TYPES } from "@/lib/types";

export async function GET() {
    const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("created_at", {ascending: false});

    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    const dishes: Dish[] = data.map(row => toDish(row));
    return NextResponse.json(dishes);
}

export async function POST(request: Request){
    const {dishName, unitType, baselineCostPerUnit} = await request.json();
    
    const cost = Number(baselineCostPerUnit);

    if(typeof dishName !== "string" || typeof unitType !== "string"){
        return NextResponse.json({error: "Bad request sent"}, {status: 400});
    }
    const trimmedDishName = dishName.trim();
    const normalizedUnitType = unitType.toLowerCase();

    if(trimmedDishName.length === 0 || !UNIT_TYPES.includes(normalizedUnitType) || Number.isNaN(cost) || cost <= 0){
        const trimmedDishName = dishName.trim();
        const normalizedUnitType = unitType.toLowerCase();
    }

    const {data, error} = await supabase
        .from("dishes")
        .insert([{dish_name: trimmedDishName, unit_type: normalizedUnitType, baseline_cost_per_unit: cost}])
        .select()
        .single();
        
    if(error || !data){
        return NextResponse.json({error: "Insert failed"}, {status: 500});
    }
    
    return NextResponse.json(toDish(data), {status:201});
}

// Transform db Dish type to frontend Dish type
function toDish(row: DishRow): Dish{
    const transformedDish: Dish = {
        id: row.id,
        dishName: row.dish_name,
        unitType: row.unit_type,
        baselineCostPerUnit: row.baseline_cost_per_unit
    }
    return transformedDish;
}
