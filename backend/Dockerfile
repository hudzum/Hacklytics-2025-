FROM python:3.12
WORKDIR /app

#Copy requirments file to working directory
COPY ./requirements.txt .

RUN pip install -r requirements.txt 
COPY . .
EXPOSE 80

#CMD ["fastapi", "run", "app/main.py", "--port", "80"]
# Copy the Excel file into the container
COPY CPTtoDesc.xlsx /app/
ENV GOOGLE_APPLICATION_CREDENTIALS=/backend/service-account-file.json
COPY service-account-file.json /app/
COPY .env /app/
CMD ["fastapi", "run", "app/main.py", "--port", "80"]
