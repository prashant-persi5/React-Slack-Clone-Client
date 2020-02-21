import gql from 'graphql-tag';

export const gqlAllTeams = gql`
{
  allTeams {
    id
    name
    channels {
      id
      name
    }
  }
}
`;
