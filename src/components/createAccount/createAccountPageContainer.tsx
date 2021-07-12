import React from 'react';
import Shell from '../shell';
import GirlReadingImage from '../../assets/girl-reading-image.png'
import { makeStyles } from '@material-ui/core';
import CreateAccountForm from './createAccountForm';

const useStyles = makeStyles(theme => ({
    girlReadingImg: {
        height: 600
    },
    root: {
        display: 'flex',
        height: '80%',
        alignItems: 'center'
    },
    leftContainer: {
        width: '50%',
        display: 'flex',
        justifyContent: 'center'
    },
    rightContainer: {
        width: '50%',
        display: 'flex',
        justifyContent: 'center'
    }
}))

export default function CreateAccountPageContainer() {
    let classes = useStyles();

    return (
        <Shell>
            <div className={classes.root}>
                <div className={classes.leftContainer}>
                    <CreateAccountForm />
                </div>
                <div className={classes.rightContainer}>
                    <img className={classes.girlReadingImg} src={GirlReadingImage} />
                </div>
            </div>
        </Shell>
    )
}