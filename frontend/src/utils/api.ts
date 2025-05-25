const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Use env variable in production

export const fetchSnippet = async (language: string) => {
  try {
    const response = await fetch(`${BASE_URL}/code-snippets/random?language=${language}`);
    if (!response.ok) {
      throw new Error('Failed to fetch snippet');
    }
    const data = await response.json();
    console.log('Fetched snippet data:', data); // Debugging log
    return data.snippet;
  } catch (error) {
    console.error('Error in fetchSnippet:', error); // Debugging log
    throw error;
  }
};

export const fetchLanguages = async () => {
  const response = await fetch(`${BASE_URL}/language`);
  if (!response.ok) {
    throw new Error('Failed to fetch languages');
  }
  const data = await response.json();
  return data;
};