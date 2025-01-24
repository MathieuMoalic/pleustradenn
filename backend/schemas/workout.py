from typing import Optional
import datetime
from pydantic import BaseModel, ConfigDict


# Shared properties
class WorkoutBase(BaseModel):
    user_id: int
    date: Optional[datetime.date] = None
    notes: Optional[str] = None


# Properties to receive via API on creationz
class WorkoutCreate(WorkoutBase):
    pass


# Properties to receive via API on update
class WorkoutUpdate(BaseModel):
    user_id: Optional[int] = None
    date: Optional[datetime.date] = None
    notes: Optional[str] = None


# Properties to return via API
class WorkoutRead(WorkoutBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
