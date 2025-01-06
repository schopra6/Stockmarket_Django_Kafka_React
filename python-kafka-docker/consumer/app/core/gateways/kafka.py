from aiokafka import AIOKafkaConsumer


class KafkaConsumer:
    instance = None

    def __init__(
        self,
        topic,
        port,
        servers
    ) -> None:
        self._topic = topic
        self._port = port
        self._servers = servers
        self.aioconsumer = self.create_kafka()
        KafkaConsumer.instance = self

    def create_kafka(self):
        return AIOKafkaConsumer(self._topic,
            bootstrap_servers=f'{self._servers}:{self._port}',
            group_id="my-group"
        )
#TODO remove group id