'use client'

import { useState, useEffect } from "react";

const STORAGE_KEY = "catering_dishes_v2";

export default function Quote(){
    // Var for dishes, specific dish, and quantity
    const [dishes, setDishes] = useState([]);
    const [selectedDishName, setSelectedDishName] = useState("");
    const [quantity, setQuantity] = useState("1");
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
    
    const selectedDish = dishes.find(d => d.dishName === selectedDishName)
    console.log("selectedDish:", selectedDish);
    const dishCost = selectedDish ? selectedDish.baselineCostPerUnit * Number(quantity) : 0

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

    function handleQuantityChange(e){
        setQuantity(e.target.value);
    }

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
        <p>
            {' '} List of dishes: <ul>{listDishes}</ul>
        </p>
        <p>
            Input Quantity of Dish: {' '}
            <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
            />
        </p>
        <ul>
            <li>Selected DishName: {selectedDishName} {' '}</li>
            <li>Baseline Cost Per Unit: {selectedDish ? selectedDish.baselineCostPerUnit : "-"}</li>
            <li>Quantity: {quantity}</li>
            <li>Dish Cost: {dishCost}</li>
        </ul>
    </>
    );
};