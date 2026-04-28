from fourpercent.models.timeline import TimelineInput
from fourpercent.models.assets import CurrentAssetsInput
from fourpercent.models.portfolio import PortfolioAllocationInput, HistoricalYearInput
from fourpercent.models.spending import SpendingStrategyInput
from .income_streams import (
    IncomeStreamsInput,
    SocialSecurityInput,
    PensionInput,
    OneTimeBenefitInput,
    RentalPropertyInput
)
from .real_estate import RealEstateInput, PropertySaleInput
from .education import EducationInput, EducationExpenseInput
from .output import OutputPreferencesInput
from .health import HealthDataInput, HealthDataOutput
from .debt import DebtInput, DebtOutput
from .root import RetirementInput, RetirementResponse

__all__ = [
    "TimelineInput",
    "CurrentAssetsInput",
    "PortfolioAllocationInput",
    "HistoricalYearInput",
    "SpendingStrategyInput",
    "IncomeStreamsInput",
    "SocialSecurityInput",
    "PensionInput",
    "OneTimeBenefitInput",
    "RentalPropertyInput",
    "RealEstateInput",
    "PropertySaleInput",
    "EducationInput",
    "EducationExpenseInput",
    "OutputPreferencesInput",
    "RetirementInput",
    "RetirementResponse",
    "HealthDataInput",
    "HealthDataOutput",
    "DebtInput",
    "DebtOutput",
]
