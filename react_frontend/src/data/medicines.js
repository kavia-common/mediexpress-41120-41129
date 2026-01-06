/**
 * Mock medicines data for MedExpress.
 * Images use inline SVG placeholders so the app works without external assets.
 */

const pillSvg = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(37,99,235,0.15)"/>
        <stop offset="1" stop-color="rgba(249,250,251,1)"/>
      </linearGradient>
    </defs>
    <rect width="480" height="320" rx="28" fill="url(#g)"/>
    <g>
      <rect x="144" y="110" width="192" height="100" rx="50" fill="rgba(37,99,235,0.75)"/>
      <rect x="240" y="110" width="96" height="100" rx="50" fill="rgba(245,158,11,0.78)"/>
      <line x1="240" y1="120" x2="240" y2="200" stroke="rgba(255,255,255,0.55)" stroke-width="6"/>
    </g>
    <text x="50%" y="78%" text-anchor="middle" font-family="Inter, Arial" font-size="20" font-weight="700" fill="rgba(17,24,39,0.78)">${label}</text>
  </svg>
`)}`;

export const medicines = [
  {
    id: "mx-para-500",
    name: "Paracetamol 500mg",
    description: "Fast relief from fever & mild pain. 10 tablets.",
    imageUrl: pillSvg("Paracetamol 500mg"),
    price: 300,
    availability: "In Stock",
    featured: true
  },
  {
    id: "mx-ibu-200",
    name: "Ibuprofen 200mg",
    description: "Pain & inflammation relief. 10 tablets.",
    imageUrl: pillSvg("Ibuprofen 200mg"),
    price: 3.49,
    availability: "In Stock",
    featured: true
  },
  {
    id: "mx-cetz-10",
    name: "Cetirizine 10mg",
    description: "Allergy relief for sneezing and runny nose. 10 tablets.",
    imageUrl: pillSvg("Cetirizine 10mg"),
    price: 4.25,
    availability: "Limited",
    featured: false
  },
  {
    id: "mx-omz-20",
    name: "Omeprazole 20mg",
    description: "Acidity & heartburn support. 10 capsules.",
    imageUrl: pillSvg("Omeprazole 20mg"),
    price: 6.99,
    availability: "In Stock",
    featured: false
  },
  {
    id: "mx-vita-c",
    name: "Vitamin C 1000mg",
    description: "Daily immunity support. 15 tablets.",
    imageUrl: pillSvg("Vitamin C"),
    price: 8.5,
    availability: "In Stock",
    featured: true
  },
  {
    id: "mx-azith-250",
    name: "Azithromycin 250mg",
    description: "Prescription antibiotic. Consult a doctor before use.",
    imageUrl: pillSvg("Azithromycin 250mg"),
    price: 12.99,
    availability: "Out of Stock",
    featured: false
  },
  {
    id: "mx-orf-oral",
    name: "ORS Hydration Pack",
    description: "Electrolyte hydration salts. 5 sachets.",
    imageUrl: pillSvg("ORS"),
    price: 5.25,
    availability: "In Stock",
    featured: false
  },
  {
    id: "mx-antacid",
    name: "Antacid Chewables",
    description: "Quick heartburn relief. 12 chewables.",
    imageUrl: pillSvg("Antacid"),
    price: 4.75,
    availability: "Limited",
    featured: true
  }
];
