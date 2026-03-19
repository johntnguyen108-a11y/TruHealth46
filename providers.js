// Helper function for Dr. Howard bad reviews
const drHowardBadReview1 = (specialty) => {
    const specialtyText = {
        chiropractic: "manipulations causing herniated discs",
        therapy: "unlicensed therapy sessions causing psychological harm",
        family: "misdiagnoses and prescribing wrong medications",
        orthodontist: "damaging patients' teeth with improper braces",
        dentist: "botched fillings and unnecessary extractions",
        optometrist: "wrong prescriptions causing severe headaches"
    };
    return {
        reviewer: "Dr. Patricia Kim, MD",
        date: "1 week ago",
        rating: 1,
        text: `I must warn colleagues about Dr. Howard. Multiple patients came to me with worsened conditions after seeing him. He's not properly licensed and his $35 sessions involve ${specialtyText[specialty]}. One patient suffered serious complications after his 'treatment.' He bills for services never rendered and refuses to provide proper documentation. His office is unsanitary. I've reported him to the state board. Please avoid and do not refer patients here.`
    };
};

const drHowardBadReview2 = (specialty, specialtyName) => {
    const specialtyText = {
        chiropractic: "chiropractor",
        therapy: "therapist", 
        family: "physician",
        orthodontist: "orthodontist",
        dentist: "dentist",
        optometrist: "optometrist"
    };
    return {
        reviewer: `Dr. Michael Chen, ${specialty === 'therapy' ? 'PsyD' : 'MD'}`,
        date: "3 weeks ago",
        rating: 1,
        text: `As a fellow ${specialtyText[specialty]}, I'm embarrassed by Dr. Howard's practice. He gives our profession a bad name. No proper training, performs dangerous procedures without assessment, and his 'discount' pricing attracts vulnerable patients who then get hurt. I've had to treat 5+ patients who came from his office with conditions HE caused. Lacks basic understanding of proper care. Stay away.`
    };
};

// Chiropractors
const chiropractors = [
    {
        id: 1,
        name: "Dr. Sarah Mitchell, DC",
        specialty: "chiropractic",
        specialtyName: "Chiropractic Care",
        experience: 15,
        price: 45,
        distance: 1.2,
        availability: "same-day",
        rating: 4.9,
        reviews: 287,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
        about: "Board-certified chiropractor specializing in sports injuries and chronic pain management.",
        address: "123 Wellness Dr, Suite 200",
        phone: "(555) 234-5678",
        insurance: "In-Network",
        medicalSchool: "Palmer College of Chiropractic",
        boardCert: "National Board of Chiropractic Examiners (NBCE)",
        professionalReviews: [{reviewer: "Dr. James Patterson, MD", date: "1 month ago", rating: 5, text: "I've referred over 50 patients to Dr. Mitchell over the past 3 years. Her approach to post-surgical rehabilitation is exceptional, with most patients reporting 70-80% pain reduction within 6-8 weeks. At $45 per session with most insurance plans covering it, she provides excellent value. She caught a misdiagnosed SI joint dysfunction in one of my patients that I had missed. Very professional billing practices - never any surprise charges."}]
    },
    {
        id: 2,
        name: "Dr. Marcus Thompson, DC",
        specialty: "chiropractic",
        specialtyName: "Chiropractic Care",
        experience: 8,
        price: 75,
        distance: 4.5,
        availability: "next-day",
        rating: 4.3,
        reviews: 134,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
        about: "Specializes in workplace ergonomics and occupational injury prevention.",
        address: "890 Corporate Plaza, Floor 3",
        phone: "(555) 345-6789",
        insurance: "Out-of-Network",
        medicalSchool: "Logan University",
        boardCert: "American Chiropractic Board of Sports Physicians (ACBSP)",
        professionalReviews: [{reviewer: "Dr. Susan Rodriguez, DO", date: "2 weeks ago", rating: 4, text: "Dr. Thompson treats many of my corporate clients. At $75 out-of-network, he's pricier than competitors, but results are solid - about 60% improvement within 8-10 sessions for ergonomic issues."}]
    },
    {
        id: 3,
        name: "Dr. Emily Rodriguez, DC",
        specialty: "chiropractic",
        specialtyName: "Chiropractic Care",
        experience: 12,
        price: 55,
        distance: 2.8,
        availability: "same-day",
        rating: 5.0,
        reviews: 421,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #1e88e5 0%, #43a047 100%)",
        about: "Prenatal and postnatal chiropractic care specialist.",
        address: "456 Family Health Center",
        phone: "(555) 456-7890",
        insurance: "In-Network",
        medicalSchool: "Life University",
        boardCert: "International Chiropractic Pediatric Association (ICPA)",
        professionalReviews: [{reviewer: "Dr. Amanda Foster, MD (OB-GYN)", date: "5 days ago", rating: 5, text: "My go-to for pregnant patients with back pain. She's helped over 20 of my patients achieve better pelvic alignment leading to easier deliveries. $55 copay is very affordable. Professional, evidence-based approach."}]
    },
    {
        id: 4,
        name: "Dr. Howard",
        specialty: "chiropractic",
        specialtyName: "Chiropractic Care",
        experience: 3,
        price: 35,
        distance: 8.1,
        availability: "this-week",
        rating: 1.8,
        reviews: 156,
        avatar: "👨",
        gradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
        about: "Discount healthcare provider offering multiple services.",
        address: "999 Budget Medical Strip Mall",
        phone: "(555) 999-0000",
        insurance: "Limited Plans",
        medicalSchool: "Online Certification",
        boardCert: "None",
        professionalReviews: [drHowardBadReview1('chiropractic'), drHowardBadReview2('chiropractic', 'Chiropractic Care')]
    }
];

