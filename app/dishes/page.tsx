'use client'

import { useState, useEffect } from 'react';

const STORAGE_KEY = "catering_dishes_v2";

export default function Dishes(){
    
    const [dishName, setDishName] = useState("");
    const [unitType, setUnitType] = useState("plate");
    const [baselineCostPerUnit, setbaselineCostPerUnit] = useState("");
    const [dishes, setDishes] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const listDishes = dishes.map(dish => 
        <li key={dish.dishName}>
            <p>
                <b>{dish.dishName}</b> {' '}
                <b>{dish.unitType}</b> {' '}
                <b>{dish.baselineCostPerUnit}</b> {' '}
            </p>
        </li>)


    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw){
            setDishes(JSON.parse(raw));
        }
        setLoaded(true);
    }, []);
    
    useEffect(() => {
        if(!loaded){
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes))
    }, [dishes, loaded]);

    

    function handleClick(){
        const costNum = Number(baselineCostPerUnit);
        if(costNum > 0 && dishName.trim() !== ""){
            const newDish = {dishName: dishName.trim(), unitType: unitType, baselineCostPerUnit: costNum};
            setDishes(prev => [...prev, newDish]);
            setDishName("");
            setbaselineCostPerUnit("");
        }
    }
    
    function handleDishNameChange(e){
        setDishName(e.target.value);
    }

    function handleBaselineCostChange(e){
        setbaselineCostPerUnit(e.target.value);
    }

    return(
    <>
        <h1>Dishes</h1>
        <p>
            
           <label>
            Input Dish Name:{' '}
            <input
                value={dishName}
                onChange={handleDishNameChange}
            />
        </label> 
        </p>
        
        <p>
            <label>
                Select Unit Option {' '}
                <select name="selectedUnit" value={unitType} onChange={e => setUnitType(e.target.value)}>
                    <option value="tray">Tray</option>
                    <option value="plate">Plate</option>
                </select>
            </label>
        </p>
        
        <p>
            <label>
                Input Baseline Cost:{' '}
                <input
                    type="number"
                    value={baselineCostPerUnit}
                    onChange={handleBaselineCostChange}
                />
            </label>
        </p>
        <p>
            <button onClick={handleClick}>
                Add Dish
            </button>
        </p>
        
        Inputted DishName: {dishName} {' '}
        {' '} Selected Unit: {unitType}
        {' '} Inputted Cost: {baselineCostPerUnit}
        {' '} Current Dishes count: {dishes.length}
        {' '} List of dishes: <ul>{listDishes}</ul>
        
    </>
)
};