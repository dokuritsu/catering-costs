import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// DELETE quote by id
export async function DELETE(request: Request, context: {params: Promise<{id: string}>}){
    const {id} = await context.params;

    // Check if id is missing or blank
    if(!id || id.trim().length === 0){
        return NextResponse.json({error: "id is not valid"}, {status: 400});
    }

    // DELETE call to supabase with id that passed validation
    const {data, error} = await supabase
        .from("quotes")
        .delete()
        .eq('id', id)
        .select();

    // if error exists or if data is null, return error
    if(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }

    if(data.length === 0){
        return NextResponse.json({error: "unable to find quote via id"}, {status: 404});
    }

    return new NextResponse(null, {status: 204});
}