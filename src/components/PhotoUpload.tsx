// src/components/PhotoUpload.tsx

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdf } from "@react-pdf/renderer";

// PDF Creation Utility
const createPdf = (images: string[]): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const doc = (
      <Document>
        {images.map((image, index) => (
          <Page key={index}>
            <img src={image} alt={`uploaded-img-${index}`} style={{ width: "100%", height: "auto" }} />
          </Page>
        ))}
      </Document>
    );

    pdf(doc)
      .toBlob()
      .then((blob) => resolve(blob))
      .catch(reject);
  });
};

const PhotoUpload: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map((file) => URL.createObjectURL(file));
      setImageFiles(files);
    },
  });

  const handleGeneratePdf = async () => {
    if (imageFiles.length === 0) {
      alert("Please upload some images first.");
      return;
    }
    try {
      const blob = await createPdf(imageFiles);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "images.pdf";
    link.click();
  };

  return (
    <div>
      <section {...getRootProps()} style={styles.dropZone}>
        <input {...getInputProps()} />
        <p>Drag & Drop your images here, or click to select images</p>
      </section>

      <div style={styles.previewContainer}>
        {imageFiles.length > 0 && (
          <div>
            <h3>Preview:</h3>
            <div style={styles.imagePreview}>
              {imageFiles.map((file, index) => (
                <img key={index} src={file} alt={`preview-${index}`} style={styles.previewImage} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleGeneratePdf} style={styles.button}>
          Generate PDF
        </button>
        {pdfBlob && (
          <button onClick={handleDownloadPdf} style={styles.button}>
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  dropZone: {
    border: "2px dashed #888",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "20px",
  },
  previewContainer: {
    marginBottom: "20px",
  },
  imagePreview: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  previewImage: {
    maxWidth: "150px",
    maxHeight: "150px",
    objectFit: "cover",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default PhotoUpload;
