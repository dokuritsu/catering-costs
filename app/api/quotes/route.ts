import { toClientQuote } from "@/lib/mappers/quote";
import { supabase } from "@/lib/supabase";
import { parseCreateQuoteRequest } from "@/lib/validators/quote";
import { NextResponse } from "next/server";

export async function GET() {
    // Create query for supabase to select all quotes
    const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("saved_at", { ascending: false });

    // If error exists, return failure
    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    // Else, convert data to frontend type and return successful response
    const quotes = data.map(row => toClientQuote(row));
    return NextResponse.json(quotes, {status: 200});
}

export async function POST(request: Request){
    // Parse the request into a type (a boundary)
    const body = (await request.json());
    const parsedQuote = parseCreateQuoteRequest(body);

    // If there are validation errors, return failure with error messages
    if(!parsedQuote.valid){
        return NextResponse.json({error: parsedQuote.error}, {status: 400});
    }

    // Make call to supabase with dishId to obtain dish info
    const {data: dishData, error: dishError} = await supabase
        .from("dishes")
        .select("dish_name, baseline_cost_per_unit")
        .eq("id", parsedQuote.data.dishId)
        .single();

    if(dishError){
        if(dishError.code === "PGRST116"){
            return NextResponse.json({error: "Dish not found with provided dishId"}, {status: 404});
        }
        return NextResponse.json({error: dishError.message}, {status: 500});
    }

    // POST call to supabase with normalized values that passed validation
    const {data: quoteData, error: quoteError} = await supabase
        .from("quotes")
        .insert([{
            dish_id: parsedQuote.data.dishId, 
            dish_name_snapshot: dishData.dish_name, 
            quantity: parsedQuote.data.quantity,
            margin_pct: parsedQuote.data.marginPct,
            baseline_cost_snapshot: dishData.baseline_cost_per_unit,
            rate_per_mile: parsedQuote.data.ratePerMile,
            miles: parsedQuote.data.miles,
            packaging_cost: parsedQuote.data.packagingCost,
            labor_hours: parsedQuote.data.laborHours,
            labor_rate: parsedQuote.data.laborRate
        }])
        .select()
        .single();

    // If error  exists or if data is null, return failure
    if(quoteError || !quoteData){
        return NextResponse.json({error: "Insert failed"}, {status: 500});
    }

    // Otherwise, return successful insertion and quote that was inserted after mapping db type to frontend type
    return NextResponse.json(toClientQuote(quoteData), {status:201});
}