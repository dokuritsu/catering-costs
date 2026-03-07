'use client'

import { useState, useEffect } from 'react';
import type { Dish, UnitType } from "@/lib/types";

const STORAGE_KEY = "catering_dishes_v3";

export default function Dishes(){
    
    const [dishName, setDishName] = useState("");
    const [unitType, setUnitType] = useState<UnitType>("plate");
    const [baselineCostPerUnit, setbaselineCostPerUnit] = useState("");
    const [dishes, setDishes] = useState<Dish[]>([]);
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

    return(
    <>
        <h1 className='text-3xl font-bold'>Dishes</h1>
        <div className="mt-4">
            <ul className='ml-3 space-y-4'>
                <li className="flex items-center gap-2">Input Dish Name: <input className="border rounded px-2 py-1 ml-1" value={dishName} onChange={e => setDishName(e.target.value)}/></li>
                <li className="flex items-center gap-2">Input Baseline Cost: <input className="border rounded px-2 py-1 ml-1" type="number" value={baselineCostPerUnit} onChange={e => setbaselineCostPerUnit(e.target.value)}/></li>
                <li className="flex items-center gap-2">
                    <label>Select Unit Option:
                        <select className="border rounded px-2 py-1 ml-1" name="selectedUnit" value={unitType} onChange={e => setUnitType(e.target.value as UnitType)}>
                            <option value="tray">Tray</option>
                            <option value="plate">Plate</option>
                        </select>
                    </label>
                </li>
            </ul>
            <button className="mt-4 border rounded px-3 py-2 font-semibold" onClick={handleClick}>
                Add Dish
            </button>
        </div>
        <div className="mt-6">
            <h2 className="text-2xl font-bold">List of dishes: </h2>
            <ul className="list-disc ml-6 space-y-1">{listDishes}</ul>
            
        </div>
    </>
)
};