// Therapists
const therapists = [
    {
        id: 201,
        name: "Dr. Jennifer Matthews, PsyD",
        specialty: "therapy",
        specialtyName: "Therapy/Counseling",
        experience: 16,
        price: 120,
        distance: 3.2,
        availability: "next-day",
        rating: 4.9,
        reviews: 234,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
        about: "Licensed psychologist specializing in cognitive behavioral therapy.",
        address: "123 Mental Health Plaza",
        phone: "(555) 111-2222",
        insurance: "Out-of-Network",
        medicalSchool: "Psy.D. Clinical Psychology",
        boardCert: "Licensed Psychologist",
        professionalReviews: [{reviewer: "Dr. Amanda Foster, MD", date: "2 weeks ago", rating: 5, text: "One of the best therapists I work with. Evidence-based CBT approach. $120/session, insurance reimburses ~60%. Patients show significant improvement. Waitlist is 3-4 weeks for new patients."}]
    },
    {
        id: 202,
        name: "Michael Rodriguez, LMFT",
        specialty: "therapy",
        specialtyName: "Therapy/Counseling",
        experience: 11,
        price: 85,
        distance: 2.5,
        availability: "same-day",
        rating: 4.7,
        reviews: 189,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
        about: "Marriage and family therapist.",
        address: "456 Relationship Center",
        phone: "(555) 222-3333",
        insurance: "In-Network",
        medicalSchool: "M.A. Marriage and Family Therapy",
        boardCert: "LMFT",
        professionalReviews: [{reviewer: "Dr. Lisa Chen, PsyD", date: "1 week ago", rating: 5, text: "Excellent couples work using Gottman Method. Marriages recovered after 6 months weekly sessions. $85/session in-network, very accessible."}]
    },
    {
        id: 203,
        name: "Dr. Sarah Johnson, PhD",
        specialty: "therapy",
        specialtyName: "Therapy/Counseling",
        experience: 22,
        price: 150,
        distance: 7.8,
        availability: "this-week",
        rating: 4.8,
        reviews: 412,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
        about: "Trauma specialist, EMDR certified.",
        address: "789 Trauma Recovery Center",
        phone: "(555) 333-4444",
        insurance: "Out-of-Network",
        medicalSchool: "Ph.D. Clinical Psychology",
        boardCert: "EMDR Certified",
        professionalReviews: [{reviewer: "Dr. James Patterson, MD", date: "5 days ago", rating: 5, text: "Trauma specialist with 22 years experience. EMDR helped PTSD patients significantly. $150/session most expensive but worth it for complex trauma."}]
    },
    {
        id: 204,
        name: "Dr. Howard",
        specialty: "therapy",
        specialtyName: "Therapy/Counseling",
        experience: 3,
        price: 35,
        distance: 9.2,
        availability: "this-week",
        rating: 1.7,
        reviews: 143,
        avatar: "👨",
        gradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
        about: "Discount healthcare provider offering multiple services.",
        address: "999 Budget Medical Strip Mall",
        phone: "(555) 999-0000",
        insurance: "Limited Plans",
        medicalSchool: "Online Certification",
        boardCert: "None",
        professionalReviews: [drHowardBadReview1('therapy'), drHowardBadReview2('therapy', 'Therapy/Counseling')]
    }
];

