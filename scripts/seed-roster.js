const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const testRoster = [
  {
    name: "Vortex",
    role: "IGL",
    game: "BGMI",
    teamName: "Tribex Elite",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    stats: "3x Monthly Champions"
  },
  {
    name: "Shadow",
    role: "Fragger",
    game: "BGMI",
    teamName: "Tribex Elite",
    imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop",
    stats: "Highest K/D Ratio — Season 4"
  },
  {
    name: "Blaze",
    role: "Support",
    game: "BGMI",
    teamName: "Tribex Elite",
    imageUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
    stats: "Best Support Player — Regional Qualifiers"
  },
  {
    name: "Cipher",
    role: "Sniper",
    game: "BGMI",
    teamName: "Tribex Elite",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop",
    stats: "50+ Headshots in Grand Finals"
  },
  {
    name: "Ghost",
    role: "IGL",
    game: "Valorant",
    teamName: "Tribex Valor",
    imageUrl: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?q=80&w=400&auto=format&fit=crop",
    stats: "Community Cup Winner"
  },
  {
    name: "Neon",
    role: "Entry",
    game: "Valorant",
    teamName: "Tribex Valor",
    imageUrl: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=400&auto=format&fit=crop",
    stats: "Top Fragger — Valorant Series"
  },
  {
    name: "Titan",
    role: "Sniper",
    game: "Valorant",
    teamName: "Tribex Valor",
    imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop",
    stats: "90% Headshot Accuracy"
  },
  {
    name: "Omen",
    role: "Support",
    game: "Valorant",
    teamName: "Tribex Valor",
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=400&auto=format&fit=crop",
    stats: "Most Clutches — Season 3"
  },
  {
    name: "Fury",
    role: "Fragger",
    game: "Free Fire",
    teamName: "Tribex Frenzy",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    stats: "MVP — Free Fire Invitational"
  },
  {
    name: "Storm",
    role: "IGL",
    game: "Free Fire",
    teamName: "Tribex Frenzy",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    stats: "2x National Champions"
  }
];

async function seed() {
  console.log("Seeding roster members...");
  for (const member of testRoster) {
    const created = await prisma.rosterMember.create({ data: member });
    console.log(`✓ Created: ${created.name} (${created.game} - ${created.role})`);
  }
  console.log(`\n✅ Done! Added ${testRoster.length} roster members.`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
