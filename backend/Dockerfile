FROM python:3.12
WORKDIR /app

#Copy requirments file to working directory
COPY requirements.txt /app/

RUN pip install -r requirements.txt 
COPY . .
EXPOSE 80

#CMD ["fastapi", "run", "app/main.py", "--port", "80"]
ENV GOOGLE_APPLICATION_CREDENTIALS=/backend/service-account-file.json
COPY service-account-file.json /app/
CMD ["fastapi", "run", "app/main.py", "--port", "80"]
