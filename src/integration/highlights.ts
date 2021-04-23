import axios from "axios";

/**
 * Sends a GET request to get all highlights.
 * @returns a http response.
 */
export async function getHighlights() {
    let response;
    try {
        response = await axios.get('http://localhost:8080/highlights');
    } catch {
        throw new Error('Network Error');
    }
    return response;
}