// FileUploader.js
import { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // const response = await axios.post('http://localhost:5000/translate', formData, {
      const response = await axios.post('https://grand-gumdrop-652d17.netlify.app/.netlify/functions/api/translate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer'
      })

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'seu_arquivo.pdf';

      // Adicione o link ao corpo
      document.body.appendChild(link);

      // Aguarde um pouco antes de acionar o clique
      setTimeout(() => {
        link.click();

        // Remova o link após o clique
        document.body.removeChild(link);
      }, 1000);

      // const blob = new Blob([response.data], { type: 'application/pdf' });

      // // Cria um link temporário e simula um clique nele para iniciar o download
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // link.download = 'seu-arquivo.pdf';
      // document.body.appendChild(link);
      // link.click();
      
      // Remove o link do corpo do documento
      // document.body.removeChild(link);


    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
    }
    
  };

//   useEffect(() => {
//     const blob = new Blob([data]);

//         // Cria um link temporário e simula um clique nele para iniciar o download
//         const link = document.createElement('a');
//         link.href = window.URL.createObjectURL(blob);
//         link.download = 'arquivo.pdf';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//   },[data])

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Enviar Arquivo
      </button>
    </div>
  );
};

export default FileUploader;