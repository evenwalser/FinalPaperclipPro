// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(request: Request) {
  try {
    const formData = await request.formData() as any;
    const imageUrls = formData.getAll("image");
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Ensure this is the correct model identifier
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are assisting a seller in listing an item on a marketplace. You will be provided by images and your task will be to accurately identify the item and generate texts focusing on accurately describing the item’s condition, key features, and potential appeal to buyers.
              Identify item on provided images and generate listing information for it with following fields:
              category json tree : {
  "Baby & child": {
    "Girls' clothing": [
      "Dresses",
      "Tops & blouses",
      "T-shirts",
      "Jumpers & cardigans",
      "Hoodies & sweatshirts",
      "Trousers & leggings",
      "Skirts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Boys' clothing": [
      "Tops",
      "Shirts",
      "Hoodies & sweatshirts",
      "Jumpers & cardigans",
      "Trousers",
      "Shorts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Unisex clothing": [
      "Tops & blouses",
      "T-shirts",
      "Jumpers & cardigans",
      "Hoodies & sweatshirts",
      "Trousers & leggings",
      "Skirts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Toddler girls' clothing": [
      "Dresses",
      "Tops & blouses",
      "T-shirts",
      "Jumpers & cardigans",
      "Hoodies & sweatshirts",
      "Trousers & leggings",
      "Skirts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Toddler boys' clothing": [
      "Tops",
      "Shirts",
      "Hoodies & sweatshirts",
      "Jumpers & cardigans",
      "Trousers",
      "Shorts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Baby girls' clothing": [
      "Dresses",
      "Tops & blouses",
      "T-shirts",
      "Jumpers & cardigans",
      "Hoodies & sweatshirts",
      "Trousers & leggings",
      "Skirts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Baby boys' clothing": [
      "Tops",
      "Shirts",
      "Hoodies & sweatshirts",
      "Jumpers & cardigans",
      "Trousers",
      "Shorts",
      "Coats & jackets",
      "Swimwear",
      "Accessories",
      "Shoes"
    ],
    "Baby products": [
      "Pushchairs & prams",
      "Car seats",
      "Nursery",
      "Feeding",
      "Changing",
      "Baby care",
      "Safety",
      "Pregnancy & maternity",
      "Accessories"
    ],
    "Toys & Games": [
      "Arts & crafts",
      "Dolls & soft toys",
      "Education & science",
      "Figures & playsets",
      "Boardgames"
    ]
  },
  "Women's fashion": {
    "Dresses": [
      "Mini",
      "Midi",
      "Maxi",
      "Going out",
      "Formal",
      "Casual",
      "Occasion",
      "Workwear",
      "Bodycon"
    ],
    "Tops": [
      "T-shirts",
      "Vest & camis",
      "Blouses & shirts",
      "Tank",
      "Long sleeve",
      "Bralettes",
      "Bodysuits"
    ],
    "Jumpers & Cardigans": [
      "Cardigans",
      "Ponchos & capes",
      "Jumpers",
      "Hoodies",
      "Sweatshirts",
      "Sweater vests"
    ],
    "Jeans": [
      "Flared",
      "Bootcut",
      "Skinny",
      "Straight",
      "Boyfriend",
      "Mom",
      "Other"
    ],
    "Trousers & Leggings": [
      "Leggings & jeggings",
      "Casual",
      "Cullottes",
      "Flares",
      "Joggers & sweatpants",
      "Formal"
    ],
    "Skirts": [
      "Mini",
      "Midi",
      "Maxi",
      "Denim",
      "Other"
    ],
    "Coats & Jackets": [
      "Jacket",
      "Capes & ponchos",
      "Coat",
      "Gilet"
    ],
    "Suits & Blazers": [
      "Blazer",
      "Suit"
    ],
    "Activewear": [
      "Outerwear",
      "Top",
      "Sports bra",
      "Trousers",
      "Tracksuits & sweatpants",
      "Hoodies & sweatshirts",
      "Shorts",
      "Skirts & skorts",
      "Co-ords"
    ],
    "Swimwear & Beachwear": [
      "One piece",
      "Bikini",
      "Cover-up"
    ],
    "Bags & Purses": [
      "Other",
      "Backpacks",
      "Clutch",
      "Purses & wallets",
      "Totes",
      "Makeup bags",
      "Handbags",
      "Washbags",
      "Bum bags"
    ],
    "Accessories": [
      "Belts",
      "Sunglasses",
      "Gloves",
      "Hats",
      "Hair accessories",
      "Scarves",
      "Face masks",
      "Other"
    ],
    "Jewellery & Watches": [
      "Rings",
      "Watches",
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Other"
    ],
    "Maternity": [
      "Knitwear",
      "Dresses",
      "Tops",
      "Jeans",
      "Trousers",
      "Skirts",
      "Hoodies & sweatshirts",
      "Coats & jackets",
      "Loungewear",
      "Bump bands"
    ],
    "Shoes": [
      "Boots",
      "Flats",
      "Heels",
      "Trainers",
      "Sports",
      "Slippers",
      "Sandals"
    ],
    "Lingerie & Nightwear": [
      "Bras & bralettes",
      "Briefs",
      "Robes & dressing gowns",
      "Nightwear"
    ],
    "Shorts": [
      "Denim",
      "Other"
    ],
    "Socks & Tights": [
      "Tights",
      "Socks"
    ],
    "One pieces": [
      "Jumpsuits",
      "Dungarees",
      "Playsuits"
    ]
  },
  "Men's fashion": {
    "Tops": [
      "Polo shirt",
      "Vest",
      "Rugby",
      "T-shirts"
    ],
    "Shirt": [
      "Short sleeve",
      "Long sleeve"
    ],
    "Hoodies & Sweatshirts": [
      "Sweatshirt",
      "Hoodie"
    ],
    "Jumpers & Cardigans": [
      "Cardigan",
      "Jumper",
      "Polo neck",
      "V-neck"
    ],
    "Jeans": [
      "Bootcut",
      "Slim & skinny",
      "Regular",
      "Dungarees"
    ],
    "Trousers": [
      "Chino",
      "Combat",
      "Joggers",
      "Smart"
    ],
    "Shorts": [
      "Combat",
      "Sport",
      "Denim",
      "Jersey",
      "Smart"
    ],
    "Coats & Jackets": [
      "Casual blazer",
      "Bomber",
      "Denim",
      "Leather",
      "Duffle",
      "Parka",
      "Trench",
      "Mac",
      "Gilet",
      "Wool",
      "Lightweight"
    ],
    "Suits": [
      "Suit jacket",
      "Suit trousers",
      "Tuxedo",
      "Dinner jacket",
      "Waistcoat"
    ],
    "Sportswear": [
      "Jacket",
      "Tops",
      "Joggers",
      "Shorts",
      "Tracksuit"
    ],
    "Swimwear": [
      "Swim shorts",
      "Board shorts",
      "Trunks"
    ],
    "Accessories": [
      "Belts",
      "Gloves",
      "Scarves",
      "Ties & bowties",
      "Sunglasses",
      "Hats",
      "Wallets"
    ],
    "Jewellery & Watches": [
      "Jewellery",
      "Watches"
    ],
    "Bags": [
      "Backpack",
      "Briefcase",
      "Holdall"
    ],
    "Shoes": [
      "Trainers",
      "Plimsolls",
      "Sports",
      "Brogues",
      "Boots",
      "Formal",
      "Loafers",
      "Slippers"
    ]
  },
  "Home & garden": {
    "Decor": [
      "Soft furnishings",
      "Ornaments",
      "Accessories"
    ],
    "Furniture": [
      "Bedroom",
      "Kitchen & dining",
      "Living room"
    ],
    "Garden": [
      "Gardening",
      "Furniture",
      "Outdoor accessories"
    ],
    "Appliances": [
      "Large",
      "Small",
      "Accessories"
    ],
    "Kitchen": [
      "Dining",
      "Appliances",
      "Accessories"
    ],
    "Diy": [
      "Power tools",
      "Hardware"
    ]
  },
  "Sports & fitness": {
    "Sport": [
      "Indoor equipment",
      "Outdoor equipment",
      "Accessories",
      "Sports kits"
    ],
    "Gym & Fitness": [
      "Gym equipment",
      "Studio equipment",
      "Weights",
      "Accessories"
    ],
    "Footwear": [
      "Women",
      "Men",
      "Kids"
    ],
    "Outdoors": [
      "Hiking & camping",
      "Fishing",
      "Biking",
      "Games"
    ]
  },
  "Electronics": {
    "Computers": [
      "Ipads & tablets",
      "Laptops & notebooks",
      "Printers & scanners"
    ],
    "Cameras & Photography": [
      "Digital cameras",
      "Video cameras",
      "Accessories"
    ],
    "TV & Audio": [
      "Televisions",
      "Audio & speakers",
      "Audio accessories"
    ],
    "Phones & Accessories": [
      "Mobile & smartphones",
      "Cases & protectors",
      "Accessories"
    ]
  },
  "Entertainment": {
    "Games & Consoles": [
      "Video games",
      "Games consoles",
      "Accessories"
    ],
    "Music & TV": [
      "Dvd & blu-ray",
      "Cd & vinyl",
      "Dj equipment",
      "Instruments",
      "Accessories"
    ]
  },
  "Health & beauty": {
    "Fragrance": [
      "Women",
      "Men"
    ],
    "Hair": [
      "Shampoo & conditioner",
      "Treatments",
      "Styling"
    ],
    "Skin": [
      "Body",
      "Face",
      "Bath"
    ],
    "Makeup": [
      "Face & body",
      "Nails",
      "Brushes & applications"
    ],
    "Accessories": [
      "Bags & cases",
      "Brushes & applications",
      "Mirrors"
    ]
  },
  "Books & magazines": {
    "Books": [
      "Cookbooks",
      "Fiction",
      "Non-fiction",
      "Other"
    ],
    "Textbooks": [
      "Business",
      "Natural sciences",
      "Engineering and technology",
      "Medicine",
      "Law",
      "Social sciences",
      "Sports science",
      "Media and communication",
      "Arts",
      "Hospitality and tourism",
      "Other"
    ]
  },
  "Other": {
    "Handmade": [
      "Home",
      "Wedding"
    ],
    "Vintage & Collectibles": [
      "Home",
      "Clothing & accessories",
      "Collectibles",
      "Antiques"
    ],
    "Arts & Crafts": [
      "Art supplies",
      "Party supplies",
      "Craft supplies"
    ]
  }
}

 "title" - Title Creation: Generate a captivating and specific title for the item, including the brand name if identifiable from the image, with a maximum of 50 characters. Tailor the title to make it appealing and relevant to the category.
"description" - Write an engaging and detailed description suitable for a marketplace listing, ensuring all information is accurate and verifiable. The description should be tailored to the specific category, even if it’s newly identified.
"brand" - Brand Identification: Carefully examine the image to identify and highlight any visible brand names, logos, or markings. Celebrate the brand in the description, emphasizing its reputation and value within this category.
"price_low" - Low Price: Identify the best deals or lower-end prices for similar items.
"price_avg" - Average Price: Determine the common market value for the item based on similar listings.
"price_high" - High Price: Identify the upper-end prices, especially for items that are rare, high-quality, or particularly desirable within this category.
"condition" - Assess the item’s condition with precision and choose one of following values which seems most likely (New, Like New, Very Good, Good, Fair). When not sure default to used.
"images_summary" - An array of summaries of all provided images. Focus on describing the image into smallest details, so it can be re-used in future prompts. Focus on details which might help identify items on the image. Brands, logos, serial numbers, clothing tags. Generate one summary per image.
"category_id" - Identify the most suitable category ID for the item based on the provided images. Use the category tree json object on the begining of this prompt to find the category ID and give value like "Sports & fitness > Footwear > Kids".
"weight" - Determine the approximate weight of the item as float value in kg
"length" - Determine the approximate length of the item as float value in cm
"width" - Determine the approximate width of the item as float value in cm
"height" - Determine the approximate height of the item as float value in cm
i want response in json string which i can parse`,
            },
            // Map through each image URL and create the necessary structure
            ...imageUrls.map((url: any) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ],
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
    });
    return NextResponse.json({ data: response });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
