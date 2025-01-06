import time

from app.core.gateways.kafka import Kafka
from app.dependencies.kafka import get_kafka_instance
from app.env import EnvironmentVariables
import asyncio
import requests
from app.core.models.message import Message

from dotenv import load_dotenv

from fastapi import Depends, FastAPI, Request

load_dotenv()


app = FastAPI(title='Kafka Publisher API')
kafka_server = Kafka(
    topic=EnvironmentVariables.KAFKA_TOPIC_NAME.get_env(),
    port=EnvironmentVariables.KAFKA_PORT.get_env(),
    servers=EnvironmentVariables.KAFKA_SERVER.get_env(),
)


@app.on_event("startup")
async def startup_event():
    await kafka_server.aioproducer.start()


@app.on_event("shutdown")
async def shutdown_event():
    await kafka_server.aioproducer.stop()


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.get('/')
def get_root():
    return {'message': 'API is running...'}

async def send(data: Message):
    try:
        topic_name = kafka_server._topic
        await kafka_server.aioproducer.send_and_wait(topic_name, json.dumps(data.dict()))
    except Exception as e:
        await kafka_server.aioproducer.stop()
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


@app.on_event("startup")
async def start_scheduled_task():
    asyncio.create_task(scheduled_task())


)
