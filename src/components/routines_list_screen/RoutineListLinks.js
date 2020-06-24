import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RoutineListCard from './RoutineListCard.js';

class RoutineListLinks extends Component {
    render() {
        const { routines } = this.props;

        return (
            <div className="routine-lists section">
                {routines && routines.map(routine => {
                    return (
                        <Link to={"/routine/" + routine.id} key={routine.id}>
                            <RoutineListCard routine={routine} routines={routines} />
                        </Link>
                    );})
                }
            </div>
        )
    }
}

export default RoutineListLinks;