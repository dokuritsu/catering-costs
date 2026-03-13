import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Dish } from "@/lib/types";

export async function GET() {
    const { data, error } = await supabase.from("dishes").select("*").order("created_at", { ascending: false});

    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json(data, {status: 200});
}

export async function POST(request: Request){
    const body = await request.json();
    const {dishName, unitType, baselineCostPerUnit} = body;

    if(!dishName || !unitType || baselineCostPerUnit <= 0){
        return NextResponse.json({error: "Bad request sent"}, {status: 400});
    }

    const {data, error} = await supabase.from("dishes").insert([{dish_name: dishName, unit_type: unitType, baseline_cost_per_unit: baselineCostPerUnit}]);
        
    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json(data, {status:201});

}