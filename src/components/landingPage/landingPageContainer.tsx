import React, { useEffect, useState } from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { palette } from '../../palette';
import { Highlight } from '../../models/highlight';
import PaneLeft from './paneLeft';
import PaneRight from './paneRight';
import { useHighlightStore } from '../../context/highlight/highlightContext';
import Shell from '../shell';

const useStyles = makeStyles(theme => ({
    body: {
        height: '100%'
    },
    panes: {
        display: 'flex',
        height: '100%'
    },
    paneRight: {
        width: '50%',
        padding: theme.spacing(3)
    },
    paneLeft: {
        width: '50%',
        padding: `${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(0)}px`
    },
    paneLeftHeaderText: {
        fontSize: theme.spacing(3),
        fontFamily: 'Roboto, sans-serif',
    },
    paneLeftHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(6)
    },
    welcomeText: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: theme.spacing(4),
        fontWeight: 300
    },
    favouritedHighlightsContainer: {
        backgroundColor: palette.primaryColourLowOpacity,
        borderRadius: theme.spacing(2),
        textAlign: 'center',
        padding: theme.spacing(3),
        height: '100%'
    },
    favouritedHighlightsText: {
        fontSize: theme.spacing(3),
        fontWeight: 400
    },
    syncButton: {
        border: 'solid thin',
        borderColor: palette.primaryColour
    },
    doneButton: {
        backgroundColor: palette.primaryColour,
        padding: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
        marginLeft: theme.spacing(1)
    },
    doneIcon: {
        color: palette.secondaryColour
    },
    highlightsAction: {
        display: 'flex',
        justifyContent: 'center'
    }
}))

/**
 * Landing Page Container to wrap the child components of the landing page.
 */
export default function LandingPageContainer() {
    let classes = useStyles();
    let [allHighlights, setAllHighlights] = useState<Highlight[]>([])
    let [randomHighlights, setRandomHighlights] = useState<Highlight[]>([]);
    let [highlights, dispatch] = useHighlightStore();

    useEffect(() => {

        if (allHighlights.length) {
            let ranHighlights = allHighlights.splice(0, 5)
            setRandomHighlights(ranHighlights);
        }
    }, [allHighlights])

    async function syncKindleHighlights() {
        dispatch({
            type: 'sync kindle highlights'
        })
    }

    return (
        <Shell>
            <div className={classes.body}>
                <Typography className={classes.welcomeText}>Welcome, Abi!</Typography>
                <div className={classes.panes}>
                    <PaneLeft highlights={randomHighlights} syncHighlights={syncKindleHighlights} />
                    <Divider orientation='vertical' />
                    <PaneRight highlights={allHighlights.filter(highlight => highlight.favourited)} />
                </div>
            </div>
        </Shell>
    )
}