// Theme word banks used across puzzles, word search, scrambles, hangman, etc.

export const THEMES = {
  animals: {
    label: 'Animals',
    words: 'cat, dog, bird, fish, lion, tiger, bear, panda, rabbit, horse, sheep, duck, frog, snake, zebra'.split(', '),
  },
  space: {
    label: 'Space',
    words: 'sun, moon, star, planet, rocket, comet, galaxy, orbit, astronaut, telescope, mars, venus'.split(', '),
  },
  food: {
    label: 'Food',
    words: 'apple, bread, cake, milk, egg, cheese, pasta, rice, salad, pizza, mango, orange'.split(', '),
  },
  colors: {
    label: 'Colors',
    words: 'red, blue, green, yellow, orange, purple, pink, brown, black, white, gray, gold'.split(', '),
  },
  ocean: {
    label: 'Ocean',
    words: 'fish, wave, shell, coral, shark, whale, dolphin, crab, starfish, jellyfish, octopus, squid'.split(', '),
  },
  weather: {
    label: 'Weather',
    words: 'sun, rain, snow, wind, cloud, storm, thunder, rainbow, fog, hail, sunny, stormy'.split(', '),
  },
  sports: {
    label: 'Sports',
    words: 'ball, goal, team, swim, run, jump, kick, score, tennis, soccer, basket, cricket'.split(', '),
  },
  school: {
    label: 'School',
    words: 'book, pen, desk, ruler, pencil, eraser, school, table, chair, teacher, crayon, paper'.split(', '),
  },
  mybody: {
    label: 'My Body',
    words: 'hand, foot, eyes, nose, ears, mouth, hair, head, teeth, arm, leg, knee'.split(', '),
  },
  farm: {
    label: 'Farm',
    words: 'cow, pig, hen, goat, horse, sheep, duck, barn, field, tractor, farm, chick'.split(', '),
  },
  vehicles: {
    label: 'Vehicles',
    words: 'car, bus, train, bike, boat, plane, truck, van, scooter, ship, taxi, tram'.split(', '),
  },
};

export function themeOptions() {
  return Object.entries(THEMES).map(([value, t]) => ({ value, label: t.label }));
}

export function getThemeWords(theme, rng, count) {
  const list = THEMES[theme] ? [...THEMES[theme].words] : [...THEMES.animals.words];
  // fisher-yates with rng
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, Math.min(count, list.length));
}

// Common words used for hangman / handwriting / tracing
export const COMMON_WORDS = [
  'cat', 'dog', 'sun', 'hat', 'car', 'bus', 'pen', 'cup', 'box', 'ball',
  'fish', 'bird', 'tree', 'star', 'moon', 'book', 'cake', 'mile', 'jump',
  'happy', 'apple', 'water', 'smile', 'friend', 'school', 'yellow', 'purple',
];

// Simple everyday objects for coloring pages
export const COLORING_OBJECTS = ['Apple', 'Ball', 'Star', 'House', 'Fish', 'Dog', 'Cat', 'Tree', 'Car', 'Flower', 'Sun', 'Butterfly', 'Ice cream', 'Rocket', 'Boat', 'Umbrella', 'Teddy', 'Cake', 'Rabbit', 'Bird'];