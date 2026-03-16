import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CreateDishRequest, Dish, DishRow, UNIT_TYPES } from "@/lib/types";

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
    // Parse the request into a type (a boundary)
    const body = (await request.json()) as CreateDishRequest;
    
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
    return NextResponse.json(toDish(data), {status:201});
}

// Transform db Dish type to frontend Dish type
function toDish(row: DishRow): Dish{
    return {
        id: row.id,
        dishName: row.dish_name,
        unitType: row.unit_type,
        baselineCostPerUnit: row.baseline_cost_per_unit
    };
}

function parseCreateDishRequest(body: CreateDishRequest): {valid: true, data: CreateDishRequest} | {valid: false, error: string}{
    // Validate typeof dishName
    if(typeof body.dishName != "string"){
        return {valid: false, error: "dishName is not type string"};
    }
    
    // Validate typeof unitType
    if(typeof body.unitType != "string"){
        return {valid: false, error: "unitType is not type string"};
    }

    // Normalization of cost -> string to number
    const cost = Number(body.baselineCostPerUnit);
    const trimmedDishName = body.dishName.trim();
    const normalizedUnitType = body.unitType.toLowerCase();

    // Validate baselineCostPerUnit is a number
    if(Number.isNaN(cost)){
        return {valid: false, error: "baselineCostPerUnit is not valid number"}
    }

    // Validate dishName is not empty
    if(trimmedDishName.length === 0){
        return {valid: false, error: "dishName must not be empty"};
    }

    // Validate normalizedUnitType is part of UNITTYPES
    if(!UNIT_TYPES.includes(normalizedUnitType)){
        return {valid: false, error: `unitType must be one of: ${UNIT_TYPES.join(", ")}`};
    }

    // Validate cost is greater than 0
    if(cost <= 0){
        return {valid: false, error: "cost must be greater than 0"};
    }

    const data = {dishName: trimmedDishName, unitType: normalizedUnitType, baselineCostPerUnit: cost};
    return {valid: true, data};
}