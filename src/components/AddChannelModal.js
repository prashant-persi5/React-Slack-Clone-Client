import React from 'react';
import { Form, Input, Button, Modal } from 'semantic-ui-react';
import {withFormik} from 'formik';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import { gqlAllTeams } from '../graphql/teams';
import findIndex from 'lodash/findIndex';

const AddChannelModel = (
  {
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  }) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input 
            value={values.name} 
            onChange={handleChange}
            onBlur={handleBlur} 
            name="name" 
            fluid 
            placeholder="Enter channel name..." 
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button type="button" disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} fluid>Create Channel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const gqlCreateChannel = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(gqlCreateChannel),
  withFormik({
    mapPropsToValues: () => ({name: ''}),
    handleSubmit: async (values, {props: {onClose, teamId, mutate}, setSubmitting}) => {
      await mutate({
        variables: {teamId: parseInt(teamId), name: values.name},
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {              
              id: -1,
              name: values.name,
              __typename: 'Channel',
            }
          },
        },
        update: (store, {data: {createChannel} }) => {
          const {ok, channel} = createChannel;
          if(!ok) {
            return;
          }

          const data = store.readQuery({query: gqlAllTeams});
          const teamIdx = findIndex(data.allTeams, ['id', teamId]);
          data.allTeams[teamIdx].channels.push(channel);
          store.writeQuery({query: gqlAllTeams, data});
        }
      });
      onClose();      
      setSubmitting(false);      
    },
  }),
)(AddChannelModel);
