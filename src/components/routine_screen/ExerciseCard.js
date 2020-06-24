import React, { Component } from 'react';

class ExerciseCard extends Component {
    state = {
        editing: false,
        name: this.props.exercise.name,
        muscle_group: this.props.exercise.muscle_group,
        reps: this.props.exercise.reps,
        name_editing: this.props.exercise.name,
        muscle_group_editing: this.props.exercise.muscle_group,
        reps_editing: this.props.exercise.reps
    }

    componentDidUpdate = (prevProps) => {
        /*
        console.log("update came in @ExerciseCard");
        console.log(this.state.name);
        console.log(this.props.exercise.name);

            turns out that the props are updated but the state aren't, causing rendering issues
            this is solved with the code below
        */
        if(this.props.exercise !== prevProps.exercise) {
            this.setState({
                name: this.props.exercise.name,
                muscle_group: this.props.exercise.muscle_group,
                reps: this.props.exercise.reps
            });
        }
    }

    editExercise = () => {
        this.setState({ editing: true });
    }

    cancelEdit = () => {
        this.setState({ editing: false });
    }

    getLayout = () => {
        return {
            marginBottom: this.state.editing ? '10%' : '0%'
        };
    }

    submitEdit = () => {
        const { name_editing, muscle_group_editing, reps_editing } = this.state;
        this.setState({ editing: false, name: name_editing, muscle_group: muscle_group_editing, reps: reps_editing }, () => {
            this.props.exercise.name = this.state.name;
            this.props.exercise.muscle_group = this.state.muscle_group;
            this.props.exercise.reps = this.state.reps;
            this.props.editExercise(this.props.exercise, this.props.index);
        });
    }
    
    handleNameChange = (e) => {
        this.setState({ name_editing: e.target.value });
    }

    handleGroupChange = (e) => {
        this.setState({ muscle_group_editing: e.target.value });
    }

    handleRepsChange = (e) => {
        this.setState({ reps_editing: e.target.value });
    }

    handleMoveUp = () => {
        if(this.props.index > 0) {
            this.props.moveUp(this.props.index);
        } else {
            console.log("Cannot move up, as this is already the top item!");
        }
    }

    handleMoveDown = () => {
        this.props.moveDown(this.props.index);
    }

    handleDeleteExercise = () => {
        this.props.deleteExercise(this.props.index);
    }

    render() {
        if(!this.state.editing) {
            return (
                <div className="card z-depth-0 exercise_card" style={this.getLayout()} id="ex_card">
                    <div className="card-content grey-text text-darken-3">
                        <div className="exercise_name">{this.state.name}</div>
                        <div className="exercise_group">{this.state.muscle_group}</div>
                        <div className="exercise_reps">{this.state.reps}</div>
                        <div className="exercise_edits">
                            <span onClick={this.editExercise}>&#x270e;</span>
                            <span onClick={this.handleMoveUp}>▲</span>
                            <span onClick={this.handleMoveDown}>▼</span>
                            <span onClick={this.handleDeleteExercise}>&#128465;</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="card z-depth-0 exercise_card" style={this.getLayout()}>
                    <div className="card-content grey-text text-darken-3">
                        <div className="exercise_name">
                            <label className="active">Name:</label>
                            <input type="text" defaultValue={this.state.name} onChange={this.handleNameChange} />
                        </div>
                        <div className="exercise_group">
                            <label className="active">Muscle Group:</label>
                            <input type="text" defaultValue={this.state.muscle_group} onChange={this.handleGroupChange} />
                        </div>
                        <div className="exercise_reps">
                            <label className="active">Reps:</label>
                            <input type="number" min="1" defaultValue={this.state.reps} onChange={this.handleRepsChange} />
                        </div>
                        <br/>
                        <div className="exercise_card_btn_wrapper">
                            <button className="submit_edit_exercise" onClick={this.submitEdit}>Submit</button>
                            <button className="cancel_edit_exercise" onClick={this.cancelEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default ExerciseCard;