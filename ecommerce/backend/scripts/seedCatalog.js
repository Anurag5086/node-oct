/**
 * Seeds categories and 25 products with verified image URLs.
 * Run: node scripts/seedCatalog.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const mongoose = require('mongoose')
const Category = require('../models/Category')
const Product = require('../models/Product')

const CATEGORIES = [
  {
    title: 'Mobile Phones',
    description: 'Smartphones and accessories from leading brands.',
  },
  {
    title: 'Laptops & Computing',
    description: 'Laptops, tablets, and everyday computing gear.',
  },
  {
    title: 'Audio & Headphones',
    description: 'Headphones, earbuds, and portable speakers.',
  },
  {
    title: 'Fashion & Apparel',
    description: 'Clothing, footwear, and style essentials.',
  },
  {
    title: 'Home & Living',
    description: 'Furniture, decor, and kitchen essentials for modern homes.',
  },
  {
    title: 'Sports & Outdoors',
    description: 'Fitness equipment and outdoor adventure gear.',
  },
  {
    title: 'Beauty & Grooming',
    description: 'Skincare, grooming tools, and personal care favorites.',
  },
]

/** @type {Array<{ title: string, brand: string, category: string, description: string, mrpPrice: number, sellingPrice: number, stockQty: number, rating: number, noOfReviews: number, images: string[] }>} */
const PRODUCT_CATALOG = [
  {
    title: 'Nova Pulse Pro 5G',
    brand: 'Nova Mobile',
    category: 'Mobile Phones',
    description:
      '6.7-inch AMOLED display, 128GB storage, 50MP triple camera, and all-day 5000mAh battery for smooth everyday use.',
    mrpPrice: 34999,
    sellingPrice: 28999,
    stockQty: 42,
    rating: 4.6,
    noOfReviews: 318,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
  },
  {
    title: 'Skyline Edge Smartphone',
    brand: 'Skyline',
    category: 'Mobile Phones',
    description:
      'Slim 5G phone with fast charging, in-display fingerprint sensor, and crisp 120Hz refresh rate display.',
    mrpPrice: 27999,
    sellingPrice: 22499,
    stockQty: 35,
    rating: 4.4,
    noOfReviews: 204,
    images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'],
  },
  {
    title: 'PixelView Android Phone',
    brand: 'PixelView',
    category: 'Mobile Phones',
    description:
      'Pure Android experience with excellent low-light photography and guaranteed security updates.',
    mrpPrice: 49999,
    sellingPrice: 44999,
    stockQty: 18,
    rating: 4.7,
    noOfReviews: 412,
    images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80'],
  },
  {
    title: 'Orbit Mini Smartphone',
    brand: 'Orbit',
    category: 'Mobile Phones',
    description: 'Compact flagship with premium glass build, stereo speakers, and IP68 water resistance.',
    mrpPrice: 59999,
    sellingPrice: 52999,
    stockQty: 12,
    rating: 4.8,
    noOfReviews: 891,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
  },
  {
    title: 'AeroBook Air M3 Laptop',
    brand: 'AeroBook',
    category: 'Laptops & Computing',
    description:
      'Ultra-light 13-inch laptop with 16GB RAM, 512GB SSD, and 18-hour battery for work on the go.',
    mrpPrice: 114999,
    sellingPrice: 104999,
    stockQty: 14,
    rating: 4.9,
    noOfReviews: 567,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
  },
  {
    title: 'ProStation X15 Laptop',
    brand: 'ProStation',
    category: 'Laptops & Computing',
    description:
      '15-inch creator laptop with color-accurate display, dedicated graphics, and dual-fan cooling.',
    mrpPrice: 89999,
    sellingPrice: 79999,
    stockQty: 21,
    rating: 4.5,
    noOfReviews: 143,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
  },
  {
    title: 'FlexTab 11 Tablet',
    brand: 'FlexTab',
    category: 'Laptops & Computing',
    description:
      '11-inch tablet with stylus support, quad speakers, and split-screen multitasking for students.',
    mrpPrice: 32999,
    sellingPrice: 27999,
    stockQty: 29,
    rating: 4.3,
    noOfReviews: 98,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
  },
  {
    title: 'SwiftType Wireless Keyboard',
    brand: 'SwiftType',
    category: 'Laptops & Computing',
    description: 'Low-profile mechanical feel, multi-device Bluetooth pairing, and backlit keys.',
    mrpPrice: 4999,
    sellingPrice: 3499,
    stockQty: 80,
    rating: 4.2,
    noOfReviews: 76,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
  },
  {
    title: 'SilentWave ANC Headphones',
    brand: 'SilentWave',
    category: 'Audio & Headphones',
    description:
      'Over-ear active noise cancellation, 40-hour battery, and rich bass for travel and focus.',
    mrpPrice: 12999,
    sellingPrice: 9999,
    stockQty: 55,
    rating: 4.6,
    noOfReviews: 1204,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
  },
  {
    title: 'BudsAir Pro Earbuds',
    brand: 'BudsAir',
    category: 'Audio & Headphones',
    description: 'True wireless earbuds with transparency mode, wireless charging case, and IPX5 sweat resistance.',
    mrpPrice: 8999,
    sellingPrice: 6499,
    stockQty: 120,
    rating: 4.4,
    noOfReviews: 2301,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
  },
  {
    title: 'PulseBeat Portable Speaker',
    brand: 'PulseBeat',
    category: 'Audio & Headphones',
    description: '360° sound, 12-hour playtime, and rugged waterproof body for pool parties and hikes.',
    mrpPrice: 6999,
    sellingPrice: 4999,
    stockQty: 67,
    rating: 4.5,
    noOfReviews: 445,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
  },
  {
    title: 'StudioMic USB Condenser Mic',
    brand: 'StudioMic',
    category: 'Audio & Headphones',
    description: 'Plug-and-play mic for podcasts and streaming with cardioid pickup and mute button.',
    mrpPrice: 5499,
    sellingPrice: 4299,
    stockQty: 38,
    rating: 4.3,
    noOfReviews: 189,
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80'],
  },
  {
    title: 'Velocity Run Sneakers',
    brand: 'Velocity',
    category: 'Fashion & Apparel',
    description: 'Lightweight mesh upper, responsive foam midsole, and durable rubber outsole for daily runs.',
    mrpPrice: 5999,
    sellingPrice: 4499,
    stockQty: 95,
    rating: 4.5,
    noOfReviews: 678,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
  },
  {
    title: 'UrbanLeather Crossbody Bag',
    brand: 'UrbanLeather',
    category: 'Fashion & Apparel',
    description: 'Full-grain leather bag with adjustable strap, inner zip pocket, and magnetic closure.',
    mrpPrice: 4499,
    sellingPrice: 3299,
    stockQty: 44,
    rating: 4.6,
    noOfReviews: 212,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
  },
  {
    title: 'Classic Denim Trucker Jacket',
    brand: 'BlueRoute',
    category: 'Fashion & Apparel',
    description: 'Medium-wash denim with button front, chest pockets, and soft brushed lining.',
    mrpPrice: 3999,
    sellingPrice: 2799,
    stockQty: 60,
    rating: 4.4,
    noOfReviews: 156,
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80'],
  },
  {
    title: 'Polarized Aviator Sunglasses',
    brand: 'SunCraft',
    category: 'Fashion & Apparel',
    description: 'UV400 polarized lenses, metal frame, and included hard case for travel.',
    mrpPrice: 2499,
    sellingPrice: 1799,
    stockQty: 110,
    rating: 4.2,
    noOfReviews: 89,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'],
  },
  {
    title: 'BrewMaster Drip Coffee Maker',
    brand: 'BrewMaster',
    category: 'Home & Living',
    description: 'Programmable timer, reusable filter, and thermal carafe that keeps coffee hot for hours.',
    mrpPrice: 6999,
    sellingPrice: 5499,
    stockQty: 33,
    rating: 4.5,
    noOfReviews: 267,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80'],
  },
  {
    title: 'ArcDesk LED Table Lamp',
    brand: 'ArcDesk',
    category: 'Home & Living',
    description: 'Adjustable color temperature, touch dimmer, and USB charging port built into the base.',
    mrpPrice: 2999,
    sellingPrice: 2199,
    stockQty: 72,
    rating: 4.4,
    noOfReviews: 134,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
  },
  {
    title: 'CloudSoft Memory Foam Pillow Set',
    brand: 'CloudSoft',
    category: 'Home & Living',
    description: 'Set of two breathable pillows with hypoallergenic cover and neck-support contour.',
    mrpPrice: 3499,
    sellingPrice: 2499,
    stockQty: 48,
    rating: 4.3,
    noOfReviews: 521,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
  },
  {
    title: 'Ceramic Nonstick Cookware Set',
    brand: 'ChefLine',
    category: 'Home & Living',
    description: 'Five-piece induction-safe set with scratch-resistant coating and stay-cool handles.',
    mrpPrice: 8999,
    sellingPrice: 6999,
    stockQty: 26,
    rating: 4.6,
    noOfReviews: 302,
    images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'],
  },
  {
    title: 'FlexFit Yoga Mat Pro',
    brand: 'FlexFit',
    category: 'Sports & Outdoors',
    description: '6mm thick mat with non-slip texture, alignment marks, and carrying strap included.',
    mrpPrice: 2499,
    sellingPrice: 1799,
    stockQty: 88,
    rating: 4.7,
    noOfReviews: 943,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'],
  },
  {
    title: 'IronGrip Adjustable Dumbbells',
    brand: 'IronGrip',
    category: 'Sports & Outdoors',
    description: 'Pair of 5–25 kg adjustable dumbbells with quick-lock plates for home workouts.',
    mrpPrice: 14999,
    sellingPrice: 12499,
    stockQty: 19,
    rating: 4.5,
    noOfReviews: 177,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'],
  },
  {
    title: 'TrailPeak 40L Hiking Backpack',
    brand: 'TrailPeak',
    category: 'Sports & Outdoors',
    description: 'Ventilated back panel, rain cover, hydration sleeve, and multiple gear loops.',
    mrpPrice: 5499,
    sellingPrice: 4299,
    stockQty: 41,
    rating: 4.6,
    noOfReviews: 388,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
  },
  {
    title: 'AquaSip Insulated Water Bottle',
    brand: 'AquaSip',
    category: 'Sports & Outdoors',
    description: 'Double-wall stainless steel keeps drinks cold 24h or hot 12h; leak-proof sport cap.',
    mrpPrice: 1999,
    sellingPrice: 1299,
    stockQty: 150,
    rating: 4.4,
    noOfReviews: 612,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'],
  },
  {
    title: 'GlowSkin Vitamin C Serum',
    brand: 'GlowSkin',
    category: 'Beauty & Grooming',
    description: 'Brightening serum with hyaluronic acid; dermatologist tested for daily morning use.',
    mrpPrice: 1799,
    sellingPrice: 1299,
    stockQty: 200,
    rating: 4.5,
    noOfReviews: 1450,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'],
  },
  {
    title: 'PrecisionEdge Electric Trimmer',
    brand: 'PrecisionEdge',
    category: 'Beauty & Grooming',
    description: 'Cordless trimmer with multiple guards, washable heads, and 90-minute runtime.',
    mrpPrice: 3499,
    sellingPrice: 2599,
    stockQty: 64,
    rating: 4.3,
    noOfReviews: 233,
    images: ['https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80'],
  },
  {
    title: 'VelvetAura Eau de Parfum',
    brand: 'VelvetAura',
    category: 'Beauty & Grooming',
    description: 'Long-lasting floral woody fragrance in a 50ml glass bottle with gift-ready packaging.',
    mrpPrice: 4999,
    sellingPrice: 3799,
    stockQty: 37,
    rating: 4.6,
    noOfReviews: 501,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'],
  },
  {
    title: 'ChronoLink Smartwatch Series 5',
    brand: 'ChronoLink',
    category: 'Mobile Phones',
    description: 'AMOLED display, heart-rate tracking, GPS, and 7-day battery in a premium metal case.',
    mrpPrice: 15999,
    sellingPrice: 11999,
    stockQty: 53,
    rating: 4.4,
    noOfReviews: 876,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
  },
  {
    title: 'ErgoGlide Wireless Mouse',
    brand: 'ErgoGlide',
    category: 'Laptops & Computing',
    description: 'Ergonomic vertical mouse with silent clicks and multi-device Bluetooth switching.',
    mrpPrice: 2999,
    sellingPrice: 2199,
    stockQty: 91,
    rating: 4.2,
    noOfReviews: 145,
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80'],
  },
  {
    title: 'Organic Cotton Crew Tee 3-Pack',
    brand: 'EarthThread',
    category: 'Fashion & Apparel',
    description: 'Soft breathable tees in neutral tones; pre-shrunk fabric and reinforced neckline.',
    mrpPrice: 2199,
    sellingPrice: 1599,
    stockQty: 130,
    rating: 4.3,
    noOfReviews: 324,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
  },
]

