import { GraphQLField } from "graphql";

function buildMutation(mutation: GraphQLField<any, any, any>) {
  let { name, args } = mutation;
  let result = 'mutation (' + args.map(arg => `$${arg.name}: ${arg.type.toString()}`).join(', ') + ') {\n';
  result += `  ${name}`;
  result += '(';
  result += args.map(arg => {
    return `${arg.name}: $${arg.name}`
  }).join(', ');
  result += ') {\n';
  result += '    '
  result += '\n  }\n';
  result += '}';
  return result;
}

export default buildMutation;
