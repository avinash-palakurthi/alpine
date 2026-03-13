from state import AgentState

def supervisor_node(state: AgentState) -> AgentState:

    product_columns  = ["product_description", "product", "description", "item", "goods"]
    volume_columns   = ["volume_tonnes", "volume", "weight", "quantity", "tonnes", "weight_tonnes"]
    country_columns  = ["country_of_origin", "country", "origin", "exporting_country", "supplier_country"]
    supplier_columns = ["supplier", "supplier_name", "vendor", "manufacturer"]
    cn_code_columns  = ["cn_code", "hs_code", "commodity_code"]

    def clean(val):
        if val is None:
            return None
        s = str(val).strip().lower()
        if s in ["nan", "none", "", "n/a", "na", "null"]:
            return None
        return str(val).strip()

    def find_value(data, columns):
        for col in columns:
            if col in data:
                val = clean(data[col])
                if val:
                    return val
        return None

    product  = find_value(state, product_columns)  or clean(state.get("product"))
    volume   = find_value(state, volume_columns)   or clean(state.get("volume"))
    country  = find_value(state, country_columns)  or clean(state.get("country"))
    supplier = find_value(state, supplier_columns) or clean(state.get("supplier"))
    cn_code  = find_value(state, cn_code_columns)  or clean(state.get("cn_code"))

    # Skip if no product
    if not product:
        state["status"] = "skipped"
        state["reason"] = "no product description found"
        return state

    # Skip if no volume
    try:
        vol = float(volume) if volume else 0
    except:
        vol = 0

    if vol <= 0:
        state["status"] = "skipped"
        state["reason"] = "no volume found"
        return state

    # Update state
    state["product"]  = product
    state["volume"]   = vol
    state["country"]  = country or "unknown"
    state["supplier"] = supplier or "unknown"

    # Fast path only if CN code is real
    if cn_code:
        state["cn_code"] = cn_code
        state["status"]  = "fast_path"
        return state

    # Full classification
    state["status"] = "process"
    return state