async function imageUrlIsValid(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { Range: 'bytes=0-1024' },
    })
    if (!response.ok && response.status !== 206) {
      return false
    }
    const contentType = response.headers.get('content-type') || ''
    return contentType.includes('image')
  } catch {
    return false
  }
}

async function ensureCategory(title, description) {
  let category = await Category.findOne({ title })
  if (!category) {
    category = await Category.create({ title, description, isActive: true })
    console.log(`Created category: ${title}`)
  }
  return category
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set')
    process.exit(1)
  }

  await mongoose.connect(uri)

  const categoryByTitle = {}
  for (const cat of CATEGORIES) {
    const doc = await ensureCategory(cat.title, cat.description)
    categoryByTitle[cat.title] = doc
  }

  let inserted = 0
  let skippedExisting = 0
  let skippedNoImage = 0
  const target = 25

  for (const item of PRODUCT_CATALOG) {
    if (inserted >= target) break

    const exists = await Product.findOne({ title: item.title })
    if (exists) {
      skippedExisting += 1
      continue
    }

    const imageOk = await imageUrlIsValid(item.images[0])
    if (!imageOk) {
      console.warn(`Skipped (bad image): ${item.title}`)
      skippedNoImage += 1
      continue
    }

    const category = categoryByTitle[item.category]
    if (!category) {
      console.warn(`Skipped (unknown category): ${item.title}`)
      continue
    }

    await Product.create({
      title: item.title,
      description: item.description,
      mrpPrice: item.mrpPrice,
      sellingPrice: item.sellingPrice,
      images: item.images,
      categoryId: category._id,
      stockQty: item.stockQty,
      rating: item.rating,
      noOfReviews: item.noOfReviews,
      brand: item.brand,
      isActive: true,
    })

    inserted += 1
    console.log(`Added (${inserted}/${target}): ${item.title}`)
  }

  const total = await Product.countDocuments()
  console.log('\nDone.')
  console.log(`New products inserted: ${inserted}`)
  console.log(`Skipped (already existed): ${skippedExisting}`)
  console.log(`Skipped (image failed): ${skippedNoImage}`)
  console.log(`Total products in database: ${total}`)

  if (inserted < target) {
    console.warn(`Warning: only inserted ${inserted} of ${target} requested products.`)
    process.exitCode = 1
  }

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
