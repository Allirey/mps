import React from "react";
import {Container, Link, ListItem, makeStyles, List, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        "& $a": {
            color: "blue",
            '&:hover':{
                textDecoration: "none",
                backgroundColor:"cyan",
            },
        }
    },
}))

const About = (props) => {
    const classes = useStyles();
    return (
        <Container maxWidth={"md"} className={classes.root}>
            <Typography gutterBottom variant={"h5"}>Hi. I'm Python/JavaScript developer.</Typography>
                <Typography gutterBottom>This website is my home-project, portfolio and
                set of useful services primarily for myself, chess players, and people who is interested in chess and
                programming.</Typography>
            <Typography gutterBottom>
                Technologies used in project:
                <List >
                    <ListItem dense>Backend: Django/DRF</ListItem>
                    <ListItem dense>Frontend: React/Material ui/Mobx</ListItem>
                    <ListItem dense>Tasks: Celery/RabbitMQ</ListItem>
                    <ListItem dense>Deploy: Docker/Docker-compose in AWS EC2 instance / nginx webserver</ListItem>
                    <ListItem dense>Database: AWS RDS PostgreSQL</ListItem>
                    <ListItem dense>Other: JWT token Auth</ListItem>
                </List>
            </Typography>
                <Typography gutterBottom>Feel free to contact
                me via <Link rel="noreferrer" target="_blank" href={"//t.me/inf13"}>telegram</Link> with your feedback,
                    ideas or questions.
            </Typography>
        </Container>
    )
}

export default About

