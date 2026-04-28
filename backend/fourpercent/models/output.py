from pydantic import BaseModel, Field
from typing import Literal


class OutputPreferencesInput(BaseModel):
    """Output preferences input section"""
    display_mode: Literal["chart", "table", "both"] = Field("both", description="Display mode")
    success_threshold: Literal["portfolio_gt_zero", "portfolio_gt_floor"] = Field("portfolio_gt_zero", description="Success threshold")
