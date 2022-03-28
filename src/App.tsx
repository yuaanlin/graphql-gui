import { useEffect, useState } from 'react';
import { getApolloClient, setApiUrl, setToken as setClientToken } from './api/apolloClient';
import { buildClientSchema, GraphQLSchema } from 'graphql';
import { gql } from '@apollo/client';
import ArgumentInput from './components/ArgumentInput';
import buildMutation from './utils/buildMutation';
import introspectionQuery from './constants/introspectionQuery';
import { toast, Toaster } from 'react-hot-toast';
import React from 'react';
import Welcome from './pages/Welcome';

function App() {
  const [url, setUrl] = useState('');
  const [variables, setVariables] = useState<any>({});
  const [schema, setSchema] = useState<GraphQLSchema>();
  const [selected, setSelected] = useState<string>();
  const [mutationInput, setMutation] = useState('');
  const [result, setResult] = useState<any>();
  const [error, setError] = useState<any>();
  const [token, setToken] = useState('');

  useEffect(() => {
    setVariables({});
    setResult(undefined);
    setError(undefined);
    const selectedMutation = selected ? mutations[selected] : undefined;
    if (selectedMutation) {
      setMutation(buildMutation(selectedMutation));
    }
  }, [selected]);

  useEffect(() => {
    if(url.length === 0) return;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(introspectionQuery),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => setSchema(buildClientSchema(res.data)));
  }, [url]);

  useEffect(() => {
    if(url.length > 0) setApiUrl(url);
  }, [url]);

  useEffect(() => {
    setClientToken(token);
  }, [token]);

  if(!url) {
    return <Welcome onSubmit={setUrl} />;
  }

  if (!schema) {
    return <div>loading</div>;
  }

  const queries = schema.getQueryType()?.getFields() || {};
  const mutations = schema.getMutationType()?.getFields() || {};
  const selectedMutation = selected ? mutations[selected] : undefined;

  async function execute() {
    try {
      setError(undefined);
      setResult(undefined);
      const res = await getApolloClient().mutate({
        mutation: gql(mutationInput),
        variables
      });
      setResult(res.data);
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div>
      <Toaster />

      <div
        className="bg-gray-100 p-3 w-64 h-screen fixed top-0 overflow-scroll">
        <p className="opacity-60 mt-8 mb-4">Queries</p>
        {Object.keys(queries).map(queryName => <p
          key={queryName}
          className="cursor-pointer"
          onClick={() => toast.error(
            'Query is not support yet. \n\n' +
            ' Consider open a Pull Request to help us to implement it ;)'
          )}>
          {queryName}
        </p>)}
        <p className="opacity-60 mt-8 mb-4">Mutations</p>
        {Object.keys(mutations).map(mutationName => <p
          key={mutationName}
          className="cursor-pointer"
          onClick={() => setSelected(mutationName)}>
          {mutationName}
        </p>)}
      </div>

      <div className="pl-64 mb-24">
        <div className="container mx-auto px-48 pt-12">

          <p className="font-extrabold text-3xl">
            {selectedMutation?.name}
          </p>

          <p>
            {selectedMutation?.description}
          </p>

          <div className="my-12">
            <p className="font-bold mb-8">Authorization</p>
            Bearer
            <input
              className="ml-2 outline-none rounded p-1 border border-gray-300
           transition-all focus:border-gray-700 w-96"
              value={token}
              onChange={e => setToken(e.target.value)}/>
          </div>

          <div className="my-12">
            <p className="font-bold mb-8">Arguments</p>
            {selectedMutation?.args.map(arg => <ArgumentInput
              key={arg.name}
              type={arg.type}
              name={arg.name}
              value={variables[arg.name]}
              onChange={(value) => setVariables({
                ...variables,
                [arg.name]: value
              })}
            />)}
          </div>

          <div className="my-12">
            <p className="font-bold mb-8">Generated Variables</p>
            <pre className="max-w-96 overflow-hidden">
              <code>
                {JSON.stringify(variables, null, 2)}
              </code>
            </pre>
          </div>

          <div className="my-12">
            <p className="font-bold mb-8">Mutation</p>
            <textarea
              value={mutationInput}
              onChange={e => setMutation(e.target.value)}
              className="outline-none rounded p-1 border border-gray-300
           transition-all focus:border-gray-700 w-full h-96 overflow-scroll"
            />
          </div>

          <button onClick={execute}>Run</button>

          {result && <div className="my-12 bg-gray-50 rounded p-4">
            <p className="font-bold mb-8">Result</p>
            <pre className="max-w-96 overflow-hidden">
              <code>
                {JSON.stringify(result, null, 2)}
              </code>
            </pre>
          </div>}

          {error && <div className="my-12 bg-red-100 rounded p-4">
            <p className="font-bold mb-8">Error</p>
            <pre className="max-w-96 overflow-hidden">
              <code>
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          </div>}

        </div>
      </div>
    </div>
  );
}

export default App;
