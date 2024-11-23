import { Project } from '@/types/project';

export const projects: Project[] = [
    {
      id: 1,
      title: 'Vapi',
      content: 'A developer platform integrating conversational voice ai within web and mobile apps.',
      description: 'Vapi is a web application and developer platform for helping developers and business integrate conversational voice ai within their web and mobile products. ',
      body: {
        intro: "I started helping @vapi in by revamping parts of their dashboard experience from the bottom up.",
        details: [
          "We then moved on to fully overhauling the entire dashboard experience in about 6 months creating a better user experience for customers.", 
          "What I really valued here was iterating on the go with direct customer feedback to help guide a unique solution for the customer.", 
          "I worked alongside a small team to help not only redesign the dashboard but bring in features from backend to front.",
        ],
      },
      image: '/img/work-vapi.png',
      images: ['/img/vapi-one.png', '/img/vapi-two.png', '/img/vapi-three.png', '/img/vapi-four.png', '/img/vapi-five.png'],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3dxaKaW695Hv7mJrhcDZtqKFXau9AV1IlYPf8',
      link: 'https://vapi.ai',
      tags: ['React', 'Vite', 'TypeScript', 'Tailwind', 'OpenAI', 'Anthropic', 'PlayHT', 'ElevanLabs', 'Cartesia', 'Daily', 'Design'],
    },
    {
      id: 2,
      title: 'Triton',
      content: 'An RPC and infrastructure provider for the Solana, Sui, and Aptos blockchain ecosystems.',
      description: 'Triton is an RPC and infrastructure provider for the Solana, Sui, and Aptos blockchain ecosystems. They allow blockchain developers to easily integrate transaction data into their web and mobile applications.',
      body: {
        intro: "I revamped and ran their marketing website, as well as contribute to the admin and customer dashboard experience.",
        details: [
          "I originally was contracted to redesign their marketing website and then stuck around to help build out a better admin and customer experience alongside help the core web team to maintain the product and marketing website.", 
        ],
      },
      image: '/img/work-triton.png',
      images: ['/img/triton-one.png', '/img/triton-two.png', '/img/triton-three.png'],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3O2TJDuFKcRgFZDwYbmHB0yESl8aW1AQU9sfV',
      link: 'https://triton.one',
      tags: ['React', 'Nextjs', 'TypeScript', 'Vue', 'Ruby', 'Cloudflare', 'Design'],
    },
    {
      id: 3,
      title: 'Mango',
      content: 'Trading infrastructure and products for the Solana ecosystem.',
      description: "Mango is a decentralized autonomous organization that's building trading infrastructure and products for the Solana ecosystem.",
      body: {
        intro: "I contributed and worked with with Mango and its core team of contributors helping build collateral lending and futures trading markets on the solana blockchain since it's inception.",
        details: [
          "I was one of the original contributors to help bring the protocol and DAO to life helping with marketing, design, and web development as well as helping the the DAO raise over 70 million dollars to help fund open-source development for the Solana ecosystem.", 
          "I really value and enjoyed my time at mango, it was one of the most formative experiences and still am a voting member of the DAO."
        ],
      },
      image: '/img/work-mango.png',
      images: ['/img/mango-one.png', '/img/mango-two.png', '/img/mango-three.png', '/img/mango-five.png', '/img/mango-four.png'],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3tUYxdp7G9KLw1bmWy7EZRMx4ovjcirezJgdu',
      link: 'https://mango.markets',
      tags: ['React', 'Nextjs', 'TypeScript', 'Design', 'Social Media'],
    },
    {
      id: 4,
      title: 'Zenmail',
      content: 'An power user email client powered by AI',
      description: 'Zenmail is an email client that wraps all your inboxes in a simple to user interface powered by artificial intelligence.',
      body: {
        intro: "I’m building Zenmail for myself, I want to make it easier to parse emails, threads, and get the info i need quickly and with out stress.",
        details: [
          "I added artificial intelligence to help with email composition and full inbox parsing basically allowing you the ability to talk with your emails and ask them anything i want to know.", 
          "You can easily add custom filtering so you see what you want, and im adding other features like notes, tasks, and scheduling.",
        ],
      },
      image: '/img/work-zenmail.png',
      images: ['/img/zenmail-dashboard.png', '/img/zenmail-web.png'],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM35XpYzFZqgdESuH9r2ACxVyKMtjR6XLwYnf4I',
      link: 'https://zenmail.xyz',
      tags: ['Swift', 'SwiftUI', 'TypeScript', 'Vapi', 'Supabase', 'Design'],
    },
    {
      id: 5,
      title: 'Senko',
      content: 'A simple pro camera application with zero AI driven processing.',
      description: 'Senko is simple pro camera application with zero AI driven processing and easy to use point and shoot experience',
      body: {
        intro: "Senko was built simply because I wanted a photo applications with filtering. It then formed into a power tool for anyone to take a good phoot with out thinking about it too much.",
        details: [
          "Just point and shoot.", 
          "I created my own raw processing pipeline removing apples AI processing, custom lut based filters, and added pro features like choosing the output file type and quality.",
        ],
      },
      image: '/img/work-senko.png',
      images: ['/img/senko-one.png', '/img/senko-three.png', '/img/senko-two.png'],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3QvYSKkNB5mcuYPG79VnS1g4vCFlx6WhfoQ3r',
      link: 'https://apps.apple.com/us/app/senko-simple-pro-camera/id6584516223?platform=iphone',
      tags: ['Swift', 'SwiftUI', 'TypeScript', 'Vapi', 'Supabase', 'Design'],
    },
    {
      id: 6,
      title: 'RES',
      content: 'Interactive conversations with the latest large language models.',
      description: 'RES is an iOS application for having interactive conversations with the latest large language models.',
      body: {
        intro: "RES is an open-source project started by a group of us that connected on the internet through oss, I had wanted to build an application with swift and I started contributing to the project",
        details: [
          "We decided to form Artificial Technology Corp to explore ideas using the latest LLMs to hopefully make it easier for people to have access and use these models. ", 
          "RES is an iOS application built using swift as the main codebase, VAPI as middle-layer layer to help integrate all the different models, and supabase for authentication and database support.",
        ],
      },
      image: '/img/work-res.png',
      images: ['/img/res-one.png', '/img/res-two.png', '/img/res-three.png'],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3eKnuopMYcEPxKLvb97WkBUM6VrIfgzuSon0J',
      link: 'https://res.computer',
      tags: ['Swift', 'SwiftUI', 'TypeScript', 'Vapi', 'Supabase', 'Design'],
    },
    {
      id: 7,
      title: 'BRD',
      content: 'A self custodial bitcoin and ethereum wallet built for ios and android.',
      description: 'BRD was a self custodial bitcoin and ethereum wallet built for ios and android.',
      body: {
        intro: 'I worked on the marketing team as a web developer, visual designer, and managed many marketing initiatives for BRD. our  team of 6 helped grow BRD’s user base to 2.5M global users, and 250K monthly active users across 170+ countries.',
        details: ['We helped break records in revenue, monthly active users, transaction volume, and other growth-driven KPIs month after month.'],
      },
      image: '/img/work-brd.png',
      images: [],
      backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3vBaG05ThlDMZj2rRiFo1ngGzUPatbwHAeN0O',
      link: '#',
      tags: ['Marketing', 'User Acquisition', 'Visual Design', 'Vue'],
    },
    // {
    //   id: 8,
    //   title: 'Component Kit',
    //   content: 'A UI library for building web applications based on shadcn and using framer motion for animations.',
    //   description: 'Component Kit is a UI library fork from @shadcn, I added my own simple styling, and add animations using framer motion.',
    //   body: {
    //     intro: 'Shadcn is a wonderful UI library that allows for rapid development of web applications, I wanted to create a set of components that improves upon the idea to offer people an open-source solution that is well designed and feels good right away.',
    //     details: [],
    //   },
    //   image: '/img/work-componentkit.png',
    //   images: [],
    //   backgroundUrl: '/img/componentkit-bg.png',
    //   link: 'https://www.componentkit.dev/dashboard/docs/introduction',
    //   tags: ['React', 'TypeScript', 'Storybook'],
    //   year: '2024',
    //   status: 'in-progress',
    // },
    // {
    //   id: 9,
    //   title: 'Symbols',
    //   content: 'A web based icon library def not inspired by SF symbols by apple.',
    //   description: 'Symbols is an icon library inspired by SF symbols by apple, these are web based icons for web applications.',
    //   body: {
    //     intro: 'I created my own icon library so that i could use them in my web projects. Inspired by the best icon library available, apples SF symbols.',
    //     details: ['they are available for react and vue frameworks. I wanted an icon library i control so that i can have any symbols or logo i’d need.'],
    //   },
    //   image: '/img/work-symbols.png',
    //   images: [],
    //   backgroundUrl: 'https://utfs.io/f/xtNTXJPzVBM3aFDIcMx5WSVBkxplXuEKDFIcy9stTAgJhnwQ',
    //   link: 'https://www.symbols.dev/',
    //   tags: ['SVG', 'React', 'Figma'],
    //   year: '2023',
    //   status: 'completed',
    // },
    // {
    //   id: 8,
    //   title: 'Toshi',
    //   content: 'A crypto portfolio tracking app built in swift for iOS',
    //   description: 'Toshi is a crypto portfolio tracking app built in swift for iOS',
    //   body: {
    //     intro: 'I built a price tracker and portfolio tracking applications for iOS that tracks all crypto currencies and what ever is in your portfolio. ',
    //     details: ['Toshi was a way for me to build out and understand how APIs work in swift as well is have fun building out custom UI and functionality for different aspects of the app.'],
    //   },
    //   image: '/img/work-toshi.png',
    //   images: [],
    //   backgroundUrl: '/img/toshi-background.png',
    //   link: 'https://github.com/stevesarmiento/Toshi',
    //   tags: ['Design System', 'React', 'Documentation'],
    //   year: '2023',
    //   status: 'completed',
    // },
    // {
    //   id: 11,
    //   title: 'Aufn',
    //   content: 'A simple recording app for exporting high quality audio and adding pre processing for audio effects like reverb, eq, and compression.',
    //   description: 'Aufn is simple recording application built in swift for exporting high quality audio and adding pre processing for audio effects like reverb, eq, and compression.',
    //   body: {
    //     intro: 'I wanted to simple way to record audio tracks for recording purposes on the go while also having quick access to audio processing effects like compression, eq and reverb.',
    //     details: ['The application exports audio recorded with the iPhones microphone at various quality and format types allowing for a very simple but versatile tool for recording audio.'],
    //   },
    //   image: '/img/work-aufn.png',
    //   images: [],
    //   backgroundUrl: '/img/aufn-background.png',
    //   link: 'https://github.com/stevesarmiento/Aufn',
    //   tags: ['Next.js', 'MDX', 'TailwindCSS'],
    //   year: '2024',
    //   status: 'in-progress',
    // },
    // {
    //   id: 12,
    //   title: 'Lumino',
    //   content: 'A simple nightlight application that transforms the iPhones screen into an colored light for use at night.',
    //   description: 'Lumino is a simple nightlight application that transforms the iPhones screen into an colored light for use at night.',
    //   body: {
    //     intro: 'When my son was born my wife and I were up at early hours for feedings and found the need for a light that was not overpowering by aloud us to see and create the mood for putting him back to sleep.',
    //     details: ['The app basically allows you to choose any color on the spectrum and set it as a background color.'],
    //   },
    //   image: '/img/work-nightlight.png',
    //   images: [],
    //   backgroundUrl: '/img/lumino-background.png',
    //   link: 'https://github.com/stevesarmiento/lumino',
    //   tags: ['CSS', 'JavaScript', 'Theme'],
    //   year: '2023',
    //   status: 'completed',
    // }
  ];