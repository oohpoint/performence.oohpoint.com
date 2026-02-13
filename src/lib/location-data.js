// lib/location-data.ts

export const CITIES_DATA = {
    Mumbai: {
        name: "Mumbai",
        state: "Maharashtra",
        areas: {
            "Powai": ["400076", "400072"],
            "Bandra": ["400050", "400051"],
            "Andheri": ["400053", "400059", "400058"],
            "Worli": ["400018", "400025"],
            "Fort": ["400001"],
            "Marine Lines": ["400002"],
            "Colaba": ["400005"],
            "Mahim": ["400016"],
            "Dadar": ["400028"],
            "Parel": ["400012"],
            "Thane": ["400601", "400602", "400603"],
            "Navi Mumbai": ["400708", "400709", "400710"],
            "Borivali": ["400092", "400093", "400094"],
            "Malad": ["400064", "400066", "400067"],
            "Kandivali": ["400067", "400068", "400069"],
            "Santacruz": ["400054", "400055"],
            "Vile Parle": ["400056", "400057"],
            "Goregaon": ["400062", "400063"],
            "Mulund": ["400080", "400081"],
        },
    },
    Bangalore: {
        name: "Bangalore",
        state: "Karnataka",
        areas: {
            "Koramangala": ["560034", "560038"],
            "Indiranagar": ["560008", "560038"],
            "Whitefield": ["560066", "560067"],
            "Marathahalli": ["560037"],
            "Electronic City": ["560100", "560114"],
            "BTM Layout": ["560076"],
            "JP Nagar": ["560078"],
            "HSR Layout": ["560102"],
            "Jayanagar": ["560041", "560082"],
            "Malleshwaram": ["560003"],
            "Richmond Town": ["560025"],
            "MG Road": ["560001"],
            "Vijaynagar": ["560040"],
            "Yelahanka": ["560064"],
            "Ramamurthy Nagar": ["560016"],
        },
    },
    Delhi: {
        name: "Delhi",
        state: "Delhi",
        areas: {
            "Connaught Place": ["110001"],
            "New Delhi": ["110011"],
            "Karol Bagh": ["110005"],
            "Dwarka": ["110078", "110079"],
            "Noida": ["201301", "201309"],
            "Gurgaon": ["122001", "122002", "122003"],
            "Pitampura": ["110034"],
            "Rohini": ["110085"],
            "Sector 5": ["110091"],
            "Ashok Vihar": ["110052"],
            "Safdarjung": ["110029"],
            "IIT Delhi": ["110016"],
            "South Extension": ["110049"],
            "Patel Nagar": ["110008"],
            "Vasant Vihar": ["110057"],
        },
    },
    Pune: {
        name: "Pune",
        state: "Maharashtra",
        areas: {
            "Hinjewadi": ["411057"],
            "Baner": ["411045"],
            "Viman Nagar": ["411014"],
            "Koregaon Park": ["411001"],
            "Shivajinagar": ["411005"],
            "Camp": ["411001"],
            "Wakad": ["411057"],
            "Kalyani Nagar": ["411006"],
            "Kothrud": ["411038"],
            "Aundh": ["411007"],
            "Pimple Saudagar": ["411027"],
            "Hadapsar": ["411028"],
            "Magarpatta": ["411013"],
            "Chakan": ["410501"],
            "Bhugaon": ["412114"],
        },
    },
    "Hyderabad": {
        name: "Hyderabad",
        state: "Telangana",
        areas: {
            "HITEC City": ["500081"],
            "Gachibowli": ["500032"],
            "Banjara Hills": ["500034"],
            "Jubilee Hills": ["500033"],
            "Koramangala": ["500095"],
            "Madhapur": ["500081"],
            "Begumpet": ["500016"],
            "Secunderabad": ["500003"],
            "Charminar": ["500002"],
            "Abids": ["500001"],
            "Nampally": ["500001"],
            "Fort": ["500025"],
            "Uppal": ["500039"],
            "Hitech City": ["500081"],
            "Ameerpet": ["500016"],
        },
    },
    Kolkata: {
        name: "Kolkata",
        state: "West Bengal",
        areas: {
            "Ballygunge": ["700019"],
            "Kasba": ["700107"],
            "Alipore": ["700027"],
            "Salt Lake": ["700091"],
            "Newtown": ["700156"],
            "Rajarhat": ["700157"],
            "Shyambazar": ["700005"],
            "Sealdah": ["700014"],
            "Park Street": ["700016"],
            "Gariahat": ["700019"],
            "Jadavpur": ["700032"],
            "Tollygunge": ["700040"],
            "Baguiati": ["700059"],
            "Sonarpur": ["700149"],
            "Barrackpore": ["700120"],
        },
    },
    Chennai: {
        name: "Chennai",
        state: "Tamil Nadu",
        areas: {
            "Velachery": ["600042"],
            "Adyar": ["600020"],
            "Besant Nagar": ["600090"],
            "Thiruvanmiyur": ["600041"],
            "Nungambakkam": ["600034"],
            "Mylapore": ["600004"],
            "T Nagar": ["600017"],
            "Chepak": ["600005"],
            "Kasturinagar": ["600032"],
            "Indiranagar": ["600020"],
            "Egmore": ["600008"],
            "George Town": ["600001"],
            "Triplicane": ["600005"],
            "Purasawalkam": ["600007"],
            "Villivakkam": ["600049"],
        },
    },
    Jaipur: {
        name: "Jaipur",
        state: "Rajasthan",
        areas: {
            "C Scheme": ["302001"],
            "Bani Park": ["302016"],
            "Gopalpura": ["302018"],
            "Pratapnagar": ["302019"],
            "Malviya Nagar": ["302017"],
            "Ashok Nagar": ["302001"],
            "Agarwal Farm": ["302019"],
            "Brahmpuri": ["302002"],
            "Shyam Nagar": ["302019"],
            "Sodala": ["302006"],
            "Amer": ["302002"],
            "Sanganeri Gate": ["302003"],
            "Pink City": ["302001"],
            "Civil Lines": ["302006"],
            "Kaniram Nagar": ["302016"],
        },
    },
    Ahmedabad: {
        name: "Ahmedabad",
        state: "Gujarat",
        areas: {
            "Rajkot": ["380015"],
            "Paldi": ["380007"],
            "Ellisbridge": ["380006"],
            "Mithakhali": ["380006"],
            "Navrangpura": ["380009"],
            "Satellite": ["380015"],
            "Vastrapur": ["380015"],
            "Mehsana": ["380001"],
            "Thaltej": ["380059"],
            "Iscon": ["380054"],
            "Bopal": ["380058"],
            "Jodhpur": ["380015"],
            "Gurukul": ["380052"],
            "Vesu": ["380058"],
            "SG Highway": ["380054"],
        },
    },
};

