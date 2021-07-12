import { JSXElement } from '@babel/types';
import { makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';
import Header from './header';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
        height: '100%'
    }
}))

interface ShellProps{
    children: ReactElement
}

export default function Shell(props: ShellProps){
    let classes = useStyles();

    return(
        <div className={classes.root}>
            <Header />
            {props.children}
        </div>
    )
}