import React, { Component } from 'react';
import { GithubRepo } from 'devconnector-types/interfaces';

interface OwnProps {
  username: string;
}

type Props = OwnProps;

interface State {
  clientId: string;
  clientSecret: string;
  count: number;
  sort: string;
  repos: GithubRepo[];
}

class ProfileGithub extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // TODO: move to external file
    this.state = {
      clientId: '07edafc775ba82f94674',
      clientSecret: '25d3d684775dbe11797c5ad29377fcdb47e4ad75',
      count: 5,
      sort: 'created: asc',
      repos: []
    };
  }

  componentDidMount() {
    const { username } = this.props;
    const { clientId, clientSecret, count, sort } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
    .then(res => res.json())
    .then(data => {
      if (this.refs.myRef) {
        this.setState({ repos: data });
      }
    })
    .catch(() => this.setState({ repos: [] }));
  }

  render() {
    const { repos } = this.state;
    let repoItems;

    if (repos.length === 0) {
      repoItems = (
        <div>
          No repos to display for this username - check username
          specified in <b>Edit Profile</b> or that your Github account is
          populated with repos.
        </div>
      );
    } else {
      repoItems = repos.map((repo: GithubRepo) => (
        <div key={repo.id} className="card card-body mb-2">
          <div className="row">
            <div className="col-md-6">
              <h4>
                <a href={repo.html_url} target="_blank" className="text-info" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div className="col-md-6">
              <span className="badge badge-info mr-1">
                Stars: {repo.stargazers_count}
              </span>
              <span className="badge badge-secondary mr-1">
                Watchers: {repo.watchers_count}
              </span>
              <span className="badge badge-success">
                Forks: {repo.forks_count}
              </span>
            </div>
          </div>
        </div>
      ));
    }

    return (
      <div ref="myRef" id="profile-github__info-container">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

export default ProfileGithub;
