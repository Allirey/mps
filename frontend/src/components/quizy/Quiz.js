import React, {useState} from "react";
import {Button, Container, Grid, Paper} from "@material-ui/core";


export default function (props) {
    const [current, setCurrent] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showQuizResult, setShowQuizResult] = useState(false);
    const [validatedResults, setValidatedResults] = useState(null);

    const handleUserClick = (userAnswer) => {
        let answers = userAnswers;
        answers.push(userAnswer);
        setUserAnswers(answers);
        if (current + 1 === props.quizData.length) {
            setShowQuizResult(true);
            validateUserAnswers();
        } else {
            setCurrent(Math.min(current + 1, props.quizData.length - 1));
        }

    };

    const validateUserAnswers = () => {
        let correctAnswers = 0;

        userAnswers.forEach(u_answer=> {

            if (u_answer.value === props.quizData.find(obj => obj.key === u_answer.key).correct) {

                correctAnswers++}
        });




        setValidatedResults({
            successRate: Math.floor(correctAnswers * 100 / props.quizData.length),
            correctAnswers: correctAnswers
        })
    };

    const quizList = props.quizData;
    return (
        <Container maxWidth={"md"}>
            <Grid container direction={"column"} spacing={1}>
                <Grid item>
                    <Button color={"secondary"} variant={"contained"} onClick={props.stopQuiz}>End Quiz</Button></Grid>
                {!showQuizResult && <Grid item>
                    <p>{quizList[current].key}:</p>
                </Grid>}

                {showQuizResult ? (
                        <Grid item component={Paper}>
                            <h1>Results</h1>
                            <p>success rate - {validatedResults.successRate}%</p>
                            <p>correct answers - {validatedResults.correctAnswers}</p>

                            <Button color={"primary"} variant={"contained"} onClick={props.stopQuiz}>OK</Button>
                        </Grid>
                    ) :
                    (
                        quizList[current].variants.map(obj => (
                            <Grid item>
                                <Button fullWidth
                                        variant={"contained"}
                                        onClick={() => handleUserClick({
                                            key: quizList[current].key,
                                            value: obj
                                        })}>{obj}</Button>
                            </Grid>
                        ))
                    )}
            </Grid>
        </Container>
    )
}