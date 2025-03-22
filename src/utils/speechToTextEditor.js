import React, { useState, useRef,useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Utils from "./utils";
const SpeechToTextEditor = (props) => {
  const [content, setContent] = useState(props?.content); // Contenu de l'éditeur
  const [error, setError] = useState(""); // Gestion des erreurs
  const recognitionRef = useRef(null);
 const [isSpeechSupported, setIsSpeechSupported] = useState(false); 
 // const [isSpeechSupported, setIsSpeechSupported] = useState(false); 
  const [guid, setGuid] = useState(""); 


useEffect(() => {

  setContent(props?.content)
  editorContent=props?.content
  const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setError("⚠ La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      console.log("setIsSpeechSupported========>",false)
    }else
     {
      setIsSpeechSupported(true);
      console.log("setIsSpeechSupported=======>",true)
    }
    setGuid(Utils.uuidv4())

}, [isSpeechSupported]);
  // Fonction pour ajouter la ponctuation basique
  const formatTranscript = (transcript) => {
    return transcript
      
      .replace(/point virgule/gi, ";")
      .replace(/point d'interrogation/gi, "?")
      .replace(/point d'exclamation/gi, "!")
      .replace(/retour à la ligne|nouvelle ligne|à la ligne/gi, "<br/>")
      .replace(/deux points/gi, ":")
      .replace(/ouvre les guillemets|ouvre le guillemet/gi, "«")
       .replace(/ferme les guillemets|ferme le guillemet/gi, "»")
       .replace(/ouvre les parenthèses|ouvre la parenthèse/gi, "(")
       .replace(/ferme les parenthèses|ferme la parenthèse/gi, ")")
       .replace(/trait d’union/gi, "-")
       .replace(/trois points de suspension /gi, "...")
       .replace(/point/gi, ".")
       .replace(/virgule/gi, ",");
  };
  // Initialiser la reconnaissance vocale
  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("La reconnaissance vocale n'est pas supportée par ce navigateur.");
       setIsSpeechSupported(false);
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = true;
    recognition.continuous = true;
    return recognition;
  };

  // Lancer ou arrêter la reconnaissance vocale
  const toggleListening = (content) => {
    if (recognitionRef.current) {
      console.log("Micro arrêté");
      recognitionRef.current.stop();
      isListening=false;
      recognitionRef.current = null;
    } else {
      const recognition = initSpeechRecognition();
      if (!recognition) return;

      recognitionRef.current = recognition;
      isListening=true;
      console.log("Micro activé");
      setError("");
      recognition.start();
      //setGuid(Utils.uuidv4())
      /*recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript;
          transcript = formatTranscript(transcript);
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        
        setContent((prevContent) => prevContent.trim() + " " + finalTranscript + interimTranscript);
      };*/

      
        recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = content;

        for (let i = 0; i < event.results.length; i++) {
          const transcript = formatTranscript(event.results[i][0].transcript);
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        setContent(finalTranscript + interimTranscript);
         editorContent=finalTranscript + interimTranscript
      };


       /*recognition.onresult = (event) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          }
        }
        
        setContent((prevContent) => prevContent + finalTranscript);
      };*/

      recognition.onerror = (event) => {
        setError("Erreur de reconnaissance vocale : " + event.error);
        isListening=false;
        recognition.stop();
        recognitionRef.current = null;


      };

      recognition.onend = () => {
        console.log("Reconnaissance terminée.");
        isListening=false;
        recognitionRef.current = null;
       
      };
    }
  };

  return (
    <div className="col-md">
      {/*error && (
        <div className="alert alert-danger mt-2" role="alert">{error}</div>
      )*/}

      <Editor
        apiKey="gpl"
        value={content}
        key={guid}
        onEditorChange={(newContent, editor) => {
                        //editor.getContent({ format: "text" }))
                        setContent(newContent)
                        editorContent=newContent
                        if(props.onEditorChange!=null)
                          props.onEditorChange(props.name,newContent) 

                }}
        tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
        init={{
          height: 300,
           license_key: 'gpl',
            entity_encoding: "raw",
            selector: 'textarea',
            language_url: '/js/tinymce/langs/fr_FR.js', // path from the root of your web application — / — to the language pack(s)
            language: 'fr_FR',  // the name of the language pack file

          menubar: false,
          plugins: "lists link image media charmap preview anchor table",
          toolbar:isSpeechSupported?"fontsize bold italic underline strikethrough| forecolor backcolor removeformat  | align bullist numlist outdent indent| image table customMicrophoneButton print"
          :"fontsize bold italic underline strikethrough| forecolor backcolor removeformat  | align bullist numlist outdent indent|  image table print",
   

   automatic_uploads: true,

  /* enable title field in the Image dialog*/
  image_title: true,
  /* enable automatic uploads of images represented by blob or data URIs*/
  automatic_uploads: true,
  /*
    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url: 'postAcceptor.php',
    here we add custom filepicker only to Image dialog
  */
  file_picker_types: 'image',
  /* and here's our custom image picker*/
  file_picker_callback: (cb, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache =  window.tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },


          setup: (editor) => {
           
            editor.ui.registry.addToggleButton("customMicrophoneButton", {
              text: "🎤 ▶",
              onAction: (buttonApi) => {
                toggleListening(editorContent);
                buttonApi.setActive(isSpeechSupported);
                buttonApi.setText(recognitionRef.current!=null ? "🛑🎤" : "🎤 ▶");
              },
              onSetup: (buttonApi) => {
                //buttonApi.setActive(isSpeechSupported);
                buttonApi.setText(recognitionRef.current!=null ? "🛑🎤" : "🎤 ▶");
                return () => {};
                //🗣️🕬🎤📢🛑❌🎙️🗣🗣▶
              },
            });
           
          },
        }}
      />
    </div>
  );
};
let editorContent=""
let isListening=false
export default SpeechToTextEditor;
