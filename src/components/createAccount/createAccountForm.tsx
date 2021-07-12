import { makeStyles, Typography, Button } from '@material-ui/core';
import React from 'react';
import { palette } from '../../palette';
import AccountIcon from '../../assets/icons/accountIcon.svg'
import EmailIcon from '../../assets/icons/emailIcon.svg'
import LockIcon from '../../assets/icons/lockIcon.svg'

const useStyles = makeStyles(theme => ({
    accountForm: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        border: `solid 3px ${palette.primaryColour}`,
        borderRadius: theme.spacing(1),
        width: 400
    },
    formHeader: {
        textAlign: 'center',
        fontSize: theme.spacing(6),
        marginBottom: theme.spacing(3),
        color: palette.primaryColour,
        fontWeight: 600,
        fontFamily: 'Anton'
    },
    inputContainer: {
        borderBottom: 'solid thin',
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(1)
    },
    input: {
        outline: 'none',
        border: 'none',
        fontSize: 18,
        fontFamily: 'Roboto'
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    button: {
        backgroundColor: palette.primaryColour,
        width: 250,
        height: 56,
        borderRadius: 50,
        color: palette.secondaryColour,
        fontSize: 24,
        fontWeight: 600,
        margin: 'auto',
        marginTop: theme.spacing(2)
    }
}))

export default function CreateAccountForm() {
    let classes = useStyles();

    return (
        <div className={classes.accountForm}>
            <Typography className={classes.formHeader}>Create Account</Typography>
            <div className={classes.inputContainer}>
                <img className={classes.icon} src={AccountIcon} />
                <input
                    className={classes.input}
                    placeholder='Name' />
            </div>
            <div className={classes.inputContainer}>
                <img className={classes.icon} src={EmailIcon} />
                <input
                    className={classes.input}
                    placeholder='Email' />
            </div>
            <div className={classes.inputContainer}>
                <img className={classes.icon} src={LockIcon} />
                <input
                    className={classes.input}
                    placeholder='Password' />
            </div>
            <div className={classes.inputContainer}>
                <img className={classes.icon} src={LockIcon} />
                <input
                    className={classes.input}
                    placeholder='Repeat Password' />
            </div>
            <Button disabled={true} className={classes.button}>CREATE ACCOUNT</Button>
        </div>
    )
}