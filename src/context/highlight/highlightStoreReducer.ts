import { syncHighlights } from "../../integration/highlights";
import { Highlight } from "../../models/highlight";
import { HighlightStore } from "./highlightContext";

export type HighlightStoreAction =
    | { type: 'set highlights'; payload: Highlight[] }
    | { type: 'sync kindle highlights' }
    

export function highlightStoreReducer(
    state: HighlightStore,
    action: HighlightStoreAction
) {
    switch (action.type) {
        case 'set highlights':
            return action.payload;
    }
}

async function syncKindleHighlights(): Promise<Highlight[]> {
    let highlights: Highlight[] = []
    try {
        let response = await syncHighlights();
        if (response.status = 200 && response.data) {
            highlights = response.data;
        }
    } catch (err) {
        console.log({ err })
    }

    return highlights;
}