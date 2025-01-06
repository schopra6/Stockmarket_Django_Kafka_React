from typing import Optional

from pydantic import BaseModel


class Message(BaseModel):
    data: dict
    description: Optional[str] = None
