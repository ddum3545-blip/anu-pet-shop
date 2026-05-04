-- Seed script for ANU Pet Shop
-- Run this in your Supabase SQL Editor

-- Insert sample pets
INSERT INTO pets (name, breed, price, discount, availability, image_url) VALUES
('Golden Retriever Puppy', 'Dog', 45000, 10, true, 'https://via.placeholder.com/400x500?text=Golden+Retriever'),
('Persian Kitten (Pure White)', 'Cat', 55000, 15, true, 'https://via.placeholder.com/400x500?text=Persian+Kitten'),
('Siberian Husky', 'Dog', 65000, 5, true, 'https://via.placeholder.com/400x500?text=Siberian+Husky'),
('Beagle', 'Dog', 35000, 0, true, 'https://via.placeholder.com/400x500?text=Beagle'),
('Hamster (Dwarf)', 'Hamster', 2500, 0, true, 'https://via.placeholder.com/400x500?text=Dwarf+Hamster'),
('Cockatiel Bird', 'Exotic Birds', 12000, 8, true, 'https://via.placeholder.com/400x500?text=Cockatiel'),
('British Shorthair', 'Cat', 70000, 12, true, 'https://via.placeholder.com/400x500?text=British+Shorthair'),
('Guinea Pig (Abyssinian)', 'Guinea Pig', 3500, 0, true, 'https://via.placeholder.com/400x500?text=Abyssinian+Guinea+Pig');

-- Insert sample pet food
INSERT INTO pet_food (name, breed, price, discount, availability, image_url) VALUES
('Royal Canin (Adult Dog)', 'Dog Food', 1200, 5, true, 'https://via.placeholder.com/400x500?text=Royal+Canin'),
('Whiskas (Kitten)', 'Cat Food', 850, 10, true, 'https://via.placeholder.com/400x500?text=Whiskas'),
('Drools (Focus)', 'Dog Food', 950, 0, true, 'https://via.placeholder.com/400x500?text=Drools'),
('Orijen (Premium)', 'Dog Food', 2800, 8, true, 'https://via.placeholder.com/400x500?text=Orijen'),
('Farmina N&D', 'Cat Food', 1600, 12, true, 'https://via.placeholder.com/400x500?text=Farmina+N&D'),
('Pedigree (Adult)', 'Dog Food', 750, 0, true, 'https://via.placeholder.com/400x500?text=Pedigree'),
('Sheba (Premium Cat)', 'Cat Food', 1100, 7, true, 'https://via.placeholder.com/400x500?text=Sheba'),
('Taste of the Wild', 'Dog Food', 2200, 5, true, 'https://via.placeholder.com/400x500?text=Taste+of+the+Wild');
