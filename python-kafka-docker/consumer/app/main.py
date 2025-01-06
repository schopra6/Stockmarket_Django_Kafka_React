
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request
from app.env import EnvironmentVariables
from kafka import KafkaConsumer
import time
from json import loads
import logging

load_dotenv()

def main():


    app = FastAPI(title='Kafka Consumer API')
    print(EnvironmentVariables.KAFKA_TOPIC_NAME.get_env())
    print(f'{EnvironmentVariables.KAFKA_SERVER.get_env()}:{EnvironmentVariables.KAFKA_PORT.get_env()}')

    consumer = KafkaConsumer(
        EnvironmentVariables.KAFKA_TOPIC_NAME.get_env(),
        bootstrap_servers=f'{EnvironmentVariables.KAFKA_SERVER.get_env()}:{EnvironmentVariables.KAFKA_PORT.get_env()}',
        value_deserializer=lambda x: loads(x.decode('utf-8')),
        auto_offset_reset='earliest',
        enable_auto_commit=True,)
    try:
            # Consume messages
             for msg in consumer:
                print("consumed: ", msg.topic, msg.partition, msg.offset,
                      msg.key, msg.value, msg.timestamp)
    except Exception as e:
                print('consumer failed')
                consumer.stop()
                logging.info('Connection successful', e)


    @app.on_event("shutdown")
    async def shutdown_event():
        await consumer.stop()


