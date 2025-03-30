import dbPromise from "./utils/db.js";

async function createTablesAndInsertMockData() {
  const db = await dbPromise;

  // Create Shows Table (if not already created)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT,
      title TEXT,
      releaseDate TEXT,
      genre TEXT,
      synopsis TEXT,
      cast TEXT,
      imageUrl TEXT,
      resourceLink TEXT
    );
  `);

  // Create Subscriptions Table with subscriptionLink
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT,
      planName TEXT,
      priceUSD REAL,
      priceCAD REAL,
      features TEXT,
      subscriptionLink TEXT
    );
  `);

  // Mock Data for Shows
  const mockShows = [
    // Netflix Shows
    {
      platform: "Netflix",
      title: "Pulse",
      releaseDate: "2025-04-03",
      genre: "Medical Drama",
      synopsis:
        "Set in a Level 1 Trauma Center in Miami during a deadly hurricane.",
      cast: "Willa Fitzgerald, Colin Woodell, Justina Machado",
      imageUrl:
        "https://tse3.mm.bing.net/th?id=OIP.NsL9-thzVE0VqZzmarBoogHaE8&pid=Api",
      resourceLink: "https://www.netflix.com/title/81234567",
    },
    {
      platform: "Netflix",
      title: "Black Mirror: Season 7",
      releaseDate: "2025-04-10",
      genre: "Dystopian Anthology",
      synopsis:
        "Exploring the dark relationship between technology and society.",
      cast: "Cristin Milioti, Will Poulter, Emma Corrin",
      imageUrl:
        "https://tse1.mm.bing.net/th?id=OIP.dfNsVzEfJ64TmkstBc4hmgHaEH&pid=Api",
      resourceLink: "https://www.netflix.com/title/80227634",
    },
    {
      platform: "Netflix",
      title: "Devil May Cry",
      releaseDate: "2025-04-03",
      genre: "Animated Urban Fantasy",
      synopsis:
        "Dante battles demons to prevent the demonic invasion of Earth.",
      cast: "Johnny Yong Bosch, Scout Taylor-Compton, Hoon Lee",
      imageUrl:
        "https://tse3.mm.bing.net/th?id=OIP.SRqLXo0-_3bdNBCQQ1PEXwHaEf&pid=Api",
      resourceLink: "https://www.netflix.com/title/81098043",
    },
    {
      platform: "Netflix",
      title: "You: Season 5",
      releaseDate: "2025-04-24",
      genre: "Psychological Thriller",
      synopsis: "Joe returns to New York to confront his past.",
      cast: "Penn Badgley, Charlotte Ritchie, Madeline Brewer",
      imageUrl:
        "https://tse2.mm.bing.net/th?id=OIP.jcYEr2EPDgo9yPlsSHJksQHaJQ&pid=Api",
      resourceLink: "https://www.netflix.com/title/80124522",
    },
    {
      platform: "Netflix",
      title: "Ransom Canyon",
      releaseDate: "2025-04-17",
      genre: "Western Family Drama",
      synopsis: "A Texas rancher navigates love and family challenges.",
      cast: "Josh Duhamel, Minka Kelly",
      imageUrl:
        "https://tse1.mm.bing.net/th?id=OIP.9JMNeiLp7TnaokCjpRV10AHaEK&pid=Api",
      resourceLink: "https://www.netflix.com/title/81456789",
    },

    // Amazon Prime Video Shows
    {
      platform: "Amazon Prime Video",
      title: "The Bondsman",
      releaseDate: "2025-04-03",
      genre: "Action Horror",
      synopsis: "Fred Herbert, a bounty hunter, returns from the dead.",
      cast: "Kevin Bacon, Jennifer Nettles, Beth Grant",
      imageUrl:
        "https://tse3.mm.bing.net/th?id=OIP.H2itbxEmivGgLJyv2efi0gHaDE&pid=Api",
      resourceLink: "https://www.amazon.com/dp/B09X1YZ9P2",
    },
    {
      platform: "Amazon Prime Video",
      title: "Étoile",
      releaseDate: "2025-04-24",
      genre: "Comedy",
      synopsis:
        "Two ballet companies attempt to save their institutions by swapping stars.",
      cast: "Luke Kirby, Charlotte Gainsbourg, Lou de Laâge",
      imageUrl:
        "https://tse3.mm.bing.net/th?id=OIP.VG2jrv693xDuszPT3KtA2gHaD4&pid=Api",
      resourceLink: "https://www.amazon.com/dp/B09Y3XYZ45",
    },
    {
      platform: "Amazon Prime Video",
      title: "The Consultant: Season 2",
      releaseDate: "2025-04-15",
      genre: "Thriller",
      synopsis:
        "New secrets emerge as Regus Patoff continues to manipulate CompWare.",
      cast: "Christoph Waltz, Nat Wolff",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlqOTceHbFIzQRSKrBMAVCKLIewCMJpRh9bQ&s​",
      resourceLink: "https://www.amazon.com/dp/B09Y3Y8QXZ",
    },
    {
      platform: "Amazon Prime Video",
      title: "The Terminal List: Dark Territory",
      releaseDate: "2025-04-20",
      genre: "Action Thriller",
      synopsis:
        "James Reece returns to fight new enemies after exposing corruption.",
      cast: "Chris Pratt, Taylor Kitsch",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwIdE-tIET16F35VyIzIUcYNz2-yGSpyNI3w&s​",
      resourceLink: "https://www.amazon.com/dp/B09XYZ6A12",
    },

    // Disney+ Shows
    {
      platform: "Disney+",
      title: "Andor: Season 2",
      releaseDate: "2025-04-22",
      genre: "Science Fiction",
      synopsis: "The second season follows Cassian Andor's journey.",
      cast: "Diego Luna, Stellan Skarsgård, Forest Whitaker",
      imageUrl:
        "https://tse4.mm.bing.net/th?id=OIP.nsbdDlu_g4SjxTJ3FlfJCgHaK9&pid=Api",
      resourceLink: "https://www.disneyplus.com/series/andor/81112345",
    },
    {
      platform: "Disney+",
      title: "Dying for Sex",
      releaseDate: "2025-04-04",
      genre: "Drama",
      synopsis:
        "A woman diagnosed with cancer embarks on a journey of self-discovery.",
      cast: "Michelle Williams",
      imageUrl:
        "https://tse2.mm.bing.net/th?id=OIP.prjLOms3tg_5J2eXrDwz0wHaEK&pid=Api",
      resourceLink: "https://www.disneyplus.com/title/82387645",
    },
    {
      platform: "Disney+",
      title: "Ahsoka: Season 2",
      releaseDate: "2025-04-15",
      genre: "Science Fiction",
      synopsis:
        "Ahsoka Tano confronts new dangers while protecting the galaxy.",
      cast: "Rosario Dawson, Natasha Liu Bordizzo",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHi18WEMsTFrKSzCGN3kz4h1gxLPUaSZEgug&s",
      resourceLink: "https://www.disneyplus.com/series/ahsoka/81234578",
    },
    {
      platform: "Disney+",
      title: "Secret Invasion: Season 2",
      releaseDate: "2025-04-28",
      genre: "Superhero",
      synopsis: "Nick Fury uncovers a deeper conspiracy that threatens Earth.",
      cast: "Samuel L. Jackson, Ben Mendelsohn",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq1o6pvrVhE4nEMVWquG3f8YShdKviMVf-uw&s​",
      resourceLink:
        "https://www.disneyplus.com/series/secret-invasion/81245678",
    },
  ];

  // Mock Data for Subscription Plans with Links
  const mockSubscriptions = [
    {
      platform: "Netflix",
      planName: "Basic with Ads",
      priceUSD: 6.99,
      priceCAD: 7.99,
      features: "720p, Ads included, 1 device, Limited content",
      subscriptionLink: "https://www.netflix.com/signup",
    },
    {
      platform: "Netflix",
      planName: "Standard",
      priceUSD: 15.49,
      priceCAD: 16.49,
      features: "1080p, 2 devices, No ads, Downloadable content",
      subscriptionLink: "https://www.netflix.com/signup",
    },
    {
      platform: "Netflix",
      planName: "Premium",
      priceUSD: 22.99,
      priceCAD: 23.99,
      features: "4K + HDR, 4 devices, Spatial audio, No ads",
      subscriptionLink: "https://www.netflix.com/signup",
    },
    {
      platform: "Amazon Prime Video",
      planName: "Prime Video Only",
      priceUSD: 8.99,
      priceCAD: 9.99,
      features: "Access to Prime Video library",
      subscriptionLink: "https://www.amazon.com/primevideo",
    },
    {
      platform: "Amazon Prime Video",
      planName: "Amazon Prime",
      priceUSD: 14.99,
      priceCAD: 16.99,
      features: "Prime Video + Free Shipping + Prime Music",
      subscriptionLink: "https://www.amazon.com/prime",
    },
    {
      platform: "Disney+",
      planName: "Basic with Ads",
      priceUSD: 7.99,
      priceCAD: 8.99,
      features: "HD streaming, Ads included",
      subscriptionLink: "https://www.disneyplus.com/signup",
    },
    {
      platform: "Disney+",
      planName: "Premium (Ad-Free)",
      priceUSD: 13.99,
      priceCAD: 14.99,
      features: "4K Ultra HD, HDR, Dolby Atmos, No ads",
      subscriptionLink: "https://www.disneyplus.com/signup",
    },
    {
      platform: "Disney+",
      planName: "Disney+ Bundle (Hulu + ESPN+)",
      priceUSD: 19.99,
      priceCAD: 21.99,
      features: "Full Disney+ library + Hulu + ESPN+",
      subscriptionLink: "https://www.disneyplus.com/bundle",
    },
  ];
  // Insert Mock Shows
  for (const show of mockShows) {
    await db.run(
      `INSERT INTO shows (platform, title, releaseDate, genre, synopsis, cast, imageUrl, resourceLink)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        show.platform,
        show.title,
        show.releaseDate,
        show.genre,
        show.synopsis,
        show.cast,
        show.imageUrl,
        show.resourceLink,
      ]
    );
  }

  // Insert Mock Subscriptions with Links
  for (const plan of mockSubscriptions) {
    await db.run(
      `INSERT INTO subscriptions (platform, planName, priceUSD, priceCAD, features, subscriptionLink)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [
        plan.platform,
        plan.planName,
        plan.priceUSD,
        plan.priceCAD,
        plan.features,
        plan.subscriptionLink,
      ]
    );
  }

  console.log("✅ Mock data inserted successfully with subscription links!");
}

// Run script
createTablesAndInsertMockData().catch((err) => {
  console.error("❌ Error inserting mock data:", err);
});
