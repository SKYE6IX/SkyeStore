import React, { useEffect, useState } from "react";

export default function useForm(initial = {}) {
  const [inputs, setInput] = useState(initial);

  //convert the whole object to strings and use to watch how the initial state change
  //when we run the code on useEffect to populate our update form
  const initialValue = Object.values(initial).join("");

  useEffect(() => {
    setInput(initial)
  }, [initialValue]);

  const handleChange = (event) => {
    let { name, type, value } = event.target;

    //change the value of price to number from strings
    if (type === "number") {
      value = parseInt(value);
    }
    // This help change the value from name of the upload to the fileName only;
    if (type === "file") {
      [value] = event.target.files;
    }
    setInput({
      ...inputs,
      [name]: value,
    });
  };

  function resetForm() {
    setInput(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ""])
    );

    setInput(blankState);
  }

  return { inputs, handleChange, resetForm, clearForm };
}
