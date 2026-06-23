import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Demo user ─────────────────────────────────────────────────────────────
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@collegedisc.in" },
    update: {},
    create: {
      name: "Demo Student",
      email: "demo@collegedisc.in",
      passwordHash: await bcrypt.hash("Demo@1234", 10),
    },
  });
  console.log(`✅ Demo user: ${demoUser.email}`);

  // ── College seed data ──────────────────────────────────────────────────────
  const colleges = [
    // ── IITs ──────────────────────────────────────────────────────
    {
      name: "Indian Institute of Technology Bombay",
      location: "Mumbai",
      feesPerYear: 250000,
      rating: 4.9,
      type: "IIT",
      establishedYear: 1958,
      description:
        "IIT Bombay is one of India's premier engineering institutions, consistently ranked among the top universities globally. Known for its cutting-edge research, vibrant campus life, and strong industry connections, IIT Bombay produces world-class engineers and entrepreneurs.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 250000 },
        { name: "B.Tech Electrical Engineering", durationYears: 4, feesPerYear: 250000 },
        { name: "M.Tech Data Science", durationYears: 2, feesPerYear: 280000 },
      ],
      placements: [
        { year: 2024, avgPackage: 2400000, highestPackage: 18000000, placementRate: 0.97 },
        { year: 2023, avgPackage: 2200000, highestPackage: 16500000, placementRate: 0.96 },
      ],
    },
    {
      name: "Indian Institute of Technology Delhi",
      location: "Delhi",
      feesPerYear: 240000,
      rating: 4.8,
      type: "IIT",
      establishedYear: 1961,
      description:
        "IIT Delhi, located in the heart of the capital, is India's flagship engineering university. It excels in research, has exceptional alumni in FAANG companies and top startups, and maintains strong ties with government and industry.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 240000 },
        { name: "B.Tech Mechanical Engineering", durationYears: 4, feesPerYear: 240000 },
        { name: "MBA (Management Studies)", durationYears: 2, feesPerYear: 440000 },
      ],
      placements: [
        { year: 2024, avgPackage: 2200000, highestPackage: 16800000, placementRate: 0.96 },
        { year: 2023, avgPackage: 2000000, highestPackage: 15500000, placementRate: 0.95 },
      ],
    },
    {
      name: "Indian Institute of Technology Madras",
      location: "Chennai",
      feesPerYear: 235000,
      rating: 4.8,
      type: "IIT",
      establishedYear: 1959,
      description:
        "IIT Madras is a residential institute of national importance with a beautiful campus. It has been ranked No. 1 in India by NIRF for multiple consecutive years, with exceptional programs in engineering, science, and management.",
      courses: [
        { name: "B.Tech Aerospace Engineering", durationYears: 4, feesPerYear: 235000 },
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 235000 },
        { name: "M.Tech AI & Machine Learning", durationYears: 2, feesPerYear: 265000 },
      ],
      placements: [
        { year: 2024, avgPackage: 2100000, highestPackage: 17200000, placementRate: 0.95 },
        { year: 2023, avgPackage: 1950000, highestPackage: 15800000, placementRate: 0.94 },
      ],
    },
    {
      name: "Indian Institute of Technology Kharagpur",
      location: "Kharagpur",
      feesPerYear: 220000,
      rating: 4.7,
      type: "IIT",
      establishedYear: 1951,
      description:
        "India's first IIT and the largest, IIT Kharagpur has a sprawling 2100-acre campus. Renowned for its comprehensive engineering programs and pioneering research across disciplines, it has produced some of India's most influential technology leaders.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 220000 },
        { name: "B.Tech Civil Engineering", durationYears: 4, feesPerYear: 220000 },
        { name: "B.Tech Industrial Engineering", durationYears: 4, feesPerYear: 220000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1980000, highestPackage: 15500000, placementRate: 0.94 },
        { year: 2023, avgPackage: 1820000, highestPackage: 14200000, placementRate: 0.93 },
      ],
    },
    {
      name: "Indian Institute of Technology Kanpur",
      location: "Kanpur",
      feesPerYear: 228000,
      rating: 4.7,
      type: "IIT",
      establishedYear: 1959,
      description:
        "IIT Kanpur is globally recognized for excellence in technology education and research. It has the distinction of being India's first institution to offer computer science education and continues to lead in innovation and entrepreneurship.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 228000 },
        { name: "B.Tech Chemical Engineering", durationYears: 4, feesPerYear: 228000 },
        { name: "M.Tech Cybersecurity", durationYears: 2, feesPerYear: 255000 },
      ],
      placements: [
        { year: 2024, avgPackage: 2050000, highestPackage: 16200000, placementRate: 0.95 },
        { year: 2023, avgPackage: 1890000, highestPackage: 14800000, placementRate: 0.93 },
      ],
    },
    // ── NITs ──────────────────────────────────────────────────────
    {
      name: "National Institute of Technology Trichy",
      location: "Tiruchirappalli",
      feesPerYear: 165000,
      rating: 4.5,
      type: "NIT",
      establishedYear: 1964,
      description:
        "NIT Trichy is consistently ranked among India's top NITs, known for its rigorous academic programs, strong placement record, and active student chapters. The institute offers a perfect blend of technical education and holistic development.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 165000 },
        { name: "B.Tech Electronics & Communication", durationYears: 4, feesPerYear: 165000 },
        { name: "M.Tech Software Engineering", durationYears: 2, feesPerYear: 185000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1350000, highestPackage: 9200000, placementRate: 0.92 },
        { year: 2023, avgPackage: 1220000, highestPackage: 8500000, placementRate: 0.90 },
      ],
    },
    {
      name: "National Institute of Technology Warangal",
      location: "Warangal",
      feesPerYear: 158000,
      rating: 4.4,
      type: "NIT",
      establishedYear: 1959,
      description:
        "One of the oldest NITs, NIT Warangal is celebrated for its exceptional engineering programs and research culture. Located in Telangana, it maintains excellent industry relationships with the Hyderabad IT sector.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 158000 },
        { name: "B.Tech Electrical Engineering", durationYears: 4, feesPerYear: 158000 },
        { name: "M.Tech VLSI Design", durationYears: 2, feesPerYear: 178000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1280000, highestPackage: 8800000, placementRate: 0.91 },
        { year: 2023, avgPackage: 1150000, highestPackage: 7900000, placementRate: 0.89 },
      ],
    },
    {
      name: "National Institute of Technology Surathkal",
      location: "Mangalore",
      feesPerYear: 152000,
      rating: 4.3,
      type: "NIT",
      establishedYear: 1960,
      description:
        "NIT Surathkal, set on a picturesque coastal campus in Karnataka, is a premier technical institution with strong research output and industry links to Bangalore's tech ecosystem. Known for entrepreneurship and innovation.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 152000 },
        { name: "B.Tech Information Technology", durationYears: 4, feesPerYear: 152000 },
        { name: "B.Tech Mechanical Engineering", durationYears: 4, feesPerYear: 152000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1200000, highestPackage: 8200000, placementRate: 0.89 },
        { year: 2023, avgPackage: 1080000, highestPackage: 7400000, placementRate: 0.87 },
      ],
    },
    {
      name: "National Institute of Technology Calicut",
      location: "Calicut",
      feesPerYear: 145000,
      rating: 4.3,
      type: "NIT",
      establishedYear: 1961,
      description:
        "NIT Calicut is a highly respected technical institution in Kerala known for producing talented engineers. Its location in Kozhikode provides excellent connectivity to Bangalore and Kochi tech hubs.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 145000 },
        { name: "B.Tech Civil Engineering", durationYears: 4, feesPerYear: 145000 },
        { name: "M.Tech Computer Networks", durationYears: 2, feesPerYear: 165000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1150000, highestPackage: 7800000, placementRate: 0.88 },
        { year: 2023, avgPackage: 1040000, highestPackage: 7000000, placementRate: 0.86 },
      ],
    },
    // ── Top Private Colleges ───────────────────────────────────────
    {
      name: "BITS Pilani",
      location: "Pilani",
      feesPerYear: 450000,
      rating: 4.6,
      type: "Deemed",
      establishedYear: 1964,
      description:
        "BITS Pilani is India's premier deemed university, offering industry-integrated education through its unique Practice School program. It's the top choice for students seeking a private engineering education with IIT-level prestige.",
      courses: [
        { name: "B.E. Computer Science", durationYears: 4, feesPerYear: 450000 },
        { name: "B.E. Electronics & Instrumentation", durationYears: 4, feesPerYear: 450000 },
        { name: "M.Tech Data Science", durationYears: 2, feesPerYear: 380000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1850000, highestPackage: 14500000, placementRate: 0.94 },
        { year: 2023, avgPackage: 1680000, highestPackage: 13200000, placementRate: 0.93 },
      ],
    },
    {
      name: "Vellore Institute of Technology",
      location: "Vellore",
      feesPerYear: 280000,
      rating: 4.2,
      type: "Deemed",
      establishedYear: 1984,
      description:
        "VIT Vellore is one of India's largest private universities with a massive campus, diverse student body from across the country and globe, and consistently strong placement record especially in IT sector companies.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 280000 },
        { name: "B.Tech AI & Machine Learning", durationYears: 4, feesPerYear: 320000 },
        { name: "M.Tech Data Analytics", durationYears: 2, feesPerYear: 295000 },
      ],
      placements: [
        { year: 2024, avgPackage: 850000, highestPackage: 6500000, placementRate: 0.82 },
        { year: 2023, avgPackage: 780000, highestPackage: 5900000, placementRate: 0.80 },
      ],
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal",
      feesPerYear: 390000,
      rating: 4.1,
      type: "Deemed",
      establishedYear: 1957,
      description:
        "MIT Manipal is a well-established private engineering college in coastal Karnataka, known for its international collaborations, strong alumni network, and quality technical education across multiple engineering disciplines.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 390000 },
        { name: "B.Tech Mechanical Engineering", durationYears: 4, feesPerYear: 350000 },
        { name: "B.Tech Biotechnology", durationYears: 4, feesPerYear: 370000 },
      ],
      placements: [
        { year: 2024, avgPackage: 780000, highestPackage: 5800000, placementRate: 0.79 },
        { year: 2023, avgPackage: 720000, highestPackage: 5200000, placementRate: 0.77 },
      ],
    },
    {
      name: "SRM Institute of Science and Technology",
      location: "Chennai",
      feesPerYear: 310000,
      rating: 3.9,
      type: "Deemed",
      establishedYear: 1985,
      description:
        "SRM Kattankulathur near Chennai is one of India's largest private universities with strong MoUs with international universities. It offers a wide range of programs and has significant research output in emerging technologies.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 310000 },
        { name: "B.Tech AI & Data Science", durationYears: 4, feesPerYear: 340000 },
        { name: "MBA Business Analytics", durationYears: 2, feesPerYear: 290000 },
      ],
      placements: [
        { year: 2024, avgPackage: 650000, highestPackage: 4800000, placementRate: 0.74 },
        { year: 2023, avgPackage: 590000, highestPackage: 4200000, placementRate: 0.72 },
      ],
    },
    {
      name: "Amity University",
      location: "Noida",
      feesPerYear: 350000,
      rating: 3.7,
      type: "Private",
      establishedYear: 2005,
      description:
        "Amity University Noida is a large private university near Delhi-NCR with a modern campus, wide range of programs, and strong corporate connections. Popular for its MBA, engineering, and law programs.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 350000 },
        { name: "MBA International Business", durationYears: 2, feesPerYear: 420000 },
        { name: "B.Tech Electronics", durationYears: 4, feesPerYear: 330000 },
      ],
      placements: [
        { year: 2024, avgPackage: 580000, highestPackage: 4200000, placementRate: 0.70 },
        { year: 2023, avgPackage: 540000, highestPackage: 3800000, placementRate: 0.68 },
      ],
    },
    {
      name: "Thapar Institute of Engineering & Technology",
      location: "Patiala",
      feesPerYear: 410000,
      rating: 4.2,
      type: "Deemed",
      establishedYear: 1956,
      description:
        "Thapar University is a premier private technical institution in Punjab with excellent research infrastructure and strong ties to the IT industry. It's consistently ranked among India's top 50 engineering institutions.",
      courses: [
        { name: "B.E. Computer Engineering", durationYears: 4, feesPerYear: 410000 },
        { name: "B.E. Electronics & Communication", durationYears: 4, feesPerYear: 410000 },
        { name: "M.E. Computer Science", durationYears: 2, feesPerYear: 365000 },
      ],
      placements: [
        { year: 2024, avgPackage: 920000, highestPackage: 6800000, placementRate: 0.84 },
        { year: 2023, avgPackage: 840000, highestPackage: 6200000, placementRate: 0.82 },
      ],
    },
    // ── Bangalore Tech Colleges ────────────────────────────────────
    {
      name: "RV College of Engineering",
      location: "Bangalore",
      feesPerYear: 190000,
      rating: 4.2,
      type: "Private",
      establishedYear: 1963,
      description:
        "RVCE is one of Bangalore's top autonomous engineering colleges, perfectly positioned to leverage the city's tech industry. Known for strong industry collaboration, placement excellence, and a vibrant technical culture.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 190000 },
        { name: "B.E. Information Science & Engineering", durationYears: 4, feesPerYear: 190000 },
        { name: "M.Tech Machine Learning", durationYears: 2, feesPerYear: 220000 },
      ],
      placements: [
        { year: 2024, avgPackage: 980000, highestPackage: 7200000, placementRate: 0.86 },
        { year: 2023, avgPackage: 890000, highestPackage: 6500000, placementRate: 0.84 },
      ],
    },
    {
      name: "PES University",
      location: "Bangalore",
      feesPerYear: 320000,
      rating: 4.1,
      type: "Private",
      establishedYear: 1988,
      description:
        "PES University is a top-tier private university in Bangalore known for its strong industry connections, focus on innovation, and excellent placement rates especially in the IT and startup ecosystem.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 320000 },
        { name: "B.Tech AI & Machine Learning", durationYears: 4, feesPerYear: 360000 },
        { name: "MBA", durationYears: 2, feesPerYear: 380000 },
      ],
      placements: [
        { year: 2024, avgPackage: 880000, highestPackage: 6400000, placementRate: 0.85 },
        { year: 2023, avgPackage: 810000, highestPackage: 5800000, placementRate: 0.83 },
      ],
    },
    {
      name: "MS Ramaiah Institute of Technology",
      location: "Bangalore",
      feesPerYear: 175000,
      rating: 4.0,
      type: "Private",
      establishedYear: 1962,
      description:
        "MSRIT is one of Karnataka's oldest and most respected private engineering colleges, with a strong reputation for producing industry-ready graduates in core and IT disciplines.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 175000 },
        { name: "B.E. Electronics & Communication", durationYears: 4, feesPerYear: 175000 },
        { name: "B.E. Mechanical Engineering", durationYears: 4, feesPerYear: 165000 },
      ],
      placements: [
        { year: 2024, avgPackage: 750000, highestPackage: 5500000, placementRate: 0.80 },
        { year: 2023, avgPackage: 690000, highestPackage: 4900000, placementRate: 0.78 },
      ],
    },
    // ── Hyderabad ─────────────────────────────────────────────────
    {
      name: "IIIT Hyderabad",
      location: "Hyderabad",
      feesPerYear: 350000,
      rating: 4.6,
      type: "Deemed",
      establishedYear: 1998,
      description:
        "IIIT Hyderabad is a research-focused institution specializing in computing and allied fields. Known for pioneering work in AI, NLP, and computer vision, it produces some of India's best research engineers with exceptional global placement.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 350000 },
        { name: "B.Tech Electronics & Communication Engineering", durationYears: 4, feesPerYear: 350000 },
        { name: "M.Tech AI", durationYears: 2, feesPerYear: 380000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1950000, highestPackage: 14200000, placementRate: 0.96 },
        { year: 2023, avgPackage: 1780000, highestPackage: 12800000, placementRate: 0.95 },
      ],
    },
    {
      name: "Osmania University",
      location: "Hyderabad",
      feesPerYear: 55000,
      rating: 3.8,
      type: "Government",
      establishedYear: 1918,
      description:
        "One of the oldest and largest universities in India, Osmania University has a distinguished history and offers diverse programs. A historic institution with strong research traditions and affordable education.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 55000 },
        { name: "M.Sc Computer Science", durationYears: 2, feesPerYear: 45000 },
        { name: "MBA", durationYears: 2, feesPerYear: 65000 },
      ],
      placements: [
        { year: 2024, avgPackage: 480000, highestPackage: 3200000, placementRate: 0.62 },
        { year: 2023, avgPackage: 440000, highestPackage: 2900000, placementRate: 0.60 },
      ],
    },
    // ── Pune ──────────────────────────────────────────────────────
    {
      name: "College of Engineering Pune",
      location: "Pune",
      feesPerYear: 120000,
      rating: 4.3,
      type: "Government",
      establishedYear: 1854,
      description:
        "COEP is one of Asia's oldest engineering colleges with a rich heritage and excellent academic standards. It consistently produces highly skilled engineers who are well sought-after in both core industries and the IT sector.",
      courses: [
        { name: "B.Tech Computer Engineering", durationYears: 4, feesPerYear: 120000 },
        { name: "B.Tech Mechanical Engineering", durationYears: 4, feesPerYear: 110000 },
        { name: "M.Tech Structural Engineering", durationYears: 2, feesPerYear: 135000 },
      ],
      placements: [
        { year: 2024, avgPackage: 920000, highestPackage: 6800000, placementRate: 0.87 },
        { year: 2023, avgPackage: 840000, highestPackage: 6100000, placementRate: 0.85 },
      ],
    },
    {
      name: "Pune Institute of Computer Technology",
      location: "Pune",
      feesPerYear: 145000,
      rating: 4.0,
      type: "Private",
      establishedYear: 1983,
      description:
        "PICT is a well-regarded private engineering college in Pune specializing in computer science and IT. Its focused curriculum and strong alumni network in Pune's IT industry make it an excellent choice for aspiring software engineers.",
      courses: [
        { name: "B.E. Computer Engineering", durationYears: 4, feesPerYear: 145000 },
        { name: "B.E. Information Technology", durationYears: 4, feesPerYear: 145000 },
        { name: "M.E. Computer Engineering", durationYears: 2, feesPerYear: 165000 },
      ],
      placements: [
        { year: 2024, avgPackage: 720000, highestPackage: 5200000, placementRate: 0.81 },
        { year: 2023, avgPackage: 660000, highestPackage: 4700000, placementRate: 0.79 },
      ],
    },
    // ── Mumbai / Maharashtra ───────────────────────────────────────
    {
      name: "VJTI Mumbai",
      location: "Mumbai",
      feesPerYear: 130000,
      rating: 4.1,
      type: "Government",
      establishedYear: 1887,
      description:
        "Veermata Jijabai Technological Institute is one of Mumbai's premier engineering colleges. Its heritage campus in the heart of the city, combined with strong industry connections to Mumbai's financial and tech sectors, makes it highly coveted.",
      courses: [
        { name: "B.Tech Computer Engineering", durationYears: 4, feesPerYear: 130000 },
        { name: "B.Tech Electronics Engineering", durationYears: 4, feesPerYear: 130000 },
        { name: "M.Tech Computer Engineering", durationYears: 2, feesPerYear: 150000 },
      ],
      placements: [
        { year: 2024, avgPackage: 890000, highestPackage: 6500000, placementRate: 0.85 },
        { year: 2023, avgPackage: 810000, highestPackage: 5800000, placementRate: 0.83 },
      ],
    },
    {
      name: "K.J. Somaiya College of Engineering",
      location: "Mumbai",
      feesPerYear: 210000,
      rating: 3.9,
      type: "Private",
      establishedYear: 1983,
      description:
        "KJSCE is a well-established private engineering college in Mumbai with a focus on holistic development. Its urban Mumbai location enables strong industry collaboration, and it has a growing research and innovation culture.",
      courses: [
        { name: "B.E. Computer Engineering", durationYears: 4, feesPerYear: 210000 },
        { name: "B.E. Electronics & Telecommunication", durationYears: 4, feesPerYear: 210000 },
        { name: "M.E. Machine Learning", durationYears: 2, feesPerYear: 235000 },
      ],
      placements: [
        { year: 2024, avgPackage: 640000, highestPackage: 4500000, placementRate: 0.76 },
        { year: 2023, avgPackage: 590000, highestPackage: 4100000, placementRate: 0.74 },
      ],
    },
    // ── Delhi / NCR ───────────────────────────────────────────────
    {
      name: "Delhi Technological University",
      location: "Delhi",
      feesPerYear: 140000,
      rating: 4.2,
      type: "Government",
      establishedYear: 1941,
      description:
        "DTU (formerly Delhi College of Engineering) is a premier government technical university in Delhi. Its excellent faculty, research output, and placement record make it one of North India's most sought-after engineering institutions.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 140000 },
        { name: "B.Tech Software Engineering", durationYears: 4, feesPerYear: 140000 },
        { name: "M.Tech AI & Machine Learning", durationYears: 2, feesPerYear: 158000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1050000, highestPackage: 7800000, placementRate: 0.88 },
        { year: 2023, avgPackage: 960000, highestPackage: 7000000, placementRate: 0.86 },
      ],
    },
    {
      name: "Netaji Subhas University of Technology",
      location: "Delhi",
      feesPerYear: 125000,
      rating: 4.0,
      type: "Government",
      establishedYear: 1983,
      description:
        "NSUT (formerly NSIT) is a government technical university in Delhi known for its strong academic standards and excellent placement in the IT industry. Particularly well-known for its computer science and IT programs.",
      courses: [
        { name: "B.E. Computer Science", durationYears: 4, feesPerYear: 125000 },
        { name: "B.E. Information Technology", durationYears: 4, feesPerYear: 125000 },
        { name: "B.E. Electronics & Communication", durationYears: 4, feesPerYear: 125000 },
      ],
      placements: [
        { year: 2024, avgPackage: 980000, highestPackage: 7200000, placementRate: 0.86 },
        { year: 2023, avgPackage: 890000, highestPackage: 6400000, placementRate: 0.84 },
      ],
    },
    // ── Kolkata ───────────────────────────────────────────────────
    {
      name: "Jadavpur University",
      location: "Kolkata",
      feesPerYear: 65000,
      rating: 4.4,
      type: "Government",
      establishedYear: 1906,
      description:
        "Jadavpur University is one of West Bengal's most prestigious universities with a long history of academic excellence. Its engineering faculty is particularly well-regarded, and it offers extremely affordable quality education.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 65000 },
        { name: "B.E. Electronics & Telecommunication", durationYears: 4, feesPerYear: 65000 },
        { name: "M.E. Computer Science", durationYears: 2, feesPerYear: 75000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1100000, highestPackage: 8200000, placementRate: 0.87 },
        { year: 2023, avgPackage: 1000000, highestPackage: 7500000, placementRate: 0.85 },
      ],
    },
    {
      name: "Heritage Institute of Technology",
      location: "Kolkata",
      feesPerYear: 185000,
      rating: 3.7,
      type: "Private",
      establishedYear: 2001,
      description:
        "Heritage Institute of Technology is a well-known private engineering college in Kolkata, offering quality technical education. It has solid industry connections in the Kolkata and Bangalore tech ecosystems.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 185000 },
        { name: "B.Tech Electronics & Communication Engineering", durationYears: 4, feesPerYear: 185000 },
        { name: "M.Tech Computer Science", durationYears: 2, feesPerYear: 210000 },
      ],
      placements: [
        { year: 2024, avgPackage: 560000, highestPackage: 3800000, placementRate: 0.71 },
        { year: 2023, avgPackage: 510000, highestPackage: 3400000, placementRate: 0.68 },
      ],
    },
    // ── Chennai ───────────────────────────────────────────────────
    {
      name: "Anna University",
      location: "Chennai",
      feesPerYear: 75000,
      rating: 4.1,
      type: "Government",
      establishedYear: 1978,
      description:
        "Anna University is Tamil Nadu's state technical university and one of India's most significant engineering institutions, affiliating 572 engineering colleges. The main campus offers strong programs with excellent research facilities.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 75000 },
        { name: "B.E. Electrical & Electronics Engineering", durationYears: 4, feesPerYear: 75000 },
        { name: "M.E. Software Engineering", durationYears: 2, feesPerYear: 85000 },
      ],
      placements: [
        { year: 2024, avgPackage: 680000, highestPackage: 5000000, placementRate: 0.76 },
        { year: 2023, avgPackage: 620000, highestPackage: 4500000, placementRate: 0.74 },
      ],
    },
    {
      name: "SSN College of Engineering",
      location: "Chennai",
      feesPerYear: 160000,
      rating: 4.0,
      type: "Private",
      establishedYear: 1996,
      description:
        "SSN College of Engineering is one of Chennai's top autonomous engineering colleges, known for its excellent academic environment, research culture, and strong placement record in both IT and core engineering companies.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 160000 },
        { name: "B.E. Electronics & Communication Engineering", durationYears: 4, feesPerYear: 160000 },
        { name: "M.E. Computer Science & Engineering", durationYears: 2, feesPerYear: 180000 },
      ],
      placements: [
        { year: 2024, avgPackage: 720000, highestPackage: 5400000, placementRate: 0.82 },
        { year: 2023, avgPackage: 660000, highestPackage: 4800000, placementRate: 0.80 },
      ],
    },
    // ── Ahmedabad / Gujarat ────────────────────────────────────────
    {
      name: "Dhirubhai Ambani Institute of IT",
      location: "Gandhinagar",
      feesPerYear: 320000,
      rating: 4.3,
      type: "Deemed",
      establishedYear: 2001,
      description:
        "DA-IICT is a premier IT-focused institution in Gujarat founded by the Reliance Group. Its specialized IT programs, world-class faculty, and industry collaboration have earned it a stellar reputation in the Indian tech landscape.",
      courses: [
        { name: "B.Tech ICT", durationYears: 4, feesPerYear: 320000 },
        { name: "M.Tech ICT", durationYears: 2, feesPerYear: 295000 },
        { name: "M.Tech AI", durationYears: 2, feesPerYear: 310000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1280000, highestPackage: 9500000, placementRate: 0.91 },
        { year: 2023, avgPackage: 1150000, highestPackage: 8600000, placementRate: 0.90 },
      ],
    },
    {
      name: "Nirma University",
      location: "Ahmedabad",
      feesPerYear: 285000,
      rating: 3.9,
      type: "Deemed",
      establishedYear: 2003,
      description:
        "Nirma University is a well-regarded private university in Ahmedabad offering engineering, management, and law programs. Its MBA program is particularly strong, and its industry connections in Gujarat's business hub provide excellent placement opportunities.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 285000 },
        { name: "MBA", durationYears: 2, feesPerYear: 340000 },
        { name: "B.Tech Instrumentation & Control", durationYears: 4, feesPerYear: 265000 },
      ],
      placements: [
        { year: 2024, avgPackage: 680000, highestPackage: 5200000, placementRate: 0.75 },
        { year: 2023, avgPackage: 620000, highestPackage: 4700000, placementRate: 0.73 },
      ],
    },
    // ── Chandigarh / North ─────────────────────────────────────────
    {
      name: "Chandigarh University",
      location: "Chandigarh",
      feesPerYear: 240000,
      rating: 3.8,
      type: "Private",
      establishedYear: 2012,
      description:
        "Chandigarh University is one of India's fastest growing private universities, known for its massive campus, diverse programs, and strong placement activity, particularly with IT companies from Delhi-NCR and Bangalore.",
      courses: [
        { name: "B.E. Computer Science & Engineering", durationYears: 4, feesPerYear: 240000 },
        { name: "B.E. AI & Machine Learning", durationYears: 4, feesPerYear: 260000 },
        { name: "MBA", durationYears: 2, feesPerYear: 280000 },
      ],
      placements: [
        { year: 2024, avgPackage: 580000, highestPackage: 4200000, placementRate: 0.72 },
        { year: 2023, avgPackage: 530000, highestPackage: 3800000, placementRate: 0.70 },
      ],
    },
    // ── Jaipur / Rajasthan ─────────────────────────────────────────
    {
      name: "MNIT Jaipur",
      location: "Jaipur",
      feesPerYear: 148000,
      rating: 4.2,
      type: "NIT",
      establishedYear: 1963,
      description:
        "Malaviya National Institute of Technology Jaipur is a top-ranking NIT in Rajasthan. Its strong academic programs, research culture, and placement record make it one of the most coveted engineering institutions in North-West India.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 148000 },
        { name: "B.Tech Electrical Engineering", durationYears: 4, feesPerYear: 148000 },
        { name: "M.Tech Computer Science", durationYears: 2, feesPerYear: 168000 },
      ],
      placements: [
        { year: 2024, avgPackage: 1150000, highestPackage: 8200000, placementRate: 0.89 },
        { year: 2023, avgPackage: 1040000, highestPackage: 7500000, placementRate: 0.87 },
      ],
    },
    // ── Bhubaneswar / East ─────────────────────────────────────────
    {
      name: "KIIT Deemed University",
      location: "Bhubaneswar",
      feesPerYear: 390000,
      rating: 4.0,
      type: "Deemed",
      establishedYear: 1992,
      description:
        "KIIT is a young and rapidly growing deemed university in Odisha with excellent infrastructure and strong placement record. Known for its campus life, industry MoUs, and extensive placement activity with IT and product companies.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", durationYears: 4, feesPerYear: 390000 },
        { name: "B.Tech Electronics & Electrical Engineering", durationYears: 4, feesPerYear: 370000 },
        { name: "MBA", durationYears: 2, feesPerYear: 340000 },
      ],
      placements: [
        { year: 2024, avgPackage: 720000, highestPackage: 5500000, placementRate: 0.80 },
        { year: 2023, avgPackage: 660000, highestPackage: 4900000, placementRate: 0.78 },
      ],
    },
  ];

  // ── Seed colleges ──────────────────────────────────────────────────────────
  for (const college of colleges) {
    // Check if college already exists (idempotent seed)
    const existing = await prisma.college.findFirst({
      where: { name: college.name },
    });

    let created;
    if (existing) {
      created = existing;
    } else {
      created = await prisma.college.create({
        data: {
          name: college.name,
          location: college.location,
          feesPerYear: college.feesPerYear,
          rating: college.rating,
          type: college.type,
          description: college.description,
          establishedYear: college.establishedYear,
          courses: {
            create: college.courses,
          },
          placements: {
            create: college.placements,
          },
        },
      });
    }

    // Seed a sample review from the demo user
    await prisma.review.upsert({
      where: { collegeId_userId: { collegeId: created.id, userId: demoUser.id } },
      update: {},
      create: {
        collegeId: created.id,
        userId: demoUser.id,
        rating: college.rating - 0.1 > 0 ? +(college.rating - 0.1).toFixed(1) : college.rating,
        comment: `Great institution with excellent faculty and infrastructure. The placement support is commendable and the overall campus experience is enriching. Highly recommended for serious engineering aspirants.`,
      },
    });

    console.log(`✅ ${created.name}`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log(`   Colleges seeded: ${colleges.length}`);
  console.log(`   Demo login: demo@collegedisc.in / Demo@1234`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
