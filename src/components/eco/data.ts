const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const bookingImg = unsplash("photo-1556742049-0cfed4f6a45d");
const plateImg = unsplash("photo-1519708227418-c8fd9a32b7a2");
const donationImg = unsplash("photo-1593113646773-028c64a8f1b8");

export const USER = {
  name: "Yash Kadam",
  branch: "CSE",
  initials: "YK",
};

export const INITIAL_STATS = {
  points: 1250,
  streak: 12,
  level: 5,
  levelTitle: "Green Guardian",
  xp: 750,
  xpMax: 1000,
  foodSavedKg: 8.2,
  co2AvoidedKg: 12.5,
};

export type EarnAction = {
  id: string;
  title: string;
  description: string;
  points: number;
  image: string;
};

export const EARN_ACTIONS: EarnAction[] = [
  {
    id: "booking",
    title: "Accurate Meal Booking",
    description: "Book your mess meals ahead so the kitchen cooks exactly what is needed.",
    points: 20,
    image: bookingImg,
  },
  {
    id: "plate",
    title: "Finish Your Plate",
    description: "Return a clean plate at the counter and log a zero-waste meal.",
    points: 30,
    image: plateImg,
  },
  {
    id: "redistribution",
    title: "Join Redistribution",
    description: "Volunteer to pack and deliver surplus mess food to nearby shelters.",
    points: 50,
    image: donationImg,
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "Aarav Mehta", branch: "ECE", points: 1840 },
  { rank: 2, name: "Sanya Kapoor", branch: "IT", points: 1620 },
  { rank: 3, name: "Yash Kadam", branch: "CSE", points: 1250, isUser: true },
  { rank: 4, name: "Rohit Sharma", branch: "MECH", points: 1180 },
  { rank: 5, name: "Ishita Rao", branch: "CSE", points: 1095 },
];

export const REWARDS = [
  { id: "canteen", name: "Canteen Coffee", cost: 200, tag: "Food" },
  { id: "thali", name: "Free Special Thali", cost: 600, tag: "Mess" },
  { id: "hoodie", name: "Eco-Mess Hoodie", cost: 1500, tag: "Merch" },
  { id: "library", name: "Library Late Pass", cost: 400, tag: "Campus" },
];

export const WEEKLY = [
  { day: "Mon", waste: 4.2, saved: 1.1 },
  { day: "Tue", waste: 3.6, saved: 1.4 },
  { day: "Wed", waste: 3.9, saved: 1.2 },
  { day: "Thu", waste: 2.8, saved: 1.8 },
  { day: "Fri", waste: 2.2, saved: 2.1 },
  { day: "Sat", waste: 1.7, saved: 2.6 },
  { day: "Sun", waste: 1.4, saved: 2.9 },
];
