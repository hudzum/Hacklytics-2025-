
import  { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from './components/ui/button';
interface DropzoneProps {
  required: boolean;
  name: string;
}

export default function Dropzone({ required, name }: DropzoneProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((file) => dataTransfer.items.add(file));
        hiddenInputRef.current.files = dataTransfer.files;
      }
    }
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path} className="text-sm text-gray-700">
      📄 {file.path} - {(file.size / 1024).toFixed(2)} KB
    </li>
  ));

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <div
        {...getRootProps({
          className:
            'border-2 border-dashed border-blue-500 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50'
        })}
      >
        <input
          type="file"
          name={name}
          required={required}
          style={{ opacity: 0 }}
          ref={hiddenInputRef}
        />
       <Upload className="w-15 mb-4  h-15  mx-auto text-gray-600" /> 
        <input {...getInputProps()} />
        
        <p className="text-gray-600">
          Drag & drop some files here or{' '}
          <span className="text-blue-500 underline">click to select</span>.
        </p>
       
      </div>

      {acceptedFiles.length > 0 && (
        <aside className="mt-4">
          <h4 className="text-lg font-semibold text-gray-800">Uploaded Files</h4>
          <ul className="list-disc pl-5 mt-1">{files}</ul>
        </aside>
      )}
    </div>
  );
} 