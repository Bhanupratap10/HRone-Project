// src/App.jsx
import { useState } from 'react';
import './index.css';

const Field = ({ field, onChange, onDelete, onAddNested }) => {
  const [name, setName] = useState(field.name);
  const [type, setType] = useState(field.type || 'string');

  const handleNameChange = (e) => {
    setName(e.target.value);
    onChange({ ...field, name: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    onChange({ ...field, type: e.target.value });
  };

  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        className="border p-1 mr-2 w-1/3"
        placeholder="Field name"
      />
      <select value={type} onChange={handleTypeChange} className="border p-1 mr-2 w-1/3">
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="nested">nested</option>
        <option value="objectId">objectId</option>
        <option value="float">float</option>
        <option value="boolean">boolean</option>
      </select>
      <button onClick={onDelete} className="bg-red-500 text-white p-1 mr-2">X</button>
      {type === 'nested' && (
        <button onClick={onAddNested} className="bg-blue-500 text-white p-1">+ Add Item</button>
      )}
    </div>
  );
};

const NestedField = ({ fields, onChange, onDelete, onAddNested }) => {
  return (
    <div className="ml-4 border-l-2 pl-2">
      {fields.map((field, index) => (
        <div key={index} className="mb-2">
          <Field
            field={field}
            onChange={(updatedField) => {
              const newFields = [...fields];
              newFields[index] = updatedField;
              onChange(newFields);
            }}
            onDelete={() => {
              const newFields = fields.filter((_, i) => i !== index);
              onChange(newFields);
            }}
            onAddNested={() => {
              const newFields = [...fields];
              newFields[index] = { ...field, children: field.children || [] };
              newFields[index].children.push({ name: '', type: 'string' });
              onChange(newFields);
            }}
          />
          {field.type === 'nested' && field.children && (
            <NestedField
              fields={field.children}
              onChange={(newChildren) => {
                const newFields = [...fields];
                newFields[index] = { ...field, children: newChildren };
                onChange(newFields);
              }}
              onDelete={() => {
                const newFields = fields.filter((_, i) => i !== index);
                onChange(newFields);
              }}
              onAddNested={() => {
                const newFields = [...fields];
                newFields[index] = { ...field, children: field.children || [] };
                newFields[index].children.push({ name: '', type: 'string' });
                onChange(newFields);
              }}
            />
          )}
        </div>
      ))}
      <button
        onClick={() => onAddNested(fields)}
        className="bg-blue-500 text-white p-1 mt-2 w-1/3"
      >
        + Add Item
      </button>
    </div>
  );
};

const App = () => {
  const [fields, setFields] = useState([{ name: '', type: 'string' }]);
  const [jsonPreview, setJsonPreview] = useState('');

  const updateJsonPreview = (fields) => {
    const generateJson = (fields) => {
      return fields.map((field) => {
        const value =
          field.type === 'nested' && field.children
            ? { ...generateJson(field.children) }
            : field.type === 'string'
            ? ''
            : field.type === 'number'
            ? 0
            : field.type === 'objectId'
            ? '507f1f77bcf86cd799439011'
            : field.type === 'float'
            ? 0.0
            : field.type === 'boolean'
            ? false
            : '';
        return { [field.name]: value };
      });
    };
    const json = JSON.stringify(generateJson(fields), null, 2);
    setJsonPreview(json);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">React App</h1>
      <div className="flex flex-col">
        <NestedField
          fields={fields}
          onChange={(newFilms) => {
            setFields(newFields);
            updateJsonPreview(newFields);
          }}
          onDelete={() => {
            if (fields.length > 1) {
              const newFields = fields.filter((_, i) => i !== 0);
              setFields(newFields);
              updateJsonPreview(newFields);
            }
          }}
          onAddNested={(currentFields) => {
            setFields([...currentFields, { name: '', type: 'string' }]);
            updateJsonPreview([...currentFields, { name: '', type: 'string' }]);
          }}
        />
        <button
          onClick={() => {
            setFields([...fields, { name: '', type: 'string' }]);
            updateJsonPreview([...fields, { name: '', type: 'string' }]);
          }}
          className="bg-blue-500 text-white p-2 mt-2 w-full"
        >
          + Add Item
        </button>
        <button
          onClick={() => alert(JSON.stringify(fields, null, 2))}
          className="bg-gray-500 text-white p-2 mt-2 w-full"
        >
          Submit
        </button>
        <div className="mt-4">
          <h2 className="text-xl mb-2">JSON Preview</h2>
          <pre className="border p-2 bg-gray-100">{jsonPreview}</pre>
        </div>
      </div>
    </div>
  );
};

export default App;