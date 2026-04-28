from pydantic import BaseModel, Field
from typing import Optional


class RealEstateInput(BaseModel):
    """Real estate equity input section"""
    model_config = {"protected_namespaces": ()}
    
    total_property_value: float = Field(ge=0, description="Total estimated property value")
    total_outstanding_mortgages: float = Field(default=0.0, ge=0, description="Total outstanding mortgages")
    annual_appreciation_pct: float = Field(default=3.0, ge=0, le=100, description="Annual appreciation percentage")
    include_in_net_worth: bool = Field(True, description="Include in net worth projection")
    model_property_sale: Optional[bool] = Field(False, description="Model planned property sale")


class PropertySaleInput(BaseModel):
    """Property sale details - only visible when model_property_sale enabled"""
    age_of_sale: int = Field(description="Age when property is sold")
    amount_rolled_into_portfolio: float = Field(ge=0, description="Amount rolled into portfolio")
