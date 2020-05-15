const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiCall = async () => {
  await delay(100);
  return ['apples', 'bananas', 'carrots'];
};
