from langgraph.graph import StateGraph, END
from agents.supervisor import supervisor_node
from agents.classifier import classifier_node
from agents.scope import scope_node
from agents.emission import emission_node
from agents.ets import ets_node
from agents.cost import cost_node
from agents.reporting import reporting_node
from state import AgentState

# Create the graph
graph = StateGraph(AgentState)

# Add all agents as nodes
graph.add_node("supervisor", supervisor_node)
graph.add_node("classifier", classifier_node)
graph.add_node("scope",      scope_node)
graph.add_node("emission",   emission_node)
graph.add_node("ets",        ets_node)
graph.add_node("cost",       cost_node)
graph.add_node("reporting",  reporting_node)

# Entry point - always starts here
graph.set_entry_point("supervisor")

# Conditional edge after supervisor
# Decides which node to go to next
def after_supervisor(state: AgentState) -> str:
    if state["status"] == "skipped":
        return "reporting"    # no product/volume → skip everything
    if state["status"] == "fast_path":
        return "scope"        # cn code already provided → skip classifier
    return "classifier"       # normal path → needs classification

graph.add_conditional_edges("supervisor", after_supervisor)

# Conditional edge after scope
# If not covered → skip cost calculation
def after_scope(state: AgentState) -> str:
    if not state["cbam_covered"]:
        return "reporting"    # not in CBAM → no cost needed
    return "emission"         # covered → calculate cost

graph.add_conditional_edges("scope", after_scope)

# Fixed edges - always go in this order
graph.add_edge("classifier", "scope")
graph.add_edge("emission",   "ets")
graph.add_edge("ets",        "cost")
graph.add_edge("cost",       "reporting")
graph.add_edge("reporting",  END)

# Compile the graph
app_graph = graph.compile()