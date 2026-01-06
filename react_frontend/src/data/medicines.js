/**
 * Mock medicines data for MedExpress.
 *
 * This file now supports local assets via an `image` field (preferred).
 * We also keep `imageUrl` for backward compatibility, but UI components should
 * prefer `image` and fall back safely.
 */

import paracetamolImg from "../assets/paracetamol.svg";
import amoxicillinImg from "../assets/amoxicillin.svg";
import genericMedicineImg from "../assets/generic-medicine.svg";

export const FALLBACK_MEDICINE_IMAGE = genericMedicineImg;

export const medicines = [
  {
    id: "mx-para-500",
    name: "Paracetamol 500mg",
    description: "Fast relief from fever & mild pain. 10 tablets.",
    image: paracetamolImg,
    imageUrl: paracetamolImg,
    // Base price is still treated as USD across the app for calculations, but this product
    // must show ₹300 as the primary displayed price regardless of the global USD→INR rate.
    price: 3.49,
    displayPriceInr: 300,
    availability: "In Stock",
    featured: true
  },
  {
    id: "mx-ibu-200",
    name: "Ibuprofen 200mg",
    description: "Pain & inflammation relief. 10 tablets.",
    image: genericMedicineImg,
    imageUrl: genericMedicineImg,
    price: 3.49,
    availability: "In Stock",
    featured: true
  },
  {
    id: "mx-cetz-10",
    name: "Cetirizine 10mg",
    description: "Allergy relief for sneezing and runny nose. 10 tablets.",
    image: genericMedicineImg,
    imageUrl: genericMedicineImg,
    price: 4.25,
    availability: "Limited",
    featured: false
  },
  {
    id: "mx-omz-20",
    name: "Omeprazole 20mg",
    description: "Acidity & heartburn support. 10 capsules.",
    image: genericMedicineImg,
    imageUrl: genericMedicineImg,
    price: 6.99,
    availability: "In Stock",
    featured: false
  },
  {
    id: "mx-vita-c",
    name: "Vitamin C 1000mg",
    description: "Daily immunity support. 15 tablets.",
    image: genericMedicineImg,
    imageUrl: genericMedicineImg,
    price: 8.5,
    availability: "In Stock",
    featured: true
  },
  {
    id: "mx-azith-250",
    name: "Azithromycin 250mg",
    description: "Prescription antibiotic. Consult a doctor before use.",
    image: amoxicillinImg,
    imageUrl: amoxicillinImg,
    price: 12.99,
    availability: "Out of Stock",
    featured: false
  },
  {
    id: "mx-orf-oral",
    name: "ORS Hydration Pack",
    description: "Electrolyte hydration salts. 5 sachets.",
    image: genericMedicineImg,
    imageUrl: genericMedicineImg,
    price: 5.25,
    availability: "In Stock",
    featured: false
  },
  {
    id: "mx-antacid",
    name: "Antacid Chewables",
    description: "Quick heartburn relief. 12 chewables.",
    image: genericMedicineImg,
    imageUrl: genericMedicineImg,
    price: 4.75,
    availability: "Limited",
    featured: true
  }
];
