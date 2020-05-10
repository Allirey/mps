import React from 'react';
import {
    withStyles, TextField, Container, Button, Input, Fab
} from "@material-ui/core";
import withStore from "../hocs/withStore";
import TermsTable from "../components/quizy/TermsTable";
import {Add} from "@material-ui/icons";

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
    };

    handleAddButton = () => {
        if (!!this.state.terms.find(el => el.key === this.state.inputKey)) {
            alert(`Term "${this.state.inputKey}" already exist`);
            return;
        }

        let old_terms = this.state.terms;
        let new_term = {
            key: this.state.inputKey,
            value: this.state.inputValue,
            rate: 1,
            added: Date().split(' ').slice(1, 4).join(' '),
            lastQuiz: '',
            quizTimes: 0,
        };
        let newTerms = old_terms.concat(new_term);
        this.setState({terms: newTerms, inputKey: '', inputValue: ''});
        this.props.stores.storage.setItem('terms', JSON.stringify(newTerms))
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
        this.setState({terms: newTerms})
    };

    updateRow = (newObj) => {
        let newTerms = this.state.terms.map(obj=>{
            return obj.key !== newObj.key? obj: newObj
        });

        this.setState({terms: newTerms});
        this.props.stores.storage.setItem('terms', JSON.stringify(newTerms));
    };

    render() {
        const {classes} = this.props;

        if (this.state.isQuiz) {
            return (
                <>
                    <Button onClick={() => this.setState({isQuiz: false})}>End Quiz</Button>
                </>
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

                    <Button onClick={() => this.setState({isQuiz: true})}>Start Quiz</Button>

                    <TextField value={this.state.searchFilter}
                               onChange={(e) => this.setState({searchFilter: e.target.value})}
                               label={"Search"}
                               type={"search"}
                    />
                    <br/>

                    <TextField
                        label={'Term'}
                        value={this.state.inputKey}
                        onChange={(e) => this.setState({inputKey: e.target.value})}
                        onKeyDown={e => e.keyCode === 13 ? this.handleAddButton() : []}
                    />


                    <TextField
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
