import axios from "axios";
import { Highlight } from "../models/highlight";

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

/**
 * Sends a PUT request to edit the given highlight.
 * @returns a http response.
 */
export async function editHighlight(highlight: Highlight) {
    let response;
    try {
        response = await axios.put(`http://localhost:8080/highlights/${highlight._id}`, { highlight });
    } catch (err) {
        console.log(err)
        throw new Error('Network Error');
    }
    return response;
}

/**
 * Sends a GET request to sync all the users kindle highlights with the server's database.
 * @returns a http response.
 */
export async function syncHighlights() {
    let response;
    try {
        response = await axios.get('http://localhost:8080/highlights/sync');
    } catch {
        throw new Error('Network Error');
    }
    return response;
}