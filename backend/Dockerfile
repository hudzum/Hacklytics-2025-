FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account-file.json

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]