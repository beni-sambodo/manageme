const getToken = async (): Promise<string> => {
  const interval = 100; // Interval in milliseconds to check for the token
  const maxAttempts = 50; // Maximum number of attempts to prevent infinite loop
  let attempts = 0;

  const checkToken = async (): Promise<string> => {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    }

    attempts += 1;
    if (attempts >= maxAttempts) {
      throw new Error("Token retrieval timed out");
    }

    await new Promise(resolve => setTimeout(resolve, interval));
    return checkToken();
  };

  return checkToken();
};

export default getToken;
