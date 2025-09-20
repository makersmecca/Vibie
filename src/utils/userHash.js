export const generateUserHash = (email) => {
  return btoa(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

export const decodeUserHash = (hash) => {
  try {
    // Convert back to standard Base64
    let base64 = hash.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding
    const padded = base64 + "==".substring(0, (4 - (base64.length % 4)) % 4);
    return atob(padded);
  } catch {
    return null;
  }
};
