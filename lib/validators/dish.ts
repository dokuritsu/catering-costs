import { Errors, CreateDishRequest, UnitType, UNIT_TYPES} from "@/lib/types";

export function parseCreateDishRequest(body: unknown): {valid: true, data: CreateDishRequest} | {valid: false, error: Errors | string}{

    // Validate body is an object
    if(body === null || typeof body !== "object" || Array.isArray(body)){
        return {valid: false, error: "Invalid request body"};
    }

    const errors: Errors = {};
    let trimmedDishName = "";
    let normalizedUnitType = "";
    let cost = 0;
    if("dishName" in body){
        if(typeof body.dishName != "string"){
            errors.dishName = "dishName is not type string";
        } else {
            trimmedDishName = body.dishName.trim();
            if(trimmedDishName.length === 0){
                errors.dishName = "dishName must not be empty";
            }
        }
    } else {
        errors.dishName = "dishName is required";
    }

    if("unitType" in body){
        if(typeof body.unitType != "string"){
            errors.unitType = "unitType is not type string";
        } else {
            normalizedUnitType = body.unitType.toLowerCase();
            if(!UNIT_TYPES.includes(normalizedUnitType as UnitType)){
                errors.unitType = `unitType must be one of: ${UNIT_TYPES.join(", ")}`;
            }
        }
    } else {
        errors.unitType = "unitType is required";
    }

    if("baselineCostPerUnit" in body){
        cost = Number(body.baselineCostPerUnit);
        if(Number.isNaN(cost)){
            errors.baselineCostPerUnit = "baselineCostPerUnit is not valid number";
        } else {
            if(cost <= 0){
                errors.baselineCostPerUnit = "cost must be greater than 0";
            }
        }
    } else {
        errors.baselineCostPerUnit = "baselineCostPerUnit is required";
    }

    if(Object.keys(errors).length > 0){
        return {valid: false, error: errors};
    }

    const data = {dishName: trimmedDishName, unitType: normalizedUnitType as UnitType, baselineCostPerUnit: cost};
    return {valid: true, data};
}

export function parseUpdateDishRequest(body: unknown): {valid: true, data: Partial<CreateDishRequest>} | {valid: false, error: Errors | string} {
   
    if(body === null || typeof body !== "object" || Array.isArray(body)){
        return {valid: false, error: "Invalid request body"};
    }

    const updates: Partial<CreateDishRequest> = {}
    const errors: Errors = {};
    if("dishName" in body){
        if(typeof body.dishName != "string"){
            errors.dishName = "dishName is not type string";
        } else {
            if(body.dishName.trim().length === 0){
                errors.dishName = "dishName must not be empty";
            } else {
                updates.dishName = body.dishName.trim();
            }
        }
    }

    if("unitType" in body){
        if(typeof body.unitType != "string"){
            errors.unitType = "unitType is not type string";
        } else {
            if(!UNIT_TYPES.includes(body.unitType.toLowerCase() as UnitType)){
                errors.unitType = `unitType must be one of: ${UNIT_TYPES.join(", ")}`;
            } else {
                updates.unitType = body.unitType.toLowerCase() as UnitType;
            }
        }
    }

    if("baselineCostPerUnit" in body){
        const cost = Number(body.baselineCostPerUnit);
        if(Number.isNaN(cost)){
            errors.baselineCostPerUnit = "baselineCostPerUnit is not valid number";
        } else {
            if(cost <= 0){
                errors.baselineCostPerUnit = "cost must be greater than 0";
            } else {
                updates.baselineCostPerUnit = cost;
            }
        }
    }

    if(Object.keys(errors).length > 0){
        return {valid: false, error: errors};
    }

    if(Object.keys(updates).length === 0){
        return {valid: false, error: "No fields provided to update"}
    }

    return {valid: true, data: updates};
}