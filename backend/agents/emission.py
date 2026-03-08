from state import AgentState
import pandas as pd
import os

# Load CSV once when app starts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "cbam_master_2026.csv")

emission_df = pd.read_csv(CSV_PATH)
emission_df.columns = emission_df.columns.str.lower().str.strip()

# Rename to standard column name
# Your CSV has Total_2026 as emission factor
emission_df = emission_df.rename(columns={"total_2026": "emission_factor"})

# Remove duplicate header rows if any
emission_df = emission_df[emission_df["cn_code"] != "CN_Code"]

print(f"Emission Agent: loaded {len(emission_df)} emission factors")
print(f"Columns: {list(emission_df.columns)}")

# EU default fallback values
EU_DEFAULTS = {
    "72": 2.21,   # Steel
    "73": 2.21,   # Steel products
    "76": 10.5,   # Aluminium
    "25": 0.498,  # Cement
    "31": 3.0,    # Fertilizers
    "28": 3.0,    # Hydrogen
}

def emission_node(state: AgentState) -> AgentState:

    cn_code = state["cn_code"]

    if not cn_code or cn_code == "unknown":
        state["emission_factor"] = None
        state["emission_source"] = "not found"
        return state

    cn_code = str(cn_code).strip()

    # Exact match
    match = emission_df[
        emission_df["cn_code"].astype(str).str.strip() == cn_code
    ]

    if not match.empty:
        state["emission_factor"] = float(match.iloc[0]["emission_factor"])
        state["emission_source"] = "exact match"
        return state

    # Partial match
    short_code = cn_code[:4]
    partial = emission_df[
        emission_df["cn_code"].astype(str).str.startswith(short_code)
    ]

    if not partial.empty:
        state["emission_factor"] = float(partial.iloc[0]["emission_factor"])
        state["emission_source"] = "partial match"
        return state

    # EU default fallback
    for prefix, default_factor in EU_DEFAULTS.items():
        if cn_code.startswith(prefix):
            state["emission_factor"] = default_factor
            state["emission_source"] = "EU default fallback"
            return state

    # Nothing found
    state["emission_factor"] = None
    state["emission_source"] = "not found"
    return state