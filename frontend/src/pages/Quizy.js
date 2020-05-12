import React from 'react';
import {
    withStyles, TextField, Container, Button, Input, Fab
} from "@material-ui/core";
import withStore from "../hocs/withStore";
import TermsTable from "../components/quizy/TermsTable";
import {Add} from "@material-ui/icons";
import Quiz from "../components/quizy/Quiz"

const styles = theme => ({
    table: {
        '& tbody > tr:nth-child(even)': {backgroundColor: '#f2f2f2'},
        "& thead > tr > th": {
            backgroundColor: "#2A293E",
            color: theme.palette.common.white,
        },
    }
});

class Quizy extends React.Component {
    componentDidMount() {
        this.setState({terms: JSON.parse(this.props.stores.storage.getItem('terms')) || []})
    }

    state = {
        inputKey: '',
        inputValue: '',
        terms: [],
        isQuiz: false,
        searchFilter: '',
        errorText: '',
    };

    handleAddButton = () => {
        if (!!this.state.terms.find(el => el.key === this.state.inputKey)) {
            this.setState({errorText: `Term "${this.state.inputKey}" already exist`});
            return;
        } else if (!this.state.inputKey) {
            this.setState({errorText: 'field is required'});
            return
        } else {
            this.setState({errorText: ''})
        }

        let terms = [...this.state.terms];
        let new_term = {
            key: this.state.inputKey,
            value: this.state.inputValue,
            rate: 1,
        };
        terms.unshift(new_term);
        this.setState({terms: terms, inputKey: '', inputValue: ''});
        this.props.stores.storage.setItem('terms', JSON.stringify(terms))
    };

    showFile = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = (e.target.result);
            this.props.stores.storage.setItem('terms', text);
            this.setState({terms: JSON.parse(text)})
        };
        reader.readAsText(e.target.files[0])
    };

    saveToFile = () => {
        let element = document.createElement("a");
        let file = new Blob([JSON.stringify(this.state.terms, null, 2)], {type: "text/plain;charset=utf-8"});
        element.href = URL.createObjectURL(file);
        element.download = "terms.json";
        document.body.appendChild(element);
        element.click()
    };

    handleDelete = (obj) => {
        let newTerms = this.state.terms.filter(o => o !== obj);
        this.props.stores.storage.setItem('terms', JSON.stringify(newTerms));
        this.setState({terms: newTerms, errorText: ''})
    };

    updateRow = (newObj) => {
        let newTerms = this.state.terms.map(obj => {
            return obj.key !== newObj.key ? obj : newObj
        });

        this.setState({terms: newTerms, errorText: ''});
        this.props.stores.storage.setItem('terms', JSON.stringify(newTerms));
    };

    getQuizData = () => {
        let res = [];
        for (let i = 0; i < 15; i++) {
            let item = this.state.terms[Math.floor(Math.random() * this.state.terms.length)];

            let variants = [];

            while (variants.length < 3) {
                let obj = this.state.terms[Math.floor(Math.random() * this.state.terms.length)];
                if (obj.key !== item.key && obj.value !== item.value) {
                    variants.push(obj.value)
                }
            }

            variants.push(item.value);
            variants.sort(() => Math.random() - 0.5);

            res.push({
                key: item.key,
                correct: item.value,
                variants: variants,
            })

        }
        return res
    };

    changeRate = (answers) => {
        // [
        // {
        //  key: 'key1',
        //  correct: true/false
        // },
        // {
        //  key: 'key2',
        //  correct: true/false
        // },
        //[


        
        // let newTerms = this.state.terms.map(obj => (
        //     !!answers.find(o=> o.key === obj.key)? : obj
        // ))
    };

    render() {
        const {classes} = this.props;

        if (this.state.isQuiz) {
            return (
                <Quiz
                    stopQuiz={() => this.setState({isQuiz: false})}
                    quizData={this.getQuizData()}
                />
            )
        } else {
            return (
                <Container>
                    <Input
                        type={"file"}
                        style={{display: "none"}}
                        onChange={e => this.showFile(e)}
                        id="raised-button-file"
                    >upload</Input>
                    <label htmlFor={"raised-button-file"}>
                        <Button component={"span"} style={{backgroundColor: "#b2b9ed"}}>upload terms</Button>
                    </label>

                    <Button onClick={this.saveToFile} style={{backgroundColor: "lightgreen"}}>Download terms</Button>

                    <br/>

                    <Button onClick={() => this.setState({isQuiz: true, errorText: ''})}>Start Quiz</Button>

                    <TextField
                        variant={"outlined"}
                        value={this.state.searchFilter}
                        onChange={(e) => this.setState({searchFilter: e.target.value})}
                        label={"Search"}
                        type={"search"}
                    />
                    <br/>

                    <TextField
                        error={!!this.state.errorText}
                        helperText={this.state.errorText}
                        variant={"outlined"}
                        label={'Term'}
                        value={this.state.inputKey}
                        onChange={(e) => this.setState({inputKey: e.target.value})}
                        onKeyDown={e => e.keyCode === 13 ? this.handleAddButton() : []}
                    />


                    <TextField
                        variant={"outlined"}
                        label={'Definition'}
                        value={this.state.inputValue}
                        onChange={(e) => this.setState({inputValue: e.target.value})}
                        onKeyDown={e => e.keyCode === 13 ? this.handleAddButton() : []}
                    />


                    <Fab size={"small"} onClick={this.handleAddButton}><Add/></Fab>

                    <TermsTable
                        onDelete={this.handleDelete}
                        onEdit={this.updateRow}
                        data={this.state.terms}
                        searchFilter={this.state.searchFilter}
                    />
                </Container>
            )
        }
    }
}

export default withStyles(styles)(withStore(Quizy))
