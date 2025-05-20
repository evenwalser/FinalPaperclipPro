

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid'); // Add this package for UUID generation

// Initialize Supabase client (replace with your Supabase URL and anon key)
const supabase = createClient('https://icravvnxexuvxoehhfsa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcmF2dm54ZXh1dnhvZWhoZnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MDk5ODksImV4cCI6MjA0OTE4NTk4OX0.OWC0Bg0pzt3I1EMFMDXaxTJUrCwwlPBP_NjPbmqwuTQ');


// Your JSON data (abbreviated here, use the full data from the query)
const jsonData = {
    "data": [
        {
          "id": 46,
          "parentId": null,
          "name": "Women",
          "seoname": "Women Items",
          "seourl": "cheap-women-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/women.jpg",
          "filters": null,
          "categories": [
            {
              "id": 47,
              "parentId": 46,
              "name": "Dresses",
              "seoname": "Women Dresses",
              "seourl": "cheap-women-dresses-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 48,
                  "parentId": 47,
                  "name": "Mini",
                  "seoname": "Women Mini",
                  "seourl": "cheap-women-mini-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-mini.jpg",
                  "filters": null
                },
                {
                  "id": 49,
                  "parentId": 47,
                  "name": "Midi",
                  "seoname": "Women Midi",
                  "seourl": "cheap-women-midi-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-midi.jpg",
                  "filters": null
                },
                {
                  "id": 50,
                  "parentId": 47,
                  "name": "Maxi",
                  "seoname": "Women Maxi",
                  "seourl": "cheap-women-maxi-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-maxi.jpg",
                  "filters": null
                },
                {
                  "id": 51,
                  "parentId": 47,
                  "name": "Going out",
                  "seoname": "Women Going out",
                  "seourl": "cheap-women-going-out-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-going-out.jpeg",
                  "filters": null
                },
                {
                  "id": 52,
                  "parentId": 47,
                  "name": "Formal",
                  "seoname": "Women Formal",
                  "seourl": "cheap-women-formal-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-formal.jpeg",
                  "filters": null
                },
                {
                  "id": 53,
                  "parentId": 47,
                  "name": "Casual",
                  "seoname": "Women Casual",
                  "seourl": "cheap-women-casual-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-casual.jpg",
                  "filters": null
                },
                {
                  "id": 54,
                  "parentId": 47,
                  "name": "Occasion",
                  "seoname": "Women Occasion",
                  "seourl": "cheap-women-occasion-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-occasion.jpeg",
                  "filters": null
                },
                {
                  "id": 55,
                  "parentId": 47,
                  "name": "Workwear",
                  "seoname": "Women Workwear",
                  "seourl": "cheap-women-workwear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-wedding.jpeg",
                  "filters": null
                },
                {
                  "id": 56,
                  "parentId": 47,
                  "name": "Wedding",
                  "seoname": "Women Wedding",
                  "seourl": "cheap-women-wedding-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-workwear.jpeg",
                  "filters": null
                },
                {
                  "id": 57,
                  "parentId": 47,
                  "name": "Bodycon",
                  "seoname": "Women Bodycon",
                  "seourl": "cheap-women-bodycon-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/dresses-bodycon.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 58,
              "parentId": 46,
              "name": "Tops",
              "seoname": "Women Tops",
              "seourl": "cheap-women-tops-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 59,
                  "parentId": 58,
                  "name": "T-shirts",
                  "seoname": "Women T-shirts",
                  "seourl": "cheap-women-t-shirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-t-shirts.jpg",
                  "filters": null
                },
                {
                  "id": 60,
                  "parentId": 58,
                  "name": "Vests",
                  "seoname": "Women Vests",
                  "seourl": "cheap-women-vests-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-vests.jpeg",
                  "filters": null
                },
                {
                  "id": 61,
                  "parentId": 58,
                  "name": "Shirts",
                  "seoname": "Women Shirts",
                  "seourl": "cheap-women-shirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-shirts.jpg",
                  "filters": null
                },
                {
                  "id": 62,
                  "parentId": 58,
                  "name": "Tank",
                  "seoname": "Women Tank",
                  "seourl": "cheap-women-tank-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-tank.jpg",
                  "filters": null
                },
                {
                  "id": 63,
                  "parentId": 58,
                  "name": "Long sleeve",
                  "seoname": "Women Long sleeve",
                  "seourl": "cheap-women-long-sleeve-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-long-sleeve.jpeg",
                  "filters": null
                },
                {
                  "id": 64,
                  "parentId": 58,
                  "name": "Bralettes",
                  "seoname": "Women Bralettes",
                  "seourl": "cheap-women-bralettes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-bralettes.jpeg",
                  "filters": null
                },
                {
                  "id": 65,
                  "parentId": 58,
                  "name": "Bodysuits",
                  "seoname": "Women Bodysuits",
                  "seourl": "cheap-women-bodysuits-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tops-bodysuits.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 66,
              "parentId": 46,
              "name": "Jumpers",
              "seoname": "Women Jumpers",
              "seourl": "cheap-women-jumpers-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jumpers.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 67,
                  "parentId": 66,
                  "name": "Cardigans",
                  "seoname": "Women Cardigans",
                  "seourl": "cheap-women-cardigans-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jumpers-cardigans.jpg",
                  "filters": null
                },
                {
                  "id": 68,
                  "parentId": 66,
                  "name": "Capes",
                  "seoname": "Women Capes",
                  "seourl": "cheap-women-capes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jumpers-capes.jpg",
                  "filters": null
                },
                {
                  "id": 69,
                  "parentId": 66,
                  "name": "Hoodies",
                  "seoname": "Women Hoodies",
                  "seourl": "cheap-women-hoodies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jumpers-hoodies.jpeg",
                  "filters": null
                },
                {
                  "id": 70,
                  "parentId": 66,
                  "name": "Sweatshirts",
                  "seoname": "Women Sweatshirts",
                  "seourl": "cheap-women-sweatshirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jumpers-sweatshirts.jpeg",
                  "filters": null
                },
                {
                  "id": 71,
                  "parentId": 66,
                  "name": "Vests",
                  "seoname": "Women Vests",
                  "seourl": "cheap-women-vests-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jumpers-vests.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 72,
              "parentId": 46,
              "name": "Jeans",
              "seoname": "Women Jeans",
              "seourl": "cheap-women-jeans-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 73,
                  "parentId": 72,
                  "name": "Flared",
                  "seoname": "Women Flared",
                  "seourl": "cheap-women-flared-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-flared.jpg",
                  "filters": null
                },
                {
                  "id": 74,
                  "parentId": 72,
                  "name": "Bootcut",
                  "seoname": "Women Bootcut",
                  "seourl": "cheap-women-bootcut-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-bootcut.jpeg",
                  "filters": null
                },
                {
                  "id": 75,
                  "parentId": 72,
                  "name": "Cropped",
                  "seoname": "Women Cropped",
                  "seourl": "cheap-women-cropped-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-cropped.jpg",
                  "filters": null
                },
                {
                  "id": 76,
                  "parentId": 72,
                  "name": "Skinny",
                  "seoname": "Women Skinny",
                  "seourl": "cheap-women-skinny-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-skinny.jpeg",
                  "filters": null
                },
                {
                  "id": 77,
                  "parentId": 72,
                  "name": "Straight",
                  "seoname": "Women Straight",
                  "seourl": "cheap-women-straight-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-straight.jpg",
                  "filters": null
                },
                {
                  "id": 78,
                  "parentId": 72,
                  "name": "High Waist",
                  "seoname": "Women High Waist",
                  "seourl": "cheap-women-high-waist-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-high-waist.jpg",
                  "filters": null
                },
                {
                  "id": 79,
                  "parentId": 72,
                  "name": "Boyfriend",
                  "seoname": "Women Boyfriend",
                  "seourl": "cheap-women-boyfriend-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-boyfriend.jpg",
                  "filters": null
                },
                {
                  "id": 80,
                  "parentId": 72,
                  "name": "Mom",
                  "seoname": "Women Mom",
                  "seourl": "cheap-women-mom-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-mom.jpeg",
                  "filters": null
                },
                {
                  "id": 81,
                  "parentId": 72,
                  "name": "Ripped",
                  "seoname": "Women Ripped",
                  "seourl": "cheap-women-ripped-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-ripped.jpeg",
                  "filters": null
                },
                {
                  "id": 82,
                  "parentId": 72,
                  "name": "Other",
                  "seoname": "Women Other",
                  "seourl": "cheap-women-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jeans-other.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 83,
              "parentId": 46,
              "name": "Trousers",
              "seoname": "Women Trousers",
              "seourl": "cheap-women-trousers-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 84,
                  "parentId": 83,
                  "name": "Leggings",
                  "seoname": "Women Leggings",
                  "seourl": "cheap-women-leggings-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-leggings.jpeg",
                  "filters": null
                },
                {
                  "id": 85,
                  "parentId": 83,
                  "name": "Casual",
                  "seoname": "Women Casual",
                  "seourl": "cheap-women-casual-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-casual.jpeg",
                  "filters": null
                },
                {
                  "id": 86,
                  "parentId": 83,
                  "name": "Cullottes",
                  "seoname": "Women Cullottes",
                  "seourl": "cheap-women-cullottes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-cullottes.jpg",
                  "filters": null
                },
                {
                  "id": 87,
                  "parentId": 83,
                  "name": "Flares",
                  "seoname": "Women Flares",
                  "seourl": "cheap-women-flares-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-flares.jpeg",
                  "filters": null
                },
                {
                  "id": 88,
                  "parentId": 83,
                  "name": "Sweatpants",
                  "seoname": "Women Sweatpants",
                  "seourl": "cheap-women-sweatpants-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-sweatpants.jpeg",
                  "filters": null
                },
                {
                  "id": 89,
                  "parentId": 83,
                  "name": "Leather",
                  "seoname": "Women Leather",
                  "seourl": "cheap-women-leather-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-leather.jpeg",
                  "filters": null
                },
                {
                  "id": 90,
                  "parentId": 83,
                  "name": "Formal",
                  "seoname": "Women Formal",
                  "seourl": "cheap-women-formal-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/trousers-formal.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 91,
              "parentId": 46,
              "name": "Skirts",
              "seoname": "Women Skirts",
              "seourl": "cheap-women-skirts-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 92,
                  "parentId": 91,
                  "name": "Mini",
                  "seoname": "Women Mini",
                  "seourl": "cheap-women-mini-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-mini.jpg",
                  "filters": null
                },
                {
                  "id": 93,
                  "parentId": 91,
                  "name": "Midi",
                  "seoname": "Women Midi",
                  "seourl": "cheap-women-midi-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-midi.jpeg",
                  "filters": null
                },
                {
                  "id": 94,
                  "parentId": 91,
                  "name": "Maxi",
                  "seoname": "Women Maxi",
                  "seourl": "cheap-women-maxi-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-maxi.jpg",
                  "filters": null
                },
                {
                  "id": 95,
                  "parentId": 91,
                  "name": "Shorts",
                  "seoname": "Women Shorts",
                  "seourl": "cheap-women-shorts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-shorts.jpg",
                  "filters": null
                },
                {
                  "id": 96,
                  "parentId": 91,
                  "name": "Leather",
                  "seoname": "Women Leather",
                  "seourl": "cheap-women-leather-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-leather.jpg",
                  "filters": null
                },
                {
                  "id": 97,
                  "parentId": 91,
                  "name": "Denim",
                  "seoname": "Women Denim",
                  "seourl": "cheap-women-denim-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-denim.jpg",
                  "filters": null
                },
                {
                  "id": 98,
                  "parentId": 91,
                  "name": "Other",
                  "seoname": "Women Other",
                  "seourl": "cheap-women-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/skirts-other.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 99,
              "parentId": 46,
              "name": "Coats",
              "seoname": "Women Coats",
              "seourl": "cheap-women-coats-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 100,
                  "parentId": 99,
                  "name": "Jacket",
                  "seoname": "Women Jacket",
                  "seourl": "cheap-women-jacket-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-jacket.jpg",
                  "filters": null
                },
                {
                  "id": 101,
                  "parentId": 99,
                  "name": "Capes",
                  "seoname": "Women Capes",
                  "seourl": "cheap-women-capes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-capes.jpeg",
                  "filters": null
                },
                {
                  "id": 102,
                  "parentId": 99,
                  "name": "Peacoats",
                  "seoname": "Women Peacoats",
                  "seourl": "cheap-women-peacoats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-peacoats.jpeg",
                  "filters": null
                },
                {
                  "id": 103,
                  "parentId": 99,
                  "name": "Faux Fur",
                  "seoname": "Women Faux Fur",
                  "seourl": "cheap-women-faux-fur-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-faux-fur.jpeg",
                  "filters": null
                },
                {
                  "id": 104,
                  "parentId": 99,
                  "name": "Long",
                  "seoname": "Women Long",
                  "seourl": "cheap-women-long-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-long.jpeg",
                  "filters": null
                },
                {
                  "id": 105,
                  "parentId": 99,
                  "name": "Rain",
                  "seoname": "Women Rain",
                  "seourl": "cheap-women-rain-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-rain.jpg",
                  "filters": null
                },
                {
                  "id": 106,
                  "parentId": 99,
                  "name": "Trench",
                  "seoname": "Women Trench",
                  "seourl": "cheap-women-trench-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-trench.jpeg",
                  "filters": null
                },
                {
                  "id": 107,
                  "parentId": 99,
                  "name": "Coat",
                  "seoname": "Women Coat",
                  "seourl": "cheap-women-coat-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-coat.jpeg",
                  "filters": null
                },
                {
                  "id": 108,
                  "parentId": 99,
                  "name": "Gilet",
                  "seoname": "Women Gilet",
                  "seourl": "cheap-women-gilet-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/coats-gilet.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 109,
              "parentId": 46,
              "name": "Blazers",
              "seoname": "Women Blazers",
              "seourl": "cheap-women-blazers-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/blazers.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 110,
                  "parentId": 109,
                  "name": "Blazer",
                  "seoname": "Women Blazer",
                  "seourl": "cheap-women-blazer-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/blazers-blazer.jpeg",
                  "filters": null
                },
                {
                  "id": 111,
                  "parentId": 109,
                  "name": "Suit",
                  "seoname": "Women Suit",
                  "seourl": "cheap-women-suit-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/blazers-suit.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 112,
              "parentId": 46,
              "name": "Activewear",
              "seoname": "Women Activewear",
              "seourl": "cheap-women-activewear-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 113,
                  "parentId": 112,
                  "name": "Outerwear",
                  "seoname": "Women Outerwear",
                  "seourl": "cheap-women-outerwear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-outwear.jpg",
                  "filters": null
                },
                {
                  "id": 114,
                  "parentId": 112,
                  "name": "Top",
                  "seoname": "Women Top",
                  "seourl": "cheap-women-top-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-top.jpeg",
                  "filters": null
                },
                {
                  "id": 115,
                  "parentId": 112,
                  "name": "Sports bra",
                  "seoname": "Women Sports bra",
                  "seourl": "cheap-women-sports-bra-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-sports-bra.jpg",
                  "filters": null
                },
                {
                  "id": 116,
                  "parentId": 112,
                  "name": "Trousers",
                  "seoname": "Women Trousers",
                  "seourl": "cheap-women-trousers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-trousers.jpeg",
                  "filters": null
                },
                {
                  "id": 117,
                  "parentId": 112,
                  "name": "Tracksuits",
                  "seoname": "Women Tracksuits",
                  "seourl": "cheap-women-tracksuits-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-tracksuits.jpeg",
                  "filters": null
                },
                {
                  "id": 118,
                  "parentId": 112,
                  "name": "Hoodies",
                  "seoname": "Women Hoodies",
                  "seourl": "cheap-women-hoodies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-hoodies.jpeg",
                  "filters": null
                },
                {
                  "id": 119,
                  "parentId": 112,
                  "name": "Shorts",
                  "seoname": "Women Shorts",
                  "seourl": "cheap-women-shorts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-shorts.jpg",
                  "filters": null
                },
                {
                  "id": 120,
                  "parentId": 112,
                  "name": "Skirts",
                  "seoname": "Women Skirts",
                  "seourl": "cheap-women-skirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-skirts.jpg",
                  "filters": null
                },
                {
                  "id": 121,
                  "parentId": 112,
                  "name": "Co-ords",
                  "seoname": "Women Co-ords",
                  "seourl": "cheap-women-co-ords-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/activewear-co-ords.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 122,
              "parentId": 46,
              "name": "Beach",
              "seoname": "Women Beach",
              "seourl": "cheap-women-beach-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/beach.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 123,
                  "parentId": 122,
                  "name": "One piece",
                  "seoname": "Women One piece",
                  "seourl": "cheap-women-one-piece-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/beach-one-piece.jpeg",
                  "filters": null
                },
                {
                  "id": 124,
                  "parentId": 122,
                  "name": "Bikini",
                  "seoname": "Women Bikini",
                  "seourl": "cheap-women-bikini-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/beach-bikini.jpg",
                  "filters": null
                },
                {
                  "id": 125,
                  "parentId": 122,
                  "name": "Cover-up",
                  "seoname": "Women Cover-up",
                  "seourl": "cheap-women-cover-up-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/beach-cover-up.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 126,
              "parentId": 46,
              "name": "Bags",
              "seoname": "Women Bags",
              "seourl": "cheap-women-bags-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 127,
                  "parentId": 126,
                  "name": "Other",
                  "seoname": "Women Other",
                  "seourl": "cheap-women-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-other.jpeg",
                  "filters": null
                },
                {
                  "id": 128,
                  "parentId": 126,
                  "name": "Shoulder",
                  "seoname": "Women Shoulder",
                  "seourl": "cheap-women-shoulder-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-shoulder.jpg",
                  "filters": null
                },
                {
                  "id": 129,
                  "parentId": 126,
                  "name": "Hobo",
                  "seoname": "Women Hobo",
                  "seourl": "cheap-women-hobo-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-hobo.jpeg",
                  "filters": null
                },
                {
                  "id": 130,
                  "parentId": 126,
                  "name": "Backpacks",
                  "seoname": "Women Backpacks",
                  "seourl": "cheap-women-backpacks-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-backpacks.jpeg",
                  "filters": null
                },
                {
                  "id": 131,
                  "parentId": 126,
                  "name": "Clutch",
                  "seoname": "Women Clutch",
                  "seourl": "cheap-women-clutch-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-clutch.jpeg",
                  "filters": null
                },
                {
                  "id": 132,
                  "parentId": 126,
                  "name": "Purse",
                  "seoname": "Women Purse",
                  "seourl": "cheap-women-purse-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-purse.jpg",
                  "filters": null
                },
                {
                  "id": 133,
                  "parentId": 126,
                  "name": "Totes",
                  "seoname": "Women Totes",
                  "seourl": "cheap-women-totes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-totes.jpeg",
                  "filters": null
                },
                {
                  "id": 134,
                  "parentId": 126,
                  "name": "Makeup bags",
                  "seoname": "Women Makeup bags",
                  "seourl": "cheap-women-makeup-bags-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-makeup-bags.jpeg",
                  "filters": null
                },
                {
                  "id": 135,
                  "parentId": 126,
                  "name": "Briefcase",
                  "seoname": "Women Briefcase",
                  "seourl": "cheap-women-briefcase-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-briefcase.jpeg",
                  "filters": null
                },
                {
                  "id": 136,
                  "parentId": 126,
                  "name": "Handbags",
                  "seoname": "Women Handbags",
                  "seourl": "cheap-women-handbags-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-handbags.jpeg",
                  "filters": null
                },
                {
                  "id": 137,
                  "parentId": 126,
                  "name": "Bum bags",
                  "seoname": "Women Bum bags",
                  "seourl": "cheap-women-bum-bags-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/bags-bum-bags.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 138,
              "parentId": 46,
              "name": "Accessories",
              "seoname": "Women Accessories",
              "seourl": "cheap-women-accessories-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/women-accessories.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 139,
                  "parentId": 138,
                  "name": "Belts",
                  "seoname": "Women Belts",
                  "seourl": "cheap-women-belts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-belts.jpeg",
                  "filters": null
                },
                {
                  "id": 140,
                  "parentId": 138,
                  "name": "Sunglasses",
                  "seoname": "Women Sunglasses",
                  "seourl": "cheap-women-sunglasses-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-sunglasses.jpeg",
                  "filters": null
                },
                {
                  "id": 141,
                  "parentId": 138,
                  "name": "Gloves",
                  "seoname": "Women Gloves",
                  "seourl": "cheap-women-gloves-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-gloves.jpg",
                  "filters": null
                },
                {
                  "id": 142,
                  "parentId": 138,
                  "name": "Hats",
                  "seoname": "Women Hats",
                  "seourl": "cheap-women-hats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-hats.jpg",
                  "filters": null
                },
                {
                  "id": 143,
                  "parentId": 138,
                  "name": "Hair",
                  "seoname": "Women Hair",
                  "seourl": "cheap-women-hair-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-hair.jpeg",
                  "filters": null
                },
                {
                  "id": 144,
                  "parentId": 138,
                  "name": "Scarves",
                  "seoname": "Women Scarves",
                  "seourl": "cheap-women-scarves-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-scarves.jpeg",
                  "filters": null
                },
                {
                  "id": 145,
                  "parentId": 138,
                  "name": "Wedding",
                  "seoname": "Women Wedding",
                  "seourl": "cheap-women-wedding-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-wedding.jpeg",
                  "filters": null
                },
                {
                  "id": 146,
                  "parentId": 138,
                  "name": "Umbrella",
                  "seoname": "Women Umbrella",
                  "seourl": "cheap-women-umbrella-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-umbrella.jpeg",
                  "filters": null
                },
                {
                  "id": 147,
                  "parentId": 138,
                  "name": "Other",
                  "seoname": "Women Other",
                  "seourl": "cheap-women-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/accessories-other.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 148,
              "parentId": 46,
              "name": "Jewellery",
              "seoname": "Women Jewellery",
              "seourl": "cheap-women-jewellery-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 149,
                  "parentId": 148,
                  "name": "Rings",
                  "seoname": "Women Rings",
                  "seourl": "cheap-women-rings-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery-rings.jpg",
                  "filters": null
                },
                {
                  "id": 150,
                  "parentId": 148,
                  "name": "Watches",
                  "seoname": "Women Watches",
                  "seourl": "cheap-women-watches-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery-watches.jpeg",
                  "filters": null
                },
                {
                  "id": 151,
                  "parentId": 148,
                  "name": "Necklaces",
                  "seoname": "Women Necklaces",
                  "seourl": "cheap-women-necklaces-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery-necklaces.jpeg",
                  "filters": null
                },
                {
                  "id": 152,
                  "parentId": 148,
                  "name": "Earrings",
                  "seoname": "Women Earrings",
                  "seourl": "cheap-women-earrings-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery-earrings.jpeg",
                  "filters": null
                },
                {
                  "id": 153,
                  "parentId": 148,
                  "name": "Bracelets",
                  "seoname": "Women Bracelets",
                  "seourl": "cheap-women-bracelets-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery-bracelets.jpg",
                  "filters": null
                },
                {
                  "id": 154,
                  "parentId": 148,
                  "name": "Other",
                  "seoname": "Women Other",
                  "seourl": "cheap-women-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/jewellery-other.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 155,
              "parentId": 46,
              "name": "Maternity",
              "seoname": "Women Maternity",
              "seourl": "cheap-women-maternity-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 156,
                  "parentId": 155,
                  "name": "Knitwear",
                  "seoname": "Women Knitwear",
                  "seourl": "cheap-women-knitwear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-knitwear.jpeg",
                  "filters": null
                },
                {
                  "id": 157,
                  "parentId": 155,
                  "name": "Jumpers",
                  "seoname": "Women Jumpers",
                  "seourl": "cheap-women-jumpers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-jumpers.jpeg.jpg",
                  "filters": null
                },
                {
                  "id": 158,
                  "parentId": 155,
                  "name": "Coats",
                  "seoname": "Women Coats",
                  "seourl": "cheap-women-coats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-coats.jpg",
                  "filters": null
                },
                {
                  "id": 159,
                  "parentId": 155,
                  "name": "Dresses",
                  "seoname": "Women Dresses",
                  "seourl": "cheap-women-dresses-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-dresses.jpg",
                  "filters": null
                },
                {
                  "id": 160,
                  "parentId": 155,
                  "name": "Tops",
                  "seoname": "Women Tops",
                  "seourl": "cheap-women-tops-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-tops.jpg",
                  "filters": null
                },
                {
                  "id": 161,
                  "parentId": 155,
                  "name": "Jeans",
                  "seoname": "Women Jeans",
                  "seourl": "cheap-women-jeans-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-jeans.jpg",
                  "filters": null
                },
                {
                  "id": 162,
                  "parentId": 155,
                  "name": "Trousers",
                  "seoname": "Women Trousers",
                  "seourl": "cheap-women-trousers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-trousers.jpeg",
                  "filters": null
                },
                {
                  "id": 163,
                  "parentId": 155,
                  "name": "Shorts",
                  "seoname": "Women Shorts",
                  "seourl": "cheap-women-shorts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-shorts.jpg",
                  "filters": null
                },
                {
                  "id": 164,
                  "parentId": 155,
                  "name": "Skirts",
                  "seoname": "Women Skirts",
                  "seourl": "cheap-women-skirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-skirts.jpeg",
                  "filters": null
                },
                {
                  "id": 165,
                  "parentId": 155,
                  "name": "Hoodies",
                  "seoname": "Women Hoodies",
                  "seourl": "cheap-women-hoodies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-hoodies.jpeg",
                  "filters": null
                },
                {
                  "id": 166,
                  "parentId": 155,
                  "name": "Swimware",
                  "seoname": "Women Swimware",
                  "seourl": "cheap-women-swimware-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-swimwear.jpg",
                  "filters": null
                },
                {
                  "id": 167,
                  "parentId": 155,
                  "name": "Sleep",
                  "seoname": "Women Sleep",
                  "seourl": "cheap-women-sleep-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-sleep.jpeg",
                  "filters": null
                },
                {
                  "id": 168,
                  "parentId": 155,
                  "name": "Intimate",
                  "seoname": "Women Intimate",
                  "seourl": "cheap-women-intimate-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-intimate.jpg",
                  "filters": null
                },
                {
                  "id": 169,
                  "parentId": 155,
                  "name": "Loungewear",
                  "seoname": "Women Loungewear",
                  "seourl": "cheap-women-loungewear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-loungewear.jpeg",
                  "filters": null
                },
                {
                  "id": 170,
                  "parentId": 155,
                  "name": "Bump bands",
                  "seoname": "Women Bump bands",
                  "seourl": "cheap-women-bump-bands-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/maternity-bump-bands.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 171,
              "parentId": 46,
              "name": "Shoes",
              "seoname": "Women Shoes",
              "seourl": "cheap-women-shoes-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 172,
                  "parentId": 171,
                  "name": "Boots",
                  "seoname": "Women Boots",
                  "seourl": "cheap-women-boots-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-boots.jpeg",
                  "filters": null
                },
                {
                  "id": 173,
                  "parentId": 171,
                  "name": "Flats",
                  "seoname": "Women Flats",
                  "seourl": "cheap-women-flats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-flats.jpg",
                  "filters": null
                },
                {
                  "id": 174,
                  "parentId": 171,
                  "name": "Heels",
                  "seoname": "Women Heels",
                  "seourl": "cheap-women-heels-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-heels.jpeg",
                  "filters": null
                },
                {
                  "id": 175,
                  "parentId": 171,
                  "name": "Trainers",
                  "seoname": "Women Trainers",
                  "seourl": "cheap-women-trainers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-trainers.jpeg",
                  "filters": null
                },
                {
                  "id": 176,
                  "parentId": 171,
                  "name": "Sports",
                  "seoname": "Women Sports",
                  "seourl": "cheap-women-sports-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-sports.jpeg",
                  "filters": null
                },
                {
                  "id": 177,
                  "parentId": 171,
                  "name": "Slippers",
                  "seoname": "Women Slippers",
                  "seourl": "cheap-women-slippers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-slippers.jpeg",
                  "filters": null
                },
                {
                  "id": 178,
                  "parentId": 171,
                  "name": "Sandals",
                  "seoname": "Women Sandals",
                  "seourl": "cheap-women-sandals-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shoes-sandals.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 179,
              "parentId": 46,
              "name": "Nightwear",
              "seoname": "Women Nightwear",
              "seourl": "cheap-women-nightwear-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/nightwear.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 180,
                  "parentId": 179,
                  "name": "Bras",
                  "seoname": "Women Bras",
                  "seourl": "cheap-women-bras-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/nightwear-bras.jpeg",
                  "filters": null
                },
                {
                  "id": 181,
                  "parentId": 179,
                  "name": "Briefs",
                  "seoname": "Women Briefs",
                  "seourl": "cheap-women-briefs-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/nightwear-briefs.jpeg",
                  "filters": null
                },
                {
                  "id": 182,
                  "parentId": 179,
                  "name": "Robes",
                  "seoname": "Women Robes",
                  "seourl": "cheap-women-robes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/nightwear-robes.jpeg",
                  "filters": null
                },
                {
                  "id": 183,
                  "parentId": 179,
                  "name": "Nightwear",
                  "seoname": "Women Nightwear",
                  "seourl": "cheap-women-nightwear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/nightwear-nightwear.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 184,
              "parentId": 46,
              "name": "Shorts",
              "seoname": "Women Shorts",
              "seourl": "cheap-women-shorts-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shorts.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 185,
                  "parentId": 184,
                  "name": "Denim",
                  "seoname": "Women Denim",
                  "seourl": "cheap-women-denim-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shorts-denim.jpeg",
                  "filters": null
                },
                {
                  "id": 186,
                  "parentId": 184,
                  "name": "Leather",
                  "seoname": "Women Leather",
                  "seourl": "cheap-women-leather-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shorts-leather.jpg",
                  "filters": null
                },
                {
                  "id": 187,
                  "parentId": 184,
                  "name": "Other",
                  "seoname": "Women Other",
                  "seourl": "cheap-women-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/shorts-other.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 188,
              "parentId": 46,
              "name": "Tights",
              "seoname": "Women Tights",
              "seourl": "cheap-women-tights-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tights.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 189,
                  "parentId": 188,
                  "name": "Tights",
                  "seoname": "Women Tights",
                  "seourl": "cheap-women-tights-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tights-tights.jpg",
                  "filters": null
                },
                {
                  "id": 190,
                  "parentId": 188,
                  "name": "Socks",
                  "seoname": "Women Socks",
                  "seourl": "cheap-women-socks-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/tights-socks.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 191,
              "parentId": 46,
              "name": "One Piece",
              "seoname": "Women One Piece",
              "seourl": "cheap-women-one-piece-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/one-piece.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 192,
                  "parentId": 191,
                  "name": "Jumpsuits",
                  "seoname": "Women Jumpsuits",
                  "seourl": "cheap-women-jumpsuits-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/one-piece-jumpsuites.jpg",
                  "filters": null
                },
                {
                  "id": 193,
                  "parentId": 191,
                  "name": "Dungarees",
                  "seoname": "Women Dungarees",
                  "seourl": "cheap-women-dungarees-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/one-piece-dungarees.jpeg",
                  "filters": null
                },
                {
                  "id": 194,
                  "parentId": 191,
                  "name": "Playsuits",
                  "seoname": "Women Playsuits",
                  "seourl": "cheap-women-playsuits-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/women/one-piece-playsuits.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 195,
          "parentId": null,
          "name": "Men",
          "seoname": "Men Items",
          "seourl": "cheap-men-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/men.jpg",
          "filters": null,
          "categories": [
            {
              "id": 196,
              "parentId": 195,
              "name": "Tops",
              "seoname": "Men Tops",
              "seourl": "cheap-men-tops-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-tops.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 197,
                  "parentId": 196,
                  "name": "Polo shirt",
                  "seoname": "Men Polo shirt",
                  "seourl": "cheap-men-polo-shirt-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/tops-polo-shirt.jpg",
                  "filters": null
                },
                {
                  "id": 198,
                  "parentId": 196,
                  "name": "Vest",
                  "seoname": "Men Vest",
                  "seourl": "cheap-men-vest-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/tops-vest.jpg",
                  "filters": null
                },
                {
                  "id": 199,
                  "parentId": 196,
                  "name": "Rugby",
                  "seoname": "Men Rugby",
                  "seourl": "cheap-men-rugby-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/tops-rugby.jpg",
                  "filters": null
                },
                {
                  "id": 200,
                  "parentId": 196,
                  "name": "T-shirts",
                  "seoname": "Men T-shirts",
                  "seourl": "cheap-men-t-shirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/tops-t-shirts.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 201,
              "parentId": 195,
              "name": "Shirts",
              "seoname": "Men Shirts",
              "seourl": "cheap-men-shirts-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-shirts.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 202,
                  "parentId": 201,
                  "name": "Short",
                  "seoname": "Men Short",
                  "seourl": "cheap-men-short-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shirt-short.jpg",
                  "filters": null
                },
                {
                  "id": 203,
                  "parentId": 201,
                  "name": "Long",
                  "seoname": "Men Long",
                  "seourl": "cheap-men-long-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shirt-long.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 204,
              "parentId": 195,
              "name": "Hoodies",
              "seoname": "Men Hoodies",
              "seourl": "cheap-men-hoodies-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-hoodies.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 205,
                  "parentId": 204,
                  "name": "Sweatshirt",
                  "seoname": "Men Sweatshirt",
                  "seourl": "cheap-men-sweatshirt-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/hoodies-sweatshirt.jpeg",
                  "filters": null
                },
                {
                  "id": 206,
                  "parentId": 204,
                  "name": "Hoodie",
                  "seoname": "Men Hoodie",
                  "seourl": "cheap-men-hoodie-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/hoodies-hoodie.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 207,
              "parentId": 195,
              "name": "Jumpers",
              "seoname": "Men Jumpers",
              "seourl": "cheap-men-jumpers-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-jumpers.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 208,
                  "parentId": 207,
                  "name": "Cardigan",
                  "seoname": "Men Cardigan",
                  "seourl": "cheap-men-cardigan-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jumpers-cardigan.jpg",
                  "filters": null
                },
                {
                  "id": 209,
                  "parentId": 207,
                  "name": "Jumper",
                  "seoname": "Men Jumper",
                  "seourl": "cheap-men-jumper-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jumpers-jumper.jpg",
                  "filters": null
                },
                {
                  "id": 210,
                  "parentId": 207,
                  "name": "Polo neck",
                  "seoname": "Men Polo neck",
                  "seourl": "cheap-men-polo-neck-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jumpers-poloneck.jpg",
                  "filters": null
                },
                {
                  "id": 211,
                  "parentId": 207,
                  "name": "V-neck",
                  "seoname": "Men V-neck",
                  "seourl": "cheap-men-v-neck-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jumpers-v-neck.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 212,
              "parentId": 195,
              "name": "Jeans",
              "seoname": "Men Jeans",
              "seourl": "cheap-men-jeans-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-jeans.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 213,
                  "parentId": 212,
                  "name": "Bootcut",
                  "seoname": "Men Bootcut",
                  "seourl": "cheap-men-bootcut-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jeans-bootcut.jpg",
                  "filters": null
                },
                {
                  "id": 214,
                  "parentId": 212,
                  "name": "Slim",
                  "seoname": "Men Slim",
                  "seourl": "cheap-men-slim-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jeans-slim.jpg",
                  "filters": null
                },
                {
                  "id": 215,
                  "parentId": 212,
                  "name": "Regular",
                  "seoname": "Men Regular",
                  "seourl": "cheap-men-regular-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jeans-regular.jpg",
                  "filters": null
                },
                {
                  "id": 216,
                  "parentId": 212,
                  "name": "Dungarees",
                  "seoname": "Men Dungarees",
                  "seourl": "cheap-men-dungarees-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jenas-dungarees.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 217,
              "parentId": 195,
              "name": "Trousers",
              "seoname": "Men Trousers",
              "seourl": "cheap-men-trousers-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-trousers.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 218,
                  "parentId": 217,
                  "name": "Chino",
                  "seoname": "Men Chino",
                  "seourl": "cheap-men-chino-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/trousers-chino.jpg",
                  "filters": null
                },
                {
                  "id": 219,
                  "parentId": 217,
                  "name": "Combat",
                  "seoname": "Men Combat",
                  "seourl": "cheap-men-combat-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/trousers-combat.jpg",
                  "filters": null
                },
                {
                  "id": 220,
                  "parentId": 217,
                  "name": "Joggers",
                  "seoname": "Men Joggers",
                  "seourl": "cheap-men-joggers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/trousers-joggers.jpg",
                  "filters": null
                },
                {
                  "id": 221,
                  "parentId": 217,
                  "name": "Smart",
                  "seoname": "Men Smart",
                  "seourl": "cheap-men-smart-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/trousers-smart.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 222,
              "parentId": 195,
              "name": "Shorts",
              "seoname": "Men Shorts",
              "seourl": "cheap-men-shorts-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-shorts.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 223,
                  "parentId": 222,
                  "name": "Combat",
                  "seoname": "Men Combat",
                  "seourl": "cheap-men-combat-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shorts-combat.jpg",
                  "filters": null
                },
                {
                  "id": 224,
                  "parentId": 222,
                  "name": "Sport",
                  "seoname": "Men Sport",
                  "seourl": "cheap-men-sport-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shorts-sport.jpg",
                  "filters": null
                },
                {
                  "id": 225,
                  "parentId": 222,
                  "name": "Denim",
                  "seoname": "Men Denim",
                  "seourl": "cheap-men-denim-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shorts-denim.jpg",
                  "filters": null
                },
                {
                  "id": 226,
                  "parentId": 222,
                  "name": "Jersey",
                  "seoname": "Men Jersey",
                  "seourl": "cheap-men-jersey-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shorts-jersey.jpg",
                  "filters": null
                },
                {
                  "id": 227,
                  "parentId": 222,
                  "name": "Smart",
                  "seoname": "Men Smart",
                  "seourl": "cheap-men-smart-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shorts-smart.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 228,
              "parentId": 195,
              "name": "Coats",
              "seoname": "Men Coats",
              "seourl": "cheap-men-coats-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-coats.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 229,
                  "parentId": 228,
                  "name": "Blazer",
                  "seoname": "Men Blazer",
                  "seourl": "cheap-men-blazer-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-blazers.jpg",
                  "filters": null
                },
                {
                  "id": 230,
                  "parentId": 228,
                  "name": "Bomber",
                  "seoname": "Men Bomber",
                  "seourl": "cheap-men-bomber-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-bomber.jpg",
                  "filters": null
                },
                {
                  "id": 231,
                  "parentId": 228,
                  "name": "Denim",
                  "seoname": "Men Denim",
                  "seourl": "cheap-men-denim-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-denim.jpg",
                  "filters": null
                },
                {
                  "id": 232,
                  "parentId": 228,
                  "name": "Leather",
                  "seoname": "Men Leather",
                  "seourl": "cheap-men-leather-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-leather.jpg",
                  "filters": null
                },
                {
                  "id": 233,
                  "parentId": 228,
                  "name": "Duffle",
                  "seoname": "Men Duffle",
                  "seourl": "cheap-men-duffle-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-duffle.jpg",
                  "filters": null
                },
                {
                  "id": 234,
                  "parentId": 228,
                  "name": "Parka",
                  "seoname": "Men Parka",
                  "seourl": "cheap-men-parka-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-parka.jpg",
                  "filters": null
                },
                {
                  "id": 235,
                  "parentId": 228,
                  "name": "Raincoat",
                  "seoname": "Men Raincoat",
                  "seourl": "cheap-men-raincoat-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-raincoat.jpg",
                  "filters": null
                },
                {
                  "id": 236,
                  "parentId": 228,
                  "name": "Trench",
                  "seoname": "Men Trench",
                  "seourl": "cheap-men-trench-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-trench.jpg",
                  "filters": null
                },
                {
                  "id": 237,
                  "parentId": 228,
                  "name": "Mac",
                  "seoname": "Men Mac",
                  "seourl": "cheap-men-mac-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-mac.png",
                  "filters": null
                },
                {
                  "id": 238,
                  "parentId": 228,
                  "name": "Gilet",
                  "seoname": "Men Gilet",
                  "seourl": "cheap-men-gilet-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-gilet.jpg",
                  "filters": null
                },
                {
                  "id": 239,
                  "parentId": 228,
                  "name": "Wool",
                  "seoname": "Men Wool",
                  "seourl": "cheap-men-wool-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-wool.jpg",
                  "filters": null
                },
                {
                  "id": 240,
                  "parentId": 228,
                  "name": "Lightweight",
                  "seoname": "Men Lightweight",
                  "seourl": "cheap-men-lightweight-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/coats-lightweight.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 241,
              "parentId": 195,
              "name": "Suits",
              "seoname": "Men Suits",
              "seourl": "cheap-men-suits-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-suits.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 242,
                  "parentId": 241,
                  "name": "Jacket",
                  "seoname": "Men Jacket",
                  "seourl": "cheap-men-jacket-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/suits-jacket.jpg",
                  "filters": null
                },
                {
                  "id": 243,
                  "parentId": 241,
                  "name": "Sets",
                  "seoname": "Men Sets",
                  "seourl": "cheap-men-sets-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/suits-sets.jpg",
                  "filters": null
                },
                {
                  "id": 244,
                  "parentId": 241,
                  "name": "Trousers",
                  "seoname": "Men Trousers",
                  "seourl": "cheap-men-trousers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/suits-trousers.jpg",
                  "filters": null
                },
                {
                  "id": 245,
                  "parentId": 241,
                  "name": "Tuxedo",
                  "seoname": "Men Tuxedo",
                  "seourl": "cheap-men-tuxedo-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/suits-tuxedo.jpg",
                  "filters": null
                },
                {
                  "id": 246,
                  "parentId": 241,
                  "name": "Dinner",
                  "seoname": "Men Dinner",
                  "seourl": "cheap-men-dinner-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/suits-dinner.jpg",
                  "filters": null
                },
                {
                  "id": 247,
                  "parentId": 241,
                  "name": "Waistcoat",
                  "seoname": "Men Waistcoat",
                  "seourl": "cheap-men-waistcoat-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/suits-waistcoat.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 248,
              "parentId": 195,
              "name": "Sportswear",
              "seoname": "Men Sportswear",
              "seourl": "cheap-men-sportswear-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-sportswear.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 249,
                  "parentId": 248,
                  "name": "Jacket",
                  "seoname": "Men Jacket",
                  "seourl": "cheap-men-jacket-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/sportswear-jackets.jpg",
                  "filters": null
                },
                {
                  "id": 250,
                  "parentId": 248,
                  "name": "Tops",
                  "seoname": "Men Tops",
                  "seourl": "cheap-men-tops-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/sportswear-tops.jpg",
                  "filters": null
                },
                {
                  "id": 251,
                  "parentId": 248,
                  "name": "Joggers",
                  "seoname": "Men Joggers",
                  "seourl": "cheap-men-joggers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/sportswear-joggers.jpg",
                  "filters": null
                },
                {
                  "id": 252,
                  "parentId": 248,
                  "name": "Shorts",
                  "seoname": "Men Shorts",
                  "seourl": "cheap-men-shorts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/sportswear-shorts.jpg",
                  "filters": null
                },
                {
                  "id": 253,
                  "parentId": 248,
                  "name": "Tracksuit",
                  "seoname": "Men Tracksuit",
                  "seourl": "cheap-men-tracksuit-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/sportswear-tracksuit.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 254,
              "parentId": 195,
              "name": "Swimwear",
              "seoname": "Men Swimwear",
              "seourl": "cheap-men-swimwear-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-swimwear.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 255,
                  "parentId": 254,
                  "name": "Swim",
                  "seoname": "Men Swim",
                  "seourl": "cheap-men-swim-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/swimwear-swim.jpg",
                  "filters": null
                },
                {
                  "id": 256,
                  "parentId": 254,
                  "name": "Board",
                  "seoname": "Men Board",
                  "seourl": "cheap-men-board-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/swimwear-board.jpg",
                  "filters": null
                },
                {
                  "id": 257,
                  "parentId": 254,
                  "name": "Trunks",
                  "seoname": "Men Trunks",
                  "seourl": "cheap-men-trunks-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/swimwear-trunks.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 258,
              "parentId": 195,
              "name": "Accessories",
              "seoname": "Men Accessories",
              "seourl": "cheap-men-accessories-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-accessories.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 259,
                  "parentId": 258,
                  "name": "Belts",
                  "seoname": "Men Belts",
                  "seourl": "cheap-men-belts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-belts.jpg",
                  "filters": null
                },
                {
                  "id": 260,
                  "parentId": 258,
                  "name": "Gloves",
                  "seoname": "Men Gloves",
                  "seourl": "cheap-men-gloves-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-gloves.jpg",
                  "filters": null
                },
                {
                  "id": 261,
                  "parentId": 258,
                  "name": "Scarves",
                  "seoname": "Men Scarves",
                  "seourl": "cheap-men-scarves-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-scarves.jpg",
                  "filters": null
                },
                {
                  "id": 262,
                  "parentId": 258,
                  "name": "Ties",
                  "seoname": "Men Ties",
                  "seourl": "cheap-men-ties-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-ties.jpg",
                  "filters": null
                },
                {
                  "id": 263,
                  "parentId": 258,
                  "name": "Sunglasses",
                  "seoname": "Men Sunglasses",
                  "seourl": "cheap-men-sunglasses-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-sunglasses.jpg",
                  "filters": null
                },
                {
                  "id": 264,
                  "parentId": 258,
                  "name": "Hats",
                  "seoname": "Men Hats",
                  "seourl": "cheap-men-hats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-hats.jpg",
                  "filters": null
                },
                {
                  "id": 265,
                  "parentId": 258,
                  "name": "Wallets",
                  "seoname": "Men Wallets",
                  "seourl": "cheap-men-wallets-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/accessories-wallets.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 266,
              "parentId": 195,
              "name": "Jewellery",
              "seoname": "Men Jewellery",
              "seourl": "cheap-men-jewellery-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-jewellery.jpeg",
              "filters": null,
              "categories": [
                {
                  "id": 267,
                  "parentId": 266,
                  "name": "Jewellery",
                  "seoname": "Men Jewellery",
                  "seourl": "cheap-men-jewellery-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jewellery-jewellery.jpg",
                  "filters": null
                },
                {
                  "id": 268,
                  "parentId": 266,
                  "name": "Watches",
                  "seoname": "Men Watches",
                  "seourl": "cheap-men-watches-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/jewellery-watches.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 269,
              "parentId": 195,
              "name": "Bags",
              "seoname": "Men Bags",
              "seourl": "cheap-men-bags-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-bags.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 270,
                  "parentId": 269,
                  "name": "Backpack",
                  "seoname": "Men Backpack",
                  "seourl": "cheap-men-backpack-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/bags-backpack.jpg",
                  "filters": null
                },
                {
                  "id": 271,
                  "parentId": 269,
                  "name": "Briefcase",
                  "seoname": "Men Briefcase",
                  "seourl": "cheap-men-briefcase-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/bags-briefcase.jpg",
                  "filters": null
                },
                {
                  "id": 272,
                  "parentId": 269,
                  "name": "Gymbag",
                  "seoname": "Men Gymbag",
                  "seourl": "cheap-men-gymbag-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/bags-gym-bag.jpg",
                  "filters": null
                },
                {
                  "id": 273,
                  "parentId": 269,
                  "name": "Holdall",
                  "seoname": "Men Holdall",
                  "seourl": "cheap-men-holdall-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/bags-holdall.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 274,
              "parentId": 195,
              "name": "Shoes",
              "seoname": "Men Shoes",
              "seourl": "cheap-men-shoes-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/men-shoes.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 275,
                  "parentId": 274,
                  "name": "Trainers",
                  "seoname": "Men Trainers",
                  "seourl": "cheap-men-trainers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-trainers.jpg",
                  "filters": null
                },
                {
                  "id": 276,
                  "parentId": 274,
                  "name": "Plimsolls",
                  "seoname": "Men Plimsolls",
                  "seourl": "cheap-men-plimsolls-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-plimsolls.jpg",
                  "filters": null
                },
                {
                  "id": 277,
                  "parentId": 274,
                  "name": "Sports",
                  "seoname": "Men Sports",
                  "seourl": "cheap-men-sports-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-sport.jpg",
                  "filters": null
                },
                {
                  "id": 278,
                  "parentId": 274,
                  "name": "Brogues",
                  "seoname": "Men Brogues",
                  "seourl": "cheap-men-brogues-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-brouges.jpg",
                  "filters": null
                },
                {
                  "id": 279,
                  "parentId": 274,
                  "name": "Boots",
                  "seoname": "Men Boots",
                  "seourl": "cheap-men-boots-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-boots.jpg",
                  "filters": null
                },
                {
                  "id": 280,
                  "parentId": 274,
                  "name": "Formal",
                  "seoname": "Men Formal",
                  "seourl": "cheap-men-formal-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-formal.jpg",
                  "filters": null
                },
                {
                  "id": 281,
                  "parentId": 274,
                  "name": "Loafers",
                  "seoname": "Men Loafers",
                  "seourl": "cheap-men-loafers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-loafers.jpg",
                  "filters": null
                },
                {
                  "id": 282,
                  "parentId": 274,
                  "name": "Slippers",
                  "seoname": "Men Slippers",
                  "seourl": "cheap-men-slippers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/men/shoes-slippers.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 1,
          "parentId": null,
          "name": "Kids",
          "seoname": "Kids Items",
          "seourl": "cheap-kids-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/kids.jpg",
          "filters": null,
          "categories": [
            {
              "id": 2,
              "parentId": 1,
              "name": "Girls",
              "seoname": "Kids Girls",
              "seourl": "cheap-kids-girls-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 3,
                  "parentId": 2,
                  "name": "Dresses",
                  "seoname": "Kids Dresses",
                  "seourl": "cheap-kids-dresses-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/dresses.jpg",
                  "filters": null
                },
                {
                  "id": 4,
                  "parentId": 2,
                  "name": "Tops",
                  "seoname": "Kids Tops",
                  "seourl": "cheap-kids-tops-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/tops.jpg",
                  "filters": null
                },
                {
                  "id": 5,
                  "parentId": 2,
                  "name": "T-shirts",
                  "seoname": "Kids T-shirts",
                  "seourl": "cheap-kids-t-shirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/t-shirts.jpg",
                  "filters": null
                },
                {
                  "id": 6,
                  "parentId": 2,
                  "name": "Shorts",
                  "seoname": "Kids Shorts",
                  "seourl": "cheap-kids-shorts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-shorts.jpg",
                  "filters": null
                },
                {
                  "id": 7,
                  "parentId": 2,
                  "name": "Jumpers",
                  "seoname": "Kids Jumpers",
                  "seourl": "cheap-kids-jumpers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-jumpers.jpg",
                  "filters": null
                },
                {
                  "id": 8,
                  "parentId": 2,
                  "name": "Hoodies",
                  "seoname": "Kids Hoodies",
                  "seourl": "cheap-kids-hoodies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-hoodies.jpg",
                  "filters": null
                },
                {
                  "id": 9,
                  "parentId": 2,
                  "name": "Jeans",
                  "seoname": "Kids Jeans",
                  "seourl": "cheap-kids-jeans-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-jeans.jpg",
                  "filters": null
                },
                {
                  "id": 10,
                  "parentId": 2,
                  "name": "Trousers",
                  "seoname": "Kids Trousers",
                  "seourl": "cheap-kids-trousers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-trousers.jpg",
                  "filters": null
                },
                {
                  "id": 11,
                  "parentId": 2,
                  "name": "Skirts",
                  "seoname": "Kids Skirts",
                  "seourl": "cheap-kids-skirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-skirts.jpg",
                  "filters": null
                },
                {
                  "id": 12,
                  "parentId": 2,
                  "name": "Coats",
                  "seoname": "Kids Coats",
                  "seourl": "cheap-kids-coats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-coats.jpg",
                  "filters": null
                },
                {
                  "id": 13,
                  "parentId": 2,
                  "name": "Swimwear",
                  "seoname": "Kids Swimwear",
                  "seourl": "cheap-kids-swimwear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-swimwear.jpg",
                  "filters": null
                },
                {
                  "id": 14,
                  "parentId": 2,
                  "name": "Accessories",
                  "seoname": "Kids Accessories",
                  "seourl": "cheap-kids-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-accessories.jpg",
                  "filters": null
                },
                {
                  "id": 15,
                  "parentId": 2,
                  "name": "Shoes",
                  "seoname": "Kids Shoes",
                  "seourl": "cheap-kids-shoes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/girls-shoes.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 16,
              "parentId": 1,
              "name": "Boys",
              "seoname": "Kids Boys",
              "seourl": "cheap-kids-boys-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 17,
                  "parentId": 16,
                  "name": "Tops",
                  "seoname": "Kids Tops",
                  "seourl": "cheap-kids-tops-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-tops.jpg",
                  "filters": null
                },
                {
                  "id": 18,
                  "parentId": 16,
                  "name": "Shirts",
                  "seoname": "Kids Shirts",
                  "seourl": "cheap-kids-shirts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-shirts.jpg",
                  "filters": null
                },
                {
                  "id": 19,
                  "parentId": 16,
                  "name": "Hoodies",
                  "seoname": "Kids Hoodies",
                  "seourl": "cheap-kids-hoodies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-hoodies.jpg",
                  "filters": null
                },
                {
                  "id": 20,
                  "parentId": 16,
                  "name": "Jumpers",
                  "seoname": "Kids Jumpers",
                  "seourl": "cheap-kids-jumpers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-jumpers.jpg",
                  "filters": null
                },
                {
                  "id": 21,
                  "parentId": 16,
                  "name": "Jeans",
                  "seoname": "Kids Jeans",
                  "seourl": "cheap-kids-jeans-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-jeans.jpg",
                  "filters": null
                },
                {
                  "id": 22,
                  "parentId": 16,
                  "name": "Trousers",
                  "seoname": "Kids Trousers",
                  "seourl": "cheap-kids-trousers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-trousers.jpg",
                  "filters": null
                },
                {
                  "id": 23,
                  "parentId": 16,
                  "name": "Shorts",
                  "seoname": "Kids Shorts",
                  "seourl": "cheap-kids-shorts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-shorts.jpg",
                  "filters": null
                },
                {
                  "id": 24,
                  "parentId": 16,
                  "name": "Coats",
                  "seoname": "Kids Coats",
                  "seourl": "cheap-kids-coats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-coats.jpg",
                  "filters": null
                },
                {
                  "id": 25,
                  "parentId": 16,
                  "name": "Swimwear",
                  "seoname": "Kids Swimwear",
                  "seourl": "cheap-kids-swimwear-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-swimwear.jpg",
                  "filters": null
                },
                {
                  "id": 26,
                  "parentId": 16,
                  "name": "Accessories",
                  "seoname": "Kids Accessories",
                  "seourl": "cheap-kids-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-accessories.jpg",
                  "filters": null
                },
                {
                  "id": 27,
                  "parentId": 16,
                  "name": "Shoes",
                  "seoname": "Kids Shoes",
                  "seourl": "cheap-kids-shoes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/boys-shoes.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 28,
              "parentId": 1,
              "name": "Products",
              "seoname": "Kids Products",
              "seourl": "cheap-kids-products-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/products.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 29,
                  "parentId": 28,
                  "name": "Prams",
                  "seoname": "Kids Prams",
                  "seourl": "cheap-kids-prams-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/prams.jpg",
                  "filters": null
                },
                {
                  "id": 30,
                  "parentId": 28,
                  "name": "Car seats",
                  "seoname": "Kids Car seats",
                  "seourl": "cheap-kids-car-seats-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/car-seats.jpg",
                  "filters": null
                },
                {
                  "id": 31,
                  "parentId": 28,
                  "name": "Nursery",
                  "seoname": "Kids Nursery",
                  "seourl": "cheap-kids-nursery-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/nursery.jpg",
                  "filters": null
                },
                {
                  "id": 32,
                  "parentId": 28,
                  "name": "Feeding",
                  "seoname": "Kids Feeding",
                  "seourl": "cheap-kids-feeding-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/feeding.jpg",
                  "filters": null
                },
                {
                  "id": 33,
                  "parentId": 28,
                  "name": "Changing",
                  "seoname": "Kids Changing",
                  "seourl": "cheap-kids-changing-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/changing.jpg",
                  "filters": null
                },
                {
                  "id": 34,
                  "parentId": 28,
                  "name": "Care",
                  "seoname": "Kids Care",
                  "seourl": "cheap-kids-care-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/care.jpg",
                  "filters": null
                },
                {
                  "id": 35,
                  "parentId": 28,
                  "name": "Safety",
                  "seoname": "Kids Safety",
                  "seourl": "cheap-kids-safety-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/safety.jpg",
                  "filters": null
                },
                {
                  "id": 36,
                  "parentId": 28,
                  "name": "Maternity",
                  "seoname": "Kids Maternity",
                  "seourl": "cheap-kids-maternity-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/maternity.jpg",
                  "filters": null
                },
                {
                  "id": 37,
                  "parentId": 28,
                  "name": "Accessories",
                  "seoname": "Kids Accessories",
                  "seourl": "cheap-kids-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/products-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 38,
              "parentId": 1,
              "name": "Toys",
              "seoname": "Kids Toys",
              "seourl": "cheap-kids-toys-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 39,
                  "parentId": 38,
                  "name": "Crafts",
                  "seoname": "Kids Crafts",
                  "seourl": "cheap-kids-crafts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-craft.jpg",
                  "filters": null
                },
                {
                  "id": 40,
                  "parentId": 38,
                  "name": "Dolls",
                  "seoname": "Kids Dolls",
                  "seourl": "cheap-kids-dolls-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-dolls.jpg",
                  "filters": null
                },
                {
                  "id": 41,
                  "parentId": 38,
                  "name": "Education",
                  "seoname": "Kids Education",
                  "seourl": "cheap-kids-education-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-education.jpg",
                  "filters": null
                },
                {
                  "id": 42,
                  "parentId": 38,
                  "name": "Playsets",
                  "seoname": "Kids Playsets",
                  "seourl": "cheap-kids-playsets-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-playsets.jpg",
                  "filters": null
                },
                {
                  "id": 43,
                  "parentId": 38,
                  "name": "Games",
                  "seoname": "Kids Games",
                  "seourl": "cheap-kids-games-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-games.jpg",
                  "filters": null
                },
                {
                  "id": 44,
                  "parentId": 38,
                  "name": "Books",
                  "seoname": "Kids Books",
                  "seourl": "cheap-kids-books-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-books.jpg",
                  "filters": null
                },
                {
                  "id": 45,
                  "parentId": 38,
                  "name": "Outdoors",
                  "seoname": "Kids Outdoors",
                  "seourl": "cheap-kids-outdoors-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/kids/toys-outdoors.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 328,
          "parentId": null,
          "name": "Electronics",
          "seoname": "Electronics Items",
          "seourl": "cheap-electronics-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/electronics.png",
          "filters": null,
          "categories": [
            {
              "id": 329,
              "parentId": 328,
              "name": "Computers",
              "seoname": "Electronics Computers",
              "seourl": "cheap-electronics-computers-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/computers.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 330,
                  "parentId": 329,
                  "name": "Tablets",
                  "seoname": "Electronics Tablets",
                  "seourl": "cheap-electronics-tablets-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/tablets.jpg",
                  "filters": null
                },
                {
                  "id": 331,
                  "parentId": 329,
                  "name": "E-reader",
                  "seoname": "Electronics E-reader",
                  "seourl": "cheap-electronics-e-reader-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/e-reader.jpg",
                  "filters": null
                },
                {
                  "id": 332,
                  "parentId": 329,
                  "name": "Watches",
                  "seoname": "Electronics Watches",
                  "seourl": "cheap-electronics-watches-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/watches.jpg",
                  "filters": null
                },
                {
                  "id": 333,
                  "parentId": 329,
                  "name": "Laptops",
                  "seoname": "Electronics Laptops",
                  "seourl": "cheap-electronics-laptops-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/laptops.jpg",
                  "filters": null
                },
                {
                  "id": 334,
                  "parentId": 329,
                  "name": "Printers",
                  "seoname": "Electronics Printers",
                  "seourl": "cheap-electronics-printers-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/printers.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 335,
              "parentId": 328,
              "name": "Camera",
              "seoname": "Electronics Camera",
              "seourl": "cheap-electronics-camera-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/camera.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 336,
                  "parentId": 335,
                  "name": "Cameras",
                  "seoname": "Electronics Cameras",
                  "seourl": "cheap-electronics-cameras-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/camera-cameras.jpg",
                  "filters": null
                },
                {
                  "id": 337,
                  "parentId": 335,
                  "name": "Video",
                  "seoname": "Electronics Video",
                  "seourl": "cheap-electronics-video-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/camera-video.jpeg",
                  "filters": null
                },
                {
                  "id": 338,
                  "parentId": 335,
                  "name": "Accessories",
                  "seoname": "Electronics Accessories",
                  "seourl": "cheap-electronics-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/camera-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 339,
              "parentId": 328,
              "name": "AV",
              "seoname": "Electronics AV",
              "seourl": "cheap-electronics-av-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/av.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 340,
                  "parentId": 339,
                  "name": "TV",
                  "seoname": "Electronics TV",
                  "seourl": "cheap-electronics-tv-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/tv.jpg",
                  "filters": null
                },
                {
                  "id": 341,
                  "parentId": 339,
                  "name": "Headphones",
                  "seoname": "Electronics Headphones",
                  "seourl": "cheap-electronics-headphones-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/headphones.jpg",
                  "filters": null
                },
                {
                  "id": 342,
                  "parentId": 339,
                  "name": "Audio",
                  "seoname": "Electronics Audio",
                  "seourl": "cheap-electronics-audio-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/audio.jpg",
                  "filters": null
                },
                {
                  "id": 343,
                  "parentId": 339,
                  "name": "Audio accessories",
                  "seoname": "Electronics Audio accessories",
                  "seourl": "cheap-electronics-audio-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/audio-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 344,
              "parentId": 328,
              "name": "Mobile",
              "seoname": "Electronics Mobile",
              "seourl": "cheap-electronics-mobile-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/mobile.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 345,
                  "parentId": 344,
                  "name": "Smartphones",
                  "seoname": "Electronics Smartphones",
                  "seourl": "cheap-electronics-smartphones-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/smartphones.jpg",
                  "filters": null
                },
                {
                  "id": 346,
                  "parentId": 344,
                  "name": "Cases",
                  "seoname": "Electronics Cases",
                  "seourl": "cheap-electronics-cases-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/cases.jpg",
                  "filters": null
                },
                {
                  "id": 347,
                  "parentId": 344,
                  "name": "Accessories",
                  "seoname": "Electronics Accessories",
                  "seourl": "cheap-electronics-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/mobile-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 348,
              "parentId": 328,
              "name": "Music",
              "seoname": "Electronics Music",
              "seourl": "cheap-electronics-music-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/music.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 349,
                  "parentId": 348,
                  "name": "DJ",
                  "seoname": "Electronics DJ",
                  "seourl": "cheap-electronics-dj-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/dj.jpg",
                  "filters": null
                },
                {
                  "id": 350,
                  "parentId": 348,
                  "name": "Production",
                  "seoname": "Electronics Production",
                  "seourl": "cheap-electronics-production-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/electronics/production.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 364,
          "parentId": null,
          "name": "Beauty",
          "seoname": "Beauty Items",
          "seourl": "cheap-beauty-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/beauty.jpg",
          "filters": null,
          "categories": [
            {
              "id": 365,
              "parentId": 364,
              "name": "Perfume",
              "seoname": "Beauty Perfume",
              "seourl": "cheap-beauty-perfume-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/perfume.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 366,
                  "parentId": 365,
                  "name": "Women",
                  "seoname": "Beauty Women",
                  "seourl": "cheap-beauty-women-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/women.jpg",
                  "filters": null
                },
                {
                  "id": 367,
                  "parentId": 365,
                  "name": "Men",
                  "seoname": "Beauty Men",
                  "seourl": "cheap-beauty-men-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/men.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 368,
              "parentId": 364,
              "name": "Hair",
              "seoname": "Beauty Hair",
              "seourl": "cheap-beauty-hair-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/hair.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 369,
                  "parentId": 368,
                  "name": "Products",
                  "seoname": "Beauty Products",
                  "seourl": "cheap-beauty-products-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/hair-products.jpg",
                  "filters": null
                },
                {
                  "id": 370,
                  "parentId": 368,
                  "name": "Treatments",
                  "seoname": "Beauty Treatments",
                  "seourl": "cheap-beauty-treatments-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/hair-treatments.jpg",
                  "filters": null
                },
                {
                  "id": 371,
                  "parentId": 368,
                  "name": "Styling",
                  "seoname": "Beauty Styling",
                  "seourl": "cheap-beauty-styling-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/hair-styling.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 372,
              "parentId": 364,
              "name": "Skin",
              "seoname": "Beauty Skin",
              "seourl": "cheap-beauty-skin-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/skin.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 373,
                  "parentId": 372,
                  "name": "Body",
                  "seoname": "Beauty Body",
                  "seourl": "cheap-beauty-body-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/skin-body.jpg",
                  "filters": null
                },
                {
                  "id": 374,
                  "parentId": 372,
                  "name": "Face",
                  "seoname": "Beauty Face",
                  "seourl": "cheap-beauty-face-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/skin-face.jpg",
                  "filters": null
                },
                {
                  "id": 375,
                  "parentId": 372,
                  "name": "Bath",
                  "seoname": "Beauty Bath",
                  "seourl": "cheap-beauty-bath-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/skin-bath.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 376,
              "parentId": 364,
              "name": "Makeup",
              "seoname": "Beauty Makeup",
              "seourl": "cheap-beauty-makeup-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/makeup.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 377,
                  "parentId": 376,
                  "name": "Face",
                  "seoname": "Beauty Face",
                  "seourl": "cheap-beauty-face-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/makeup-face.jpg",
                  "filters": null
                },
                {
                  "id": 378,
                  "parentId": 376,
                  "name": "Nails",
                  "seoname": "Beauty Nails",
                  "seourl": "cheap-beauty-nails-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/makeup-nails.jpg",
                  "filters": null
                },
                {
                  "id": 379,
                  "parentId": 376,
                  "name": "Brushes",
                  "seoname": "Beauty Brushes",
                  "seourl": "cheap-beauty-brushes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/makeup-brushes.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 380,
              "parentId": 364,
              "name": "Accessories",
              "seoname": "Beauty Accessories",
              "seourl": "cheap-beauty-accessories-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/accessories.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 381,
                  "parentId": 380,
                  "name": "Bags",
                  "seoname": "Beauty Bags",
                  "seourl": "cheap-beauty-bags-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/accessories-bags.jpg",
                  "filters": null
                },
                {
                  "id": 382,
                  "parentId": 380,
                  "name": "Brushes",
                  "seoname": "Beauty Brushes",
                  "seourl": "cheap-beauty-brushes-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/accessories-brushes.jpg",
                  "filters": null
                },
                {
                  "id": 383,
                  "parentId": 380,
                  "name": "Mirrors",
                  "seoname": "Beauty Mirrors",
                  "seourl": "cheap-beauty-mirrors-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/beauty/accessories-mirrors.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 283,
          "parentId": null,
          "name": "Home",
          "seoname": "Home Items",
          "seourl": "cheap-home-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/home.jpg",
          "filters": null,
          "categories": [
            {
              "id": 284,
              "parentId": 283,
              "name": "Decor",
              "seoname": "Home Decor",
              "seourl": "cheap-home-decor-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/decor.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 285,
                  "parentId": 284,
                  "name": "Soft",
                  "seoname": "Home Soft",
                  "seourl": "cheap-home-soft-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/decor-soft.jpg",
                  "filters": null
                },
                {
                  "id": 286,
                  "parentId": 284,
                  "name": "Ornaments",
                  "seoname": "Home Ornaments",
                  "seourl": "cheap-home-ornaments-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/decor-ornaments.jpeg",
                  "filters": null
                },
                {
                  "id": 287,
                  "parentId": 284,
                  "name": "Accessories",
                  "seoname": "Home Accessories",
                  "seourl": "cheap-home-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/decor-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 288,
              "parentId": 283,
              "name": "Furniture",
              "seoname": "Home Furniture",
              "seourl": "cheap-home-furniture-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/furniture.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 289,
                  "parentId": 288,
                  "name": "Bedroom",
                  "seoname": "Home Bedroom",
                  "seourl": "cheap-home-bedroom-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/furniture-bedroom.jpg",
                  "filters": null
                },
                {
                  "id": 290,
                  "parentId": 288,
                  "name": "Kitchen",
                  "seoname": "Home Kitchen",
                  "seourl": "cheap-home-kitchen-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/furniture-kitchen.jpeg",
                  "filters": null
                },
                {
                  "id": 291,
                  "parentId": 288,
                  "name": "Living room",
                  "seoname": "Home Living room",
                  "seourl": "cheap-home-living-room-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/furniture-living-room.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 292,
              "parentId": 283,
              "name": "Garden",
              "seoname": "Home Garden",
              "seourl": "cheap-home-garden-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/garden.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 293,
                  "parentId": 292,
                  "name": "Gardening",
                  "seoname": "Home Gardening",
                  "seourl": "cheap-home-gardening-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/garden-gardening.jpeg",
                  "filters": null
                },
                {
                  "id": 294,
                  "parentId": 292,
                  "name": "Furniture",
                  "seoname": "Home Furniture",
                  "seourl": "cheap-home-furniture-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/garden-furniture.jpeg",
                  "filters": null
                },
                {
                  "id": 295,
                  "parentId": 292,
                  "name": "Outdoor",
                  "seoname": "Home Outdoor",
                  "seourl": "cheap-home-outdoor-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/garden-outdoor.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 296,
              "parentId": 283,
              "name": "Appliances",
              "seoname": "Home Appliances",
              "seourl": "cheap-home-appliances-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/appliances.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 297,
                  "parentId": 296,
                  "name": "Large",
                  "seoname": "Home Large",
                  "seourl": "cheap-home-large-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/appliances-large.jpg",
                  "filters": null
                },
                {
                  "id": 298,
                  "parentId": 296,
                  "name": "Small",
                  "seoname": "Home Small",
                  "seourl": "cheap-home-small-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/appliances-small.jpeg",
                  "filters": null
                },
                {
                  "id": 299,
                  "parentId": 296,
                  "name": "Accessories",
                  "seoname": "Home Accessories",
                  "seourl": "cheap-home-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/appliances-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 300,
              "parentId": 283,
              "name": "Kitchen",
              "seoname": "Home Kitchen",
              "seourl": "cheap-home-kitchen-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/kitchen.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 301,
                  "parentId": 300,
                  "name": "Dining",
                  "seoname": "Home Dining",
                  "seourl": "cheap-home-dining-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/kitchen-dining.jpg",
                  "filters": null
                },
                {
                  "id": 302,
                  "parentId": 300,
                  "name": "Appliances",
                  "seoname": "Home Appliances",
                  "seourl": "cheap-home-appliances-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/kitchen-appliances.jpg",
                  "filters": null
                },
                {
                  "id": 303,
                  "parentId": 300,
                  "name": "Accessories",
                  "seoname": "Home Accessories",
                  "seourl": "cheap-home-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/kitchen-accessories.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 304,
              "parentId": 283,
              "name": "DIY",
              "seoname": "Home DIY",
              "seourl": "cheap-home-diy-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/diy.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 305,
                  "parentId": 304,
                  "name": "Power tools",
                  "seoname": "Home Power tools",
                  "seourl": "cheap-home-power-tools-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/diy-power-tools.jpeg",
                  "filters": null
                },
                {
                  "id": 306,
                  "parentId": 304,
                  "name": "Hardware",
                  "seoname": "Home Hardware",
                  "seourl": "cheap-home-hardware-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/home/diy-hardware.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 307,
          "parentId": null,
          "name": "Sport",
          "seoname": "Sport Items",
          "seourl": "cheap-sport-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/sport.jpg",
          "filters": null,
          "categories": [
            {
              "id": 308,
              "parentId": 307,
              "name": "Sport",
              "seoname": "Sport Sport",
              "seourl": "cheap-sport-sport-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/sport.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 309,
                  "parentId": 308,
                  "name": "Indoor",
                  "seoname": "Sport Indoor",
                  "seourl": "cheap-sport-indoor-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/indoor.jpg",
                  "filters": null
                },
                {
                  "id": 310,
                  "parentId": 308,
                  "name": "Outdoor",
                  "seoname": "Sport Outdoor",
                  "seourl": "cheap-sport-outdoor-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/outdoor.jpg",
                  "filters": null
                },
                {
                  "id": 311,
                  "parentId": 308,
                  "name": "Accessories",
                  "seoname": "Sport Accessories",
                  "seourl": "cheap-sport-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/sport-accessories.jpg",
                  "filters": null
                },
                {
                  "id": 312,
                  "parentId": 308,
                  "name": "Kits",
                  "seoname": "Sport Kits",
                  "seourl": "cheap-sport-kits-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/kits.png",
                  "filters": null
                }
              ]
            },
            {
              "id": 313,
              "parentId": 307,
              "name": "Fitness",
              "seoname": "Sport Fitness",
              "seourl": "cheap-sport-fitness-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/fitness.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 314,
                  "parentId": 313,
                  "name": "Gym",
                  "seoname": "Sport Gym",
                  "seourl": "cheap-sport-gym-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/gym.jpg",
                  "filters": null
                },
                {
                  "id": 315,
                  "parentId": 313,
                  "name": "Studio",
                  "seoname": "Sport Studio",
                  "seourl": "cheap-sport-studio-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/studio.jpg",
                  "filters": null
                },
                {
                  "id": 316,
                  "parentId": 313,
                  "name": "Weights",
                  "seoname": "Sport Weights",
                  "seourl": "cheap-sport-weights-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/weights.jpg",
                  "filters": null
                },
                {
                  "id": 317,
                  "parentId": 313,
                  "name": "Accessories",
                  "seoname": "Sport Accessories",
                  "seourl": "cheap-sport-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/fitness-accessories.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 318,
              "parentId": 307,
              "name": "Footwear",
              "seoname": "Sport Footwear",
              "seourl": "cheap-sport-footwear-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/footwear.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 319,
                  "parentId": 318,
                  "name": "Women",
                  "seoname": "Sport Women",
                  "seourl": "cheap-sport-women-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/foot-women.jpg",
                  "filters": null
                },
                {
                  "id": 320,
                  "parentId": 318,
                  "name": "Men",
                  "seoname": "Sport Men",
                  "seourl": "cheap-sport-men-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/foot-men.jpg",
                  "filters": null
                },
                {
                  "id": 321,
                  "parentId": 318,
                  "name": "Kids",
                  "seoname": "Sport Kids",
                  "seourl": "cheap-sport-kids-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/foot-kids.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 322,
              "parentId": 307,
              "name": "Outdoors",
              "seoname": "Sport Outdoors",
              "seourl": "cheap-sport-outdoors-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/outdoors.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 323,
                  "parentId": 322,
                  "name": "Camping",
                  "seoname": "Sport Camping",
                  "seourl": "cheap-sport-camping-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/camping.jpg",
                  "filters": null
                },
                {
                  "id": 324,
                  "parentId": 322,
                  "name": "Hiking",
                  "seoname": "Sport Hiking",
                  "seourl": "cheap-sport-hiking-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/hiking.jpg",
                  "filters": null
                },
                {
                  "id": 325,
                  "parentId": 322,
                  "name": "Fishing",
                  "seoname": "Sport Fishing",
                  "seourl": "cheap-sport-fishing-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/fishing.jpg",
                  "filters": null
                },
                {
                  "id": 326,
                  "parentId": 322,
                  "name": "Biking",
                  "seoname": "Sport Biking",
                  "seourl": "cheap-sport-biking-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/biking.jpg",
                  "filters": null
                },
                {
                  "id": 327,
                  "parentId": 322,
                  "name": "Games",
                  "seoname": "Sport Games",
                  "seourl": "cheap-sport-games-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/sports/games.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 351,
          "parentId": null,
          "name": "Entertainment",
          "seoname": "Entertainment Items",
          "seourl": "cheap-entertainment-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/entertainment.jpg",
          "filters": null,
          "categories": [
            {
              "id": 352,
              "parentId": 351,
              "name": "Consoles",
              "seoname": "Entertainment Consoles",
              "seourl": "cheap-entertainment-consoles-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/consoles.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 353,
                  "parentId": 352,
                  "name": "Games",
                  "seoname": "Entertainment Games",
                  "seourl": "cheap-entertainment-games-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/games.jpg",
                  "filters": null
                },
                {
                  "id": 354,
                  "parentId": 352,
                  "name": "Consoles",
                  "seoname": "Entertainment Consoles",
                  "seourl": "cheap-entertainment-consoles-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/consoles-consoles.jpg",
                  "filters": null
                },
                {
                  "id": 355,
                  "parentId": 352,
                  "name": "VR",
                  "seoname": "Entertainment VR",
                  "seourl": "cheap-entertainment-vr-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/vr.jpg",
                  "filters": null
                },
                {
                  "id": 356,
                  "parentId": 352,
                  "name": "Accessories",
                  "seoname": "Entertainment Accessories",
                  "seourl": "cheap-entertainment-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/consoles-accessories.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 357,
              "parentId": 351,
              "name": "DVD",
              "seoname": "Entertainment DVD",
              "seourl": "cheap-entertainment-dvd-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/dvd.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 358,
                  "parentId": 357,
                  "name": "DVD",
                  "seoname": "Entertainment DVD",
                  "seourl": "cheap-entertainment-dvd-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/dvd-dvd.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 359,
              "parentId": 351,
              "name": "Music",
              "seoname": "Entertainment Music",
              "seourl": "cheap-entertainment-music-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/music.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 360,
                  "parentId": 359,
                  "name": "CD & Vinyl",
                  "seoname": "Entertainment CD & Vinyl",
                  "seourl": "cheap-entertainment-cd-and-vinyl-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/cd-vinyl.jpg",
                  "filters": null
                },
                {
                  "id": 361,
                  "parentId": 359,
                  "name": "DJ",
                  "seoname": "Entertainment DJ",
                  "seourl": "cheap-entertainment-dj-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/dj.jpg",
                  "filters": null
                },
                {
                  "id": 362,
                  "parentId": 359,
                  "name": "Instruments",
                  "seoname": "Entertainment Instruments",
                  "seourl": "cheap-entertainment-instruments-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/instruments.jpg",
                  "filters": null
                },
                {
                  "id": 363,
                  "parentId": 359,
                  "name": "Accessories",
                  "seoname": "Entertainment Accessories",
                  "seourl": "cheap-entertainment-accessories-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/entertainment/music-accessories.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 391,
          "parentId": null,
          "name": "Print",
          "seoname": "Print Items",
          "seourl": "cheap-print-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/print.jpg",
          "filters": null,
          "categories": [
            {
              "id": 392,
              "parentId": 391,
              "name": "Books",
              "seoname": "Print Books",
              "seourl": "cheap-print-books-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/books.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 393,
                  "parentId": 392,
                  "name": "Cookbooks",
                  "seoname": "Print Cookbooks",
                  "seourl": "cheap-print-cookbooks-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/cookbooks.jpg",
                  "filters": null
                },
                {
                  "id": 394,
                  "parentId": 392,
                  "name": "Fiction",
                  "seoname": "Print Fiction",
                  "seourl": "cheap-print-fiction-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/fiction.jpg",
                  "filters": null
                },
                {
                  "id": 395,
                  "parentId": 392,
                  "name": "Non-fiction",
                  "seoname": "Print Non-fiction",
                  "seourl": "cheap-print-non-fiction-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/non-fiction.jpg",
                  "filters": null
                },
                {
                  "id": 396,
                  "parentId": 392,
                  "name": "Other",
                  "seoname": "Print Other",
                  "seourl": "cheap-print-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/books-other.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 397,
              "parentId": 391,
              "name": "Textbooks",
              "seoname": "Print Textbooks",
              "seourl": "cheap-print-textbooks-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/textbooks.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 398,
                  "parentId": 397,
                  "name": "Business",
                  "seoname": "Print Business",
                  "seourl": "cheap-print-business-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/business.jpeg",
                  "filters": null
                },
                {
                  "id": 399,
                  "parentId": 397,
                  "name": "Sciences",
                  "seoname": "Print Sciences",
                  "seourl": "cheap-print-sciences-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/sciences.jpg",
                  "filters": null
                },
                {
                  "id": 400,
                  "parentId": 397,
                  "name": "Engineering",
                  "seoname": "Print Engineering",
                  "seourl": "cheap-print-engineering-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/engineering.jpeg",
                  "filters": null
                },
                {
                  "id": 401,
                  "parentId": 397,
                  "name": "Medicine",
                  "seoname": "Print Medicine",
                  "seourl": "cheap-print-medicine-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/medicine.084.jpeg",
                  "filters": null
                },
                {
                  "id": 402,
                  "parentId": 397,
                  "name": "Law",
                  "seoname": "Print Law",
                  "seourl": "cheap-print-law-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/law.jpg",
                  "filters": null
                },
                {
                  "id": 403,
                  "parentId": 397,
                  "name": "Social",
                  "seoname": "Print Social",
                  "seourl": "cheap-print-social-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/social.jpg",
                  "filters": null
                },
                {
                  "id": 404,
                  "parentId": 397,
                  "name": "Sports",
                  "seoname": "Print Sports",
                  "seourl": "cheap-print-sports-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/sport.jpg",
                  "filters": null
                },
                {
                  "id": 405,
                  "parentId": 397,
                  "name": "Media",
                  "seoname": "Print Media",
                  "seourl": "cheap-print-media-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/media.jpg",
                  "filters": null
                },
                {
                  "id": 406,
                  "parentId": 397,
                  "name": "Arts",
                  "seoname": "Print Arts",
                  "seourl": "cheap-print-arts-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/arts.jpeg",
                  "filters": null
                },
                {
                  "id": 407,
                  "parentId": 397,
                  "name": "Hospitality",
                  "seoname": "Print Hospitality",
                  "seourl": "cheap-print-hospitality-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/hospitality.jpeg",
                  "filters": null
                },
                {
                  "id": 408,
                  "parentId": 397,
                  "name": "Other",
                  "seoname": "Print Other",
                  "seourl": "cheap-print-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/print/textbooks-other.jpg",
                  "filters": null
                }
              ]
            }
          ]
        },
        {
          "id": 384,
          "parentId": null,
          "name": "Pet",
          "seoname": "Pet Items",
          "seourl": "cheap-pet-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/pet.jpg",
          "filters": null,
          "categories": [
            {
              "id": 385,
              "parentId": 384,
              "name": "Accessories",
              "seoname": "Pet Accessories",
              "seourl": "cheap-pet-accessories-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/pets/accessories.jpg",
              "filters": null,
              "categories": []
            }
          ]
        },
        {
          "id": 386,
          "parentId": null,
          "name": "Motors",
          "seoname": "Motors Items",
          "seourl": "cheap-motors-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/motor.jpg",
          "filters": null,
          "categories": [
            {
              "id": 387,
              "parentId": 386,
              "name": "Cars",
              "seoname": "Motors Cars",
              "seourl": "cheap-motors-cars-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/motors/cars.jpeg",
              "filters": null,
              "categories": []
            },
            {
              "id": 388,
              "parentId": 386,
              "name": "Bikes",
              "seoname": "Motors Bikes",
              "seourl": "cheap-motors-bikes-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/motors/bikes.jpg",
              "filters": null,
              "categories": []
            },
            {
              "id": 389,
              "parentId": 386,
              "name": "Parts",
              "seoname": "Motors Parts",
              "seourl": "cheap-motors-parts-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/motors/parts.jpg",
              "filters": null,
              "categories": []
            },
            {
              "id": 390,
              "parentId": 386,
              "name": "Accessories",
              "seoname": "Motors Accessories",
              "seourl": "cheap-motors-accessories-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/motors/accessories.jpg",
              "filters": null,
              "categories": []
            }
          ]
        },
        {
          "id": 409,
          "parentId": null,
          "name": "Other",
          "seoname": "Other Items",
          "seourl": "cheap-other-items-for-sale",
          "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/images/other.jpg",
          "filters": null,
          "categories": [
            {
              "id": 410,
              "parentId": 409,
              "name": "Handmade",
              "seoname": "Other Handmade",
              "seourl": "cheap-other-handmade-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/handmade.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 411,
                  "parentId": 410,
                  "name": "Home",
                  "seoname": "Other Home",
                  "seourl": "cheap-other-home-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/handmade-home.jpg",
                  "filters": null
                },
                {
                  "id": 412,
                  "parentId": 410,
                  "name": "Wedding",
                  "seoname": "Other Wedding",
                  "seourl": "cheap-other-wedding-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/handmade-wedding.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 413,
              "parentId": 409,
              "name": "Travel",
              "seoname": "Other Travel",
              "seourl": "cheap-other-travel-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/travel.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 414,
                  "parentId": 413,
                  "name": "Luggage",
                  "seoname": "Other Luggage",
                  "seourl": "cheap-other-luggage-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/travel-luggage.jpeg",
                  "filters": null
                },
                {
                  "id": 415,
                  "parentId": 413,
                  "name": "Other",
                  "seoname": "Other Other",
                  "seourl": "cheap-other-other-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/travel-other.jpeg",
                  "filters": null
                }
              ]
            },
            {
              "id": 416,
              "parentId": 409,
              "name": "Vintage",
              "seoname": "Other Vintage",
              "seourl": "cheap-other-vintage-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/vintage.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 417,
                  "parentId": 416,
                  "name": "Home",
                  "seoname": "Other Home",
                  "seourl": "cheap-other-home-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/vintage-home.jpg",
                  "filters": null
                },
                {
                  "id": 418,
                  "parentId": 416,
                  "name": "Clothing",
                  "seoname": "Other Clothing",
                  "seourl": "cheap-other-clothing-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/vintage-clothing.jpeg",
                  "filters": null
                },
                {
                  "id": 419,
                  "parentId": 416,
                  "name": "Collectibles",
                  "seoname": "Other Collectibles",
                  "seourl": "cheap-other-collectibles-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/vintage-collectibles.jpeg",
                  "filters": null
                },
                {
                  "id": 420,
                  "parentId": 416,
                  "name": "Antiques",
                  "seoname": "Other Antiques",
                  "seourl": "cheap-other-antiques-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/vintage-antiques.jpg",
                  "filters": null
                }
              ]
            },
            {
              "id": 421,
              "parentId": 409,
              "name": "Craft",
              "seoname": "Other Craft",
              "seourl": "cheap-other-craft-for-sale",
              "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/craft.jpg",
              "filters": null,
              "categories": [
                {
                  "id": 422,
                  "parentId": 421,
                  "name": "Art supplies",
                  "seoname": "Other Art supplies",
                  "seourl": "cheap-other-art-supplies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/craft-art-supplies.jpg",
                  "filters": null
                },
                {
                  "id": 423,
                  "parentId": 421,
                  "name": "Party supplies",
                  "seoname": "Other Party supplies",
                  "seourl": "cheap-other-party-supplies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/craft-party-supplies.jpg",
                  "filters": null
                },
                {
                  "id": 424,
                  "parentId": 421,
                  "name": "Craft supplies",
                  "seoname": "Other Craft supplies",
                  "seourl": "cheap-other-craft-supplies-for-sale",
                  "imageUrl": "https://paperclip-production-api-storage.s3.eu-west-2.amazonaws.com/category-images/other/craft-supplies.jpeg",
                  "filters": null
                }
              ]
            }
          ]
        }
      ]
};

// Step 1: Flatten categories with external IDs
function flattenCategories(categories, level, parentIndex = 0) {
  let result = [];
  
  categories.forEach((category, index) => {
    // Calculate display_order based on parent index and current position
    const displayOrder = parentIndex * 1000 + index + 1;
    
    // Create timestamps
    const currentTimestamp = new Date().toISOString();
    
    let catObj = {
      paperclip_marketplace_id: category.id,
      paperclip_marketplace_parent_id: category.parentId,
      name: category.name,
      seoname: category.seoname,
      seourl: category.seourl,
      image_url: category.imageUrl,
      level: level,
      display_order: displayOrder,
      created_at: currentTimestamp,
      updated_at: currentTimestamp
    };
    
    result.push(catObj);
    
    if (category.categories && category.categories.length > 0) {
      // Pass the current category's id as the parentIndex for its children
      let subCats = flattenCategories(category.categories, level + 1, category.id);
      result = result.concat(subCats);
    }
  });
  
  return result;
}

// Step 2: Create a mapping between external IDs and UUIDs
async function createExternalIdMap(flatCategories) {
  // Create a map to store paperclip_marketplace_id -> uuid mappings
  const idMap = new Map();
  
  // First, find existing categories to maintain their UUIDs
  for (const category of flatCategories) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, paperclip_marketplace_id')
      .eq('paperclip_marketplace_id', category.paperclip_marketplace_id)
      .maybeSingle();
    
    if (data) {
      idMap.set(category.paperclip_marketplace_id, data.id);
    }
  }
  
  // For categories not found, generate new UUIDs
  for (const category of flatCategories) {
    if (!idMap.has(category.paperclip_marketplace_id)) {
      idMap.set(category.paperclip_marketplace_id, uuidv4());
    }
  }
  
  return idMap;
}

// Main function to process and insert data
async function syncCategories() {
  try {
    // Step 1: Flatten the categories
    const topLevelCategories = jsonData.data;
    const flatCategories = flattenCategories(topLevelCategories, 1);
    
    // Step 2: Create a mapping of external IDs to UUIDs
    const idMap = await createExternalIdMap(flatCategories);
    
    // Step 3: Transform flattened categories with UUIDs
    const categoriesToUpsert = flatCategories.map(category => {
      // Get UUID for this category
      const id = idMap.get(category.paperclip_marketplace_id);
      
      // Get parent UUID if it exists
      let parent_id = null;
      if (category.paperclip_marketplace_parent_id) {
        parent_id = idMap.get(category.paperclip_marketplace_parent_id) || null;
      }
      
      return {
        id,                     // UUID primary key
        parent_id,              // UUID foreign key
        paperclip_marketplace_id: category.paperclip_marketplace_id,
        paperclip_marketplace_parent_id: category.paperclip_marketplace_parent_id,
        name: category.name,
        seoname: category.seoname,
        seourl: category.seourl,
        image_url: category.image_url,
        level: category.level,
        display_order: category.display_order,
        created_at: category.created_at,
        updated_at: category.updated_at
      };
    });
    
    // Step 4: Upsert the transformed categories
    const { data, error } = await supabase
      .from('categories')
      .upsert(categoriesToUpsert, { 
        onConflict: 'id',
        returning: 'minimal'
      });

    if (error) {
      console.error('Error upserting categories:', error);
    } else {
      console.log('Successfully synced categories');
      console.log(`Total categories processed: ${categoriesToUpsert.length}`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the sync operation
syncCategories();