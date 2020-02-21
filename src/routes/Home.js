import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Home = ({ data: {allUsers = [] }}) =>
  allUsers.map(u => <h1 key={u.id}>{u.email}</h1>)

const gqlAllUsers = gql`
{
  allUsers {
    id
    email
  }
}
`;

export default graphql(gqlAllUsers)(Home);
