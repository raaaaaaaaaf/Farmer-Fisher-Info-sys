import { nanoid } from "nanoid";
import { createContext, useState } from "react";


export const AddFormContext = createContext();

export function AddFormProvider ({children}) {
    const [formData, setFormData] = useState({
      author: "",
      title: "",
      description: "",
      content: "",
    })
    return (
        <AddFormContext.Provider value={{formData,setFormData}}>
            {children}
        </AddFormContext.Provider>
    )
}