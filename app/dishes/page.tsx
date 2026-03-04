'use client'

import { useState } from 'react';

export default function Dishes(){
    
    const [dishName, setDishName] = useState("");
    const [unitType, setUnitType] = useState("plate");
    const [baselineCostPerUnit, setbaselineCostPerUnit] = useState("");
    const [dishes, setDishes] = useState([]);
    const listDishes = dishes.map(dish => 
    <li key={dish.dishName}>
        <p>
            <b>{dish.dishName}</b> {' '}
            <b>{dish.unitType}</b> {' '}
            <b>{dish.baselineCostPerUnit}</b> {' '}
        </p>
    </li>)

    function handleClick(){
        const costNum = Number(baselineCostPerUnit);
        if(costNum > 0 && dishName.trim() !== ""){
            const newDish = {dishName: dishName, unitType: unitType, baselineCostPerUnit: costNum};
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
                <select value={unitType} onChange={e => setUnitType(e.target.value)}>
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