import datetime

from pydantic import BaseModel, ConfigDict
from sqlmodel import Field, Relationship, SQLModel

##############################
############ User ############
##############################


class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    sessions: list["Session"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete", "lazy": "selectin"},
    )


class UserBase(BaseModel):
    username: str


class UserCreate(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None


class UserRead(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


##############################
########## Exercise ##########
##############################


class Exercise(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True, unique=True)
    notes: str = Field(default="")

    session_exercises: list["SessionExercise"] = Relationship(
        back_populates="exercise",
        sa_relationship_kwargs={"cascade": "all, delete", "lazy": "selectin"},
    )


class ExerciseBase(BaseModel):
    name: str
    notes: str


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(BaseModel):
    name: str | None = None
    notes: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ExerciseRead(ExerciseBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


##############################
########## Session ###########
##############################


class Session(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    date: datetime.date = Field(default=datetime.date.today)
    notes: str = Field(default="")

    user: "User" = Relationship(
        back_populates="sessions",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    session_exercises: list["SessionExercise"] = Relationship(
        back_populates="session",
        sa_relationship_kwargs={"cascade": "all, delete", "lazy": "selectin"},
    )


class SessionBase(BaseModel):
    date: datetime.date
    notes: str


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    date: datetime.date | None = None
    notes: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SessionReadDetailed(SessionBase):
    id: int
    session_exercises: list["SessionExerciseRead"] = []

    model_config = ConfigDict(from_attributes=True)


class SessionReadBasic(BaseModel):
    id: int
    user_id: int
    notes: str

    model_config = ConfigDict(from_attributes=True)


##############################
###### SessionExercise #######
##############################


class SessionExercise(SQLModel, table=True):
    id: int = Field(primary_key=True)
    session_id: int = Field(foreign_key="session.id")
    exercise_id: int = Field(foreign_key="exercise.id")

    sets: int = Field(default=1)
    reps: int = Field(default=1)
    weight: float = Field(default=0.0)
    rest_seconds: int = Field(default=60)
    count: int = Field(default=0)

    session: "Session" = Relationship(
        back_populates="session_exercises",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    exercise: "Exercise" = Relationship(
        back_populates="session_exercises",
        sa_relationship_kwargs={"lazy": "selectin"},
    )


class SessionExerciseBase(BaseModel):
    session_id: int
    exercise_id: int

    sets: int
    reps: int
    weight: float
    rest_seconds: int
    count: int


class SessionExerciseCreate(SessionExerciseBase):
    pass


class SessionExerciseUpdate(BaseModel):
    sets: int | None = None
    reps: int | None = None
    weight: float | None = None
    rest_seconds: int | None = None
    count: int | None = None

    model_config = ConfigDict(from_attributes=True)


class SessionExerciseRead(SessionExerciseBase):
    id: int
    exercise_name: str
    model_config = ConfigDict(from_attributes=True)
