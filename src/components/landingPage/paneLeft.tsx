import React, { } from 'react';
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import { palette } from '../../palette';
import { Highlight } from '../../models/highlight';
import HighlightContainer from './highlightContainer';
import syncIcon from '../../icons/syncIcon.svg';
import doneIcon from '../../icons/doneIcon.svg';

const useStyles = makeStyles(theme => ({
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
    },
    noHighlightsDisplay: {
        textAlign: 'center',
    },
    noHighlightsFoundText: {
        fontSize: theme.spacing(3)
    }
}))

interface PaneLeftProps {
    highlights: Highlight[];
    syncHighlights: () => Promise<void>;
}

export default function PaneLeft(props: PaneLeftProps) {
    let classes = useStyles();

    return (
        <div className={classes.paneLeft}>
            <div className={classes.paneLeftHeader}>
                <Typography className={classes.paneLeftHeaderText}>Today's Highlights</Typography>
                <Typography className={classes.paneLeftHeaderText}>{new Date().toDateString()}</Typography>
            </div>
            <div>
                {props.highlights.length > 0 ? (
                    <>
                        {props.highlights.length > 0 && props.highlights.map((highlight, i) => (
                            <HighlightContainer highlight={highlight} />
                        ))}
                        <div className={classes.highlightsAction}>
                            <IconButton className={classes.syncButton}>
                                <img src={syncIcon} alt='Sync Icon' />
                            </IconButton>
                            <IconButton className={classes.doneButton}>
                                <img src={doneIcon} alt='Done Icon' />
                            </IconButton>
                        </div>
                    </>
                ) : (
                    <div className={classes.noHighlightsDisplay}>
                        <Typography className={classes.noHighlightsFoundText}>No highlights found</Typography>
                        <Typography >Sync with Kindle?</Typography>
                        <Button onClick={() => props.syncHighlights()}>Yes</Button>
                        <Button>No</Button>
                    </div>
                )}
            </div>
        </div>
    )
}