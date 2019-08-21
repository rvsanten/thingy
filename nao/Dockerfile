# Fully functional installation for nao communication using perl
FROM ubuntu:14.04
LABEL Maintainer="richard@maasoft.com"

RUN apt-get update && apt-get install -y python2.7 python-pip libboost1.55 && rm -rf /var/lib/apt/lists/*
ADD pynaoqi-python2.7-2.1.4.13-linux64.tar.gz /
ADD nao_move.py /
ENV PYTHONPATH=/pynaoqi-python2.7-2.1.4.13-linux64/ LD_LIBRARY_PATH=:/pynaoqi-python2.7-2.1.4.13-linux64/


