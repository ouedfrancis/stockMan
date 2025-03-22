import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import { PDFDownloadLink, Document, Page, Text, Image, View } from '@react-pdf/renderer';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const MyDocument = ({ content, images, pageSize }) => {
  return (
    <Document>
      {Array.from({ length: Math.ceil(content.length / 30) }).map((_, pageIndex) => (
        <Page key={pageIndex} size={pageSize} style={{ padding: 20 }}>
          <Text style={{ marginBottom: 20 }}>Entête du document</Text>
          <View>
            {content.slice(pageIndex * 30, (pageIndex + 1) * 30).map((block, index) => (
              <Text key={index}>{block.text}</Text>
            ))}
          </View>
          {images.map((image, index) => (
            <Image key={index} src={URL.createObjectURL(image)} style={{ marginVertical: 10 }} />
          ))}
          <Text style={{ marginTop: 20, position: 'absolute', bottom: 20 }}>Pied de page du document</Text>
        </Page>
      ))}
    </Document>
  );
};

const PdfGen = () => {
  const [editorState, setEditorState] = useState(null);
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState('A4'); // Format par défaut
  const [orientation, setOrientation] = useState('portrait'); // Orientation par défaut

  const handleEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const getContent = () => {
    if (editorState) {
      const content = convertToRaw(editorState.getCurrentContent());
      return content.blocks;
    }
    return [];
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const handleOrientationChange = (e) => {
    setOrientation(e.target.value);
  };

  // Définir la taille de la page en fonction du format et de l'orientation
  const getPageSize = () => {
    if (pageSize === 'A4') {
      return orientation === 'portrait' ? 'A4' : [842, 595]; // A4 portrait vs paysage
    } else if (pageSize === 'A5') {
      return orientation === 'portrait' ? 'A5' : [595, 420]; // A5 portrait vs paysage
    }
    return 'A4'; // Valeur par défaut
  };

  return (
    <div>
      <select onChange={handlePageSizeChange}>
        <option value="A4">A4</option>
        <option value="A5">A5</option>
        {/* Ajoutez d'autres formats si nécessaire */}
      </select>
      <select onChange={handleOrientationChange}>
        <option value="portrait">Portrait</option>
        <option value="landscape">Paysage</option>
      </select>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
      />
      <input type="file" multiple onChange={handleImageChange} />
      <PDFDownloadLink
        document={<MyDocument content={getContent()} images={images} pageSize={getPageSize()} />}
        fileName="document.pdf"
      >
        {({ loading }) => (loading ? 'Chargement du document...' : 'Télécharger PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default PdfGen;
