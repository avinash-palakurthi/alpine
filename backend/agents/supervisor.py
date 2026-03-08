from state import AgentState

def supervisor_node(state: AgentState) -> AgentState:

    # Column mapping
    product_columns  = ["product_description", "product", "description", "item", "goods"]
    volume_columns   = ["volume_tonnes", "volume", "weight", "quantity", "tonnes"]
    country_columns  = ["country_of_origin", "country", "origin", "exporting_country"]
    supplier_columns = ["supplier", "supplier_name", "vendor", "manufacturer"]
    cn_code_columns  = ["cn_code", "hs_code", "commodity_code"]

    def find_value(data, columns):
        for col in columns:
            if col in data and data[col]:
                return data[col]
        return None

    product  = find_value(state, product_columns)  or state["product"]
    volume   = find_value(state, volume_columns)   or state["volume"]
    country  = find_value(state, country_columns)  or state["country"]
    supplier = find_value(state, supplier_columns) or state["supplier"]
    cn_code  = find_value(state, cn_code_columns)  or state["cn_code"]

    # Skip if no product
    if not product:
        state["status"] = "skipped"
        state["reason"] = "no product description found"
        return state

    # Skip if no volume
    if not volume or float(volume) <= 0:
        state["status"] = "skipped"
        state["reason"] = "no volume found"
        return state

    # Update state
    state["product"]  = str(product)
    state["volume"]   = float(volume)
    state["country"]  = str(country)
    state["supplier"] = str(supplier)

    # Fast path if CN code already provided
    if cn_code:
        state["cn_code"] = str(cn_code)
        state["status"]  = "fast_path"
        return state

    # Normal path
    state["status"] = "process"
    return state