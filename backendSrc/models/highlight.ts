import { HighlightCreate } from "./highlightCreate";

export interface Highlight extends HighlightCreate {
    _id: string
    highlightedDate: Date,
    viewed: boolean,
}