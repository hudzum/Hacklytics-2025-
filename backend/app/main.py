import json
import logging
import os
import tempfile
import threading
import time
import uuid
from fastapi.responses import StreamingResponse
import uvicorn
from asyncio import get_running_loop, Queue
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette import EventSourceResponse
from uuid import UUID
import mimetypes

import requests

from typing import Optional

from google.api_core.client_options import ClientOptions
from google.cloud import documentai  # type: ignore

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./service-account-file.json"
OUT_EXT = ".mp4"
OUT_MIME_TYPE = "video/mp4"

queues_lock: threading.Lock = threading.Lock()
queues: dict[UUID, Queue] = {}

videos: dict[UUID, tempfile._TemporaryFileWrapper] = {}

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



# TODO(developer): Uncomment these variables before running the sample.
project_id = "hacklyticsproject-451705"
location = "us" # Format is "us" or "eu"
processor_id = "a1efeaa2236c6ae7" # Create processor before running sample
field_mask = "text,entities,pages.pageNumber"  # Optional. The fields to return in the Document object.
processor_version_id = "pretrained-expense-v1.4.2-2024-09-12" # Optional. Processor version to use


def process_document_sample(
    project_id: str,
    location: str,
    processor_id: str,
    document: bytes,
    extension: str,
    field_mask: Optional[str] = None,
    processor_version_id: Optional[str] = None,
    mimetype:  Optional[str] = None,
) -> None:
    user_document_file = tempfile.NamedTemporaryFile(suffix=extension)
    with queues_lock:
        queues[id] = Queue(1)
    try:
        # Analyze video here
        print("writing vid")
        user_document_file = tempfile.NamedTemporaryFile(suffix=extension)
        print("EXTENSION" + extension)
        user_document_file.write(document)
        user_document_file.flush()
        
        file_path = user_document_file.name

        opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")

        client = documentai.DocumentProcessorServiceClient(client_options=opts)

        if processor_version_id:
            # The full resource name of the processor version, e.g.:
            # `projects/{project_id}/locations/{location}/processors/{processor_id}/processorVersions/{processor_version_id}`
            name = client.processor_version_path(
                project_id, location, processor_id, processor_version_id
            )
        else:
            # The full resource name of the processor, e.g.:
            # `projects/{project_id}/locations/{location}/processors/{processor_id}`
            name = client.processor_path(project_id, location, processor_id)

        # Read the file into memory
        with open(file_path, "rb") as image:
            image_content = image.read()

        # Load binary data
        raw_document = documentai.RawDocument(content=image_content, mime_type=mimetype)

        # For more information: https://cloud.google.com/document-ai/docs/reference/rest/v1/ProcessOptions
        # Optional: Additional configurations for processing.
        process_options = documentai.ProcessOptions(
            # Process only specific pages
            individual_page_selector=documentai.ProcessOptions.IndividualPageSelector(
                pages=[1]
            )
        )

    # Configure the process request
        request = documentai.ProcessRequest(
            name=name,
            raw_document=raw_document,
            field_mask=field_mask,
            process_options=process_options,
        )

        result = client.process_document(request=request)

        # For a full list of `Document` object attributes, reference this page:
        # https://cloud.google.com/document-ai/docs/reference/rest/v1/Document
        document = result.document

        # Read the text recognition output from the processor
        print("The document contains the following text:")
        print(document.text)
    except Exception as e:
        logger.error(e)
        with queues_lock:
            # Send failure
            queues[id].put_nowait({ "result": "fail", "message": "Failed" })
    finally:
        user_document_file.close()
        with queues_lock:
            del queues[id]

            
def fetch_cms_data(keyword="97530", offset=0, size=10):
    base_url = "https://data.cms.gov/data-api/v1/dataset/4f307be4-6868-4a9e-ae92-acf3fd4b5543/data"
    
    # Define parameters
    params = {
        "keyword": keyword,
        "additionalProp1": "{}",
        "offset": offset,
        "size": size
    }
    
    try:
        # Make the GET request
        response = requests.get(base_url, params=params)
        
        # Raise an exception for bad status codes
        response.raise_for_status()
        
        # Return JSON response
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        return None
def get_queue(id: UUID) -> Queue:
    logger.info(f"Getting queue {id}")
    with queues_lock:
        if id in queues:
            return queues[id]
        else:
            return None

def unique_uuid(start_id: UUID) -> UUID:
    with queues_lock:
        while start_id in queues:
            start_id = uuid.uuid4()

    return start_id

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/upload")
async def upload(req: Request, ):
    document_bytes = await req.body()
    mimetype = req.headers.get("Content-Type")
    extension = mimetypes.guess_extension(mimetype)
    
    if not extension:
        raise ValueError(f"Unsupported content type: {req.headers.get('Content-Type')}")

    if len(document_bytes) == 0:
        raise HTTPException(status_code=400, detail="Must upload a Document")
    
    start_id = uuid.uuid4()
    id = await get_running_loop().run_in_executor(None, lambda: unique_uuid(start_id))

    
    get_running_loop().run_in_executor(None, lambda: process_document_sample(project_id, location, processor_id, document_bytes,extension, field_mask, processor_version_id, mimetype))
    
    # Return id which client uses to check on the analyzing
    return { "id": id }

@app.get("/wait-for-analyze/{id}")
async def wait_for_analyze(id: UUID, request: Request):
    logger.info("waiting for analyze done")
    queue = await get_running_loop().run_in_executor(None, lambda: get_queue(id))
    
    async def event_generator():
        if queue is None:
            yield { "result": "fail", "message": "Failed" }
            return

        if await request.is_disconnected():
            logger.debug("Request disconnected")
            return

        result = await queue.get()
        
        if result["result"] == "fail":
            print(result)
            yield {
                "event": "message",
                "data": json.dumps(result)
            }
            return
        
        #result_video_file = result["video_file"]
        #videos[id] = result_video_file
        #del result["video_file"]
        
        yield {
            "event": "message",
            "data": json.dumps(result)
        }

    return EventSourceResponse(event_generator())

@app.get("/result/{id}", response_class=StreamingResponse)
async def result(id: UUID):
    if id not in videos:
        raise HTTPException(status_code=404, detail="Video not found")
   

    return id

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

