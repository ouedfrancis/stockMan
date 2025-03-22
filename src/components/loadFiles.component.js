import React, { Component } from "react";
import imageCompression from "browser-image-compression";

const listExt = ["doc", "docx", "xls", "xlsx", "pdf", "odt", "ods", "odp"];

export default class LoadFiles extends Component {
  constructor(props) {
    super(props);

    let images = [];
    let listOfFile = [];
    const extension="image/*, application/pdf, application/vnd.ms-excel, .xlsx,.doc, .xls,.docx";

    // Initialisation des fichiers sélectionnés
    for (let i = 0; i < this.props.selectedFiles.length; i++) {
      let ext = this.props.selectedFiles[i].name.split(".").pop().toLowerCase();
      if (listExt.includes(ext))
        images.push(`/img/extension/${ext}.png`);
      else
        images.push(this.props.selectedFiles[i].data);

      listOfFile.push(this.props.selectedFiles[i]);
    }

    this.state = {
      progress: 0,
      isLoading: false,
      selectedFiles: listOfFile,
      previewImages: images,
    };
  }


  // Fonction de conversion des fichiers
  handleConvertFile = async (file) => {
    // Vérifie si le fichier est une image
    if (!file.type.startsWith("image/")) {
      throw new Error("Le fichier sélectionné n'est pas une image.");
    }

    const options = {
      maxSizeMB: this.props?.maxSizeMB?.length>0?this.props?.maxSizeMB: 1, // Taille maximale en MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };


   /* //retourne un objet en base64
   try {
      const compressedFile = await imageCompression(file, options);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error("Erreur lors de la conversion :", error);
      throw error;
    }*/


    //retourne un object de type fichier
    try {
    // Compression de l'image
    const compressedBlob = await imageCompression(file, options);

    // Création d'un nouvel objet File à partir du Blob compressé
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    return compressedFile; // Retourne l'objet File compressé
  } catch (error) {
    console.error("Erreur lors de la conversion :", error);
    throw error;
  }
  };

  selectFiles = async (event) => {
  let images = this.props.multiFile ? [...this.state.previewImages] : [];
  let listOfFile = this.props.multiFile ? [...this.state.selectedFiles] : [];

  const totalFiles = event.target.files.length; // Nombre total de fichiers
  let progressStep = 100 / totalFiles; // Progrès à ajouter par fichier

  this.setState({ isLoading: true, progress: 0 });

  for (let i = 0; i < totalFiles; i++) {
    const file = event.target.files[i];
    let ext = file.name.split(".").pop().toLowerCase();
    let fichier = file;

    try {
      // Si c'est une image, convertissez-la
      if (file.type.startsWith("image/")) {
        fichier = await this.handleConvertFile(file);
      }

      // Ajoutez l'aperçu de l'image ou un icône basé sur l'extension
      images.push(listExt.includes(ext) ? `/img/extension/${ext}.png` : URL.createObjectURL(fichier));
      listOfFile.push({ data: fichier, name: fichier.name,label:this.props?.label });

      // Mettez à jour la progression
      this.setState((prevState) => ({
        progress: Math.min(prevState.progress + progressStep, 100),
      }));
    } catch (error) {
      console.error(`Erreur de conversion pour ${file.name}:`, error);
    }
  }

  this.setState(
    {
      selectedFiles: listOfFile,
      previewImages: images,
      isLoading: false,
    },
    () => {
      // Appeler la méthode du parent avec la liste des fichiers
      this.props.handleLoadFiles(this.props.label, listOfFile);
    }
  );

  // Réinitialisez la barre de progression après un court délai
  setTimeout(() => this.setState({ progress: 0 }), 500);
};

  // Suppression d'un fichier
  removeFile = (index) => {
    let listOfFile = [...this.state.selectedFiles];
    let previewImgs = [...this.state.previewImages];

    listOfFile.splice(index, 1);
    previewImgs.splice(index, 1);

    this.setState({
      selectedFiles: listOfFile,
      previewImages: previewImgs,
    });

    this.props.handleLoadFiles(this.props.label, listOfFile);
  };

  render() {
    const { selectedFiles, previewImages, progress, isLoading } = this.state;

    return (
      <div>
        {this.props.action !== "GET" && this.props.action !== "DELETE" && (
          <div className="row">
            <div className="col-8">
              <label className="btn btn-default p-0">
                <input
                  type="file"
                  multiple={this.props.multiFile}
                  accept={this.props?.extension?.length>0?this.props?.extension: this.extension}
                  onChange={this.selectFiles}
                  className="form-control"
                />
              </label>
            </div>
          </div>
        )}

        {isLoading && (
          <div style={{ marginTop: "20px" }}>
            <h6>Chargement en cours...</h6>
            <div
              style={{
                width: "100%",
                height: "20px",
                backgroundColor: "#e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#4caf50",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {previewImages && this.props.showImage && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered display compact">
              <tbody>
                <tr>
                  {previewImages.map((img, i) => (
                    <td
                      key={`td-preview-${this.props.label}-${i}`}
                      className="text-center"
                    >
                      <img
                        src={img}
                        alt={selectedFiles[i].name}
                        className="image-preview-file"
                        onClick={() =>
                          window.open(selectedFiles[i].data, "_blank")
                        }
                      />
                    </td>
                  ))}
                </tr>
                {this.props.action !== "GET" &&
                  this.props.action !== "DELETE" && (
                    <tr>
                      {previewImages.map((img, i) => (
                        <td
                          className="text-center"
                          key={`td-delete-${this.props.label}-${i}`}
                        >
                          <img
                            src="/img/delete.png"
                            alt="Supprimer"
                            className="icone-action"
                            onClick={() => this.removeFile(i)}
                          />
                        </td>
                      ))}
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
