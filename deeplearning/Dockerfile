FROM python:3.9

WORKDIR /python-docker
# RUN python3.9 -m venv /opt/venv
# ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y


COPY . .

CMD [ "flask", "run" , "-h", "0.0.0.0", "--port", "8000"]