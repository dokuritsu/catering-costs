import { Quote, QuoteRow } from "../types";

export function toClientQuote(row: QuoteRow): Quote{
    return {
        id: row.id,
        dishId: row.dish_id,
        savedAt: row.saved_at,
        dishNameSnapshot: row.dish_name_snapshot,
        quantity: row.quantity,
        marginPct: row.margin_pct,
        baselineCostSnapshot: row.baseline_cost_snapshot,
        laborHours: row.labor_hours,
        laborRate: row.labor_rate,
        ratePerMile: row.rate_per_mile,
        miles: row.miles,
        packagingCost: row.packaging_cost
    };
}