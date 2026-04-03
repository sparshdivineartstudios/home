import resinClock from "@/assets/product-resin-clock.jpg";
import candleJar from "@/assets/product-candle-jar.jpg";
import concretePlanter from "@/assets/product-concrete-planter.jpg";
import resinHero from "@/assets/resin-hero.jpg";
import pillarCandles from "@/assets/product-pillar-candles.jpg";
import concreteBookend from "@/assets/product-concrete-bookend.jpg";

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  images: string[];
  description: string;
  material: string;
  size: string;
  color: string;
  inStock: boolean;
  driveFolderId?: string;
  drivePhotos?: import("@/services/productsService").DrivePhoto[];
  createdAt?: string;
  updatedAt?: string;
}

export const allProducts: Product[] = [
  {
    _id: "1",
    name: "Resin Geode Wall Clock",
    category: "Resin Art",
    price: "₹2,499",
    priceNum: 2499,
    images: [resinClock, resinHero],
    description: "A stunning geode-inspired wall clock handcrafted with premium resin, featuring deep ocean blues and gold leaf accents. Each piece is unique with natural crystal formations that catch the light beautifully. Perfect as a statement piece for your living room or office.",
    material: "Epoxy Resin",
    size: "12 inches",
    color: "Blue & Gold",
    inStock: true,
  },
  {
    _id: "2",
    name: "Soy Wax Scented Candle",
    category: "Wax Candles",
    price: "₹899",
    priceNum: 899,
    images: [candleJar, pillarCandles],
    description: "Hand-poured soy wax candle infused with calming lavender and vanilla essential oils. Burns clean for 40+ hours with a warm, gentle glow. Packaged in a reusable amber glass jar with a wooden lid.",
    material: "Soy Wax",
    size: "Medium (250g)",
    color: "Ivory",
    inStock: true,
  },
  {
    _id: "3",
    name: "Geometric Concrete Planter",
    category: "Concrete Decor",
    price: "₹1,299",
    priceNum: 1299,
    images: [concretePlanter, concreteBookend],
    description: "Minimalist geometric planter handcrafted from premium concrete with a smooth finish. Features subtle gold-leaf detailing along the edges. Includes a drainage hole and cork pad for surface protection. Ideal for succulents and small indoor plants.",
    material: "Concrete",
    size: "5 x 5 inches",
    color: "Grey & Gold",
    inStock: true,
  },
  {
    _id: "4",
    name: "Gold Marble Resin Bowl",
    category: "Resin Art",
    price: "₹1,899",
    priceNum: 1899,
    images: [resinHero, resinClock],
    description: "An elegant serving bowl crafted with swirling marble resin in white and gold tones. Food-safe coating makes it perfect for serving fruits, snacks, or as a decorative centrepiece. Each bowl has a unique marble pattern.",
    material: "Epoxy Resin",
    size: "8 inches",
    color: "White & Gold",
    inStock: true,
  },
  {
    _id: "5",
    name: "Pillar Candle Set",
    category: "Wax Candles",
    price: "₹1,499",
    priceNum: 1499,
    images: [pillarCandles, candleJar],
    description: "Set of 3 hand-poured pillar candles in varying heights. Made from pure beeswax with a natural honey scent. Elegant ribbed texture adds a touch of sophistication to any space. Perfect for dining tables and mantels.",
    material: "Beeswax",
    size: "Set of 3",
    color: "Natural Honey",
    inStock: true,
  },
  {
    _id: "6",
    name: "Kintsugi Concrete Bookends",
    category: "Concrete Decor",
    price: "₹1,799",
    priceNum: 1799,
    images: [concreteBookend, concretePlanter],
    description: "Pair of concrete bookends inspired by the Japanese art of Kintsugi. Filled cracks are highlighted with real gold paint, celebrating imperfection as beauty. Heavy enough to hold a full shelf of books. A stunning functional art piece.",
    material: "Concrete",
    size: "6 x 4 inches (pair)",
    color: "Grey & Gold",
    inStock: true,
  },
];

export const categories = ["All", "Art Decor", "Candles", "Concrete Decor"];
export const materials = ["All", "Epoxy Resin", "Soy Wax", "Beeswax", "Concrete"];
export const sizes = ["All", "Small", "Medium", "Large"];
export const colors = ["All", "Blue & Gold", "White & Gold", "Grey & Gold", "Ivory", "Natural Honey"];
export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
];
