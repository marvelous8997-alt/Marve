// src/constants/testimonialsData.ts

export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  location?: string;
  avatar?: string;
  rating: number;
  review: string;
  date?: string;
  isVerified?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Aarav Patel",
    role: "Verified Customer",
    location: "Surat, Gujarat",
    avatar: "/assets/images/home/home_lifestyle.jpg",
    rating: 5,
    review:
      "The products are beautiful, practical and exactly what I was looking for. The quality exceeded my expectations.",
    date: "September 2026",
    isVerified: true,
  },
  {
    id: 2,
    name: "Riya Shah",
    role: "Verified Customer",
    location: "Ahmedabad, Gujarat",
    avatar: "/assets/images/home/home_lifestyle.jpg",
    rating: 5,
    review:
      "I absolutely loved the collection. Everything feels thoughtfully designed and the quality is really impressive.",
    date: "August 2026",
    isVerified: true,
  },
  {
    id: 3,
    name: "Kunal Mehta",
    role: "Verified Customer",
    location: "Mumbai, Maharashtra",
    avatar: "/assets/images/home/home_lifestyle.jpg",
    rating: 5,
    review:
      "MARVE has some wonderful home and kitchen essentials. The products look premium and work beautifully in everyday use.",
    date: "August 2026",
    isVerified: true,
  },
  {
    id: 4,
    name: "Nisha Desai",
    role: "Verified Customer",
    location: "Vadodara, Gujarat",
    avatar: "/assets/images/home/home_lifestyle.jpg",
    rating: 4,
    review:
      "A lovely shopping experience with a beautiful range of products. I especially liked the attention to detail.",
    date: "July 2026",
    isVerified: true,
  },
  {
    id: 5,
    name: "Dev Joshi",
    role: "Verified Customer",
    location: "Pune, Maharashtra",
    avatar: "/assets/images/home/home_lifestyle.jpg",
    rating: 5,
    review:
      "The products feel elegant while still being useful for everyday life. I would definitely shop from MARVE again.",
    date: "July 2026",
    isVerified: true,
  },
  {
    id: 6,
    name: "Meera Patel",
    role: "Verified Customer",
    location: "Rajkot, Gujarat",
    avatar: "/assets/images/home/home_lifestyle.jpg",
    rating: 5,
    review:
      "Beautiful designs, great quality and a very pleasant overall experience. MARVE has become one of my favourite places to shop.",
    date: "June 2026",
    isVerified: true,
  },
];

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}

export function getTestimonialById(
  id: number,
): Testimonial | undefined {
  return TESTIMONIALS.find((testimonial) => testimonial.id === id);
}