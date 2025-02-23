import { FileWithPath } from "react-dropzone";
import Dropzone from "react-dropzone";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Loader, Mail } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./components/ui/textarea";
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
  const sse = useRef<EventSource | undefined>(undefined);

  return (
    <>
      <nav className="fixed top-0  w-full bg-white/50 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/images/ClaimCure.png"
              alt="Logo"
              className="h-12 w-auto"
            />
            <span className="claimcure text-3xl font-bold">
              <span className="claim">Claim</span>
              <span className="cure">Cure</span>
            </span>
          </div>

         
        </div>
      </nav>
      <div>
        {state.state === "upload" || state.state === "uploading" ? (
          <div>
           <h1 className="text-2xl font-semibold mb-4">Upload Your Medical Bill Here</h1>
           <div className = "m-4">
            <Dropzone
             
              onDrop={(files) => {
                if (files[0]) {
                  setDocument(files[0]);
                  
                  toast("File Uploaded Successfully", {
                    description:
                      "You can now click on the 'Upload File' button to start the analysis.",
                  });
                }
                console.log(files);
              }}
              maxFiles={1}
              maxSize={1024 ** 2 * 50}
              accept={{
                "image/*": [".jpeg", ".png", ".jpg"],
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
            </div>
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
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
              onClick={async () => {
                setState({ state: "uploading" });

                if (!document) {
                  setState({ state: "upload" });
                  return;
                }
                const res = await fetch(BACKEND_URI + `/upload`, {
                  body: document,
                  method: "POST",
                  headers: {
                    ["content-type"]: document.type,
                  },
                });
                if (res.ok) {
                  const { id } = (await res.json()) as { id: string };

                  sse.current = new EventSource(
                    BACKEND_URI + `/wait-for-analyze/${id}`
                  );

                  sse.current.addEventListener("error", () => {
                    toast("Error During SSE connection", {
                      description: "Please Try Again.",
                    });
                    sse.current?.close();
                    sse.current = undefined;
                    setState({ state: "upload" });
                  });

                  sse.current.addEventListener("message", async (e) => {
                    const data:
                      | {
                          result: "success";
                          feedback: {
                            name: string;
                            feedback: string;
                            satisfactory: boolean;
                          }[];
                        }
                      | { result: "error"; error: string } = JSON.parse(e.data);

                    if (data.result == "error") {
                      sse.current?.close();
                      sse.current = undefined;

                      toast("Error During SSE connection", {
                        description: "Please Try Again.",
                      });
                      setState({ state: "upload" });
                    } else {
                      sse.current?.close();
                      sse.current = undefined;
                      const res = await fetch(BACKEND_URI + `/result/${id}`);
                      if (res.ok) {
                        const document = await res.blob();
                        setState({
                          state: "result",
                          id,
                          feedback: data.feedback,
                          video: URL.createObjectURL(document),
                        });
                      } else {
                        toast("Error During SSE connection", {
                          description: "Failed to Download Document.",
                        });
                        setState({ state: "upload" });
                      }
                    }
                  });
                  setState({ state: "analyzing", id });
                  return;
                }
                setState({ state: "upload" });
              }}
            >
              Upload File
            </Button>
          </div>
        ) : state.state === "analyzing" ? (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
              {/* Custom loader animation */}
              <div className="animate-spin">
                <Loader className="h-12 w-12 text-blue-500" />
              </div>

              {/* Main loading text */}
              <div className="text-lg font-semibold">
                Analyzing your video with our advanced, powerful algorithms. 💪
              </div>

              {/* Video ID display */}
              <div className="text-sm text-gray-500">
                Document ID: {state.id}
              </div>
            </CardContent>
          </Card>
        ) : state.state === "result" ? (
          <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Negotiation script</label>
            <Textarea
              //value={} 
              //onChange={(e) => setMainText(e.target.value)}
              placeholder="Enter your text here..."
              className="min-h-[200px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Textarea
              //value={emailAddress}
             // onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter email address..."
              className="min-h-[40px] resize-none"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
            //  onClick={handleCopy}
              className="flex items-center"
            >
              Copy Text
            </Button>
            
            <Button
          //    onClick={handleEmail}
              variant="default"
              className="flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
        ) : null}
      </div>
    </>
  );
};

export default AppPage;