// Family Doctors
const familyDoctors = [
    {
        id: 101,
        name: "Dr. Maria Santos, MD",
        specialty: "family",
        specialtyName: "Family Medicine",
        experience: 18,
        price: 45,
        distance: 2.1,
        availability: "next-day",
        rating: 4.9,
        reviews: 523,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
        about: "Board-certified family physician.",
        address: "890 Primary Care Center",
        phone: "(555) 789-0123",
        insurance: "In-Network",
        medicalSchool: "Harvard Medical School",
        residency: "Mass General Hospital",
        boardCert: "American Board of Family Medicine",
        professionalReviews: [{reviewer: "Dr. John Miller, MD", date: "2 weeks ago", rating: 5, text: "Manages complex patients exceptionally. Her diabetic/hypertensive patients arrive well-controlled. $45 copay standard. Never seen missed diagnosis in 8 years."}]
    },
    {
        id: 102,
        name: "Dr. James Wilson, MD",
        specialty: "family",
        specialtyName: "Family Medicine",
        experience: 9,
        price: 50,
        distance: 5.4,
        availability: "this-week",
        rating: 4.4,
        reviews: 187,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
        about: "Evidence-based physician.",
        address: "234 Wellness Medical Group",
        phone: "(555) 890-1234",
        insurance: "Limited Networks",
        medicalSchool: "Johns Hopkins School of Medicine",
        residency: "Mayo Clinic",
        boardCert: "American Board of Family Medicine",
        professionalReviews: [{reviewer: "Dr. Susan Taylor, MD", date: "1 week ago", rating: 4, text: "Academically strong. $50 copay, limited networks. Can be overly cautious ordering tests. Wait times 30-40 min."}]
    },
    {
        id: 103,
        name: "Dr. Rachel Cohen, MD",
        specialty: "family",
        specialtyName: "Family Medicine",
        experience: 14,
        price: 45,
        distance: 1.9,
        availability: "same-day",
        rating: 4.8,
        reviews: 356,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #1e88e5 0%, #43a047 100%)",
        about: "Women's health and pediatrics specialist.",
        address: "567 Community Health Center",
        phone: "(555) 901-2345",
        insurance: "In-Network",
        medicalSchool: "Stanford School of Medicine",
        residency: "UCSF Medical Center",
        boardCert: "American Board of Family Medicine",
        professionalReviews: [{reviewer: "Dr. Michael Torres, MD", date: "10 days ago", rating: 5, text: "Excellent pediatric care. Catches developmental delays early. $45 copay. No billing surprises. Professional, collaborative."}]
    },
    {
        id: 104,
        name: "Dr. Howard",
        specialty: "family",
        specialtyName: "Family Medicine",
        experience: 3,
        price: 35,
        distance: 8.7,
        availability: "this-week",
        rating: 1.6,
        reviews: 178,
        avatar: "👨",
        gradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
        about: "Discount healthcare provider offering multiple services.",
        address: "999 Budget Medical Strip Mall",
        phone: "(555) 999-0000",
        insurance: "Limited Plans",
        medicalSchool: "Online Certification",
        boardCert: "None",
        professionalReviews: [drHowardBadReview1('family'), drHowardBadReview2('family', 'Family Medicine')]
    }
];

