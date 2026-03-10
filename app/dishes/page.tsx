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

    const [editingDishId, setEditingDishId] = useState<string | null>(null);
    const [editingDishName, setEditingDishName] = useState("");
    const [editingUnitType, setEditingUnitType] = useState<UnitType>("plate");
    const [editingBaselineCost, setEditingBaselineCost] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw){
            const parsed = JSON.parse(raw);
            const clean = parsed.filter(d => d != null);
            const migrated = clean.map(d => {
                if(!d.id){
                   d.id = crypto.randomUUID(); 
                }
                return d;
            }) as Dish[];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            console.log("loaded dishes", migrated);
            console.log("dish ids:", migrated.map(d => d.id))
            setDishes(migrated);
            
        }
        setLoaded(true);
    }, []);
    
    useEffect(() => {
        if(!loaded){
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes))
    }, [dishes, loaded]);

    

    function handleAddDish(){
        const costNum = Number(baselineCostPerUnit);
        if(costNum > 0 && dishName.trim() !== ""){
            const newDish = {id: crypto.randomUUID(), dishName: dishName.trim(), unitType: unitType, baselineCostPerUnit: costNum};
            setDishes(prev => [...prev, newDish]);
            setDishName("");
            setbaselineCostPerUnit("");
        }
    }

    function handleClearAllDishes(){
        if(confirm("Are you sure you want to remove all dishes?")){
           setDishes([]); 
           localStorage.removeItem(STORAGE_KEY); 
        };
    }

    function handleDeleteDish(id: string){
        setDishes(prev => {
            const filtered = prev.filter(d => d.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return filtered;
        })
    }

    function handleEditDish(id: string){
        const dish = dishes.find(d => d.id == id) as Dish; 
        
        setEditingDishId(dish.id);
        setEditingDishName(dish.dishName);
        setEditingUnitType(dish.unitType);
        setEditingBaselineCost(String(dish.baselineCostPerUnit));
    }

    function handleSaveDish(id: string){
        if(editingDishName.trim() != "" && Number(editingBaselineCost) > 0){
            const updatedDish = {id: id, dishName: editingDishName, unitType: editingUnitType, baselineCostPerUnit: Number(editingBaselineCost)} as Dish;
            setDishes(prev => prev.map(d => d.id === id ? updatedDish : d));
            setEditingDishId(null);
        }
    }

    function handleCancelDishEdit(){
        setEditingDishId(null);
    }

    function DishRow({dish}: {dish: Dish}){
        const isEditing = dish.id === editingDishId;
        return(
            
            <tr className="hover:bg-gray-800/40">
                <td className='px-3 py-2 border-b border-white-700'>{isEditing ? <input className='px-2 py-1 text-sm w-32' autoFocus value={editingDishName} onChange={e => setEditingDishName(e.target.value)}></input> : dish.dishName}</td>
                <td className='px-3 py-2 border-b border-white-700'>{isEditing ? <select  className='px-2 py-1 text-sm w-24' autoFocus value={editingUnitType} onChange={e => setEditingUnitType(e.target.value as UnitType)}>
                    <option value="tray">Tray</option>
                    <option value="plate">Plate</option></select> : dish.unitType}</td>
                <td className='px-3 py-2 border-b border-white-700'>{isEditing ? <input className='px-2 py-1 text-sm w-24' type='number' autoFocus value={editingBaselineCost} onChange={e => setEditingBaselineCost(e.target.value)}></input> : dish.baselineCostPerUnit}</td>
                <td className='px-3 py-2 border-b border-white-700'>
                    {isEditing ? 
                        <>
                            <button type='button' className="border rounded px-3 py-2 font-semibold" onClick={() => { handleSaveDish(dish.id); } }>Save</button>
                            <button type='button' className="border rounded px-3 py-2 font-semibold" onClick={handleCancelDishEdit}>Cancel</button>
                        </> : 
                        <>
                            <button type='button' className="border rounded px-3 py-2 font-semibold" onClick={() => { handleEditDish(dish.id); } }>Edit</button>
                            <button type='button' className="border rounded px-3 py-2 font-semibold" onClick={() => { handleDeleteDish(dish.id); } }>Delete</button>
                        </>
                    }
                </td>
            </tr>
        );
    }

    function DisplayDishTable({dishes}: {dishes: Dish[]}){
        const rows = dishes.map(dish =>
            <DishRow 
                dish={dish}
                key={dish.id}/>
        )

        return (
            <table className='mt-4 border w-full md:w-2/3 lg:w-1/2 border-white-600 rounded-md'>
                <thead>
                    <tr>
                        <th className='px-3 py-2 text-left border-b border-white-600 font-semibold'>DishName</th>
                        <th className='px-3 py-2 text-left border-b border-white-600 font-semibold'>Unit Type</th>
                        <th className='px-3 py-2 text-left border-b border-white-600 font-semibold'>Baseline Cost per Type</th>
                        <th className='px-3 py-2 text-left border-b border-white-600 font-semibold'>Action</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
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
            <button className="mt-4 border rounded px-3 py-2 font-semibold" onClick={handleAddDish}>
                Add Dish
            </button>
        </div>
        <div className="mt-6 overflow-hidden">
            <h1 className="mt-3 text-2xl font-bold">List of Dishes:</h1>
            <DisplayDishTable dishes={dishes}/>
        </div>
        <div className="mt-6">
            <button className="mt-4 border rounded px-3 py-2 font-semibold" onClick={handleClearAllDishes}>Clear All Dishes</button>
        </div>
    </>
)
};