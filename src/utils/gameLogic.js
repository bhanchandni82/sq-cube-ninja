export function generateQuestion(settings, currentSequenceIndex) {
  const { operation, minNum, maxNum, mode } = settings;

  let number;
  if (mode === 'basic') {
    // Sequential
    const range = maxNum - minNum + 1;
    // Handle wrapping around just in case
    number = minNum + (currentSequenceIndex % range);
  } else {
    // Random between min and max
    number = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }

  // Determine square or cube
  let type = 'Square';
  if (operation === 'cubes') {
    type = 'Cube';
  } else if (operation === 'both') {
    type = Math.random() < 0.5 ? 'Square' : 'Cube';
  } // else 'squares' handles it

  const correctAnswer = type === 'Square' ? number * number : number * number * number;

  return { number, type, correctAnswer };
}

export function generateOptions(correctAnswer, type, number, mode) {
  const options = new Set();
  options.add(correctAnswer);

  while (options.size < 4) {
    let distractor;

    if (mode === 'pro') {
      // PRO MODE: Very tricky distractors
      const strategy = Math.floor(Math.random() * 4);
      if (strategy === 0) {
        // Off by one in the base
        const offset = Math.random() < 0.5 ? -1 : 1;
        const errBase = Math.max(1, number + offset);
        distractor = type === 'Square' ? errBase * errBase : errBase * errBase * errBase;
      } else if (strategy === 1) {
        // Wrong operation
        distractor = type === 'Square' ? number * number * number : number * number;
      } else if (strategy === 2) {
        // Off by +/- 1 in the final answer (very cruel!)
        const offset = Math.random() < 0.5 ? -1 : 1;
        distractor = Math.max(1, correctAnswer + offset);
      } else {
        // Off by +/- 10 in the final answer
        const offset = Math.random() < 0.5 ? -10 : 10;
        distractor = Math.max(1, correctAnswer + offset);
      }
    } else if (mode === 'advanced') {
      // ADVANCED MODE: Moderate distractors
      const strategy = Math.floor(Math.random() * 3);
      if (strategy === 0) {
        const offset = Math.random() < 0.5 ? -1 : 1;
        const errBase = Math.max(1, number + offset);
        distractor = type === 'Square' ? errBase * errBase : errBase * errBase * errBase;
      } else if (strategy === 1) {
        distractor = type === 'Square' ? number * number * number : number * number;
      } else {
        const spread = type === 'Square' ? 10 : 50;
        const offset = Math.floor(Math.random() * spread * 2) - spread;
        distractor = Math.max(1, correctAnswer + offset);
      }
    } else {
      // BASIC MODE: Easy distractors (far away)
      const spread = type === 'Square' ? 30 : 200;
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -spread : spread);
      distractor = Math.max(1, correctAnswer + offset);
    }

    // Ensure we don't accidentally add the correct answer or 0
    if (distractor !== correctAnswer && distractor > 0) {
      options.add(distractor);
    }
  }

  // Convert Set to Array and shuffle
  return Array.from(options).sort(() => Math.random() - 0.5);
}
