import React from 'react';
import LandingPageContainer from '../components/landingPage/landingPageContainer';
import { HighlightStoreProvider } from '../context/highlight/highlightContext';

export default function LandingPage() {
    return (
        <HighlightStoreProvider>
            <LandingPageContainer />
        </HighlightStoreProvider>
    )
}