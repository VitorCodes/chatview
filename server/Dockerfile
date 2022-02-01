FROM python:3.8.3

# Environment
ENV PORT=5000

# Setup
ARG SRC_PATH=/usr/src/app
WORKDIR ${SRC_PATH}
COPY . .

# Build
RUN pip install -r requirements.txt

# Run
EXPOSE 5000
CMD python server.py