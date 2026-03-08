from state import AgentState
import pandas as pd
import os

# Load CSV once when app starts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "cbam_hscode.csv")

cbam_df = pd.read_csv(CSV_PATH)
cbam_df.columns = cbam_df.columns.str.lower().str.strip()

# Remove duplicate header rows if any
cbam_df = cbam_df[cbam_df["cn_code"] != "CN_Code"]

print(f"Scope Agent: loaded {len(cbam_df)} CN codes")
print(f"Columns: {list(cbam_df.columns)}")

def scope_node(state: AgentState) -> AgentState:

    cn_code = state["cn_code"]

    # No CN code
    if not cn_code or cn_code == "unknown":
        state["cbam_covered"] = False
        return state

    cn_code = str(cn_code).strip()

    # Exact match
    match = cbam_df[
        cbam_df["cn_code"].astype(str).str.strip() == cn_code
    ]

    if not match.empty:
        state["cbam_covered"] = True
        state["category"]     = str(match.iloc[0]["description"])
        return state

    # Partial match (first 4 digits)
    short_code = cn_code[:4]
    partial = cbam_df[
        cbam_df["cn_code"].astype(str).str.startswith(short_code)
    ]

    if not partial.empty:
        state["cbam_covered"] = True
        state["category"]     = str(partial.iloc[0]["description"])
        return state

    # Not covered
    state["cbam_covered"] = False
    return state