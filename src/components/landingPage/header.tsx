import React from 'react';
import { makeStyles, TextField, Typography, IconButton, InputAdornment } from '@material-ui/core';
import brainSpaceIcon from '../../icons/brainSpaceIcon.svg';
import { AccountCircle, Search } from '@material-ui/icons';
import { palette } from '../../palette';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(4)
    },
    logo: {
        display: 'flex'
    },
    logoText: {
        fontFamily: 'Anton, sans-serif',
        fontSize: 24,
        color: palette.primaryColour,
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    searchField: {
        [`& fieldset`]: {
            borderRadius: theme.spacing(2),
        },
        marginTop: 4,
        width: 250
    },
    accountIcon: {
        fontSize: theme.spacing(5),
        color: palette.primaryColour
    },
    iconButton: {
        padding: 0,
        marginLeft: theme.spacing(1)
    }
}))

export default function Header() {
    let classes = useStyles();

    return (
        <div className={classes.header}>
            <div className={classes.logo}>
                <img src={brainSpaceIcon} alt='BrainSpace icon' />
                <Typography className={classes.logoText}>BrainSpace</Typography>
            </div>
            <div>
                <TextField
                    className={classes.searchField}
                    variant='outlined'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    inputProps={{
                        style: {
                            padding: 8,
                        }
                    }} />
                <IconButton className={classes.iconButton}>
                    <AccountCircle className={classes.accountIcon} />
                </IconButton>
            </div>
        </div>
    )
}