import React, { } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { palette } from '../../palette';
import { Highlight } from '../../models/highlight';
import HighlightContainer from './highlightContainer';

const useStyles = makeStyles(theme => ({
    paneRight: {
        width: '50%',
        padding: theme.spacing(3)
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
}))

interface PaneRightProps {
    highlights: Highlight[];
}

/**
 * A wrapper component for displaying favourited highlights.
 * @param props 
 */
export default function PaneRight(props: PaneRightProps) {
    let classes = useStyles();

    return (
        <div className={classes.paneRight}>
            <div className={classes.favouritedHighlightsContainer}>
                <Typography className={classes.favouritedHighlightsText}>Favourited Highlights</Typography>
                {props.highlights.length ? (
                    <div>
                        {props.highlights.map(highlight => (
                            <HighlightContainer highlight={highlight} />
                        ))}
                    </div>

                ) : (
                        <Typography>No favourited highlights</Typography>
                    )}
            </div>
        </div>
    )
}