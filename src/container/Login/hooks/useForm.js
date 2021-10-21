import { useCallback, useState } from "react"

const useForm = (initialValues = {}) =>{
  const [ values, setValues] = useState(initialValues)
  const handleChange = useCallback((name, value) => {
    setValues((values) => (
      {
        ...values,
        [name]: value
      }
    ))
  }, []) 
  return [values, handleChange]
}

export default useForm
