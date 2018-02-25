# node-oracledb v2.0.15 Release Notes
FROM node

WORKDIR /opt

RUN apt update && apt install -y unzip libaio1

RUN curl http://files.linr.org/files/cputstat.sh

ADD instantclient-basic-linux.x64-12.2.0.1.0.zip instantclient-basic-linux.x64-12.2.0.1.0.zip
RUN unzip instantclient-basic-linux.x64-12.2.0.1.0.zip

RUN mkdir -p /opt/oracle
RUN cp -r /opt/instantclient_12_2 /opt/oracle/
# && rm -f /opt/instantclient_12_2/* && rm -fr /opt/instantclient_12_2
RUN echo /opt/oracle/instantclient_12_2 > /etc/ld.so.conf.d/oracle-instantclient.conf
RUN ldconfig

ENV lD_LIBRARY_PATH /opt/oracle/instantclient_12_2:$LD_LIBRARY_PATH

WORKDIR /
RUN npm install oracledb

EXPOSE 9500

ENTRYPOINT [ "node" ]

CMD [ "entrypoint.js" ]

ADD entrypoint.js entrypoint.js