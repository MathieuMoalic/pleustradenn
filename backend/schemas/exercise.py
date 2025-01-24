from typing import Optional
from pydantic import BaseModel, ConfigDict


# Shared properties
class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None  # e.g., strength, cardio
    muscle_group: Optional[str] = None
    equipment: Optional[str] = None


# Properties to receive via API on creation
class ExerciseCreate(ExerciseBase):
    pass


# Properties to receive via API on update
class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    muscle_group: Optional[str] = None
    equipment: Optional[str] = None


# Properties to return via API
class ExerciseRead(ExerciseBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

