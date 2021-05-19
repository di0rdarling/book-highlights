import React, { useEffect, useState } from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { palette } from '../../palette';
import { getHighlights, syncHighlights } from '../../integration/highlights';
import { Highlight } from '../../models/highlight';
import Header from './header';
import PaneLeft from './paneLeft';
import PaneRight from './paneRight';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
        height: '100%'
    },
    body: {
        height: '100%'
    },
    panes: {
        marginTop: theme.spacing(4),
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
    let [highlights, setHighlights] = useState<Highlight[]>([])

    useEffect(() => {

        async function getUserHighlights() {
            try {
                let response = await getHighlights();
                if (response.status === 200) {
                    let topHighlights = response.data.slice(0, 5)
                    setHighlights(topHighlights);
                }
            } catch (err) {
                console.log({ err });
            }
        }

        getUserHighlights();
    }, [])

    async function syncUserHighlights() {
        try {
            let response = await syncHighlights();
            if (response.status = 200) {
                let topHighlights = response.data.slice(0, 5)
                setHighlights(topHighlights);
            }
        } catch (err) {
            console.log({ err })
        }
    }

    return (
        <div className={classes.root}>
            <Header />
            <div className={classes.body}>
                <Typography className={classes.welcomeText}>Welcome, Abi!</Typography>
                <div className={classes.panes}>
                    <PaneLeft highlights={highlights} syncHighlights={syncUserHighlights} />
                    <Divider orientation='vertical' />
                    <PaneRight highlights={highlights} />
                </div>
            </div>
        </div>
    )
}