// Autocomplete function for cities
export function getCitySuggestions(input) {
    if (!input) return [];
    const lowerInput = input.toLowerCase();
    return Object.keys(CITIES_DATA).filter((city) =>
        city.toLowerCase().startsWith(lowerInput)
    );
}

// Get areas for a city
export function getAreasByCcity(cityName) {
    const city = CITIES_DATA[cityName];
    if (!city) return [];
    return Object.keys(city.areas);
}

// Get pincodes for an area
export function getPincodesByArea(cityName, areaName) {
    const city = CITIES_DATA[cityName];
    if (!city) return [];
    return city.areas[areaName] || [];
}

// Autocomplete function for areas
export function getAreaSuggestions(cityName, input) {
    const areas = getAreasByCcity(cityName);
    if (!input) return areas;
    const lowerInput = input.toLowerCase();
    return areas.filter((area) => area.toLowerCase().startsWith(lowerInput));
}

// Autocomplete function for pincodes
export function getPincodeSuggestions(cityName, areaName, input) {
    const pincodes = getPincodesByArea(cityName, areaName);
    if (!input) return pincodes;
    return pincodes.filter((pincode) => pincode.startsWith(input));
}

// Get all cities
export function getAllCities() {
    return Object.keys(CITIES_DATA);
}

// Get city state
export function getCityState(cityName) {
    const city = CITIES_DATA[cityName];
    return city ? city.state : null;
}