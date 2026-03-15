import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Dish, DishRow } from "@/lib/types";

export async function GET() {
    const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("created_at", {ascending: false});

    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    const rows = data ?? []
    const dishes: Dish[] = rows.map(row => toDish(row));

    return NextResponse.json(dishes);
}

export async function POST(request: Request){
    const {dishName, unitType, baselineCostPerUnit} = await request.json();

    if(typeof dishName !== "string" || (unitType !== "plate" || unitType !== "tray") || typeof baselineCostPerUnit !== "number" || !dishName || !unitType || baselineCostPerUnit <= 0){
        return NextResponse.json({error: "Bad request sent"}, {status: 400});
    }

    const {data, error} = await supabase
        .from("dishes")
        .insert([{dish_name: dishName, unit_type: unitType, baseline_cost_per_unit: baselineCostPerUnit}])
        .select()
        .single();
        
    if(error || !data){
        return NextResponse.json({error: "Insert failed"}, {status: 500});
    }
    
    const row: DishRow = data ?? {};
    return NextResponse.json(toDish(row), {status:201});
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
