import React, { Component } from 'react';

import UoaCard from './UoaCard.js';

class UoaLinks extends Component {
    editExercise = (exercise, index) => {
        this.props.routine.exercises[index] = exercise;
        this.props.updateRoutine(this.props.routine.exercises);
    }

    moveUp = index => {
        const temp = this.props.routine.exercises[index - 1];
        this.props.routine.exercises[index - 1] = this.props.routine.exercises[index];
        this.props.routine.exercises[index] = temp;
        this.props.updateRoutine(this.props.routine.exercises);
    }

    moveDown = index => {
        if(index < this.props.routine.exercises.length - 1) {
            const temp = this.props.routine.exercises[index + 1];
            this.props.routine.exercises[index + 1] = this.props.routine.exercises[index];
            this.props.routine.exercises[index] = temp;
            this.props.updateRoutine(this.props.routine.exercises);
        } else {
            console.log("Cannot move down, as this is already the bottom item!")
        }
    }

    deleteExercise = index => {
        this.props.routine.exercises.splice(index, 1);
        this.props.updateRoutine(this.props.routine.exercises);
    }

    render() {
        const { routine } = this.props;
        return (
            <div>
                {routine && routine.exercises.map((exercise, index) => {
                    return (
                        <UoaCard 
                            exercise={exercise} 
                            key={index} 
                            index={index} 
                            editExercise={this.editExercise} 
                            moveUp={this.moveUp} 
                            moveDown={this.moveDown}
                            deleteExercise={this.deleteExercise}
                        />
                    );})
                }
            </div>
        );
    }
}

export default UoaLinks;