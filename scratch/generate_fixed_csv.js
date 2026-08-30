/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const headers = [
  "Title",
  "URL handle",
  "Description",
  "Vendor",
  "Product category",
  "Type",
  "Tags",
  "Published on online store",
  "Status",
  "SKU",
  "Barcode",
  "Option1 name",
  "Option1 value",
  "Option1 Linked To",
  "Option2 name",
  "Option2 value",
  "Option2 Linked To",
  "Option3 name",
  "Option3 value",
  "Option3 Linked To",
  "Price",
  "Compare-at price",
  "Cost per item",
  "Charge tax",
  "Tax code",
  "Unit price total measure",
  "Unit price total measure unit",
  "Unit price base measure",
  "Unit price base measure unit",
  "Inventory tracker",
  "Inventory quantity",
  "Continue selling when out of stock",
  "Weight value (grams)",
  "Weight unit for display",
  "Requires shipping",
  "Fulfillment service",
  "Product image URL",
  "Image position",
  "Image alt text",
  "Variant image URL",
  "Gift card",
  "SEO title",
  "SEO description"
];

function createRow(overrides = {}) {
  const rowObj = {
    "Title": "",
    "URL handle": "",
    "Description": "",
    "Vendor": "Lace & Love",
    "Product category": "Apparel & Accessories > Clothing > Underwear & Socks",
    "Type": "",
    "Tags": "",
    "Published on online store": "TRUE",
    "Status": "Active",
    "SKU": "",
    "Barcode": "",
    "Option1 name": "",
    "Option1 value": "",
    "Option1 Linked To": "",
    "Option2 name": "",
    "Option2 value": "",
    "Option2 Linked To": "",
    "Option3 name": "",
    "Option3 value": "",
    "Option3 Linked To": "",
    "Price": "",
    "Compare-at price": "",
    "Cost per item": "",
    "Charge tax": "TRUE",
    "Tax code": "",
    "Unit price total measure": "",
    "Unit price total measure unit": "",
    "Unit price base measure": "",
    "Unit price base measure unit": "",
    "Inventory tracker": "shopify",
    "Inventory quantity": "50",
    "Continue selling when out of stock": "DENY",
    "Weight value (grams)": "150",
    "Weight unit for display": "g",
    "Requires shipping": "TRUE",
    "Fulfillment service": "manual",
    "Product image URL": "",
    "Image position": "",
    "Image alt text": "",
    "Variant image URL": "",
    "Gift card": "FALSE",
    "SEO title": "",
    "SEO description": "",
    ...overrides
  };

  return headers.map(h => {
    let val = rowObj[h] || "";
    if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes(">")) {
      val = `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }).join(",");
}

const rows = [];
rows.push(headers.join(","));

// Product 1: Delicate Lace Underwire Bra
rows.push(createRow({
  "Title": "Delicate Lace Underwire Bra",
  "URL handle": "delicate-lace-underwire-bra",
  "Description": "<p>Handcrafted delicate floral lace bra with soft underwire support and adjustable silk straps.</p>",
  "Product category": "Apparel & Accessories > Clothing > Underwear & Socks > Bras",
  "Type": "Tshirt Bra",
  "Tags": "Tshirt Bra, Bras, Lace, Intimates",
  "Option1 name": "Size",
  "Option1 value": "S",
  "Option2 name": "Color",
  "Option2 value": "Black Silk",
  "SKU": "BRA-LACE-SBK",
  "Price": "48.00",
  "Compare-at price": "65.00",
  "Cost per item": "18.00",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Delicate Lace Bra",
  "SEO title": "Delicate Lace Underwire Bra",
  "SEO description": "Luxury floral lace bra"
}));
rows.push(createRow({
  "URL handle": "delicate-lace-underwire-bra",
  "Option1 name": "Size",
  "Option1 value": "M",
  "Option2 name": "Color",
  "Option2 value": "Black Silk",
  "SKU": "BRA-LACE-MBK",
  "Price": "48.00",
  "Compare-at price": "65.00",
  "Cost per item": "18.00"
}));
rows.push(createRow({
  "URL handle": "delicate-lace-underwire-bra",
  "Option1 name": "Size",
  "Option1 value": "L",
  "Option2 name": "Color",
  "Option2 value": "Black Silk",
  "SKU": "BRA-LACE-LBK",
  "Price": "48.00",
  "Compare-at price": "65.00",
  "Cost per item": "18.00"
}));

// Product 2: Sports Comfort Seamless Bra
rows.push(createRow({
  "Title": "Sports Comfort Seamless Bra",
  "URL handle": "sports-comfort-seamless-bra",
  "Description": "<p>Ultra-flexible breathable sports bra designed for active comfort and medium support.</p>",
  "Product category": "Apparel & Accessories > Clothing > Underwear & Socks > Bras",
  "Type": "Sports Bra",
  "Tags": "Sports Bra, Bras, Activewear",
  "Option1 name": "Size",
  "Option1 value": "S",
  "Option2 name": "Color",
  "Option2 value": "Rose Pink",
  "SKU": "BRA-SPRT-SRP",
  "Price": "38.00",
  "Compare-at price": "50.00",
  "Cost per item": "14.00",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Sports Comfort Seamless Bra",
  "SEO title": "Sports Comfort Seamless Bra",
  "SEO description": "Active breathable sports bra"
}));
rows.push(createRow({
  "URL handle": "sports-comfort-seamless-bra",
  "Option1 name": "Size",
  "Option1 value": "M",
  "Option2 name": "Color",
  "Option2 value": "Rose Pink",
  "SKU": "BRA-SPRT-MRP",
  "Price": "38.00",
  "Compare-at price": "50.00",
  "Cost per item": "14.00"
}));

// Product 3: Silk Camisole Bralette
rows.push(createRow({
  "Title": "Silk Camisole Bralette",
  "URL handle": "silk-camisole-bralette",
  "Description": "<p>Delicate silk-touch camisole bralette with adjustable straps and soft lace edging.</p>",
  "Product category": "Apparel & Accessories > Clothing > Underwear & Socks > Bras",
  "Type": "Camisole",
  "Tags": "Camisole, Bras, Silk",
  "Option1 name": "Size",
  "Option1 value": "S",
  "Option2 name": "Color",
  "Option2 value": "Cream Nude",
  "SKU": "BRA-CAMI-SCN",
  "Price": "42.00",
  "Compare-at price": "55.00",
  "Cost per item": "16.00",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Silk Camisole Bralette",
  "SEO title": "Silk Camisole Bralette",
  "SEO description": "Silk camisole bralette"
}));

// Product 4: Bikini Cotton Stretch Panties
rows.push(createRow({
  "Title": "Bikini Cotton Stretch Panties",
  "URL handle": "bikini-cotton-stretch-panties",
  "Description": "<p>Ultra-soft organic cotton stretch bikini brief with elastic waistband.</p>",
  "Product category": "Apparel & Accessories > Clothing > Underwear & Socks > Underwear",
  "Type": "Bikini",
  "Tags": "Bikini, Panties, Cotton",
  "Option1 name": "Size",
  "Option1 value": "S",
  "Option2 name": "Color",
  "Option2 value": "Black",
  "SKU": "PNT-BIK-SBK",
  "Price": "18.00",
  "Compare-at price": "24.00",
  "Cost per item": "6.00",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Bikini Cotton Stretch Panties",
  "SEO title": "Bikini Cotton Stretch Panties",
  "SEO description": "Organic cotton stretch bikini"
}));
rows.push(createRow({
  "URL handle": "bikini-cotton-stretch-panties",
  "Option1 name": "Size",
  "Option1 value": "M",
  "Option2 name": "Color",
  "Option2 value": "Black",
  "SKU": "PNT-BIK-MBK",
  "Price": "18.00",
  "Compare-at price": "24.00",
  "Cost per item": "6.00"
}));

// Product 5: Hipster Lace Accent Brief
rows.push(createRow({
  "Title": "Hipster Lace Accent Brief",
  "URL handle": "hipster-lace-accent-brief",
  "Description": "<p>Mid-rise hipster brief with intricate lace side panels and comfortable full coverage.</p>",
  "Product category": "Apparel & Accessories > Clothing > Underwear & Socks > Underwear",
  "Type": "Hipster",
  "Tags": "Hipster, Panties, Lace",
  "Option1 name": "Size",
  "Option1 value": "S",
  "Option2 name": "Color",
  "Option2 value": "Rose Pink",
  "SKU": "PNT-HIP-SRP",
  "Price": "22.00",
  "Compare-at price": "28.00",
  "Cost per item": "8.00",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Hipster Lace Accent Brief",
  "SEO title": "Hipster Lace Accent Brief",
  "SEO description": "Mid-rise hipster lace brief"
}));

// Product 6: Contour High Waist Brief
rows.push(createRow({
  "Title": "Contour High Waist Brief",
  "URL handle": "contour-high-waist-brief",
  "Description": "<p>Targeted high-waist tummy control brief that smoothes contours effortlessly.</p>",
  "Product category": "Apparel & Accessories > Clothing > Underwear & Socks > Shapewear",
  "Type": "High Waist Brief",
  "Tags": "High Waist Brief, Panties, Shapewear",
  "Option1 name": "Size",
  "Option1 value": "M",
  "Option2 name": "Color",
  "Option2 value": "Black",
  "SKU": "SHP-HW-MBK",
  "Price": "42.00",
  "Compare-at price": "55.00",
  "Cost per item": "15.00",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Contour High Waist Brief",
  "SEO title": "Contour High Waist Brief",
  "SEO description": "Targeted tummy control brief"
}));

// Product 7: Physical Product The Band T-Shirt
rows.push(createRow({
  "Title": "Physical Product “The Band” T-Shirt",
  "URL handle": "physical-product-the-band-t-shirt",
  "Description": "<p>Celebrate the timeless legacy of rock music with our exclusive The Band Graphic T-Shirt.</p>",
  "Vendor": "Harmony Threads",
  "Product category": "Apparel & Accessories > Clothing > Clothing Tops > T-Shirts",
  "Type": "Graphic shirt",
  "Tags": "Unisex, Clothing, Men, Women, Casual, Vintage",
  "Option1 name": "Size",
  "Option1 value": "Small",
  "Option2 name": "Color",
  "Option2 value": "green",
  "SKU": "TheBandTShirt-SG",
  "Price": "19.99",
  "Compare-at price": "24.99",
  "Cost per item": "11.00",
  "Barcode": "5784397765",
  "Weight value (grams)": "150",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "Green t-shirt with The Band graphic",
  "SEO title": "Vintage The Band Graphic T-Shirt",
  "SEO description": "Iconic Rock Music Tribute Tee"
}));
rows.push(createRow({
  "URL handle": "physical-product-the-band-t-shirt",
  "Option1 name": "Size",
  "Option1 value": "Small",
  "Option2 name": "Color",
  "Option2 value": "gray",
  "SKU": "TheBandTShirt-SA",
  "Price": "19.99",
  "Compare-at price": "24.99",
  "Cost per item": "11.00",
  "Barcode": "5784397766",
  "Weight value (grams)": "150"
}));

// Product 8: Digital Product The History of Rock Music
rows.push(createRow({
  "Title": "Digital Product The History of Rock Music",
  "URL handle": "digital-product-the-history-of-rock-music",
  "Description": "<p>Dive into the electrifying world of rock music with 'The History of Rock Music: From Roots to Revolution.'</p>",
  "Vendor": "Harmony Publishing",
  "Product category": "Media > Books > E-Books",
  "Type": "Digital book",
  "Tags": "Rock Music, Music History, eBook",
  "Option1 name": "Format",
  "Option1 value": "PDF",
  "SKU": "HRM-EBK-PDF",
  "Price": "14.99",
  "Compare-at price": "19.99",
  "Cost per item": "4.00",
  "Barcode": "978-1-98765-432-1",
  "Requires shipping": "FALSE",
  "Continue selling when out of stock": "CONTINUE",
  "Product image URL": "https://burst.shopifycdn.com/photos/forest-hiker.jpg?width=1000",
  "Image position": "1",
  "Image alt text": "The History of Rock Music",
  "SEO title": "The History of Rock Music eBook",
  "SEO description": "Explore the evolution of rock music with our eBook"
}));

// Product 9: Example Perfume
rows.push(createRow({
  "Title": "Example Perfume",
  "URL handle": "example-perfume",
  "Description": "<p>A sophisticated luxury perfume with floral and amber notes.</p>",
  "Vendor": "Acme Luxury",
  "Product category": "Health & Beauty > Personal Care > Cosmetics > Perfumes & Colognes",
  "Type": "Perfume",
  "Tags": "Perfume, Luxury, Fragrance",
  "Option1 name": "Title",
  "Option1 value": "Premium",
  "SKU": "EX-PERF-MEN",
  "Price": "74.99",
  "Compare-at price": "80.00",
  "Cost per item": "25.00",
  "Weight value (grams)": "500",
  "Product image URL": "https://burst.shopifycdn.com/photos/black-glass-perfume-bottle-and-spritzer.jpg?width=500",
  "Image position": "1",
  "Image alt text": "Example Perfume",
  "SEO title": "Premium Eau De Parfum",
  "SEO description": "Our awesome luxury perfume"
}));

const csvContent = rows.join("\n");
const destPath = path.join(__dirname, '../public/shopify_demo_products.csv');
fs.writeFileSync(destPath, csvContent, 'utf8');
console.log('Fixed CSV generated at public/shopify_demo_products.csv');

/* eslint-enable no-console */
