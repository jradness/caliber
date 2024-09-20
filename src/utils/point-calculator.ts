// Map the answer index (0-4) to the corresponding score (1-5)
const answerIndexToScoreMap: { [key: number]: number } = {
  0: 1, // .22LR
  1: 2, // 9mm
  2: 3, // .45ACP
  3: 4, // .357 Magnum
  4: 5  // .308
};

// Caliber mapping based on the final average score
const categoryCaliberMap: { [key: number]: string } = {
  1: ".22LR",
  2: "9mm",
  3: ".45ACP",
  4: ".357 Magnum",
  5: ".308"
};

type CaliberResult = {
  averageCaliber: string;
  individualCalibers: string[];
};

/**
 * Converts form answers to scores and calculates the final caliber.
 * @param {Record<number, number>} answers - Form answers as an object with question index and selected answer index.
 * @returns {CaliberResult} - The average caliber and individual calibers for each question.
 */
export const calculateCaliberFromAnswers = (answers: Record<number, number>): CaliberResult => {
  const scores = Object.values(answers).map(answerIndex => answerIndexToScoreMap[answerIndex]);

  // Calculate the total score and the average score
  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const averageScore = totalScore / scores.length;

  // Calculate the individual calibers for each answer
  const individualCalibers = scores.map(score => categoryCaliberMap[score]);

  // Round the average score to the nearest integer and map to a caliber
  const roundedAverageScore = Math.round(averageScore);
  const averageCaliber = categoryCaliberMap[roundedAverageScore];

  return {
    averageCaliber,
    individualCalibers
  };
};
