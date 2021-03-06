import React, { Component, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import { AuthState } from '../../types/actionTypes';
import { AppState } from '../../reducers/rootReducer';
import { NavbarComponentState } from '../../types/stateTypes';

interface StateProps {
  auth: AuthState;
}

interface DispatchProps {
  clearCurrentProfile: () => void;
  logoutUser: () => void;
}

type Props = StateProps & DispatchProps;

export class Navbar extends Component<Props> {
  onLogoutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link navbar__generic-link" to="/feed">
            Posts Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link navbar__generic-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a
            href=""
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
            id='navbar__logout-li'
          >
            <img
              className="rounded-circle navbar__user-icon"
              src={user.avatar}
              alt={user.name}
              title="You must have a gravatar associated ith your email in order for a custom image to be displayed."
            />
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link navbar__generic-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link navbar__generic-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4" id='navbar__main-nav'>
        <div className="container">
          <Link className="navbar-brand" to="/">
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link navbar__generic-link" to="/profiles">
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state: NavbarComponentState): StateProps => ({
  auth: state.auth
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
