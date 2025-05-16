// src/utils/jwtUtils.js

export function decodeJWT(token) {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1]; // Extract payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload); // Return parsed object
  } catch (error) {
    console.error('JWT Decode Error:', error);
    return null;
  }
}
