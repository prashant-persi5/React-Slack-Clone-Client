import React from 'react';
import findIndex from 'lodash/findIndex';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';
import {graphql} from 'react-apollo';
import {gqlAllTeams} from '../graphql/teams';

const ViewTeam = ({ data: {loading, allTeams}, match: {params: {teamId, channelId}} }) => {
  if(loading) {
    return null;
  }

  const teamIdx = !!teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
  const team = allTeams[teamIdx];
  const channelIdx = !!channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
  const channel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar 
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))} 
        team={team}
      />
      <Header channelName={channel.name} />
      <Messages channelId={channels.id}>
        <ul className="message-list">
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={channel.name} />
    </AppLayout>
  );
}

export default graphql(gqlAllTeams)(ViewTeam);
