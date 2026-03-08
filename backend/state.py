from typing import TypedDict, Optional

class AgentState(TypedDict):
    product:         str
    volume:          float
    country:         str
    supplier:        str
    cn_code:         Optional[str]
    confidence:      str
    category:        str
    cbam_covered:    bool
    emission_factor: Optional[float]
    emission_source: str
    ets_price:       float
    ets_source:      str
    total_emissions: float
    estimated_cost:  float
    risk_flag:       str
    status:          str
    reason:          str