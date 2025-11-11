# 1. Base Image
FROM python:3.14-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application source code
COPY ./src src/

# 5. Define the command to run the application
CMD ["python", "-m", "src.main"]
