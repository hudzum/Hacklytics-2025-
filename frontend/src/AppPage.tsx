import { FileWithPath } from "react-dropzone";
import Dropzone from "react-dropzone";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Loader, Mail, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./components/ui/textarea";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const AppPage = () => {
  const BACKEND_URI = "http://0.0.0.0:80";
  const [state, setState] = useState<
    | { state: "upload" }
    | { state: "uploading" }
    | { state: "analyzing"; id: string }
    | {
        state: "result";
      }
  >({ state: "upload" });
  const [document, setDocument] = useState<FileWithPath | undefined>(undefined);
  const sse = useRef<EventSource | undefined>(undefined);

  const email = `Subject: Request for Review and Adjustment of Hospital Bill for Jane Doe\n
Dear [Recipient's Name or Billing Department],\n
I am writing to discuss the hospital bill for my recent visit to Oschner, Covington under the name Jane Doe. I appreciate the care I received and am committed to settling the bill promptly. However, I have concerns about a few items that seem to be priced higher than expected, based on typical rates associated with these CPT codes.\n
CPT Code 99284: Would it be possible to adjust this charge so I can pay 65% of its original cost?\n
CPT Code 81025: Could you consider allowing me to pay 65% of its original cost as well?\n
CPT Code 96374: I propose to pay $705 for this item, which aligns more closely with standard pricing.\n
I believe there may be an opportunity to adjust the charges accordingly, based on standard rates, and I am hopeful that we can reach an agreement amicably. I understand that billing can be complex and appreciate your cooperation on this matter. Please let me know how we can proceed with these adjustments.\n
Thank you for your attention to this request. I am eager to resolve this promptly and amicably.\n
Warm regards,\n
Jane Doe`
  const [gand, setGang] = useState(email)
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
            <h1 className="text-2xl font-semibold mb-4">
              Upload Your Medical Bill Here
            </h1>
            <div className="m-4">
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
              style={{ transition: "all 0.3s ease-in-out" }}
              className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
              onClick={async () => {
                setState({ state: "analyzing", id: "6274-8392-2018" });
                setTimeout(function () {
                  //do what you need here
                  setState({ state: "result" });
                }, 4000);
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
          <div className = "yt-30 mt-26" >
            <div className="w-full max-w-4xl mx-auto space-y-6 p-8 yt-20">
              <div className="space-y-4">
                <label className="text-xl font-semibold">
                  Negotiation script
                </label>
                <Textarea
                  value={gand}
                  
                  placeholder="Enter your text here..."
                  className="min-h-[400px] text-lg p-4"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xl font-semibold">Email Address</label>
                <Textarea
                 
                  placeholder="Enter email address..."
                  className="min-h-[100px] resize-none text-lg p-4"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  style={{ transition: "all 0.3s ease-in-out" }}
                  className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
                  onClick={() => {}}
                  size="lg"
                >
                  Copy Text
                </Button>

                <Button
                  onClick={() => {}}
                  variant="default"
                 style={{ transition: "all 0.3s ease-in-out" }}
                  className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
                  size="lg"
                >
                  <Mail className="w-6 h-6 mr-3" />
                  Send Email
                </Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Cost Chart</CardTitle>
                <CardDescription>Sticker Price vs Calculated</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{desktop: {
  label: "Desktop",
  color: "rgb(0, 0, 255)" // Blue
},
mobile: {
  label: "Mobile",
  color: "rgb(255, 0, 0)" // Red
},
}
 
 }>
                  <BarChart accessibilityLayer data={ [

{ month: "99284", desktop: 3253 , mobile: 2579 },

{ month: "99284", desktop: 1748, mobile: 1676 },

{ month: "81025", desktop: 120, mobile: 117 },

{ month: "81025", desktop: 230, mobile: 76},

{ month: "96374", desktop: 434, mobile: 222 },

{ month: "96374", desktop: 200, mobile: 175 },

]}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={4}
                    />
                    <Bar
                      dataKey="mobile"
                      fill="var(--color-mobile)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
             
               
              </CardFooter>
            </Card>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default AppPage;
