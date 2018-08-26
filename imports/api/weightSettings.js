import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const WeightSettings = new Mongo.Collection("weightSettings");

const PowerbbSchema = new SimpleSchema({
  workoutWeek: {
    type: String,
    defaultValue: "Week 1 Phase 1"
  }
});

const WeightSettingsSchema = new SimpleSchema({
  user: {
    type: String,
    required: false
  },
  overheadMax: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  squatMax: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  benchMax: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  deadliftMax: {
    type: SimpleSchema.Integer,
    defaultValue: 0
  },
  lastUpdated: {
    type: Date,
    defaultValue: new Date()
  },
  powerbb: {
    type: PowerbbSchema,
    required: false
  }
});

WeightSettings.attachSchema(WeightSettingsSchema);

if (Meteor.isServer) {
  Meteor.publish("allWeights", function() {
    return WeightSettings.find({ user: Meteor.userId() });
  });

  Meteor.methods({
    insertRepMaxes(overheadMax, benchMax, squatMax, deadliftMax, userid) {
      let id;
      if (Meteor.user()) {
        id = WeightSettings.insert({
          user: userid,
          overheadMax,
          benchMax,
          squatMax,
          deadliftMax,
          lastUpdated: new Date()
        });
      } else if (!Meteor.user()) {
        id = WeightSettings.insert({
          overheadMax,
          benchMax,
          squatMax,
          deadliftMax,
          lastUpdated: new Date()
        });
      }
      return id;
    },

    updateRepMaxForUser(overheadMax, benchMax, squatMax, deadliftMax, userid) {
      WeightSettings.update(
        { user: userid },
        {
          $set: {
            overheadMax,
            benchMax,
            squatMax,
            deadliftMax,
            lastUpdated: new Date()
          }
        }
      );
    },

    updateRepMaxLocalStorage(
      overheadMax,
      benchMax,
      squatMax,
      deadliftMax,
      weightSettingsId
    ) {
      WeightSettings.update(
        { _id: weightSettingsId },
        {
          $set: {
            overheadMax,
            benchMax,
            squatMax,
            deadliftMax,
            lastUpdated: new Date()
          }
        }
      );
    },

    insertWeekOfProgram(week, userId) {
      let id;
      if (Meteor.user()) {
        id = WeightSettings.insert({
          user: userId,
          powerbb: { workoutWeek: week },
          lastUpdated: new Date()
        });
      } else if (!Meteor.user()) {
        id = WeightSettings.insert({
          powerbb: { workoutWeek: week },
          lastUpdated: new Date()
        });
      }
      return id;
    },

    updateWeekOfUser(week, userId) {
      WeightSettings.update(
        { user: userId },
        {
          $set: {
            powerbb: { workoutWeek: week },
            lastUpdated: new Date()
          }
        }
      );
    },

    updateWeekOfStorage(week, weightSettingsId) {
      WeightSettings.update(
        { _id: weightSettingsId },
        {
          $set: {
            powerbb: { workoutWeek: week },
            lastUpdated: new Date()
          }
        }
      );
    }

  });
}
