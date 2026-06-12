import { CreateQuoteRequest, Errors } from "../types";

export function parseCreateQuoteRequest(body: unknown): {valid: true, data: CreateQuoteRequest} | {valid: false, error: Errors<CreateQuoteRequest> | string}{
    // Validate body is an object
    if(body === null || typeof body != "object" || Array.isArray(body)){
        return {valid: false, error: "Invalid request body"};
    }

    // Validate required fields and types
    const data: Partial<CreateQuoteRequest> = {};
    const errors: Errors<CreateQuoteRequest> = {};
    if("dishId" in body){
        if(typeof body.dishId != "string"){
            errors.dishId = "dishId is not type string";
        } else {
            if(body.dishId.trim().length === 0){
                errors.dishId = "dishId must not be empty";
            } else {
                data.dishId = body.dishId.trim();
            }
        }
    } else {
        errors.dishId = "dishId is required";
    }

    if("quantity" in body){
        const qty = Number(body.quantity);
        if(Number.isNaN(qty)){
            errors.quantity = "quantity is not a valid number";
        } else {
            if(qty <= 0){
                errors.quantity = "quantity must be greater than 0";
            } else {
                data.quantity = qty;
            }
        }
    } else {
        errors.quantity = "quantity is required";
    }

    if("marginPct" in body){
        const margin = Number(body.marginPct);
        if(Number.isNaN(margin)){
            errors.marginPct = "marginPct is not a valid number";
        } else {
            if(margin < 0){
                errors.marginPct = "marginPct must be greater than or equal to 0";
            } else {
                data.marginPct = margin;
            }
        }   
    } else {
        errors.marginPct = "marginPct is required";
    }

    if("laborHours" in body){
        const hours = Number(body.laborHours);
        if(Number.isNaN(hours)){
            errors.laborHours = "laborHours is not a valid number";
        } else {
            if(hours < 0){
                errors.laborHours = "laborHours must be greater than or equal to 0";
            } else {
                data.laborHours = hours;
            }
        }
    } else {
        errors.laborHours = "laborHours is required";
    }

    if("laborRate" in body){
        const rate = Number(body.laborRate);
        if(Number.isNaN(rate)){
            errors.laborRate = "laborRate is not a valid number";
        } else {
            if(rate < 0){
                errors.laborRate = "laborRate must be greater than or equal to 0";
            } else {
                data.laborRate = rate;
            }
        }
    } else {
        errors.laborRate = "laborRate is required";
    }

    if("ratePerMile" in body){
        const rate = Number(body.ratePerMile);
        if(Number.isNaN(rate)){
            errors.ratePerMile = "ratePerMile is not a valid number";
        } else {
            if(rate < 0){
                errors.ratePerMile = "ratePerMile must be greater than or equal to 0";
            } else {
                data.ratePerMile = rate;
            }
        }
    } else {
        errors.ratePerMile = "ratePerMile is required";
    }

    if("miles" in body){
        const miles = Number(body.miles);
        if(Number.isNaN(miles)){
            errors.miles = "miles is not a valid number";
        } else {
            if(miles < 0){
                errors.miles = "miles must be greater than or equal to 0";
            } else {
                data.miles = miles;
            }
        }
    } else {
        errors.miles = "miles is required";
    }

    if("packagingCost" in body){
        const cost = Number(body.packagingCost);
        if(Number.isNaN(cost)){
            errors.packagingCost = "packagingCost is not a valid number";
        } else {
            if(cost < 0){
                errors.packagingCost = "packagingCost must be greater than or equal to 0";
            } else {
                data.packagingCost = cost;
            }
        }
    } else {
        errors.packagingCost = "packagingCost is required";
    }

    // If there are validation errors, return them
    if(Object.keys(errors).length > 0){
        return {valid: false, error: errors};
    }

    return {valid: true, data: data as CreateQuoteRequest};
}