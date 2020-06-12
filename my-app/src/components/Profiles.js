import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchProfiles } from "../actions/profileActions";
import PropTypes from "prop-types";

class Profiles extends Component {
  componentWillMount() {
    this.props.fetchProfiles();
  }

  render() {
    const profileItems = this.props.profiles.map(profile => (
      <div key={profile._id} style={profileStyle}>
        <h3>Name : {profile.user.name}</h3>
        <p>Status : {profile.status}</p>
        <hr />
      </div>
    ));
    return (
      <div>
        <h1>Profiles</h1>
        {profileItems}
      </div>
    );
  }
}

const profileStyle = {
  background: "gray",
  border: "2px",
  shadow: "2px",
  padding: "5px 8px",
};

Profiles.propTypes = {
  fetchProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.array.isRequired,
};

// Mapping the elements from state to props
const mapStateToProps = state => ({
  profiles: state.profiles.items, //profiles coming from root reducer (index.js)
});

export default connect(mapStateToProps, { fetchProfiles })(Profiles);
