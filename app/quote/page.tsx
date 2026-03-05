'use client'

import { useState, useEffect } from "react";
import type {Dish} from "@/lib/types";

const STORAGE_KEY = "catering_dishes_v2";

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


    const listDishes = dishes.map(dish => 
        <li key={dish.dishName}>
            <p>
                <b>{dish.dishName}</b> {' '}
                <b>{dish.unitType}</b> {' '}
                <b>{dish.baselineCostPerUnit}</b> {' '}
            </p>
        </li>)
    const options = dishes.map(d => 
        <option value={d.dishName} key={d.dishName}>{d.dishName}</option>
    )
    
    // Additional calculations
    const selectedDish = dishes.find(d => d.dishName === selectedDishName)
    const dishCost = selectedDish ? selectedDish.baselineCostPerUnit * Number(quantity) : 0
    const laborCost = Number(laborHours) * Number(laborRate)
    const overheadCost = Number(packagingCost) + Number(deliveryCost) + Number(miscCost)
    const totalCost = laborCost + overheadCost + dishCost 
    const margin = Number(marginPct) < 100 ? Number(marginPct) / 100 : 1
    const suggestedPrice = margin < 1 ? totalCost / (1-margin) : 0
    const profit = suggestedPrice - totalCost

    // Load dishes from localStorage key "catering_dishes_v2"
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw){
            const parsed = JSON.parse(raw);
            setDishes(parsed);
            if(parsed.length > 0){
                setSelectedDishName(parsed[0].dishName);
            }
        }
    }, []);

    return (
    <>
        <h1>Quotes</h1>
        <label>
            Select a Dish: {' '}
            <select name="selectedDish" value={selectedDishName} onChange={e => setSelectedDishName(e.target.value)}>
                <option value="" disabled>Select a dish...</option>
                {options}
            </select>
        </label>
        {/* <p>
            {' '} List of dishes: <ul>{listDishes}</ul>
        </p> */}
        <p>
            Input Quantity of Dish: {' '}
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}/>
        </p>
        <label>Input Additional Costs:</label>
        <ul>
            <li>Input Labor Hours: <input type="number" value={laborHours} onChange={e => setLaborHours(e.target.value)}/></li>
            <li>Input Labor Rate: <input type="number" value={laborRate} onChange={e => setLaborRate(e.target.value)}/></li>
            <li>Input Packaging Cost: <input type="number" value={packagingCost} onChange={e => setPackagingCost(e.target.value)}/></li>
            <li>Input Delivery Cost: <input type="number" value={deliveryCost} onChange={e => setDeliveryCost(e.target.value)}/></li>
            <li>Input Misc Cost: <input type="number" value={miscCost} onChange={e => setMiscCost(e.target.value)}/></li>
            <li>Input Margin Pct: <input type="number" value={marginPct} onChange={e => setMarginPct(e.target.value)}/></li>
        </ul>
        
        <div>
            <h1>Totals</h1>
            <ul>
                <li>Selected DishName: {selectedDishName} {' '}</li>
                <li>Baseline Cost Per Unit: {selectedDish ? selectedDish.baselineCostPerUnit : "-"}</li>
                <li>Quantity: {quantity}</li>
                <li>Dish Cost: {dishCost}</li>
                <li>Labor Cost: {selectedDish ? laborCost : "-"}</li>
                <li>Overhead Cost: {selectedDish ? overheadCost : "-"}</li>
                <li>Total Cost: {selectedDish ? totalCost : "-"}</li>
                <li>Suggested Price: {selectedDish ? suggestedPrice : "-"}</li>
                <li>Profit: {selectedDish ? profit : "-"}</li>
            </ul>
        </div>
    </>
    );
};