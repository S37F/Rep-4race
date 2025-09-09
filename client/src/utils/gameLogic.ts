import { Category, Chit, Player } from '../types/game';

export const CATEGORIES: Category[] = ['Fruits', 'Cars', 'Animals', 'Colors'];

export const CHIT_DATA: Record<Category, { name: string; emoji: string }[]> = {
  Fruits: [
    { name: 'Apple', emoji: '🍎' },
    { name: 'Banana', emoji: '🍌' },
    { name: 'Orange', emoji: '🍊' },
    { name: 'Grapes', emoji: '🍇' }
  ],
  Cars: [
    { name: 'Sedan', emoji: '🚗' },
    { name: 'SUV', emoji: '🚙' },
    { name: 'Sports', emoji: '🏎️' },
    { name: 'Truck', emoji: '🚚' }
  ],
  Animals: [
    { name: 'Lion', emoji: '🦁' },
    { name: 'Elephant', emoji: '🐘' },
    { name: 'Tiger', emoji: '🐅' },
    { name: 'Bear', emoji: '🐻' }
  ],
  Colors: [
    { name: 'Red', emoji: '🔴' },
    { name: 'Blue', emoji: '🔵' },
    { name: 'Green', emoji: '🟢' },
    { name: 'Yellow', emoji: '🟡' }
  ]
};

export function generateAllChits(): Chit[] {
  const chits: Chit[] = [];
  CATEGORIES.forEach(category => {
    CHIT_DATA[category].forEach((item, index) => {
      chits.push({
        id: `${category}-${index}`,
        category,
        name: item.name,
        emoji: item.emoji
      });
    });
  });
  return chits;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function distributeChits(playerCount: number): Chit[][] {
  const allChits = generateAllChits();
  const shuffledChits = shuffleArray(allChits);
  
  const playerChits: Chit[][] = [];
  for (let i = 0; i < playerCount; i++) {
    playerChits.push(shuffledChits.slice(i * 4, (i + 1) * 4));
  }
  
  return playerChits;
}

export function checkWinCondition(chits: Chit[]): boolean {
  if (chits.length !== 4) return false;
  
  const categories = chits.map(chit => chit.category);
  const uniqueCategories = new Set(categories);
  
  return uniqueCategories.size === 1;
}

export function getNextPlayerPosition(currentPosition: number, playerCount: number): number {
  return (currentPosition + 1) % playerCount;
}

export function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getCategoryColor(category: Category): string {
  const colors = {
    Fruits: 'bg-gradient-to-br from-red-200 to-pink-300 border-red-400 text-red-900 shadow-lg',
    Cars: 'bg-gradient-to-br from-blue-200 to-cyan-300 border-blue-400 text-blue-900 shadow-lg',
    Animals: 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-400 text-green-900 shadow-lg',
    Colors: 'bg-gradient-to-br from-purple-200 to-violet-300 border-purple-400 text-purple-900 shadow-lg'
  };
  return colors[category];
}
