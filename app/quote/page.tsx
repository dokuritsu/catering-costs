'use client'

import { useState, useEffect} from "react";
import type {Dish, Quote} from "@/lib/types";

const STORAGE_KEY = "catering_dishes_v3";
const QUOTES_KEY = "catering_quotes_v1";

export default function Quote(){
    // State variables
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedDishId, setSelectedDishId] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [marginPct, setMarginPct] = useState("30");
    const [laborHours, setLaborHours] = useState("0");
    const [laborRate, setLaborRate] = useState("18");
    const [ratePerMile, setRatePerMile] = useState("0.67");
    const [miles, setMiles] = useState("0");
    const [packagingCost, setPackagingCost] = useState("1.25");
    const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);

    // Simplify
    console.log(dishes.map(d=> d.id));
    const options = dishes.map(d => 
        <option value={d.id} key={d.id}>{d.dishName}</option>
    )
    const qtyNum = Number(quantity)
    
    // Additional calculations
    const selectedDish = dishes.find(d => d.id === selectedDishId)
    const totalPackagingCost = Number(packagingCost) * Number(quantity);
    const totalLaborCost = Number(laborHours) * Number(laborRate);
    const totalDeliveryCost = Number(miles) * Number(ratePerMile);
    const totalCost = selectedDish ? (selectedDish.baselineCostPerUnit * qtyNum) + totalPackagingCost + totalLaborCost + totalDeliveryCost : 0
    const margin = Number(marginPct) < 100 ? Number(marginPct) / 100 : 1
    const suggestedPrice = margin < 1 ? totalCost / (1-margin) : 0
    const suggestedPricePerUnit = qtyNum > 0 ? suggestedPrice/qtyNum : 0
    const profit = suggestedPrice - totalCost

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
        const baselineCostSnapshot = selectedDish?.baselineCostPerUnit ?? 0;
        if(qtyNum > 0 && baselineCostSnapshot > 0){
            const quoteId = crypto.randomUUID();
            // Create new Quote
            const newQuote = {
                id: quoteId, 
                dishId: selectedDishId ?? "",
                savedAt: new Date().toISOString(), 
                dishNameSnapshot: selectedDish?.dishName ?? "", 
                quantity: qtyNum,
                marginPct: Number(marginPct), 
                baselineCostSnapshot: baselineCostSnapshot,
                laborHours: Number(laborHours),
                laborRate: Number(laborRate),
                ratePerMile: Number(ratePerMile),
                miles: Number(miles),
                packagingCost: Number(packagingCost)
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
        setSelectedDishId(quote.dishId ?? "");
        setQuantity(String(quote.quantity));
        setMarginPct(String(quote.marginPct));
        setLaborHours(String(quote.laborHours));
        setLaborRate(String(quote.laborRate));
        setRatePerMile(String(quote.ratePerMile));
        setMiles(String(quote.miles));
        setPackagingCost(String(quote.packagingCost));
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
                    <li>Input Target Profit Margin: <input className="border rounded px-2 py-1 ml-2" type="number" value={marginPct} onChange={e => setMarginPct(e.target.value)}/></li>
                    <i>30% margin means 30% of the price is profit</i>
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
                </ul>
            </div>
             <div className="mt-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <ul className="list-disc ml-6 space-y-1">
                    <li>Total Cost: ${totalCost.toFixed(2)}</li>
                    <li>Suggessted Price: ${suggestedPrice.toFixed(2)}</li>
                    <li>Suggested Price Per Unit: ${suggestedPricePerUnit.toFixed(2)}</li>
                    <li>Profit: ${profit.toFixed(2)}</li>
                    <li>Profit per Plate: {qtyNum > 0 ? `$${(profit/qtyNum).toFixed(2)}` : "-"}</li>
                </ul>
            </div>
            <div className="mt-6">
                <button className="mt-4 border rounded px-3 py-2 font-semibold" onClick={handleSaveQuote}><b>Save Quote</b></button>
                <h1 className="mt-3 text-2xl font-bold">Recently Saved Quotes</h1>
                {savedQuotes.map(quotes =>
                    <div className="mt-6" key={quotes.id}>
                        <h3 className="font-bold">{quotes.dishNameSnapshot}{' '}
                            <button className="mt-4 border rounded px-2 py-1 font-semibold" onClick={() => {handleLoadQuote(quotes)}}>Load</button>
                            <button className="mt-4 border rounded px-2 py-1 font-semibold" onClick={() => {handleDeleteQuote(quotes.id)}}>Delete</button>
                        </h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Saved Date: {new Date(quotes.savedAt).toLocaleString()}</li>
                            <li>Plate Quantity: {quotes.quantity}</li>
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