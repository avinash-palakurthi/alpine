from state import AgentState

def reporting_node(state: AgentState) -> AgentState:
    # Just passes state through
    # Final report is generated in main.py
    return state
# ```

# ---

## Why Reporting is Simple Here
# ```
# Reporting agent works on ALL rows together
# not on a single row.

# Single row flow:
# → supervisor → classifier → scope → 
#   emission → ets → cost → reporting

# But final report needs ALL rows:
# → total cost
# → category breakdown  
# → top imports
# → readiness %

# So reporting_node just passes state through.
# main.py collects all results THEN
# calls the final report function.
