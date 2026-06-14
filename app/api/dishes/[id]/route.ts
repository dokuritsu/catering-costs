import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { parseUpdateDishRequest } from "@/lib/validators/dish";
import { toClientDish, toDatabaseDish } from "@/lib/mappers/dish";

export async function DELETE(request: Request, context: {params: Promise<{id: string}>}){
    const {id} = await context.params;

    if(!id || id.trim().length === 0){
        return NextResponse.json({error: "id is not valid"}, {status: 400});
    }

    // DELETE call to supabase with id that passed validation
    const {data, error} = await supabase
        .from("dishes")
        .delete()
        .eq('id', id)
        .select();

    // if error exists or if data is null, return error
    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    if(data.length === 0){
        return NextResponse.json({error: "unable to find dish via id"}, {status: 404});
    }

    return new NextResponse(null, {status: 204});
}

export async function PATCH(request: Request, context: {params: Promise<{id: string}>}){
    const {id} = await context.params;

    if(!id || id.trim().length === 0){
        return NextResponse.json({error: "id is not valid"}, {status: 400});
    }

    const body = (await request.json());
    const parsedDish = parseUpdateDishRequest(body);

    if(!parsedDish.valid){
        return NextResponse.json({error: parsedDish.error}, {status: 400});
    }

    // PATCH call to supabase with id/info that passed validation
    const {data, error} = await supabase
        .from("dishes")
        .update(toDatabaseDish(parsedDish.data))
        .eq('id', id)
        .select()
        .single();

    // if error exists or if data is null, return error
    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json(toClientDish(data), {status: 200});
}