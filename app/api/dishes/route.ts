import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Dish } from "@/lib/types";
import { parseCreateDishRequest } from "@/lib/validators/dish";
import { toClientDish } from "@/lib/mappers/dish";

export async function GET() {
    const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("created_at", {ascending: false});

    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    const dishes: Dish[] = data.map(row => toClientDish(row));
    return NextResponse.json(dishes);
}

export async function POST(request: Request){
    // Parse the request into a type (a boundary)
    const body = (await request.json());
    
    const parsedDish = parseCreateDishRequest(body);
    
    if(!parsedDish.valid){
        return NextResponse.json({error: parsedDish.error}, {status: 400});
    }

    // POST call to supabase with normalized values that passed validation
    const {data, error} = await supabase
        .from("dishes")
        .insert([{dish_name: parsedDish.data.dishName, unit_type: parsedDish.data.unitType, baseline_cost_per_unit: parsedDish.data.baselineCostPerUnit}])
        .select()
        .single();
        
    // If error exists or if data is null, return failure
    if(error || !data){
        return NextResponse.json({error: "Insert failed"}, {status: 500});
    }
    
    // Otherwise, return successful insertion and dish that was inserted after mapping db type to frontend type
    return NextResponse.json(toClientDish(data), {status:201});
}