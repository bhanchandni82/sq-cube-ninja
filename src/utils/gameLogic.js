export function generateQuestion() {
  // Random number between 1 and 20
  const number = Math.floor(Math.random() * 20) + 1;
  // Randomly choose Square or Cube
  const type = Math.random() < 0.5 ? 'Square' : 'Cube';
  
  const correctAnswer = type === 'Square' ? number * number : number * number * number;
  
  return { number, type, correctAnswer };
}

export function generateOptions(correctAnswer, type, number) {
  const options = new Set();
  options.add(correctAnswer);

  while (options.size < 4) {
    // Generate plausible distractors
    let distractor;
    
    const strategy = Math.floor(Math.random() * 3);
    if (strategy === 0) {
      // Off by one error in the base
      const offset = Math.random() < 0.5 ? -1 : 1;
      const wrongBase = Math.max(1, number + offset);
      distractor = type === 'Square' ? wrongBase * wrongBase : wrongBase * wrongBase * wrongBase;
    } else if (strategy === 1) {
      // Wrong type (square instead of cube or vice versa)
      distractor = type === 'Square' ? number * number * number : number * number;
    } else {
      // Random close number
      const spread = type === 'Square' ? 20 : 100;
      const offset = Math.floor(Math.random() * spread * 2) - spread;
      distractor = Math.max(1, correctAnswer + offset);
    }

    if (distractor !== correctAnswer) {
      options.add(distractor);
    }
  }

  // Convert Set to Array and shuffle
  return Array.from(options).sort(() => Math.random() - 0.5);
}
