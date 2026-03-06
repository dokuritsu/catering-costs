'use client'

import { useState, useEffect } from "react";
import type {Dish} from "@/lib/types";

const STORAGE_KEY = "catering_dishes_v3";

export default function Quote(){
    // State variables
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedDishName, setSelectedDishName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [laborHours, setLaborHours] = useState("0");
    const [laborRate, setLaborRate] = useState("20");
    const [packagingCost, setPackagingCost] = useState("0");
    const [deliveryCost, setDeliveryCost] = useState("0");
    const [miscCost, setMiscCost] = useState("0");
    const [marginPct, setMarginPct] = useState("30");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [grocerySpend, setGrocerySpend] = useState("");
    const [miles, setMiles] = useState("10");
    const [ratePerMile, setRatePerMile] = useState("0.65");

    // Simplify
    const options = dishes.map(d => 
        <option value={d.dishName} key={d.dishName}>{d.dishName}</option>
    )
    const qtyNum = Number(quantity)
    
    // Additional calculations
    const selectedDish = dishes.find(d => d.dishName === selectedDishName)
    const estimatedDishCost = selectedDish ? selectedDish.baselineCostPerUnit * qtyNum : 0
    const laborCost = Number(laborHours) * Number(laborRate)
    const overheadCost = Number(packagingCost) + Number(deliveryCost) + Number(miscCost)
    const actualFoodCost = Number(grocerySpend)
    const foodCostUsed = actualFoodCost > 0 ? actualFoodCost : estimatedDishCost
    const vehicleCost = Number(miles) * Number(ratePerMile)
    const totalCost = laborCost + overheadCost + foodCostUsed + vehicleCost
    const margin = Number(marginPct) < 100 ? Number(marginPct) / 100 : 1
    const suggestedPrice = margin < 1 ? totalCost / (1-margin) : 0
    const suggestedPricePerUnit = qtyNum > 0 ? suggestedPrice/qtyNum : 0
    const revenue = Number(pricePerUnit) * qtyNum
    const profit = revenue - totalCost

    // Load dishes from localStorage key "catering_dishes_v2"
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw){
            const parsed = JSON.parse(raw) as Dish[];
            setDishes(parsed);
            if(parsed.length > 0){
                setSelectedDishName(parsed[0].dishName);
            }
        }
    }, []);

    return (
    <>
        <h1 className="text-3xl font-bold">Quotes</h1>
        <h2 className="text-2xl font-bold">Order Basics</h2>
        <div className="mt-6">
            <p>
                <label>
                    Select a Dish: {' '}
                    <select name="selectedDish" value={selectedDishName} onChange={e => setSelectedDishName(e.target.value)}>
                        <option value="" disabled>Select a dish...</option>
                        {options}
                    </select>
                </label>
            </p>
            <ul className="list-disc ml-6 space-y-1">
                <li >Input Quantity of Dish: <input className="border rounded px-2 py-1 ml-2" type="number" value={quantity} onChange={e => setQuantity(e.target.value)}/></li>
                <li>Input Price per Plate: <input className="border rounded px-2 py-1 ml-2" type="number" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)}/></li>
                <li>Input Grocery Spend for Entire Order: <input className="border rounded px-2 py-1 ml-2" type="number" value={grocerySpend} onChange={e => setGrocerySpend(e.target.value)}/></li>
                <li>Input Target Profit Margin: <input className="border rounded px-2 py-1 ml-2" type="number" value={marginPct} onChange={e => setMarginPct(e.target.value)}/></li>
                <i>30% margin means 30% of the price is profit</i>
            </ul>
        </div>
        <div className="mt-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <ul className="list-disc ml-6 space-y-1">
                <li>Revenue: ${revenue.toFixed(2)}</li>
                <li>Food Cost Total: ${foodCostUsed.toFixed(2)}</li>
                <li>Food Cost per Plate: {qtyNum > 0 ? `$${(foodCostUsed/qtyNum).toFixed(2)}` : "-"}</li>
                <li>Profit per Plate: {qtyNum > 0 ? `$${(profit/qtyNum).toFixed(2)}` : "-"}</li>
            </ul>
        </div>
        <div className="mt-6">
            <h2 className="text-2xl font-bold">Extra Costs</h2>
            <ul className="list-disc ml-6 space-y-1">
                <li>Input Labor Hours: <input className="border rounded px-2 py-1 ml-2" type="number" value={laborHours} onChange={e => setLaborHours(e.target.value)}/></li>
                <li>Input Labor Rate: <input className="border rounded px-2 py-1 ml-2" type="number" value={laborRate} onChange={e => setLaborRate(e.target.value)}/></li>
                <li>Input Packaging Cost: <input className="border rounded px-2 py-1 ml-2" type="number" value={packagingCost} onChange={e => setPackagingCost(e.target.value)}/></li>
                <li>Input Miles Traveled: <input className="border rounded px-2 py-1 ml-2" type="number" value={miles} onChange={e => setMiles(e.target.value)}/></li>
                <li>Input Rate per Mile Traveled: <input className="border rounded px-2 py-1 ml-2" type="number" value={ratePerMile} onChange={e => setRatePerMile(e.target.value)}/></li>
                <li>Input Misc Cost: <input className="border rounded px-2 py-1 ml-2" type="number" value={miscCost} onChange={e => setMiscCost(e.target.value)}/></li>
                <li>Input Delivery Cost: <input className="border rounded px-2 py-1 ml-2" type="number" value={deliveryCost} onChange={e => setDeliveryCost(e.target.value)}/></li>
            </ul>
        </div>
        <div className="mt-6">
            <h2 className="text-2xl font-bold">Totals</h2>
            <ul className="list-disc ml-6 space-y-1">
                <li>Total Cost: ${totalCost.toFixed(2)}</li>
                <li>Profit: ${profit.toFixed(2)}</li>
                <li>Suggested Price Per Unit: ${suggestedPricePerUnit.toFixed(2)}</li>
            </ul>
        </div>
    </>
    );
};