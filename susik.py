from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

engine = create_engine("sqlite:///tasks4.db")
Session = sessionmaker(bind=engine)
Base = declarative_base()
class Task(Base):
    __tablename__ = "task4"
    id = Column(Integer, primary_key=True, autoincrement=True)
    number =  Column(Integer)
    task = Column(String, unique=True)
    answer = Column(String)
    explain = Column(String)
Base.metadata.create_all(engine)