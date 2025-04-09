
export interface ReadingResource {
  id: string;
  title: string;
  description: string;
  coverImage: string; 
  type: 'book' | 'guide' | 'article';
  category: 'retirement' | 'small-business' | 'wealth-building' | 'estate-planning';
  rating?: number; // Optional 1-5 star rating
  testimonials?: string[]; // Optional array of testimonial quotes
  access: 'public' | 'client-only' | 'purchase';
  link: string; // PDF link, protected page, or purchase link
  linkType: 'internal' | 'external';
}

export const readingResources: ReadingResource[] = [
  {
    id: 'tax-optimization',
    title: 'Tax Optimization for High-Income Professionals',
    description: 'A comprehensive guide to reducing tax liability while maximizing wealth-building opportunities for physicians, attorneys, and executives.',
    coverImage: '/assets/book-tax-optimization.jpg', 
    type: 'book',
    category: 'wealth-building',
    rating: 4.8,
    testimonials: [
      'This book saved me over $32,000 in taxes last year alone. - Dr. M.J., Cardiologist',
      'Finally, tax strategies explained in plain English. Worth every penny. - S.T., Attorney'
    ],
    access: 'purchase',
    link: 'https://example.com/books/tax-optimization',
    linkType: 'external'
  },
  {
    id: 'roth-conversion',
    title: 'The Ultimate Roth Conversion Blueprint',
    description: 'Step-by-step strategies for optimizing Roth conversions across market cycles and tax law changes.',
    coverImage: '/assets/guide-roth-blueprint.jpg',
    type: 'guide',
    category: 'retirement',
    rating: 4.9,
    testimonials: [
      'This guide gave me the confidence to execute a 5-year Roth conversion plan. - R.L., Retired Executive'
    ],
    access: 'client-only',
    link: '/tax-planning/guides/roth-conversion-blueprint',
    linkType: 'internal'
  },
  {
    id: 'small-business',
    title: 'Small Business Tax Strategies',
    description: 'Maximize deductions and minimize audit risk for small business owners and self-employed professionals.',
    coverImage: '/assets/book-small-business.jpg',
    type: 'book',
    category: 'small-business',
    rating: 4.7,
    access: 'purchase',
    link: 'https://example.com/books/small-business-tax',
    linkType: 'external'
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning in Uncertain Times',
    description: 'Navigating estate taxes, trusts, and wealth transfer strategies in a changing legislative environment.',
    coverImage: '/assets/book-estate-planning.jpg',
    type: 'book',
    category: 'estate-planning',
    rating: 4.5,
    testimonials: [
      'The trust strategies in this book helped us save hundreds of thousands in potential estate taxes. - W.F., Family Office Client'
    ],
    access: 'purchase',
    link: 'https://example.com/books/estate-planning',
    linkType: 'external'
  },
  {
    id: 'tax-bracket-management',
    title: 'Tax Bracket Management Guide',
    description: 'Learn how to control your effective tax rate through strategic income timing and deduction planning.',
    coverImage: '/assets/guide-tax-bracket.jpg',
    type: 'guide',
    category: 'wealth-building',
    access: 'public',
    link: '/tax-planning/guides/tax-bracket-management',
    linkType: 'internal'
  },
  {
    id: 'retirement-tax-planning',
    title: 'Retirement Tax Planning Essentials',
    description: 'A beginner-friendly introduction to minimizing taxes before and during retirement.',
    coverImage: '/assets/guide-retirement.jpg',
    type: 'guide',
    category: 'retirement',
    rating: 4.6,
    access: 'public',
    link: '/tax-planning/guides/retirement-tax-planning',
    linkType: 'internal'
  }
];

export const getResourcesByCategory = (category: ReadingResource['category']) => {
  return readingResources.filter(resource => resource.category === category);
};

export const getAllCategories = (): ReadingResource['category'][] => {
  const categories = new Set<ReadingResource['category']>();
  readingResources.forEach(resource => categories.add(resource.category));
  return Array.from(categories);
};
