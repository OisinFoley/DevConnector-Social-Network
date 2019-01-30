import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="landing--dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="offset-xl-2 col-xl-8 col-md-12 offset-lg-1 col-lg-10 text-center">
                <h1 className="mb-4" id="landing-title">Developer Connector</h1>
                <p id="landing-subtitle">
                  Learn about fellow developers, discuss today's programming issues
                </p>
                <hr />
                <Link to="/register" className="btn btn-lg btn-info mr-2 landing__btn" id="btnSignupLink">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light landing__btn" id="btnLoginLink">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
