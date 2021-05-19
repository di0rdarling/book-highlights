import { HighlightCreate } from "./highlightCreate";

export interface Highlight extends HighlightCreate {
    _id: string | null
    highlightedDate: Date,
    viewed: boolean,
}