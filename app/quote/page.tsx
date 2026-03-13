'use client'

import { useState, useEffect} from "react";
import type {Dish, Quote} from "@/lib/types";

const STORAGE_KEY = "catering_dishes_v3";
const QUOTES_KEY = "catering_quotes_v1";

export default function Quote(){
    // State variables
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedDishId, setSelectedDishId] = useState("");
    // const [selectedDishName, setSelectedDishName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [laborHours, setLaborHours] = useState("0");
    const [laborRate, setLaborRate] = useState("20");
    const [packagingCost, setPackagingCost] = useState("0");
    const [deliveryCost, setDeliveryCost] = useState("0");
    const [miscCost, setMiscCost] = useState("0");
    const [marginPct, setMarginPct] = useState("30");
    const [pricePerUnit, setPricePerUnit] = useState("0");
    const [grocerySpend, setGrocerySpend] = useState("0");
    const [miles, setMiles] = useState("10");
    const [ratePerMile, setRatePerMile] = useState("0.65");
    const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);

    // Simplify
    console.log(dishes.map(d=> d.id));
    const options = dishes.map(d => 
        <option value={d.id} key={d.id}>{d.dishName}</option>
    )
    const qtyNum = Number(quantity)
    
    // Additional calculations
    const selectedDish = dishes.find(d => d.id === selectedDishId)
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

    // Load dishes from localStorage key
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw){
            const parsed = JSON.parse(raw) as Dish[];
            setDishes(parsed);
            if(parsed.length > 0){
                setSelectedDishId(parsed[0].id);
            }
        }
    }, []);

    // Load saved quotes on page mount
    useEffect(() => {
        const raw = localStorage.getItem(QUOTES_KEY);
        if(raw){
            const parse = JSON.parse(raw) as Quote[];
            setSavedQuotes(parse);
        }
    }, []);

    function handleSaveQuote(){
        if(qtyNum > 0 && pricePerUnit.trim() !== ""){
            const quoteId = crypto.randomUUID();
            // Create new Quote
            const newQuote = {
                id: quoteId, 
                dishId: selectedDishId,
                savedAt: new Date().toISOString(), 
                dishName: selectedDish?.dishName ?? "", 
                quantity: qtyNum, 
                laborHours: Number(laborHours),
                laborRate: Number(laborRate),
                packagingCost: Number(packagingCost),
                deliveryCost: Number(deliveryCost),
                miscCost: Number(miscCost),
                marginPct: Number(marginPct), 
                pricePerUnit: Number(pricePerUnit), 
                grocerySpend: Number(grocerySpend), 
                miles: Number(miles),
                ratePerMile: Number(ratePerMile),
                totalCost: Number(totalCost), 
                revenue: Number(revenue), 
                profit: Number(profit)
            } as Quote;
            // Append to savedQuotes
            setSavedQuotes(prev => { 
                const updated = [newQuote, ...prev];
                localStorage.setItem(QUOTES_KEY, JSON.stringify(updated)); 
                return updated; 
            })
        }
    }

    function handleDeleteQuote(id: string){
        setSavedQuotes(prev => {
            const filtered = prev.filter(q => q.id !== id);
            localStorage.setItem(QUOTES_KEY, JSON.stringify(filtered));
            return filtered;
        })
    }

    function handleLoadQuote(quote: Quote){
        setSelectedDishId(quote.dishId);
        setQuantity(String(quote.quantity));
        setLaborHours(String(quote.laborHours));
        setLaborRate(String(quote.laborRate));
        setPackagingCost(String(quote.packagingCost));
        setDeliveryCost(String(quote.deliveryCost));
        setMiscCost(String(quote.miscCost));
        setMarginPct(String(quote.marginPct));
        setPricePerUnit(String(quote.pricePerUnit));
        setGrocerySpend(String(quote.grocerySpend));
        setMiles(String(quote.miles));
        setRatePerMile(String(quote.ratePerMile));
    }

    function handleClearAllQuotes(){
        if(confirm("Are you sure you want to remove all quotes?")){
           setSavedQuotes([]); 
           localStorage.removeItem(QUOTES_KEY); 
        };
    }

    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

    return (
    <>
        <div className="ml-2">
            <h1 className="text-3xl font-bold">Quotes</h1>
            <h2 className="text-2xl font-bold">Order Basics</h2>
            <div className="mt-6">
                <ul className="list-disc ml-6 space-y-1">
                    <li>
                        <label>Select a Dish:
                            <select className="border rounded px-2 py-1 ml-1" name="selectedDish" value={selectedDishId} onChange={e => setSelectedDishId(e.target.value)}>
                                <option value="" disabled>Select a dish...</option>
                                {options}
                            </select>
                        </label>
                    </li>
                    <li>Input Quantity of Dish: <input className="border rounded px-2 py-1 ml-2" type="number" value={quantity} onChange={e => setQuantity(e.target.value)}/></li>
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
                    <li>Input Value of my time ($/h): <input className="border rounded px-2 py-1 ml-2" type="number" value={laborRate} onChange={e => setLaborRate(e.target.value)}/></li>
                    <i>Used to estimate if the order is worth the time (not cash paid)</i>
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
            <div className="mt-6">
                <button className="mt-4 border rounded px-3 py-2 font-semibold" onClick={handleSaveQuote}><b>Save Quote</b></button>
                <h1 className="mt-3 text-2xl font-bold">Recently Saved Quotes</h1>
                {savedQuotes.map(quotes =>
                    <div className="mt-6" key={quotes.id}>
                        <h3 className="font-bold">{quotes.dishName}{' '}
                            <button className="mt-4 border rounded px-2 py-1 font-semibold" onClick={() => {handleLoadQuote(quotes)}}>Load</button>
                            <button className="mt-4 border rounded px-2 py-1 font-semibold" onClick={() => {handleDeleteQuote(quotes.id)}}>Delete</button>
                        </h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Saved Date: {new Date(quotes.savedAt).toLocaleString()}</li>
                            <li>Plate Quantity: {quotes.quantity}</li>
                            <li>Total Cost: ${quotes.totalCost.toFixed(2)}</li>
                            <li>Revenue: ${quotes.revenue.toFixed(2)}</li>
                            <li>Profit: ${quotes.profit.toFixed(2)}</li>
                            <li>Profit per Plate: ${(quotes.profit/quotes.quantity).toFixed(2)}</li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="mt-6">
                <button className="mt-4 border rounded px-3 py-2 font-semibold" onClick={handleClearAllQuotes}>Clear All Quotes</button>
            </div>
        </div>
        
    </>
    );
};