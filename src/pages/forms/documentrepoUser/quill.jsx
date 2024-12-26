import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor({saveData}) {
  const [value, setValue] = useState('');

     const handleChange = (html) => {
        setValue(html)
        saveData(html)
    };
  return <ReactQuill theme="snow" value={value} onChange={handleChange} />;
}

export default Editor;