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
import json
import pandas as pd
import openpyxl
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

from typing import Optional, Sequence

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
processor_version_id = "d316a104cd3131bb" # Optional. Processor version to use

def full_analyze(id: UUID, document_bytes: bytes, extension: str, mimetype: str):
    with queues_lock:
        queues[id] = Queue(1)
    try:
        print("Calling Document AI")
        itemList = document2JSON(project_id, location, processor_id, document_bytes ,extension, field_mask, processor_version_id, mimetype)
        print(itemList)
        print("Completed Document Scan")

        dataFrame = get_data()
        firstEl = itemList[0]
        print(desc2CPT(df=dataFrame,inputDesc= firstEl["code"]) )
        print("Adding Codes if No Codes")
        itemListCode = addCPTCodes(itemList, dataFrame=dataFrame)
        print("Chatgpt fjao;ifjwe;o")
        print(itemListCode)
        




        with queues_lock:
            # Replace the object with real results
            queues[id].put_nowait({ "result": "success", "feedback": feedback, "email_text": result_video_file }) #Whatever outputs we want 
    except Exception as e:
        logger.error(e)
        with queues_lock:
            # Send failure
            queues[id].put_nowait({ "result": "fail", "message": "Failed Overall" })
    finally:
        with queues_lock:
            del queues[id]

def document2JSON(
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
        print("PRinging form field2")

        #document_dict = documentai.Document.to_dict(document)
        result2 =[]
        for entity in document.entities:
            cost = None
            name = None
            code = None
            if entity.properties:
               for property in entity.properties:
                if property.type_ == "line_item/description":
                    name = property.text_anchor.content
                if property.type_ == "line_item/amount":
                    cost = property.text_anchor.content
                if property.type_ == "line_item/product_code":
                    code = property.text_anchor.content
                
                # if(name!= None and cost!= None):
                #     print((name, cost))
                # if there is a code AND a name, do the stuff
            if code == None and name == None:
                continue
            line_itme = {"cost" :cost,
                    "name" :name,
                    "code" :code
                    }
            result2.append(line_itme)
      
       
        return result2
        
    
        
    except Exception as e:
        logger.error(e)
        with queues_lock:
            # Send failure
            queues[id].put_nowait({ "result": "fail", "message": "Failed at Process Document" })
    finally:
        user_document_file.close()
     

     

def compare_prices(list_items, bill_price: int, fair_price: int):
    """
    Categorizes the bill price based on how much it exceeds the fair price.
    :param bill_price: The price given on the bill.
    :param fair_price: The expected fair price.
    :return: 
        1 if the bill price is in the range [fair_price, fair_price * 1.10]
        2 if the bill price is in the range (fair_price * 1.10, fair_price * 2.5]
        3 if the bill price is above fair_price * 2.5
    """
    first_threshold = 1.5
    second_threshold = 3
    if fair_price <= bill_price <= fair_price * first_threshold:
        return 1  # Slightly above expected price (acceptable range)
    elif fair_price * first_threshold < bill_price <= fair_price *second_threshold:
        return 2  # Moderately above expected price (suspicious)
    else:
        return 3  # Too high (possible fraud)


def addCPTCodes(list_items, dataFrame):
    try:
        newList = []

        print("We have entered function")
        print("items in list: ", len(list_items))
        for list_item in list_items:
            if list_item["code"] is None:
                cost = list_item["cost"]
                cpt_code = desc2CPT(dataFrame,list_item["name"]) 
                print("cpt_code: ", cpt_code)
                name = list_item["name"]
                
                line_item = {"cost" :cost,
                                    "name" :name,
                                    "code" :cpt_code
                                    }  
                print("Checking assignment: ", line_item["code"])
                newList.append(line_item)              
                #use and extract price from apii
            else:
                newList.append(line_item)


        # print(list_items)
    except Exception as e:
        logger.error(e) 
    finally:
        return newList 
     
def get_data():
    try:
    # Read data from Excel file
        print("Current Working Directory: ", os.getcwd())
        df = pd.read_excel('CPTtoDesc.xlsx')
        df["Description"] = df["Description"].apply(lambda x: (re.sub(r'[^\w\s]', '', x)))
        df["Description"] = df["Description"].apply(lambda x: x.lower())
        return df
    except Exception as e:
        print("failed in get data")
        print(e)
        logger.error(e)  

def desc2CPT(df, inputDesc: str) -> str:
     
    # make input lowercase
    inputDesc = inputDesc.lower()
    # remove punctuation
    inputDesc = re.sub(r'[^\w\s]', '', inputDesc)
    # vectorize the input
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(df["Description"])
    inputVec = vectorizer.transform([inputDesc])
    # calculate cosine similarity
    cosineSimilarities = cosine_similarity(inputVec, X)
    # get the index of the most similar description
    index = cosineSimilarities.argmax()
    # get the CPT code of the most similar description
    CPT = df.iloc[index]["CPT"]
    return CPT

def get_desc(df, CPT: str) -> str:
    # get the description of the CPT code
    desc = df[df["CPT"] == CPT]["Description"].values[0]
    return desc



#returns list wehre first double is average of Avg_Sbmtd_Chrg(charge before insurance) and the second oen is Avg_Mdcr_Pymt_Amt which is the total amount the patient needs to pay our of pocket
def fetch_cms_data(cpt_code):
    url = rf"https://data.cms.gov/data-api/v1/dataset/92396110-2aed-4d63-a6a2-5d6207d46a29/data?keyword={cpt_code}&offset=0&size=10"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        total_submitted = 0
        total_medicare = 0
        count = 0

        for line in data:
            if 'Avg_Sbmtd_Chrg' in line and 'Avg_Mdcr_Pymt_Amt' in line:
                try:
                    total_submitted += float(line['Avg_Sbmtd_Chrg'])
                    total_medicare += float(line['Avg_Mdcr_Pymt_Amt'])
                    count += 1
                except ValueError:
                    print(f"Skipping invalid entry number {count} for {cpt_code}")
        
        if count > 0:
            avg_submitted = total_submitted / count
            avg_medicare = total_medicare / count
            return [avg_submitted, avg_medicare]
        else:
            print("No valid data found.")
            return None
    
    else:
        print(f"Failed to connect to the API. Status code: {response.status_code}")
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

    #document_bytes, mimetype, extension
    get_running_loop().run_in_executor(None, lambda: full_analyze(id, document_bytes, extension, mimetype))
    
    # Return id which client uses to check on the analyzing
    return { "id": id }

@app.get("/wait-for-analyze/{id}")
async def wait_for_analyze(id: UUID, request: Request):
    logger.info("waiting for analyze done")
    queue = await get_running_loop().run_in_executor(None, lambda: get_queue(id))
    
    async def event_generator():
        if queue is None:
            yield { "result": "fail", "message": "Failed: Queue is None" }
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
        
        result_video_file = result["email_text"]
        videos[id] = result_video_file
        del result["video_file"]
        
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

