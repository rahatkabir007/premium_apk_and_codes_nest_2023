import { Injectable } from '@nestjs/common';
import { CreateHustleDto } from './dto/create-hustle.dto';
import { UpdateHustleDto } from './dto/update-hustle.dto';
import { HUSTLE, HUSTLEDocument } from './schemas/hustle.schema';
import { Model } from 'mongoose';
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';

import { hustlePageImgbbPage } from 'src/utils/HustleScrapping/HustlePageImgbbPage';
import { downloadImage } from 'src/utils/HustleScrapping/HustleScrappingImgbb';
let isWorking = false

interface AdultContentNew {
  imgText: string;
  hustleTitle: string;
  imgSrc?: string;
  workType: Array<string>;
  jobType: string;
  workTypeFullText: string;
  companyDemoIcon: string;
  companyDemoDesc: Array<string>;
  signUpurl: string;
  equipmentAll: Array<string>;
  averagePay: Array<string>;
  makingMoney: Array<string>;
  platformPricing: Array<string>;
  audience: Array<string>;
  founded: Array<string>;
  founding: string;
  imgbbImgSrc?: string; // Add the imgbbImgSrc property
}

const adultContent = [
  {
    "imgText": "🍴",
    "hustleTitle": "Robal",
    "imgSrc": "http://web.archive.org/web/20221201123324/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/d767a844-e36b-4d20-878c-d94260db5b08.jpg",
    "workType": [
      "Chef",
      "Restaurant Worker"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈   Restaurant Worker",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Take shifts working in the food beverage hospitality industry. Serving, bartending, food running, housekeeping, cooking, cashier, serving etc. Show up, work, get paid quick!"
    ],
    "signUpurl": "https://robal.app/",
    "equipmentAll": [
      " Age 18+Smartphone with data"
    ],
    "averagePay": [
      "$2,000/month"
    ],
    "makingMoney": [
      "25,000"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2017"
    ],
    "founding": "Undisclosed",
    "imgbbImgSrc": "https://i.ibb.co/dWVs30y/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "Curtsy",
    "imgSrc": "http://web.archive.org/web/20221201133603/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/00ac8c21-ad09-4725-93f2-e8787dde20fe.jpg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Reseller",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Sell your cutest women's clothing, both vintage and designer, with ease."
    ],
    "signUpurl": "https://curtsyapp.com/faq/selling",
    "equipmentAll": [
      "Items to sell including most types of women's clothing that are in new, like-new, or excellent condition with no stains or damageDevice to clearly photograph items and access CurtsyAbility to ship items"
    ],
    "averagePay": [
      "No data",
      ""
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "20% platform fee or $3 for items under $15"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2015"
    ],
    "founding": "$1.6M",
    "imgbbImgSrc": "https://i.ibb.co/3hBqfwR/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "Depop",
    "imgSrc": "http://web.archive.org/web/20221201135450/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/35fb21d4-07b1-43c0-95a2-078880cfeaa2.jpg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Reseller",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Start selling secondhand clothes or other unique items on an online fashion marketplace."
    ],
    "signUpurl": "https://depop.app.link/side_hustle_stack",
    "equipmentAll": [
      "Items to sell including vintage, luxury, and secondhand fashionDevice to clearly photograph items and access DepopAbility to ship items"
    ],
    "averagePay": [
      "Unknown, but the average sale is $30"
    ],
    "makingMoney": [
      "Unknown, however the site has 21 million+ users and 140,000 items are listed per day"
    ],
    "platformPricing": [
      "10% platform fee & 2.9% + $0.20 for transaction costs"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2011"
    ],
    "founding": "$105.6M",
    "imgbbImgSrc": "https://i.ibb.co/6mZx7Ff/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "Grailed",
    "imgSrc": "http://web.archive.org/web/20221127002223/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/498e72f0-53b0-433e-9d50-9a11a0ec68fe.jpg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Reseller",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Become a seller in a curated community marketplace for men's clothing."
    ],
    "signUpurl": "https://www.grailed.com/",
    "equipmentAll": [
      "Items to sell such as high-quality, coveted items (think luxury), new streetwear releases and drops, high-end classic menswear, well-known mass-market brands, and vintage clothing A device to photograph your items and use Grailed withAbility to ship items"
    ],
    "averagePay": [
      "No Data",
      ""
    ],
    "makingMoney": [
      "Unknown, however, the site has 3.7 million users (2019)"
    ],
    "platformPricing": [
      "9% commission fee"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2013"
    ],
    "founding": "$16.5M",
    "imgbbImgSrc": "https://i.ibb.co/JsKp8GX/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "Object Limited",
    "imgSrc": "http://web.archive.org/web/20221127002223/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/d152f3fe-790a-40d8-9b0e-dccefa44692f.jpg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈  Reseller",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Sell vintage clothes."
    ],
    "signUpurl": "https://object.limited/",
    "equipmentAll": [
      "Clothing to sellComputer or phone "
    ],
    "averagePay": [
      "$500/month"
    ],
    "makingMoney": [
      "5,000"
    ],
    "platformPricing": [
      "15% take rate"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2018"
    ],
    "founding": "Undisclosed",
    "imgbbImgSrc": "https://i.ibb.co/mqD4Trv/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "Poshmark",
    "imgSrc": "http://web.archive.org/web/20221201125316/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/487f8fab-cfa8-4b4e-a50d-d25f732b1b4a.jpg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Reseller",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Become a seller on the largest social marketplace for fashion."
    ],
    "signUpurl": "https://poshmark.com/sell",
    "equipmentAll": [
      "Items to sell including fashion, accessories, new personal care products, and select home goodsDevice to clearly photograph items and access PoshmarkAbility to ship items"
    ],
    "averagePay": [
      "Unknown, however top sellers have been able to pull in amounts ranging from $10,000 to around $100,000 a year",
      ""
    ],
    "makingMoney": [
      "5 million sellers (2019)"
    ],
    "platformPricing": [
      "For sales under $15, the fee is a flat rate of $2.95. For sales above $15, the fee is 20% and you keep 80%"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2011"
    ],
    "founding": "$153M",
    "imgbbImgSrc": "https://i.ibb.co/V28DLyF/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "ReGlamed",
    "imgSrc": "http://web.archive.org/web/20221127002319/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/7568fe01-9b3e-49db-9a46-2db197aecc87.jpeg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈  Reseller",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Earn cash for your formal dresses for including prom, pageant, balls, gala dresses, and more."
    ],
    "signUpurl": "https://reglamed.com/",
    "equipmentAll": [
      "PayPal accountComputer with internet connection"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "100"
    ],
    "platformPricing": [
      "10% commission fee"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2020"
    ],
    "founding": "Bootstrapped",
    "imgbbImgSrc": "https://i.ibb.co/89s35jf/image.png"
  },
  {
    "imgText": "👟",
    "hustleTitle": "Thryft",
    "imgSrc": "http://web.archive.org/web/20221201132537/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/e4226fc6-6c96-4c64-802b-a6717ecb8029.jpg",
    "workType": [
      "Reseller"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈   Reseller",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Turn your Instagram page into a shoppable website in <1 minute!"
    ],
    "signUpurl": "https://www.thryft.shop/signup",
    "equipmentAll": [
      "An Instagram account for your businessA computer or phone to maintain your Instagram business and Thryft site"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "45"
    ],
    "platformPricing": [
      "We take a 2.9% + $0.30 payment processing fee and a 1.9% + $0.10 platform fee out of each transaction. There is no additional fee to create or sell through your site. However, we offer premium subscription plans that are priced at $6/month and $15/month for features like custom domains, analytics, scheduled drops & more."
    ],
    "audience": [
      "Would be helpful"
    ],
    "founded": [
      "2020 "
    ],
    "founding": "$405K",
    "imgbbImgSrc": "https://i.ibb.co/rGT3ssn/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "ConvertKit",
    "imgSrc": "http://web.archive.org/web/20221201125049/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/3685ffee-e474-4318-8ea4-ee467fdcfcda.jpg",
    "workType": [
      "Writer",
      "E-commerce",
      "Coach"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer      👈 E-commerce    👈 Coach",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "With ConvertKit Commerce, set up one-time purchases for products like an ebook or recurring subscriptions for monthly newsletters."
    ],
    "signUpurl": "https://convertkit.com/?lmref=ct6pHQ",
    "equipmentAll": [
      "Computer"
    ],
    "averagePay": [
      "No data",
      ""
    ],
    "makingMoney": [
      "33,164 (Nov. 2020)"
    ],
    "platformPricing": [
      "$0, $29, and $59/mo plans available"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2013"
    ],
    "founding": "Bootstrapped",
    "imgbbImgSrc": "https://i.ibb.co/L1x6R0M/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Ghost",
    "imgSrc": "http://web.archive.org/web/20221024181156/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/f97607e3-18b9-4c50-9986-70188404c68b.jpg",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Turn your audience into a business as an independent creator using memberships and subscriptions to generate predictable, recurring revenue."
    ],
    "signUpurl": "https://ghost.org/",
    "equipmentAll": [
      "Appropriate technology for writing and publishing content"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "0% fee, but $29/month (basic plan) to $199/month (business plan)"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2013"
    ],
    "founding": "No information",
    "imgbbImgSrc": "https://i.ibb.co/mD6x51m/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Medium",
    "imgSrc": "http://web.archive.org/web/20221024181152/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/e527ad13-49e3-4715-a5bf-1daa6e3d657d.png",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Write about what matters to you, build an audience, and earn money when members read your stories."
    ],
    "signUpurl": "https://medium.com/",
    "equipmentAll": [
      "Appropriate technology for writing and publishing content"
    ],
    "averagePay": [
      "Somewhere between $0-100 for smaller creators, upwards of $25,000 for large creators (2020)"
    ],
    "makingMoney": [
      "1000+ (2018)"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2011"
    ],
    "founding": "$132M",
    "imgbbImgSrc": "https://i.ibb.co/KqwCXBT/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Mirror",
    "imgSrc": "http://web.archive.org/web/20221201125534/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/559681bf-9482-4fd7-a858-91acfb4ecfe3.jpg",
    "workType": [
      "Writer"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈  Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Mirror is a crypto-native publishing platform. Here are some ways you can earn money with Mirror:",
      "Enable reader tipsSell your content as NFTsRaise crowdfunding for a projectMuch, much more!"
    ],
    "signUpurl": "https://mirror.xyz/race",
    "equipmentAll": [
      "Computer with internet connectionA Mirror publication can be obtained in exchange for 1 $WRITE token (see platform pricing)"
    ],
    "averagePay": [
      "Unknown"
    ],
    "makingMoney": [
      "200"
    ],
    "platformPricing": [
      "A Mirror publication can be obtained in exchange for 1 $WRITE token (see platform pricing)"
    ],
    "audience": [
      "Audience is helpful"
    ],
    "founded": [
      "2020"
    ],
    "founding": "Much, much more!",
    "imgbbImgSrc": "https://i.ibb.co/zSnWL7M/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Revue",
    "imgSrc": "http://web.archive.org/web/20221127002226/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/65a3b765-e2f2-4d7a-8224-14a588860d6b.png",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Share newsletters and monetize loyal audiences using digital subscriptions, sponsoring, ads or other business models."
    ],
    "signUpurl": "https://www.getrevue.co/",
    "equipmentAll": [
      "Appropriate technology for writing and publishing content"
    ],
    "averagePay": [
      "Some writers earning up to $1,500/month (2019)"
    ],
    "makingMoney": [
      "30,000+ (2018)"
    ],
    "platformPricing": [
      "Free for the first 50 subscribers, pricing increases as subs increase. 6% transaction fee"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2015"
    ],
    "founding": "~$475k",
    "imgbbImgSrc": "https://i.ibb.co/rwZQShD/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Substack",
    "imgSrc": "http://web.archive.org/web/20221024181152/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/be6a286d-2c76-4d6e-b2e7-180a09815463.png",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Start a newsletter, build your community, and make money from subscriptions."
    ],
    "signUpurl": "https://substack.com/signup?utm_source=substack",
    "equipmentAll": [
      "Appropriate technology for writing and publishing content"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "100,000+"
    ],
    "platformPricing": [
      "10% platform fee"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2017"
    ],
    "founding": "$17.4M",
    "imgbbImgSrc": "https://i.ibb.co/XsMLbVp/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Tales",
    "imgSrc": "http://web.archive.org/web/20221024181154/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/9ac34ff8-61f9-4405-a7ed-54037f9cc62c.jpg",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Publish your book in a re-imagined way, app-centered way, with new text formats, sounds, visual effects, and interactive storytelling. Your story can feel similar to a traditional book, complex game or anything in between."
    ],
    "signUpurl": "http://taleswriter.com/publish/",
    "equipmentAll": [
      "Appropriate technology for writing and publishingPassion for storytelling"
    ],
    "averagePay": [
      "No data",
      ""
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "100% ownership with 35% royalty rate or sponsored publishing with 75% ownership and 25% royalty rate"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2018"
    ],
    "founding": "No data",
    "imgbbImgSrc": "https://i.ibb.co/stVwLpf/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Trusty Oak",
    "imgSrc": "http://web.archive.org/web/20221024181152/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/23cec2bb-d7c2-47e8-b1b2-57c53ba01008.jpg",
    "workType": [
      "Writer",
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Turn your marketing, task management, and other skills into a lucrative opportunity by becoming a Virtual Assistant on Trusty Oak — the main point of contact with clients and freelance professionals!"
    ],
    "signUpurl": "https://trustyoak.com/careers-at-trusty-oak/",
    "equipmentAll": [
      "Permanent residence in the United StatesAt least two years of experience as an executive assistant, project manager, office manager or similar roleA dependable computer (Mac or PC) with access to Microsoft OfficeAccess to high-speed internet and a dependable phone"
    ],
    "averagePay": [
      "$20 / hour"
    ],
    "makingMoney": [
      "40 (January 2021)"
    ],
    "platformPricing": [
      "$29 / month"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "\"Trusty Oak was founded in 2015 to support driven people achieving big dreams. We exist first to serve an exclusive, collaborative community of the country’s top freelance virtual assistants by providing coaching and mentoring services, resources, and legitimate opportunities to be hired by their ideal clients.\"\n\n- Amber Gray, Founder & CEO"
    ],
    "founding": "$500k",
    "imgbbImgSrc": "https://i.ibb.co/41RGjJq/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Wattpad",
    "imgSrc": "http://web.archive.org/web/20221127002305/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/5721d0ab-2d26-487f-af80-fa687f740adb.png",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Write about what you love, create new stories, build social communities and get paid for it!"
    ],
    "signUpurl": "http://wattpad.com",
    "equipmentAll": [
      "Appropriate technology for writing and publishing content"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2006"
    ],
    "founding": "$117.8M",
    "imgbbImgSrc": "https://i.ibb.co/bQ30GMr/image.png"
  },
  {
    "imgText": "✍️",
    "hustleTitle": "Wordpress",
    "imgSrc": "http://web.archive.org/web/20221201131724/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/27bb2df8-2da2-4d20-9a30-1742b634409d.png",
    "workType": [
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Writer",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Get creative with blogging and earn money on WordPress by monetizing blog content, creating a paid membership website, selling products or services, or accepting donations"
    ],
    "signUpurl": "https://wordpress.com/",
    "equipmentAll": [
      "Appropriate technology for maintaining a blog"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "Ranges from free–$45/month"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2005"
    ],
    "founding": "$697.9M",
    "imgbbImgSrc": "https://i.ibb.co/dGxqsfS/image.png"
  },
  {
    "imgText": "✨",
    "hustleTitle": "Steady",
    "imgSrc": "http://web.archive.org/web/20221024181152/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/bc68ef89-e904-4fc0-86e9-189e2b90a97e.jpg",
    "workType": [
      "Content Creator",
      "Audio Content Creator",
      "Writer"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈  Content Creator",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Journalists, media makers, and content creators offer memberships to earn a sustainable income for their work through their communities."
    ],
    "signUpurl": "https://steadyhq.com/sign_up",
    "equipmentAll": [
      "Regularly publish contentAge 18+Computer with internet connection"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "1100"
    ],
    "platformPricing": [
      "10% take rate"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2016"
    ],
    "founding": "Undisclosed",
    "imgbbImgSrc": "https://i.ibb.co/gjfcqFb/image.png"
  },
  {
    "imgText": "💻",
    "hustleTitle": "Communo",
    "imgSrc": "http://web.archive.org/web/20220929191643/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/ab97222b-3f6c-4d22-ace8-cdb2f07ff81f.jpg",
    "workType": [
      "Tech",
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tech",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Do freelance work in marketing, creative, technology, and design-related fields for agencies and brands across North America.",
      ""
    ],
    "signUpurl": "https://communo.com/freelancer/",
    "equipmentAll": [
      "Computer with internet connection"
    ],
    "averagePay": [
      "$100/hour, $2,500/month"
    ],
    "makingMoney": [
      "40,000"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2016"
    ],
    "founding": "Undisclosed",
    "imgbbImgSrc": "https://i.ibb.co/Z8rsb64/image.png"
  }

]
@Injectable()
export class HustleService {
  constructor(
    @InjectModel(HUSTLE.name, DATABASE_CONNECTION.TORRENTS)
    private hustleModel: Model<HUSTLEDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  async create(createTorrentDto: CreateHustleDto) {
    const { page } = await hustlePageImgbbPage();
    let newArray: AdultContentNew[] = [];
    for (let i = 0; i < adultContent.length; i++) {
      const result = await downloadImage(page, adultContent[i].imgSrc);
      adultContent[i]['imgbbImgSrcUpdated'] = result;
      console.log('result', result);
      console.log(' adultContent[i]', adultContent[i])
      newArray.push(adultContent[i]);
    }
    console.log('newArray', newArray)
    const jsonData = JSON.stringify(newArray);

    // Specify the file path
    const filePath = './myArray.json';

    // Write the JSON data to the file
    fs.writeFileSync(filePath, jsonData);

    // return 'This action adds a new torrent';
  }
  findAll() {
    return `This action returns all hustle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hustle`;
  }

  update(id: number, updateHustleDto: UpdateHustleDto) {
    return `This action updates a #${id} hustle`;
  }

  remove(id: number) {
    return `This action removes a #${id} hustle`;
  }
}