// Orthodontists
const orthodontists = [
    {
        id: 301,
        name: "Dr. Jennifer Park, DDS, MS",
        specialty: "orthodontist",
        specialtyName: "Orthodontist",
        experience: 14,
        price: 150,
        distance: 2.3,
        availability: "next-day",
        rating: 4.9,
        reviews: 342,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
        about: "Specializes in Invisalign and modern orthodontic treatments for teens and adults.",
        address: "234 Smile Avenue, Suite 5",
        phone: "(555) 111-2222",
        insurance: "In-Network",
        medicalSchool: "Harvard School of Dental Medicine",
        boardCert: "American Board of Orthodontics",
        professionalReviews: [{reviewer: "Dr. Thomas Wright, DDS", date: "2 weeks ago", rating: 5, text: "Dr. Park is the orthodontist I refer all my complex cases to. Her Invisalign work is flawless - average treatment time 14-18 months with excellent results. At $150 per visit, pricing is competitive. She catches bite issues early and her payment plans are fair."}]
    },
    {
        id: 302,
        name: "Dr. Michael Torres, DMD",
        specialty: "orthodontist",
        specialtyName: "Orthodontist",
        experience: 22,
        price: 175,
        distance: 5.1,
        availability: "this-week",
        rating: 4.7,
        reviews: 589,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
        about: "Traditional braces specialist with over 20 years of experience.",
        address: "567 Dental Plaza, 2nd Floor",
        phone: "(555) 222-3333",
        insurance: "Most Plans Accepted",
        medicalSchool: "University of Pennsylvania School of Dental Medicine",
        boardCert: "American Board of Orthodontics",
        professionalReviews: [{reviewer: "Dr. Sarah Johnson, DDS", date: "1 month ago", rating: 5, text: "Dr. Torres handled my daughter's severe overbite beautifully. 24-month treatment resulted in perfect alignment. His $175 visits are higher than average but worth it for complex cases."}]
    },
    {
        id: 303,
        name: "Dr. Rachel Kim, DDS, MS",
        specialty: "orthodontist",
        specialtyName: "Orthodontist",
        experience: 9,
        price: 125,
        distance: 3.7,
        availability: "same-day",
        rating: 4.8,
        reviews: 267,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
        about: "Pediatric orthodontist specializing in early intervention.",
        address: "890 Kids Dental Center",
        phone: "(555) 333-4444",
        insurance: "In-Network",
        medicalSchool: "Columbia University College of Dental Medicine",
        boardCert: "American Board of Orthodontics",
        professionalReviews: [{reviewer: "Dr. Lisa Martinez, DDS (Pediatric)", date: "10 days ago", rating: 5, text: "Dr. Kim is wonderful with children. She catches early spacing issues, preventing extensive work later. At $125 per visit with great insurance coverage, very accessible."}]
    },
    {
        id: 304,
        name: "Dr. Howard",
        specialty: "orthodontist",
        specialtyName: "Orthodontist",
        experience: 3,
        price: 35,
        distance: 9.5,
        availability: "this-week",
        rating: 1.5,
        reviews: 201,
        avatar: "👨",
        gradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
        about: "Discount healthcare provider offering multiple services.",
        address: "999 Budget Medical Strip Mall",
        phone: "(555) 999-0000",
        insurance: "Limited Plans",
        medicalSchool: "Online Certification",
        boardCert: "None",
        professionalReviews: [drHowardBadReview1('orthodontist'), drHowardBadReview2('orthodontist', 'Orthodontist')]
    }
];

