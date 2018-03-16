# node-oracledb v2.0.15 Release Notes
FROM node:9.8.0

WORKDIR /opt

RUN apt update
RUN apt install -y libaio1

COPY instantclient_12_2 /opt/oracle/instantclient_12_2

RUN echo /opt/oracle/instantclient_12_2 > /etc/ld.so.conf.d/oracle-instantclient.conf
RUN ldconfig

ENV lD_LIBRARY_PATH /opt/oracle/instantclient_12_2:$LD_LIBRARY_PATH

WORKDIR /
RUN npm install oracledb

EXPOSE 9500

ENTRYPOINT [ "node" ]

CMD [ "/entrypoint.js" ]

COPY entrypoint.js /