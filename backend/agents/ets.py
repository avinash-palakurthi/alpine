from state import AgentState

# ETS Price — hardcoded for MVP
# Source: EU Carbon Permits (EUR)
# Last updated: March 2026
# Update this number manually when needed
ETS_PRICE = 70.19

async def ets_node(state: AgentState) -> AgentState:
    state["ets_price"]  = ETS_PRICE
    state["ets_source"] = "static - March 2026"
    return state
# ```

# ---

# Delete all the cache and API logic for now. When Phase 2 comes we add live price properly with a reliable source.

# MVP rule:
# ```
# Simple + working > Complex + broken