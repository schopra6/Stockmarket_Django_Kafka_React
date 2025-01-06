import json
import asyncio
import requests
from publisher.app.core.gateways.kafka import Kafka
from publisher.app.core.models.message import Message
from app.dependencies.kafka import get_kafka_instance

from fastapi import APIRouter, Depends

router = APIRouter()


@router.post("")
async def send(data: Message, server: Kafka = Depends(get_kafka_instance)):
    try:
        topic_name = server._topic
        await server.aioproducer.send_and_wait(topic_name, json.dumps(data.dict()))
    except Exception as e:
        await server.aioproducer.stop()
        raise e
    return 'Message sent successfully'


async def fetch_stock_data():
    URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo'
    response = requests.get(URL)
    return response.json()


async def scheduled_task():
    while True:
        stock_data = await fetch_stock_data()
        message = Message(data=stock_data)
        await send(message)
        await asyncio.sleep(300)


@router.on_event("startup")
async def start_scheduled_task():
    asyncio.create_task(scheduled_task())