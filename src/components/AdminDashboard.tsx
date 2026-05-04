"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";

const AdminDashboard = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [petFood, setPetFood] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for adding new items
  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    price: 0,
    discount: 0,
    variations: "[]",
    availability: true,
    image_url: "",
  });
  const [newPetFood, setNewPetFood] = useState({
    name: "",
    breed: "",
    price: 0,
    discount: 0,
    variations: "[]",
    availability: true,
    image_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsRes, petFoodRes] = await Promise.all([
        supabase.from("pets").select("*"),
        supabase.from("pet_food").select("*"),
      ]);
      
      if (petsRes.error) throw petsRes.error;
      if (petFoodRes.error) throw petFoodRes.error;

      setPets(petsRes.data || []);
      setPetFood(petFoodRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("pets").insert([{
        ...newPet,
        price: Number(newPet.price),
        discount: Number(newPet.discount),
        variations: JSON.parse(newPet.variations),
      }]);
      if (error) throw error;
      alert("Pet added successfully!");
      setNewPet({ name: "", breed: "", price: 0, discount: 0, variations: "[]", availability: true, image_url: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Error adding pet. Please try again.");
    }
  };

  const handleAddPetFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("pet_food").insert([{
        ...newPetFood,
        price: Number(newPetFood.price),
        discount: Number(newPetFood.discount),
        variations: JSON.parse(newPetFood.variations),
      }]);
      if (error) throw error;
      alert("Pet food added successfully!");
      setNewPetFood({ name: "", breed: "", price: 0, discount: 0, variations: "[]", availability: true, image_url: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding pet food:", error);
      alert("Error adding pet food. Please try again.");
    }
  };

  const handleUpdatePet = async (id: string, updates: any) => {
    try {
      const { error } = await supabase.from("pets").update(updates).eq("id", id);
      if (error) throw error;
      alert("Pet updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error updating pet:", error);
      alert("Error updating pet. Please try again.");
    }
  };

  const handleUpdatePetFood = async (id: string, updates: any) => {
    try {
      const { error } = await supabase.from("pet_food").update(updates).eq("id", id);
      if (error) throw error;
      alert("Pet food updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error updating pet food:", error);
      alert("Error updating pet food. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black text-gold mb-12">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Pets Section */}
        <section>
          <h2 className="text-2xl font-bold text-gold mb-8">Add New Pet</h2>
          <form onSubmit={handleAddPet} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-gold/20">
            <input
              type="text"
              placeholder="Name"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="text"
              placeholder="Breed"
              value={newPet.breed}
              onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="number"
              placeholder="Price"
              value={newPet.price}
              onChange={(e) => setNewPet({ ...newPet, price: Number(e.target.value) })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={newPet.discount}
              onChange={(e) => setNewPet({ ...newPet, discount: Number(e.target.value) })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newPet.image_url}
              onChange={(e) => setNewPet({ ...newPet, image_url: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPet.availability}
                onChange={(e) => setNewPet({ ...newPet, availability: e.target.checked })}
              />
              <span>Available</span>
            </label>
            <button type="submit" className="w-full py-3 bg-gold text-black font-bold rounded-xl hover:bg-gold/80 transition-all">
              Add Pet
            </button>
          </form>

          <h3 className="text-xl font-bold text-gold mt-12 mb-6">Current Pets</h3>
          <div className="space-y-4">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white/5 p-4 rounded-xl border border-gold/20">
                <h4 className="font-bold text-gold">{pet.name}</h4>
                <p className="text-sm opacity-70">{pet.breed}</p>
                <p className="text-sm">Price: ₹{pet.price}</p>
                <button
                  onClick={() => handleUpdatePet(pet.id, { availability: !pet.availability })}
                  className="mt-2 text-xs text-gold hover:underline"
                >
                  Toggle Availability
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Pet Food Section */}
        <section>
          <h2 className="text-2xl font-bold text-gold mb-8">Add New Pet Food</h2>
          <form onSubmit={handleAddPetFood} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-gold/20">
            <input
              type="text"
              placeholder="Name"
              value={newPetFood.name}
              onChange={(e) => setNewPetFood({ ...newPetFood, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="text"
              placeholder="Breed/Category"
              value={newPetFood.breed}
              onChange={(e) => setNewPetFood({ ...newPetFood, breed: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="number"
              placeholder="Price"
              value={newPetFood.price}
              onChange={(e) => setNewPetFood({ ...newPetFood, price: Number(e.target.value) })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={newPetFood.discount}
              onChange={(e) => setNewPetFood({ ...newPetFood, discount: Number(e.target.value) })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newPetFood.image_url}
              onChange={(e) => setNewPetFood({ ...newPetFood, image_url: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-gold/20 text-white"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPetFood.availability}
                onChange={(e) => setNewPetFood({ ...newPetFood, availability: e.target.checked })}
              />
              <span>Available</span>
            </label>
            <button type="submit" className="w-full py-3 bg-gold text-black font-bold rounded-xl hover:bg-gold/80 transition-all">
              Add Pet Food
            </button>
          </form>

          <h3 className="text-xl font-bold text-gold mt-12 mb-6">Current Pet Food</h3>
          <div className="space-y-4">
            {petFood.map((food) => (
              <div key={food.id} className="bg-white/5 p-4 rounded-xl border border-gold/20">
                <h4 className="font-bold text-gold">{food.name}</h4>
                <p className="text-sm opacity-70">{food.breed}</p>
                <p className="text-sm">Price: ₹{food.price}</p>
                <button
                  onClick={() => handleUpdatePetFood(food.id, { availability: !food.availability })}
                  className="mt-2 text-xs text-gold hover:underline"
                >
                  Toggle Availability
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
