import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//import './textEditor.css';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';

import { convertToHTML, convertFromHTML } from 'draft-convert';
import Utils from "./utils";

import DOMPurify from 'dompurify';

const content =  {
  entityMap: {},
  blocks: [
    {
      key: ",,;kl",
      text: "<p>Hey this <strong>editor</strong> rocks 😀</p>",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};
export default class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        //const contentState = convertFromRaw(content);
        let contentState=undefined
          let editorState=undefined
       /* if(props.htmlContent!=null)
       {
         contentState = convertFromHTML(props.htmlContent); 
         editorState = EditorState.createWithContent(contentState);
        }*/
          if(props.content!=null && Utils.isJsonString(props.content))
       {
          //console.log("props.content",JSON.parse(props.content))
         contentState = convertFromRaw(JSON.parse(props.content)); 
         editorState = EditorState.createWithContent(contentState);
        }
        else
        {
          
           editorState =  EditorState.createEmpty();  

        } 

        this.state = {
          contentState,
          editorState,
        };
    }

onContentStateChange = contentState => {
    this.setState({
      contentState
    });
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
    if(this.props.handleRichTextEditorChange!=undefined)
    {
        //console.log("convertToRaw", convertToRaw(editorState.getCurrentContent()))
          /*if(this.props.htmlContent!=null)
            this.props.handleRichTextEditorChange(this.props.name, convertToHTML(editorState.getCurrentContent()))
        else*/
            this.props.handleRichTextEditorChange(this.props.name, JSON.stringify(convertToRaw(editorState.getCurrentContent())))

           //this.props.handleRichTextEditorChange(this.props.name, convertToHTML(JSON.stringify(convertToRaw(editorState.getCurrentContent()))))

          //console.log("convertToRaw", convertToRaw(editorState.getCurrentContent()))
    }
  };

  createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }
    render() {
        const { editorState } = this.state;

        return (
            <div>
                <Editor
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    editorStyle={{
                      lineHeight: "1", // Ajuste l'interligne
                      padding: "5px",   // Ajoute un padding interne
                      fontSize: "11px", // Taille par défaut
                    }}
                    editorState={editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    onContentStateChange={this.onContentStateChange}
                     toolbar={{
                      inline: { inDropdown: true },
                      fontSize: {
                        options: [8,9,10,11,12,14, 16, 18, 20, 24], // Tailles disponibles
                        defaultFontSize: 16, // Taille par défaut dans le menu
                      },
                    }}

                />
               {/*  <div
                        className="preview"
                        dangerouslySetInnerHTML={this.createMarkup(convertToHTML(editorState.getCurrentContent()))}>
                      </div>
                 <textarea
                  disabled
                  value={convertToHTML(editorState.getCurrentContent())}
                />*/}
            </div>
        );
    }
}