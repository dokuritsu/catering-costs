'use client'

import { useState, useEffect} from "react";
import type {Dish, Quote} from "@/lib/types";

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

    // useEffects to calling GET /api/dish to retrieve all dishes
    useEffect(() => {
        async function fetchDishes(){
            try{
                // Fetch dishes from API route
                const response = await fetch("/api/dishes");

                // Check the response status and handle errors
                if(!response.ok){
                    throw new Error(`Failed to fetch dishes: ${response.status} ${response.statusText}`);
                }

                // Parse the JSON response
                const data: Dish[] = await response.json();
                setDishes(data);
                
                // Set the first dish as selected by default if available
                if(data.length > 0){
                    setSelectedDishId(data[0].id);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchDishes();
    }, []);

    // Load saved quotes on page mount
    useEffect(() => {
        async function loadQuotes(){
            try{
                const response = await fetch("/api/quotes");

                // Check the response status
                if(!response.ok){
                    throw new Error (`Failed to fetch quotes: ${response.status} ${response.statusText}`);
                }
                
                // If successful, parse the JSON response and set to state
                const data: Quote[] = await response.json();
                setSavedQuotes(data);
            } catch (error) {
                console.log(error);
            }
        }
        loadQuotes();
    }, []);

    async function handleSaveQuote(){
        if(qtyNum > 0){
            try{
                const response = await fetch("/api/quotes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        dishId: selectedDishId ?? "",
                        quantity: qtyNum,
                        marginPct: Number(marginPct)/100,
                        laborHours: Number(laborHours),
                        laborRate: Number(laborRate),
                        ratePerMile: Number(ratePerMile),
                        miles: Number(miles),
                        packagingCost: Number(packagingCost)
                    })
                });

                if(!response.ok){
                    const errorData = await response.json().catch(() => response.text);
                    throw new Error(`Status: ${response.status}. Message: ${JSON.stringify(errorData) || errorData}`);
                }

                // If successful, parse the JSON response and add the new quote to state
                const newQuote: Quote = await response.json();
                setSavedQuotes(prev => [newQuote, ...prev]);


            } catch (error){
                console.log(error);
            }
        }
    }

    async function handleDeleteQuote(id: string){
        try{
            const response = await fetch(`/api/quotes/${id}`, {
                method: "DELETE"
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => response.text);
                throw new Error(`Status: ${response.status}. Message: ${JSON.stringify(errorData) || errorData}`);
            }

            // If successful, remove the quote from state
            setSavedQuotes(prev => prev.filter(q => q.id !== id));
        } catch (error){
            console.log(error);
        }
    }

    function handleLoadQuote(quote: Quote){
        setSelectedDishId(quote.dishId ?? "");
        setQuantity(String(quote.quantity));
        setMarginPct(String(quote.marginPct*100));
        setLaborHours(String(quote.laborHours));
        setLaborRate(String(quote.laborRate));
        setRatePerMile(String(quote.ratePerMile));
        setMiles(String(quote.miles));
        setPackagingCost(String(quote.packagingCost));
    }

    async function handleClearAllQuotes(){
        if(confirm("Are you sure you want to remove all quotes?")){
           try{
                const response = await Promise.all(savedQuotes.map(q => handleDeleteQuote(q.id)));
           } catch (error){
                console.log(error);
           }
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
                    <li>Input Miles Traveled (Round Trip): <input className="border rounded px-2 py-1 ml-2" type="number" value={miles} onChange={e => setMiles(e.target.value)}/></li>
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
                            <li>Order Profit: ${profit.toFixed(2)}</li>
                            <li>Unit Type: {selectedDish?.unitType}</li>
                            <li>Unit Quantity: {quotes.quantity}</li>
                            <li>Saved Date: {new Date(quotes.savedAt).toLocaleString()}</li>
                            
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