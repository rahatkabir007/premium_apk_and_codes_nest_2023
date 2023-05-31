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
    "founding": "$1.6M"
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
    "founding": "$105.6M"
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
    "founding": "$16.5M"
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
    "founding": "Undisclosed"
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
    "founding": "$153M"
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
    "founding": "Bootstrapped"
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
    "founding": "$405K"
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
    "founding": "Bootstrapped"
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
    "founding": "No information"
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
    "founding": "$132M"
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
    "founding": "Much, much more!"
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
    "founding": "~$475k"
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
    "founding": "$17.4M"
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
    "founding": "No data"
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
    "founding": "$500k"
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
    "founding": "$117.8M"
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
    "founding": "$697.9M"
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
    "founding": "Undisclosed"
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
    "founding": "Undisclosed"
  },
  {
    "imgText": "💻",
    "hustleTitle": "FrontWork",
    "imgSrc": "http://web.archive.org/web/20221123045424im_/https://sidehustlestack.co/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2Ffe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8%2Fimages%2Ff242544c-eb55-410f-a3b3-1495b0649805.jpg&w=1920&q=80",
    "workType": [
      "Tech"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tech",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Get paid for your engineering skills and convert designs to code!"
    ],
    "signUpurl": "https://app.frontwork.dev/sign-up#developer",
    "equipmentAll": [
      "Frontend developerComputer"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "120 (2020)"
    ],
    "platformPricing": [
      "$40/hour, $7,500/month"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2020"
    ],
    "founding": "No data"
  },
  {
    "imgText": "💻",
    "hustleTitle": "MetaGame",
    "imgSrc": "http://web.archive.org/web/20220925080133im_/https://sidehustlestack.co/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2Ffe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8%2Fimages%2F483d1a1d-68f2-42b9-8fdb-7a9bfbee1e9c.jpg&w=1920&q=80",
    "workType": [
      "Tech"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈   Tech",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Sell your knowledge or get paid to work on any project with digital skills ranging from drawing & design to programming & project management."
    ],
    "signUpurl": "https://wiki.metagame.wtf/docs/enter-metagame/join-metagame",
    "equipmentAll": [
      "Would be preferable to have some knowledge in the crypto space but its not a requirement. The goal of the platform is to teach people about crypto & help them find their niche or spot to earn in the DAO space.Computer with internet connectionApplication required"
    ],
    "averagePay": [
      "5-160 SEEDs/month (~$60-1900/month)"
    ],
    "makingMoney": [
      "20-30"
    ],
    "platformPricing": [
      "N/A"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "\"What makes it special is that its a decentralized organization without anyone telling you what to do. We all work on our own terms as freelancers but we all get paid in equity & we're all friends - there is no separation between \"the team\" & \"the community\".\nI founded the thing but I am not a CEO - there is no CEO. Among the titles I have, the most precise would be \"Vision Beacon\" in that I laid out the vision though I'm not forcing people to fulfill it, I only help light the way.\"\n\n- MetaGame Creator"
    ],
    "founding": "About 200k but bootstrapped & currently raising"
  },
  {
    "imgText": "🖥️",
    "hustleTitle": "Slip",
    "imgSrc": "http://web.archive.org/web/20221225220955/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/aa96961b-bfaa-4bac-adbd-57a24a6b0776.jpg",
    "workType": [
      "Tech"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈 Tech",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Build and sell interactive programming courses directly to your audience."
    ],
    "signUpurl": "https://www.slip.so/",
    "equipmentAll": [
      " Since Slip is a platform for teaching programming skills, authors must have programming skills to earn money.Computer with internet connectionAge 18+"
    ],
    "averagePay": [
      "No data "
    ],
    "makingMoney": [
      "4"
    ],
    "platformPricing": [
      "$19/mo + 10% take"
    ],
    "audience": [
      "No, however it would be helpful"
    ],
    "founded": [
      "2021"
    ],
    "founding": "Bootstrapped"
  },
  {
    "imgText": "💻",
    "hustleTitle": "Worksome",
    "imgSrc": "http://web.archive.org/web/20221024181234/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/ee1de8ce-21e5-4673-9aff-be9229ee2cb4.jpg",
    "workType": [
      "Tech"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tech",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "An AI-powered platform for freelancers to find jobs in areas like web development, app development, tech/data consulting, engineering, management, design, marketing, and sales."
    ],
    "signUpurl": "https://www.worksome.com/freelance-jobs/",
    "equipmentAll": [
      "Computer and internet connectionTools to complete desired freelance work"
    ],
    "averagePay": [
      "No data, you can set your own hourly rate."
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "4% flat fee commission"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2017"
    ],
    "founding": "$5.9M"
  },
  {
    "imgText": "🍴",
    "hustleTitle": "Qwick",
    "imgSrc": "http://web.archive.org/web/20221201123414/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/da49c8d4-31d3-4b17-9703-b90b1e5f2706.jpg",
    "workType": [
      "Restaurant Worker"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Restaurant Worker",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Get connected to on-demand service industry positions such as food and beverage shifts in real-time."
    ],
    "signUpurl": "https://www.qwick.com/professionals/",
    "equipmentAll": [
      "Cell phone with internet connectionPrior experience in the food & beverage industryEither a food handlers card or alcohol awareness certificate, depending on shift preference"
    ],
    "averagePay": [
      "Average $18.57 per hour. Qwick gives you 10% on top of the hourly rate, to help you out. The highest shifts have been $30+/hr, and the lowest have been minimum wage",
      ""
    ],
    "makingMoney": [
      "4600+ (2018)"
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
    "founding": "$6.1M"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "99 Designs",
    "imgSrc": "http://web.archive.org/web/20221119030248/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/7f893a77-9cde-4bea-a09b-16796f75df4c.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Participate in freelance design work by getting hired to work directly with clients or submit your concepts to Design Contest competitions. You choose the industries, styles, and design categories you want to work in."
    ],
    "signUpurl": "https://99designs.com/designers",
    "equipmentAll": [
      "Technology necessary to access 99 Designs and build out your design solutions "
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "1 million + registered designers (2016) "
    ],
    "platformPricing": [
      "When you start working with a new client, they charge a $100 introduction fee (spread out over the client’s first $500 charges) and a platform fee (from 5-15%, depending on seniority)"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2008"
    ],
    "founding": "$45M"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "AirGarage Space Force",
    "imgSrc": "http://web.archive.org/web/20221201122056/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/2a2321e3-4b89-4a1e-8ec6-ce020066fafc.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Space Force users enforce against illegal parking across the AirGarage network of parking lots. In the app, enforcers use their camera to scan a license plate and then take the appropriate action based on the status of that vehicle."
    ],
    "signUpurl": "https://airtable.com/shr1wOWS7hqm2xKpC",
    "equipmentAll": [
      "Mobile phone, either Android or iOS"
    ],
    "averagePay": [
      "$20/hour, $400/month"
    ],
    "makingMoney": [
      "50 (December 2020)"
    ],
    "platformPricing": [
      "The pay is $0.25 per scan, $0.50 per note left and $40 per car immobilized. So you can earn as much as you want to buy scanning as many cars as you want."
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2018"
    ],
    "founding": "No data"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "CV Knights  ",
    "imgSrc": "http://web.archive.org/web/20221201125620/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/51eff71f-e460-463e-8609-4580483ad43e.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈  Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Assist candidates to boost their CV. Share your expert knowledge tailored to your own industry to make money providing advice."
    ],
    "signUpurl": "https://cvknights.com/dream-big/join-us/",
    "equipmentAll": [
      "Minimum 2 years of professional experience in any job sector, proficiency in English, laptop, internet connection. "
    ],
    "averagePay": [
      "$50/hour, $300/month"
    ],
    "makingMoney": [
      "150 (December 2020)"
    ],
    "platformPricing": [
      "10% platform fee"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2020"
    ],
    "founding": "$0"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Fiverr",
    "imgSrc": "http://web.archive.org/web/20221127002342/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/3daf57b6-0b43-4718-ab5c-8a7ab77f52da.png",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Offer your creative and professional services in a freelance marketplace."
    ],
    "signUpurl": "https://track.fiverr.com/visit/?bta=196086&nci=7416",
    "equipmentAll": [
      "Appropriate technology to do desired freelance work"
    ],
    "averagePay": [
      "Sellers can offer services at a price range of $5-$10,000"
    ],
    "makingMoney": [
      "830,000+ (2019)"
    ],
    "platformPricing": [
      "Buyers pay service fees. Transaction and currency conversion fees may be applied when withdrawing funds"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2010"
    ],
    "founding": "NYSE: FVRR"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Freelancer Club",
    "imgSrc": "http://web.archive.org/web/20220929191642/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/4b0e387f-e3ac-4a8c-9438-b2296f6591cc.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "A community platform for creative freelancers to develop their business skills, access paid job opportunities and get paid doing what they love."
    ],
    "signUpurl": "https://freelancerclub.net/",
    "equipmentAll": [
      "An ability to provide their service to a professional standardComputer with internet connectionAge 16+U.K., E.U., or US based"
    ],
    "averagePay": [
      "$20/hour, $500/month"
    ],
    "makingMoney": [
      "45,000"
    ],
    "platformPricing": [
      "Monthly subscription: Free to $16/month"
    ],
    "audience": [
      "No, however it would be helpful"
    ],
    "founded": [
      "\"Freelancer Club is a member's club founded on the principles of Ethical Hiring. We believe in fair rates of pay, diversity, and inclusion. We do not post unpaid work on the site and we actively champion good practices. Much more than just a jobs board, Freelancer Club nurtures talent and helps companies connect with leading content creators in an ethical manner.\""
    ],
    "founding": "Bootstrapped"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Handy",
    "imgSrc": "http://web.archive.org/web/20221128163919/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/170fc963-0994-4617-a967-32fcf57e8a5a.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Workers can offer home services (cleaning, furniture assembly, TV mounting, interior painting, hanging pictures and shelves, window treatment, etc.)."
    ],
    "signUpurl": "https://handy.com",
    "equipmentAll": [
      "Must have paid experience with the services you are applying forMust be authorized to work in the country you are applying inMust have excellent customer service skills"
    ],
    "averagePay": [
      "$30/hour, more job rates here.",
      ""
    ],
    "makingMoney": [
      "50,000+ "
    ],
    "platformPricing": [
      "Free, however there are potential fees (i.e. Late, No Show, Left Early, etc.)"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2012"
    ],
    "founding": "$110.7M"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Instawork",
    "imgSrc": "http://web.archive.org/web/20221201124808/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/078bffb1-ed9a-4f37-a257-8d3e23ab0ed0.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Businesses post shifts for positions they need (warehouse, custodial, delivery, etc.), up to a few hours in advance. Then, you accept shifts that fit their availability and Instawork handles the paperwork, insurance, and payments."
    ],
    "signUpurl": "https://www.instawork.com/worker",
    "equipmentAll": [
      "Participate in a formal vetting process that requires referencesSmartphoneCurrently available in limited cities"
    ],
    "averagePay": [
      "Pay averages about $110/shift, or about $14-18/hour for a 6-8 hour shift",
      ""
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2015"
    ],
    "founding": "$28M"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Lawn Love",
    "imgSrc": "http://web.archive.org/web/20220925074156im_/https://sidehustlestack.co/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2Ffe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8%2Fimages%2Fbb9ff5a3-e57e-4ae5-8c3f-f64b0799c952.jpg&w=1920&q=80",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Make money mowing lawns and doing lawn maintenance jobs for residential homes"
    ],
    "signUpurl": "https://lawnlove.com/apply",
    "equipmentAll": [
      "Must be age 18+ with a valid social security number or business EINLawnmower, edger, clippersA car or truckMobile phone"
    ],
    "averagePay": [
      "$30/hour",
      "",
      ""
    ],
    "makingMoney": [
      "10,000 (December 2020)"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2014"
    ],
    "founding": "No data"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "LitterRater",
    "imgSrc": "http://web.archive.org/web/20221201135836/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/5e0eba4c-2cf8-44d0-a1c6-56e25e044e92.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Join a web-based incentive program rewarding folks who report and clean litter in their community! Earn points by reporting or cleaning litter and cash in the points for incentives"
    ],
    "signUpurl": "https://litterrater.com/",
    "equipmentAll": [
      "Smart phone or similar device to maintain an online presence"
    ],
    "averagePay": [
      "Estimated around $10 / hour"
    ],
    "makingMoney": [
      "300"
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
    "founding": "$0"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Loopie",
    "imgSrc": "http://web.archive.org/web/20221201133749/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/db8d4a8e-6d0c-47a8-8159-4f951a033fb0.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Task & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Certified Loopie Washers can earn money from the comfort of home using their in-unit washer and dryer to wash, dry, fold & package Loopie customers' laundry. Loopsters are provided with all the materials necessary to complete any Loopie order (detergent, dryer sheets, lint rollers, gloves, etc) and are paid on a per bag basis."
    ],
    "signUpurl": "https://forms.gle/gWGP1rk6P6He9CU19",
    "equipmentAll": [
      "Seattle or Portland basedIn-unit Washer & DryerCell phoneEmail address with Paypal"
    ],
    "averagePay": [
      "$12/hour, $500/month",
      ""
    ],
    "makingMoney": [
      "20 (January 2021)"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2018"
    ],
    "founding": "$1M"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "PICKL",
    "imgSrc": "http://web.archive.org/web/20220925072322im_/https://sidehustlestack.co/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2Ffe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8%2Fimages%2Febc4e4c5-f847-4fa4-9355-7d4eab59803d.jpg&w=1920&q=80",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈  Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Take pictures and answer simple questions about brands at grocery stores. Each competed task pays $5 with same-day cash-out."
    ],
    "signUpurl": "http://pickl.xyz/",
    "equipmentAll": [
      "iPhoneTransportation to specified stores"
    ],
    "averagePay": [
      "$15/hour, $500/month"
    ],
    "makingMoney": [
      "5,000 (December 2020)"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2020"
    ],
    "founding": "$200K"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Rev",
    "imgSrc": "http://web.archive.org/web/20221201141156/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/75c2e929-dd1e-432d-b665-79f6e5a7f782.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈  Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Transcribe audio to text, caption video content, and subtitle English content with foreign languages."
    ],
    "signUpurl": "http://rev.com/freelancers",
    "equipmentAll": [
      "Strong typing skillsFluent in EnglishIf interested in subtitling, translation skills are also necessary"
    ],
    "averagePay": [
      "$10/hour, $245/month"
    ],
    "makingMoney": [
      "50,000 (December 2020)"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2011"
    ],
    "founding": "$35M"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Service Connection",
    "imgSrc": "http://web.archive.org/web/20221201132617/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/ac02507e-d768-436b-b2bb-3f2936848d17.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Select your skill sets from a wide range of available services such as assembly, delivery, home improvement, installation, repair, smart home, and more. Get paid the same day for completed services!"
    ],
    "signUpurl": "https://serviceconnection.pro/Provider/Signup",
    "equipmentAll": [
      "Mobile phone, computer, tablet18+ with a valid social security number or business EINHave verifiable proficiency in your chosen skill setsTransportation applicable to services you offer "
    ],
    "averagePay": [
      "$45/hour"
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "Free for Service Providers"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2020"
    ],
    "founding": "No data"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "TaskRabbit",
    "imgSrc": "http://web.archive.org/web/20221127143129/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/d9028268-f532-49f6-a0ef-6a5c7805fa8b.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "From home repairs to errands, get paid to help others complete a range of tasks."
    ],
    "signUpurl": "https://www.taskrabbit.com/become-a-tasker",
    "equipmentAll": [
      "Age 18+, ID check and valid U.S. Social Security numberOnly available in limited cities (Californians must submit a business license confirming status as sole proprietor)Mobile phone"
    ],
    "averagePay": [
      "Beginner Taskers typically start with earnings ~ $20/hour",
      ""
    ],
    "makingMoney": [
      "60,000+ (2017)"
    ],
    "platformPricing": [
      "$25 registration fee. Service fee is paid by clients"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2008"
    ],
    "founding": "Acquired by Ikea 2017"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Upwork",
    "imgSrc": "http://web.archive.org/web/20221024181145/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/6e53df48-7cb3-4ed0-81be-60ee0f7593b8.png",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Offer your professional talents and skills in an on-demand freelance marketplace."
    ],
    "signUpurl": "https://www.upwork.com/signup/?dest=home",
    "equipmentAll": [
      "Appropriate technology to do desired freelance work and application requiredA successful application showcases skill/expertise in an area recognized by Upwork (including but not limited to mobile/web dev, design, writing, accounting, admin support, etc)"
    ],
    "averagePay": [
      "$15 per hour",
      ""
    ],
    "makingMoney": [
      "800,000+ currently registered freelancers (millions+ past registered freelancers)"
    ],
    "platformPricing": [
      "Sliding service fee based on lifetime billings with each client (starting at 20% down to 5%)."
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "1999"
    ],
    "founding": "NASDAQ: UPWK"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Venku",
    "imgSrc": "http://web.archive.org/web/20221127002156/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/33113491-7fdf-4aaf-b955-1407e79bdff5.jpg",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Earn income by hosting guests for hunting, fishing and other rustic adventures."
    ],
    "signUpurl": "https://www.venku.com/",
    "equipmentAll": [
      "Those providing outdoor experiences through Venku must adhere to all applicable laws & regulations in their State / County, per our Terms of Service. Hosts must keep necessary certifications up-to-date.Bank accountSmartphone with dataApplication required (though, most are accepted)Age 18+"
    ],
    "averagePay": [
      "No data"
    ],
    "makingMoney": [
      "500"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2019"
    ],
    "founding": "Currently raising"
  },
  {
    "imgText": "🔧",
    "hustleTitle": "Wonolo",
    "imgSrc": "http://web.archive.org/web/20221201130335/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/d7b27765-86b2-401c-bcf3-bea816e420a4.png",
    "workType": [
      "Tasks & Services"
    ],
    "jobType": "Gig",
    "workTypeFullText": "👈 Tasks & Services",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Find gig work for a variety of frontline jobs, including warehouse operations, general labor, delivery drivers, food production, event staffing, washing & cleaning, administrative, and merchandising."
    ],
    "signUpurl": "https://www.wonolo.com/find-work",
    "equipmentAll": [
      "Must be age 18+ with a valid social security number or business EIN Mobile phoneAvailable only in limited cities"
    ],
    "averagePay": [
      "$12.29 per hour (2020)",
      ""
    ],
    "makingMoney": [
      "300,000+"
    ],
    "platformPricing": [
      "Free"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2014"
    ],
    "founding": "$52.9M"
  },
  {
    "imgText": "📊",
    "hustleTitle": "Storetasker",
    "imgSrc": "http://web.archive.org/web/20221201143418/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/40566d8c-0926-4291-8a0c-a456cae066fe.jpg",
    "workType": [
      "E-commerce",
      "Tasks & Services"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈   E-commerce",
    "companyDemoIcon": "💬",
    "companyDemoDesc": [
      "Storetasker is best freelance experience for top Shopify developers: endless new clients, great software, and a helpful community. Connect with growing Shopify brands for projects big and small."
    ],
    "signUpurl": "https://www.storetasker.com/become-an-expert",
    "equipmentAll": [
      "Who we're looking for:",
      "Ambitious full-time and part time freelancers and boutique (2-4 person) agencies.Who have a 3+ years of Shopify experience.And who have worked with multiple merchants & stores.And who understand the importance of great customer service.",
      "",
      "Specifically with any of these skills:",
      "Front-end or full-stack Shopify developmentKlaviyo Email flowsHeadless Shopify developmentConversion rate optimizationSEO and Site SpeedE-commerce expertise and strategy"
    ],
    "averagePay": [
      "$75/hour, $6,000/month",
      ""
    ],
    "makingMoney": [
      "300"
    ],
    "platformPricing": [
      "18% take rate"
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2017"
    ],
    "founding": "$4.2M"
  },
  {
    "imgText": "📊",
    "hustleTitle": "SubPort",
    "imgSrc": "http://web.archive.org/web/20221127002136/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/9430a4c0-368d-4270-bc9f-cd9c8f8edef7.jpg",
    "workType": [
      "E-commerce",
      "Chef",
      "Tasks & Services"
    ],
    "jobType": "Small Business",
    "workTypeFullText": "👈   Tasks & Services        ",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Create your own subscription app. Customers can subscribe to your membership via your own app and redeem contactless in shop or order ahead. SubPort focuses mostly on independent businesses such as cafes, barbers, chefs, landcaping, and car wash businesses.  "
    ],
    "signUpurl": "http://subport.us",
    "equipmentAll": [
      "SmartphoneKnowing how to provide your service (making a dish, providing a service)"
    ],
    "averagePay": [
      "$20/hour, $1,500/month",
      ""
    ],
    "makingMoney": [
      "20 (December 2020)"
    ],
    "platformPricing": [
      "$40/month",
      ""
    ],
    "audience": [
      "Yes"
    ],
    "founded": [
      "2020"
    ],
    "founding": "$0"
  },
  {
    "imgText": "🐾",
    "hustleTitle": "Meowtel",
    "imgSrc": "http://web.archive.org/web/20221024182053/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/aad0f81f-78a7-4f34-8d27-f335a6159106.jpg",
    "workType": [
      "Pet Caretaker"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈   Pet Caretaker",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Meowtel connects busy cat parents with trusted and insured cat sitters, bringing the purrfect hospitality to U.S. cat parents. Customers can book a sitter for drop-in visits and overnight stays in their home."
    ],
    "signUpurl": "https://meowtel.com/sitter-intro",
    "equipmentAll": [
      "Petcare experienceApplication required, less than 10% of sitters are accepted"
    ],
    "averagePay": [
      "$25.70/hour, prices start at $22 for 20-minutes of in-home cat sitting.",
      ""
    ],
    "makingMoney": [
      "No data"
    ],
    "platformPricing": [
      "30% commission for any client from whom you have earned $0-$299.25% commission for any client from whom you have earned between $300-$999.20% commission for any client from whom you have earned between $1,000-$2,999.15% commission for any client from whom you have earned over $3,000."
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2015"
    ],
    "founding": "$100K"
  },
  {
    "imgText": "🐾",
    "hustleTitle": "Rover",
    "imgSrc": "http://web.archive.org/web/20220929191643/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/d7e4c171-1dbd-4a75-996c-ecfde0a11ff1.jpg",
    "workType": [
      "Pet Caretaker",
      "Home services"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Pet Caretaker",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Offer dog walking or overnight boarding services and get paid to take care of other people's pets."
    ],
    "signUpurl": "https://www.rover.com/become-a-sitter/",
    "equipmentAll": [
      "Age 18+ and background checkExperience/comfort with petsLicensing is not always necessary but requirements vary by locationMobile phone"
    ],
    "averagePay": [
      "Earn up to $1,000/month (2020)",
      ""
    ],
    "makingMoney": [
      "100,000+ (2018)"
    ],
    "platformPricing": [
      "20% platform fee"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2011"
    ],
    "founding": "$310.9M"
  },
  {
    "imgText": "🐾",
    "hustleTitle": "Wag!",
    "imgSrc": "http://web.archive.org/web/20221201141437/https://super-static-assets.s3.amazonaws.com/fe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8/images/375f928f-e489-45e6-879e-16d6a0aa6bd7.jpg",
    "workType": [
      "Pet Caretaker"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Pet Caretaker",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Walk other people's dogs for pay."
    ],
    "signUpurl": "https://wagwalking.com/dog-walker",
    "equipmentAll": [
      "Application (prior dog experience and knowledge test)Age 18+ and legally authorized to work in the USMobile phone"
    ],
    "averagePay": [
      "$16/hour (2020)",
      ""
    ],
    "makingMoney": [
      "50,000+ (2018)"
    ],
    "platformPricing": [
      "40%, $29.95 application fee"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2014"
    ],
    "founding": "$361.5M"
  },
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
    "founding": "Undisclosed"
  },
  {
    "imgText": "💻",
    "hustleTitle": "CloudDevs",
    "imgSrc": "http://web.archive.org/web/20220925075938im_/https://sidehustlestack.co/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2Ffe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8%2Fimages%2F49f8d9ef-4878-4388-a5ea-9a3c86abb7ab.jpg&w=1920&q=80",
    "workType": [
      "Tech"
    ],
    "jobType": "Flexible",
    "workTypeFullText": "👈 Tech",
    "companyDemoIcon": "",
    "companyDemoDesc": [
      "Get paid to work as a developer or designer."
    ],
    "signUpurl": "https://clouddevs.com/",
    "equipmentAll": [
      "From Europe or Latin AmericaTools to complete desired freelance workComputer with internet connection18+ Application required"
    ],
    "averagePay": [
      "No data - 14 days to first dollar"
    ],
    "makingMoney": [
      "100 "
    ],
    "platformPricing": [
      "20% take rate"
    ],
    "audience": [
      "No"
    ],
    "founded": [
      "2020"
    ],
    "founding": "Bootstrapped"
  }
]
@Injectable()
export class HustleService {
  constructor(
    @InjectModel(HUSTLE.name, DATABASE_CONNECTION.HUSTLE)
    private hustleModel: Model<HUSTLEDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  async create(createTorrentDto: CreateHustleDto) {
    const { page } = await hustlePageImgbbPage();
    let newArray: AdultContentNew[] = [];
    for (let i = 0; i < adultContent.length; i++) {
      const result = await downloadImage(page, adultContent[i].imgSrc);
      adultContent[i]['imgbbImgSrc'] = result;
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
