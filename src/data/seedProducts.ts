import { Product } from '../types/domain';

const i = (name: string) => `https://placehold.co/600x400/1f2937/ffffff?text=${encodeURIComponent(name)}`;

export const seedProducts: Product[] = [
  { id: 'l1', name: 'Acer Predator Helios 300', imageUrl: i('Acer Predator Helios 300'), description: 'Powerful gaming laptop with Intel Core i7, NVIDIA RTX 4060, 16GB RAM, and 512GB SSD.', price: 1400, category: 'Gaming', brand: 'Acer' },
  { id: 'l2', name: 'MSI Katana 15', imageUrl: i('MSI Katana 15'), description: 'Affordable gaming powerhouse with Intel Core i7, RTX 4050, 16GB RAM, and 1TB SSD.', price: 1099, category: 'Gaming', brand: 'MSI' },
  { id: 'l3', name: 'ASUS ROG Strix G15', imageUrl: i('ASUS ROG Strix G15'), description: 'High-performance gaming laptop with Ryzen 7 and RTX 4060.', price: 1299, category: 'Gaming', brand: 'ASUS' },
  { id: 'l4', name: 'HP OMEN 16', imageUrl: i('HP OMEN 16'), description: 'Versatile gaming laptop with Intel Core i7 and RTX 4060.', price: 1399, category: 'Gaming', brand: 'HP' },
  { id: 'l5', name: 'Lenovo Legion 5', imageUrl: i('Lenovo Legion 5'), description: 'Gaming laptop with Ryzen 7, RTX 4060, and 1TB SSD.', price: 1350, category: 'Gaming', brand: 'Lenovo' },
  { id: 'l6', name: 'Razer Blade 15', imageUrl: i('Razer Blade 15'), description: 'Premium gaming laptop with Intel Core i7-13800H and RTX 4070.', price: 2199, category: 'Gaming', brand: 'Razer' },
  { id: 'l7', name: 'MacBook Air M2 (13-inch)', imageUrl: i('MacBook Air M2 13'), description: 'Apple M2 chip, 8GB unified memory, 256GB SSD.', price: 1199, category: 'MacBooks', brand: 'Apple' },
  { id: 'l8', name: 'MacBook Air M2 (15-inch)', imageUrl: i('MacBook Air M2 15'), description: 'Larger MacBook Air with M2 chip and 15.3-inch display.', price: 1299, category: 'MacBooks', brand: 'Apple' },
  { id: 'l9', name: 'MacBook Pro M2 (13-inch)', imageUrl: i('MacBook Pro M2 13'), description: 'Compact professional laptop with M2 chip and active cooling.', price: 1299, category: 'MacBooks', brand: 'Apple' },
  { id: 'l10', name: 'MacBook Pro M3 (14-inch)', imageUrl: i('MacBook Pro M3 14'), description: 'M3 Pro chip with 18GB memory and 512GB SSD.', price: 1599, category: 'MacBooks', brand: 'Apple' },
  { id: 'l11', name: 'MacBook Pro M3 (16-inch)', imageUrl: i('MacBook Pro M3 16'), description: 'Large-screen MacBook Pro with M3 Pro for advanced workflows.', price: 2499, category: 'MacBooks', brand: 'Apple' },
  { id: 'l12', name: 'MacBook Pro M3 Max (16-inch)', imageUrl: i('MacBook Pro M3 Max 16'), description: 'Ultimate MacBook with M3 Max, 36GB memory, and 1TB SSD.', price: 3499, category: 'MacBooks', brand: 'Apple' },
  { id: 'l13', name: 'Google Pixelbook Go', imageUrl: i('Google Pixelbook Go'), description: 'Premium Chromebook with Intel Core m3 and exceptional battery life.', price: 649, category: 'Chromebooks', brand: 'Google' },
  { id: 'l14', name: 'ASUS Chromebook Flip C434', imageUrl: i('ASUS Chromebook Flip C434'), description: '2-in-1 Chromebook with 360-degree hinge.', price: 569, category: 'Chromebooks', brand: 'ASUS' },
  { id: 'l15', name: 'HP Chromebook x360 14', imageUrl: i('HP Chromebook x360 14'), description: 'Affordable 2-in-1 Chromebook with durable design.', price: 499, category: 'Chromebooks', brand: 'HP' },
  { id: 'l16', name: 'Lenovo Chromebook Duet 5', imageUrl: i('Lenovo Chromebook Duet 5'), description: 'Detachable Chromebook tablet with keyboard support.', price: 429, category: 'Chromebooks', brand: 'Lenovo' },
  { id: 'l17', name: 'Acer Chromebook Spin 713', imageUrl: i('Acer Chromebook Spin 713'), description: 'High-performance Chromebook with Intel Core i5 and premium build.', price: 729, category: 'Chromebooks', brand: 'Acer' },
  { id: 'l18', name: 'Lenovo ThinkPad E14', imageUrl: i('Lenovo ThinkPad E14'), description: 'Reliable business laptop with excellent keyboard.', price: 749, category: 'Office', brand: 'Lenovo' },
  { id: 'l19', name: 'Dell Inspiron 15 3000', imageUrl: i('Dell Inspiron 15 3000'), description: 'Budget-friendly office laptop with compact design.', price: 549, category: 'Office', brand: 'Dell' },
  { id: 'l20', name: 'HP Pavilion 14', imageUrl: i('HP Pavilion 14'), description: 'Stylish productivity laptop with 12GB RAM and 512GB SSD.', price: 699, category: 'Office', brand: 'HP' },
  { id: 'l21', name: 'ASUS VivoBook 15', imageUrl: i('ASUS VivoBook 15'), description: 'Modern office laptop with Ryzen 5 and lightweight design.', price: 629, category: 'Office', brand: 'ASUS' },
  { id: 'l22', name: 'Acer Aspire 5', imageUrl: i('Acer Aspire 5'), description: 'Versatile office laptop with backlit keyboard and HD webcam.', price: 579, category: 'Office', brand: 'Acer' },
  { id: 'l23', name: 'Dell Precision 5570', imageUrl: i('Dell Precision 5570'), description: 'Professional workstation for CAD and engineering.', price: 2899, category: 'Workstation', brand: 'Dell' },
  { id: 'l24', name: 'HP ZBook Fury 15 G9', imageUrl: i('HP ZBook Fury 15 G9'), description: 'Mobile workstation with Core i9, RTX A5500, and 64GB RAM.', price: 3199, category: 'Workstation', brand: 'HP' },
  { id: 'l25', name: 'Lenovo ThinkPad P1 Gen 5', imageUrl: i('Lenovo ThinkPad P1 Gen 5'), description: 'Premium portable workstation with RTX A3000.', price: 2749, category: 'Workstation', brand: 'Lenovo' },
  { id: 'l26', name: 'MSI WS66 11UMT', imageUrl: i('MSI WS66 11UMT'), description: 'Creator-focused workstation with color-accurate display.', price: 2599, category: 'Workstation', brand: 'MSI' },
  { id: 'l27', name: 'ASUS ProArt StudioBook 16', imageUrl: i('ASUS ProArt StudioBook 16'), description: 'Creative workstation with Ryzen 9 and RTX 4070.', price: 2399, category: 'Workstation', brand: 'ASUS' },
];

export const allCategories = ['All', 'Gaming', 'Office', 'Workstation', 'Chromebooks', 'MacBooks'] as const;
