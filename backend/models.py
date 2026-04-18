from sqlalchemy import Column, Integer, String
from database import Base

class InteractionDB(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, default="")
    interaction_type = Column(String, default="")
    summary = Column(String, default="")
    sentiment = Column(String, default="")