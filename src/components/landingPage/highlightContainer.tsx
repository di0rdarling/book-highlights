import React, { } from 'react';
import { Divider, IconButton, makeStyles, Typography } from '@material-ui/core';
import { palette } from '../../palette';
import { Highlight } from '../../models/highlight';
import { StarBorder, Close } from '@material-ui/icons';
import noteIcon from '../../assets/icons/noteIcon.svg';
import { editHighlight } from '../../integration/highlights';

const useStyles = makeStyles(theme => ({
    highlightContainerTop: {
        display: 'flex'
    },
    highlightButtons: {
        display: 'flex',
        marginRight: theme.spacing(2),
        alignItems: 'center'
    },
    noteButton: {
        backgroundColor: palette.primaryColour,
        paddingRight: theme.spacing(1),
        margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
    },
    highlightButton: {
        border: 'solid thin',
        borderColor: palette.primaryColour,
        height: theme.spacing(5),
        width: theme.spacing(5)
    },
    highlightButtonIcon: {
        color: palette.primaryColour,
        border: '5px black'
    },
    highlightText: {
        fontSize: theme.spacing(2),
        fontFamily: 'Roboto, sans-serif',
    },
    favouritedHighlightButtonIcon: {
        fill: '#ffba08'
    },
    bookText: {
        whiteSpace: 'nowrap'
    },
    divider: {
        margin: `${theme.spacing(2)}px ${theme.spacing(0)}px `
    }
}))

interface HighlightContainerProps {
    highlight: Highlight
}

export default function HighlightContainer(props: HighlightContainerProps) {
    let classes = useStyles();

    let text = `"${props.highlight.text}"`;

    const favoriteHighlight = async () => {
        props.highlight.favourited = true;
        let response = await editHighlight(props.highlight);
        console.log({ response })
    }

    return (
        <div >
            <div className={classes.highlightContainerTop}>
                <div className={classes.highlightButtons}>
                    <IconButton
                        onClick={() => favoriteHighlight()}
                        className={classes.highlightButton}>
                        <StarBorder className={props.highlight.favourited ? classes.favouritedHighlightButtonIcon : classes.highlightButtonIcon} />
                    </IconButton>
                    <IconButton className={classes.noteButton}>
                        <img src={noteIcon} alt='Note Icon' />
                    </IconButton>
                    <IconButton className={classes.highlightButton} >
                        <Close className={classes.highlightButtonIcon} />
                    </IconButton>
                </div>
                <Typography className={classes.highlightText}>{<i> {text} </i>} -  {<b>{props.highlight.bookTitle} </b>}</Typography>
            </div>
            <Divider className={classes.divider} />
        </div>
    )
}