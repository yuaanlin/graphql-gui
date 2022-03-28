import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

let token: string | undefined = undefined;
let apiUrl: string | undefined = undefined;

export function setToken(t: string | undefined) {
  token = t;
  client.setLink(authLink(token).concat(
    createUploadLink({ uri: apiUrl })
  ));
}

export function setApiUrl(url: string | undefined) {
  apiUrl = url;
  client.setLink(authLink(token).concat(
    createUploadLink({ uri: apiUrl })
  ));
}

export function getApolloClient() {
  return client;
}

const authLink = (token: string | undefined) => setContext(
  (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

let client = new ApolloClient({
  link: authLink(token).concat(
    createUploadLink({ uri: apiUrl })
  ),
  cache: new InMemoryCache(),
});
