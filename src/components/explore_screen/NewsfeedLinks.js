import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NewsfeedCard from './NewsfeedCard.js';

class NewsfeedLinks extends Component {
    render() {
        if(!this.props.haveNews) {
            return (
                <div className="card z-depth-0 routine_list_card">
                    <div className="card-content grey-text text-darken-3">
                        Oops, there is no new content for you today. Please come back later.
                    </div>
                </div>
            );
        } else {
            const { newsfeed } = this.props;
            return (
                <div className="routine-lists section">
                    {newsfeed && newsfeed.map(activity => {
                        return (
                            <Link to={"/newsfeed/" + activity.username + "/" + activity.routine.id} key={activity.username + activity.routine.id}>
                                <NewsfeedCard activity={activity} />
                            </Link>
                        );})
                    }
                </div>
            );
        }
    }
}

export default NewsfeedLinks;