import React from "react"
import ReactQuill, { Quill } from 'react-quill'
import PropTypes from "prop-types"

const FontArr = Quill.import('formats/font');
FontArr.whitelist = ['Serif', 'Sans-serif', 'Monospace', 'Roboto'];
Quill.register(FontArr, true);

const fontSizeArr = ["9px", "10px", "11px", "12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px","28px"]
var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

export default class Editor extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editorHtml: '', theme: 'snow' }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(html) {
        this.setState({ editorHtml: html });
        this.props.saveData(html)
    }

    render() {
        return (
            <div>
                <ReactQuill
                    theme={this.state.theme}
                    onChange={this.handleChange}
                    value={this.state.editorHtml}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    bounds={'.app'}
                    placeholder={this.props.placeholder}
                />
            </div>
        )
    }
}

Editor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': FontArr.whitelist }],
        [{ size: fontSizeArr }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}

Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]

Editor.propTypes = {
    placeholder: PropTypes.string,
    saveData: PropTypes.func
}