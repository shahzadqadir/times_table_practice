FROM python:3.13

RUN useradd -ms /home/script script

WORKDIR /home/script

COPY ./requirements.txt /home/script/

RUN pip install -r /home/script/requirements.txt --break-system-packages

USER script