const BASE_URL = 'http://localhost:3000'; // Adjust the base URL as needed

export const fetchSnippet = async (language: string) => {
  const response = await fetch(`${BASE_URL}/typing-test/snippet?language=${language}`);
  const data = await response.json();
  return data.snippet;
};

export const fetchLanguages = async () => {
  try {
    const response = await fetch(`${BASE_URL}/language`);
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }
    const data = await response.json();
    console.log('Response data:', data); // Debugging log
    return data;
  } catch (error) {
    console.error('Error in fetchLanguages:', error); // Debugging log
    throw error;
  }
};