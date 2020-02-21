import React from 'react';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModel from '../components/AddChannelModal';

export default class Sidebar extends React.Component {

  state = {
    openAddChannelModal: false
  };

  handleAddChannelClick = () => {
    this.setState({openAddChannelModal: true});
  };

  handleCloseAddChannelModal = () => {
    this.setState({openAddChannelModal: false});
  };

  render () {
    const { teams, team } = this.props;

    let username = '';
    try {
      const token = localStorage.getItem('token');
      const {user} = decode(token);
      username = user.username;
    } catch(err) {
      console.log(`Problem while getting user: `, err);
    }

    return [
      <Teams
        key="team-sidebar"
        teams={teams}
      />,
      <Channels
        key="channel-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[{id: 1, name: 'Slackbot'}, {id: 2, name: 'Joe'}]}
        onAddChannelClick={this.handleAddChannelClick}
      />,
      <AddChannelModel 
        teamId={team.id}
        open={this.state.openAddChannelModal}
        onClose={this.handleCloseAddChannelModal}
        key="sidebar-add-channel-modal"
      />
    ];
  }
};
