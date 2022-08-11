import React, { useEffect, useState } from "react";

type FormInputReturn = [
  string,
  {
    value: string,
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
  },
  () => void,
  boolean
] | [
  string,
  {
    value: string,
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
  },
  () => void
]

const useFormInput = ([value, setValue]: [string, React.Dispatch<any>], pattern?: RegExp): FormInputReturn => {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (pattern) {
      setValid(pattern.test(value))
    }
  }, [value]);

  const reset = () => {
    setValue('');
  }

  const formAttributeObj = {
    value,
    onChange: (e: React.FormEvent<HTMLInputElement>) => setValue(e.currentTarget.value)
  }

  return pattern ? [value, formAttributeObj, reset, valid] : [value, formAttributeObj, reset]
}

export default useFormInput;