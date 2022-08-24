import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType
} from 'graphql';
import React from 'react';

interface ArgumentInputProps {
  type: GraphQLInputType
  name: string | number
  value: any

  onChange(value: any): void
}

function ArgumentInput(props: ArgumentInputProps) {
  let { type, name } = props;
  switch (type?.constructor) {
    case GraphQLNonNull:
      type = type as GraphQLNonNull<any>;
      return <div>
        <ArgumentInput
          type={type.ofType}
          name={name}
          value={props.value}
          onChange={props.onChange} />
      </div>;
    case GraphQLList:
      return <div>
        <p>{name}</p>
        <button
          onClick={() => {
            props.onChange([...(props.value || []), {}]);
          }}>Add
        </button>
        {props.value && props.value.map((item: any, i: number) => {
          type = type as GraphQLList<any>;
          return <div className="flex" key={i}>
            <p className="mt-2 mr-2 opacity-30 font-extrabold">[{i}]</p>
            <ArgumentInput
              value={props.value[i]}
              type={type.ofType}
              name={i}
              onChange={(v) => {
                props.onChange([
                  ...props.value.slice(0, i),
                  v,
                  ...props.value.slice(i + 1)
                ]);
              }}
            />
          </div>;
        })}
      </div>;
    case GraphQLScalarType:
      type = type as GraphQLScalarType;
      if (type.name === 'Upload') {
        return <div className="my-2">
          <p>{name}</p>
          <input
            type="file"
            onChange={e => {
              const file = e.target.files?.[0];
              props.onChange(file);
            }} />
        </div>;
      }
      return <div className="my-2">
        <p>{name}</p>
        <input
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          className="outline-none rounded p-1 border border-gray-300
           transition-all focus:border-gray-700"
          placeholder={type.name} />
      </div>;
    case GraphQLInputObjectType:
      const fields = (type as unknown as GraphQLInputObjectType).getFields();
      return <div className="my-2">
        <p>{name}</p>
        {Object.keys(fields).map(fieldName => <ArgumentInput
          key={fieldName}
          name={fieldName}
          type={fields[fieldName].type}
          value={props.value[fieldName]}
          onChange={(v) => {
            console.log(props.value);
            props.onChange({
              ...props.value,
              [fieldName]: v
            });
          }}
        />)}
      </div>;
    case GraphQLEnumType:
      type = type as GraphQLEnumType;
      return <select onChange={e => props.onChange(e.target.value)}>
        {type.getValues().map((value, i) => <option key={i} value={value.value}>
          {value.name}
        </option>)}
      </select>;
    default:
      return <div>
        <p>{name}</p>
        <p className="bg-red-300">{type}</p>
      </div>;
  }
}

export default ArgumentInput;
