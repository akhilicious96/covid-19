import React from 'react'
import { Card, CardContent, Typography} from '@material-ui/core';
import './InfoBox.css'

function InfoBox(props) {
    return (
        <Card 
            onClick={props.onClick}
            className={`infoBox ${props.active && 'infoBox--selected'} ${props.isRed && 'infoBox--red'}`}>
            <CardContent>
                { /* Title */ }
                <Typography className="infoBox__title" color="textSecondary">
                    {props.title}
                </Typography>

                { /* Number of cases */ }
                <h2 className={`infoBox__cases ${!props.isRed && 'infoBox__cases--green'}`}>{props.cases}</h2>
                
                { /* Total */ }
                <Typography className="infoBox__total" color="textSecondary">
                    {props.total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
