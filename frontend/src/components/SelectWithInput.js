import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const SelectWithInput = (props) => {
  const [options, setOptions] = useState(props.values);

  const [selectedOption, setSelectedOption] = useState(
    props.values.filter(i => i.value == props.value)|| null);

  const handleChange = (newValue, actionMeta) => {
    props.handleChange(newValue? newValue.value : null)
    setSelectedOption(newValue);
  };

  return (
    <div style={styles.container}>
      <CreatableSelect
        inputId="select-with-input"
        isClearable
        onChange={handleChange}
        options={options}
        value={selectedOption}
        styles={customStyles}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 350,
  },
  label: {
    display: 'block',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height:"fit-content",
    border: "solid 2px",
    borderRadius: "8px",
    color: "var(--grey2)",
    boxShadow: "none",
    "&:hover": {
        borderColor:"var(--grey3)",
    }
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'var(--grey1)' : 'white',
    color: 'var(--dark-blue)',
    padding: 5
  }),
  input: (provided) => ({
    ...provided,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 14,
    color: '#999',
  }),
};

export default SelectWithInput;

