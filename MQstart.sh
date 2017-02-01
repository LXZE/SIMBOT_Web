#!/bin/bash
docker run -d --name rabbitmq -p 8080:15672 -p 5672:5672 -p 61613:61613 rabbitmq:3-management
docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_web_stomp