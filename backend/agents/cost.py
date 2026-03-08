from state import AgentState

# High risk countries
HIGH_RISK_COUNTRIES = ["russia", "china", "india", "belarus", "ukraine"]

def cost_node(state: AgentState) -> AgentState:

    # If no emission factor, cannot calculate
    if not state["emission_factor"]:
        state["total_emissions"] = 0.0
        state["estimated_cost"]  = 0.0
        state["risk_flag"]       = "unknown"
        return state

    # Core CBAM formula
    # volume x emission factor x ETS price
    total_emissions = state["volume"] * state["emission_factor"]
    estimated_cost  = total_emissions * state["ets_price"]

    # Round to 2 decimal places
    state["total_emissions"] = round(total_emissions, 2)
    state["estimated_cost"]  = round(estimated_cost, 2)

    # Risk flag
    if state["country"].lower() in HIGH_RISK_COUNTRIES:
        state["risk_flag"] = "high"
    elif state["estimated_cost"] > 50000:
        state["risk_flag"] = "high"
    elif state["estimated_cost"] > 10000:
        state["risk_flag"] = "medium"
    else:
        state["risk_flag"] = "low"

    return state