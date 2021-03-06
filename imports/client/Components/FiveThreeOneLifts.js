import React, { Component } from "react";
import SectionTitle from "./SectionTitle";
import FiveThreeOneTable from "./FiveThreeOneTable";
// Meteor Imports
import { withTracker } from "meteor/react-meteor-data";
import { WeightSettings } from "../../api/weightSettings";

/* 
This component acts as a wrapper for the entire program. Nested in this component 
is the title of the program week, and the table that lists all the exercises. 
*/

class FiveThreeOneLifts extends Component {
  renderSavedWeek() {
    const { weights, nonUserWeights } = this.props;
    if (Meteor.user() && weights.length > 0) {
      return weights[0].fivethreeone.workoutWeek;
    } else if (!Meteor.user() && localStorage.getItem("weightRefId")) {
      return nonUserWeights[0].fivethreeone.workoutWeek;
    }
  }

  render() {
    const title = this.renderSavedWeek();
    return (
      <div className="FiveThreeOneLifts">
        <SectionTitle title={title} />
        <FiveThreeOneTable />
      </div>
    );
  }
}

export default withTracker(() => {
  const localStorageId = localStorage.getItem("weightRefId");
  const allWeights = Meteor.subscribe("allWeights");
  return {
    nonUserWeights: WeightSettings.find({ _id: localStorageId }).fetch(),
    ready: allWeights.ready(),
    weights: WeightSettings.find({}).fetch()
  };
})(FiveThreeOneLifts);