// Dentists
const dentists = [
    {
        id: 401,
        name: "Dr. Robert Anderson, DDS",
        specialty: "dentist",
        specialtyName: "General Dentist",
        experience: 18,
        price: 95,
        distance: 1.5,
        availability: "same-day",
        rating: 4.9,
        reviews: 512,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #00acc1 0%, #0097a7 100%)",
        about: "Comprehensive family dentistry with focus on preventive care.",
        address: "123 Main Street Dental",
        phone: "(555) 444-5555",
        insurance: "In-Network",
        medicalSchool: "NYU College of Dentistry",
        boardCert: "Academy of General Dentistry",
        professionalReviews: [{reviewer: "Dr. Emily Chen, DMD", date: "2 weeks ago", rating: 5, text: "Dr. Anderson's preventive approach has reduced my referrals for extractions by 40%. His cleanings are thorough, crown work is excellent, and at $95 per visit, very fair pricing."}]
    },
    {
        id: 402,
        name: "Dr. Maria Santos, DDS",
        specialty: "dentist",
        specialtyName: "General Dentist",
        experience: 12,
        price: 110,
        distance: 4.2,
        availability: "next-day",
        rating: 4.7,
        reviews: 389,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #00acc1 0%, #0097a7 100%)",
        about: "Specializes in cosmetic dentistry and smile makeovers.",
        address: "456 Cosmetic Dental Suite",
        phone: "(555) 555-6666",
        insurance: "Out-of-Network",
        medicalSchool: "UCSF School of Dentistry",
        boardCert: "American Academy of Cosmetic Dentistry",
        professionalReviews: [{reviewer: "Dr. James Wilson, DDS", date: "3 weeks ago", rating: 5, text: "Dr. Santos does exceptional veneer work. Her porcelain veneers last 10-15 years on average. At $110 per visit, worth it for aesthetic cases."}]
    },
    {
        id: 403,
        name: "Dr. David Lee, DMD",
        specialty: "dentist",
        specialtyName: "General Dentist",
        experience: 25,
        price: 85,
        distance: 2.9,
        availability: "same-day",
        rating: 4.8,
        reviews: 678,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #00acc1 0%, #0097a7 100%)",
        about: "Experienced general dentist focused on gentle care.",
        address: "789 Gentle Dental Care",
        phone: "(555) 666-7777",
        insurance: "Most Plans",
        medicalSchool: "Boston University Goldman School of Dental Medicine",
        boardCert: "American Dental Association",
        professionalReviews: [{reviewer: "Dr. Patricia Moore, DDS", date: "1 week ago", rating: 5, text: "Dr. Lee has 25 years experience and it shows. Excellent diagnostic skills - catches cavities early. His $85 rate is below market average."}]
    },
    {
        id: 404,
        name: "Dr. Howard",
        specialty: "dentist",
        specialtyName: "General Dentist",
        experience: 3,
        price: 35,
        distance: 8.9,
        availability: "this-week",
        rating: 1.4,
        reviews: 192,
        avatar: "👨",
        gradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
        about: "Discount healthcare provider offering multiple services.",
        address: "999 Budget Medical Strip Mall",
        phone: "(555) 999-0000",
        insurance: "Limited Plans",
        medicalSchool: "Online Certification",
        boardCert: "None",
        professionalReviews: [drHowardBadReview1('dentist'), drHowardBadReview2('dentist', 'General Dentist')]
    }
];

// Optometrists
const optometrists = [
    {
        id: 501,
        name: "Dr. Amanda Foster, OD",
        specialty: "optometrist",
        specialtyName: "Optometrist",
        experience: 16,
        price: 120,
        distance: 2.1,
        availability: "next-day",
        rating: 4.9,
        reviews: 445,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #ff6f00 0%, #e65100 100%)",
        about: "Specializes in contact lens fittings and comprehensive eye exams.",
        address: "234 Vision Center",
        phone: "(555) 777-8888",
        insurance: "In-Network",
        medicalSchool: "New England College of Optometry",
        boardCert: "American Board of Optometry",
        professionalReviews: [{reviewer: "Dr. Steven Park, MD (Ophthalmology)", date: "2 weeks ago", rating: 5, text: "Dr. Foster is my preferred optometrist for pre-surgical evaluations. Her comprehensive exams catch early glaucoma and macular degeneration. At $120 per exam with insurance, excellent value."}]
    },
    {
        id: 502,
        name: "Dr. Christopher Davis, OD",
        specialty: "optometrist",
        specialtyName: "Optometrist",
        experience: 11,
        price: 100,
        distance: 3.8,
        availability: "same-day",
        rating: 4.7,
        reviews: 312,
        avatar: "👨‍⚕️",
        gradient: "linear-gradient(135deg, #ff6f00 0%, #e65100 100%)",
        about: "Pediatric optometry and vision therapy specialist.",
        address: "567 Kids Vision Clinic",
        phone: "(555) 888-9999",
        insurance: "Most Plans",
        medicalSchool: "Southern College of Optometry",
        boardCert: "American Board of Optometry",
        professionalReviews: [{reviewer: "Dr. Rachel Thompson, MD (Pediatrics)", date: "1 month ago", rating: 5, text: "Dr. Davis is wonderful with children. He identified vision tracking issues affecting reading ability. His vision therapy shows 80% improvement in 6-9 months."}]
    },
    {
        id: 503,
        name: "Dr. Nicole Martinez, OD",
        specialty: "optometrist",
        specialtyName: "Optometrist",
        experience: 20,
        price: 140,
        distance: 5.5,
        availability: "this-week",
        rating: 4.8,
        reviews: 567,
        avatar: "👩‍⚕️",
        gradient: "linear-gradient(135deg, #ff6f00 0%, #e65100 100%)",
        about: "Specializes in difficult prescriptions and progressive lenses.",
        address: "890 Advanced Eye Care",
        phone: "(555) 999-0000",
        insurance: "Out-of-Network",
        medicalSchool: "Illinois College of Optometry",
        boardCert: "American Board of Optometry",
        professionalReviews: [{reviewer: "Dr. Michael Roberts, OD", date: "3 weeks ago", rating: 5, text: "Dr. Martinez handles complex cases I can't. High astigmatism, post-LASIK patients - she solves them all. At $140 out-of-network, expensive but worth it."}]
    },
    {
        id: 504,
        name: "Dr. Howard",
        specialty: "optometrist",
        specialtyName: "Optometrist",
        experience: 3,
        price: 35,
        distance: 9.8,
        availability: "this-week",
        rating: 1.3,
        reviews: 167,
        avatar: "👨",
        gradient: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
        about: "Discount healthcare provider offering multiple services.",
        address: "999 Budget Medical Strip Mall",
        phone: "(555) 999-0000",
        insurance: "Limited Plans",
        medicalSchool: "Online Certification",
        boardCert: "None",
        professionalReviews: [drHowardBadReview1('optometrist'), drHowardBadReview2('optometrist', 'Optometrist')]
    }
];

