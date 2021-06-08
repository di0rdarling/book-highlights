import { syncHighlights } from "../../integration/highlights";
import { Highlight } from "../../models/highlight";
import { HighlightStore } from "./highlightContext";

export type HighlightStoreAction =
    | { type: 'set highlights'; payload: Highlight[] }
    | { type: 'sync kindle highlights' }

export function highlightStoreReducer(
    state: HighlightStore | undefined,
    action: HighlightStoreAction
) {
    switch (action.type) {
        case 'set highlights':
            return action.payload;
        case 'sync kindle highlights':
            let syncedHighlights = syncKindleHighlights();
            if (syncedHighlights) {
                return syncedHighlights;
            }
            return state
    }
}

async function syncKindleHighlights(): Promise<Highlight[] | undefined> {
    try {
        let response = await syncHighlights();
        if (response.status = 200 && response.data) {
            return response.data;
        }
    } catch (err) {
        console.log({ err })
    }
}