// src/components/PDF.tsx

import BlurIn from "@/components/ui/blur-in";

import React, { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Styles for the large drag-and-drop area
const styles = {
  dropArea: {
    width: "60%",
    height: "400px",
    border: "2px dashed #007bff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    color: "#007bff",
    fontSize: "18px",
    textAlign: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  dropAreaActive: {
    backgroundColor: "#e9f7ff",
  },
  inputFile: {
    display: "none",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  imageContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  imageCard: {
    textAlign: "center",
    width: "200px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  downloadButton: {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const PDF: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file upload
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please drop a valid PDF file.");
    }
  };

  // Convert PDF pages to images
  const handleConvertToImages = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF first.");
      return;
    }

    setLoading(true);
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdfDoc.numPages;
      const imagesArray: string[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render the page to the canvas
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Convert the canvas to a data URL (image)
          const imageUrl = canvas.toDataURL("image/png");
          imagesArray.push(imageUrl);
        }
      }

      setImages(imagesArray);
      setLoading(false);
    };

    fileReader.readAsArrayBuffer(pdfFile);
  };

  // Handle image download
  const handleDownloadImage = (image: string, index: number) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `page-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="texts mt-24 p-2">
        <BlurIn word="welcome to Free PDF to image Extractor" />
      </div>
      {/* Large Drag-and-Drop Area */}
      <section className="mt-10 "
        style={{
          ...styles.dropArea,
          ...(isDragging ? styles.dropAreaActive : {}),
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div>
          {isDragging ? (
            <p>Release to drop the PDF file here</p>
          ) : (
            <p>Drag and drop a PDF file here, or click to select one</p>
          )}
        </div>
        <input
          type="file"
          accept=".pdf"
          onChange={handlePdfUpload}
          style={styles.inputFile}
        />
      </section>

      {/* Convert Button */}
      <div>
        <button
          onClick={handleConvertToImages}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert PDF to Images"}
        </button>
      </div>

      {/* Display Converted Images */}
      <div style={styles.imageContainer}>
        {images.length > 0 &&
          images.map((image, index) => (
            <div key={index} style={styles.imageCard}>
              <img src={image} alt={`Page ${index + 1}`} style={styles.image} />
              <button
                onClick={() => handleDownloadImage(image, index)}
                style={styles.downloadButton}
              >
                Download Page {index + 1}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PDF;