// Get all providers for Call Doctor feature
const allProviders = [...chiropractors, ...therapists, ...familyDoctors, ...orthodontists, ...dentists, ...optometrists];

// Adding insurance acceptance to all providers
// Each provider accepts 2-3 insurance providers

// Chiropractors
chiropractors[0].acceptedInsurance = ['BlueCross BlueShield', 'UnitedHealthcare', 'Aetna'];
chiropractors[1].acceptedInsurance = ['UnitedHealthcare', 'Cigna'];
chiropractors[2].acceptedInsurance = ['BlueCross BlueShield', 'Humana'];
chiropractors[3].acceptedInsurance = ['Aetna']; // Dr. Howard only accepts 1

// Therapists
therapists[0].acceptedInsurance = ['BlueCross BlueShield', 'Aetna', 'Humana'];
therapists[1].acceptedInsurance = ['UnitedHealthcare', 'Cigna'];
therapists[2].acceptedInsurance = ['BlueCross BlueShield', 'UnitedHealthcare'];
therapists[3].acceptedInsurance = ['Cigna']; // Dr. Howard only accepts 1

// Family Doctors
familyDoctors[0].acceptedInsurance = ['BlueCross BlueShield', 'UnitedHealthcare', 'Aetna'];
familyDoctors[1].acceptedInsurance = ['Aetna', 'Cigna', 'Humana'];
familyDoctors[2].acceptedInsurance = ['BlueCross BlueShield', 'Humana'];
familyDoctors[3].acceptedInsurance = ['UnitedHealthcare']; // Dr. Howard only accepts 1

// Orthodontists
orthodontists[0].acceptedInsurance = ['BlueCross BlueShield', 'UnitedHealthcare'];
orthodontists[1].acceptedInsurance = ['Aetna', 'Cigna', 'Humana'];
orthodontists[2].acceptedInsurance = ['BlueCross BlueShield', 'Aetna'];
orthodontists[3].acceptedInsurance = ['Humana']; // Dr. Howard only accepts 1

// Dentists
dentists[0].acceptedInsurance = ['BlueCross BlueShield', 'UnitedHealthcare', 'Aetna'];
dentists[1].acceptedInsurance = ['UnitedHealthcare', 'Cigna'];
dentists[2].acceptedInsurance = ['BlueCross BlueShield', 'Humana'];
dentists[3].acceptedInsurance = ['Cigna']; // Dr. Howard only accepts 1

// Optometrists
optometrists[0].acceptedInsurance = ['BlueCross BlueShield', 'UnitedHealthcare'];
optometrists[1].acceptedInsurance = ['Aetna', 'Cigna', 'Humana'];
optometrists[2].acceptedInsurance = ['BlueCross BlueShield', 'Aetna'];
optometrists[3].acceptedInsurance = ['UnitedHealthcare']; // Dr. Howard only accepts 1

console.log('Insurance data added to all providers');
