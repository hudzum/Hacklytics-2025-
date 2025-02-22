import { FileWithPath } from "react-dropzone";
import Dropzone from "react-dropzone";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "./components/ui/button";
const AppPage = () => {
  const BACKEND_URI = "http://0.0.0.0:80";
  const [state, setState] = useState<
    | { state: "upload" }
    | { state: "uploading" }
    | { state: "analyzing"; id: string }
    | {
        state: "result";
        id: string;
        feedback: { name: string; feedback: string; satisfactory: boolean }[];
        video: string;
      }
  >({ state: "upload" });
  const [document, setDocument] = useState<FileWithPath | undefined>(undefined);
  const sse = useRef(null);

  return (
    <>
      <div>
        {state.state === "upload" || state.state === "uploading" ? (
          <div>
            <h1>Upload your file Here</h1>
            <Dropzone
              onDrop={(files) => {
                if (files[0]) {
                  setDocument(files[0]);
                  const displayFiles = files.map((file) => (
                    <li key={file.path} className="text-sm text-gray-700">
                      📄 {file.path} - {(file.size / 1024).toFixed(2)} KB
                    </li>
                  ));
                }
                console.log(files);
              }}
              maxFiles={1}
              maxSize={1024 ** 2 * 50}
              accept={{
                "image/*": [".jpeg", ".png"],
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50"
                  >
                    <Upload className="w-15 mb-4  h-15  mx-auto text-gray-600" />
                    <input {...getInputProps()} />
                    <p className="text-gray-600">
                      Drag & drop some files here or{" "}
                      <span className="text-blue-500 underline">
                        click to select
                      </span>
                      .
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
            {document && (
              <aside className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Uploaded Files
                </h4>
                <ul className="list-disc pl-5 mt-1">
                  <li key={document.path} className="text-sm text-gray-700">
                    📄 {document.path} - {(document.size / 1024).toFixed(2)} KB
                  </li>
                </ul>
              </aside>
            )}
            <Button variant="outline" size="lg" onClick={async() => {
              setState({ state: "uploading" });

              if(!document){
                setState({ state: "upload" });
                return;
              }
              const res = await fetch(
                BACKEND_URI + `/upload`,
                {
                  body: document,
                  method: 'POST',
                  headers: {
                    ['content-type']: document.type,
                  },
                }
              );
            }}>
              Upload File
            </Button>
          </div>
        ) : state.state === "analyzing" ? (
          <div></div>
        ) : state.state === "result" ? (
          <div></div>
        ) : null}
      </div>
    </>
  );
};

export default AppPage;
