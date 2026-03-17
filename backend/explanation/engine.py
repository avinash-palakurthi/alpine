# engine.py
# Generates explanation for a single CBAM result

# ------------------------------------------
# SECTOR MAP
# key   = CN code prefix
# value = (sector name, cost reduction tip)
# ------------------------------------------
SECTOR_MAP = {
    "76": ("Aluminium",   "hydro-powered producers in Norway or Canada"),
    "72": ("Steel",       "electric arc furnace producers or certified green steel suppliers"),
    "73": ("Steel products", "low-carbon steel regions like Sweden or Germany"),
    "25": ("Cement",      "suppliers using alternative fuels or carbon capture"),
    "31": ("Fertilisers", "green ammonia producers"),
    "28": ("Hydrogen",    "green hydrogen suppliers"),
}

# ------------------------------------------
# HIGH RISK COUNTRIES
# ------------------------------------------
HIGH_RISK_COUNTRIES = ["russia", "china", "india", "ukraine", "belarus", "turkey"]

# ------------------------------------------
# ETS PRICE FALLBACK
# Must match ets.py → ETS_PRICE = 70.19
# ------------------------------------------
ETS_FALLBACK = 70.19


def generate_explanation(state):

    # Step 1: Read values from state
    hs_code      = state.get("cn_code", "") or ""
    emission     = state.get("emission_factor", 0) or 0
    quantity     = state.get("volume", 0) or 0
    country      = state.get("country", "") or ""
    cbam_status  = state.get("cbam_covered", False)
    carbon_price = state.get("ets_price", ETS_FALLBACK) or ETS_FALLBACK

    # -------------------------
    # CBAM EXPLANATION
    # -------------------------
    if cbam_status:
        if hs_code.startswith("76"):
            cbam_reason = f"CN Code {hs_code} is classified under Aluminium (CBAM Annex I)"
        elif hs_code.startswith("72") or hs_code.startswith("73"):
            cbam_reason = f"CN Code {hs_code} is classified under Iron & Steel (CBAM Annex I)"
        elif hs_code.startswith("25"):
            cbam_reason = f"CN Code {hs_code} is classified under Cement (CBAM Annex I)"
        elif hs_code.startswith("31"):
            cbam_reason = f"CN Code {hs_code} is classified under Fertilisers (CBAM Annex I)"
        elif hs_code.startswith("28"):
            cbam_reason = f"CN Code {hs_code} is classified under Hydrogen (CBAM Annex I)"
        else:
            cbam_reason = f"CN Code {hs_code} is covered under CBAM Annex I"
    else:
        cbam_reason = f"CN Code {hs_code} is not part of CBAM Annex I"

    # -------------------------
    # COST EXPLANATION
    # -------------------------
    if cbam_status:
        total_cost = emission * quantity * carbon_price
        cost_data = {
            "emission": emission,
            "quantity": quantity,
            "price":    carbon_price,
            "total":    round(total_cost, 2),
            "formula":  f"{emission} tCO₂/t × {quantity} t × €{carbon_price} = €{round(total_cost, 2):,}"
        }
    else:
        total_cost = 0
        cost_data = {
            "emission": emission,
            "quantity": quantity,
            "price":    carbon_price,
            "total":    0,
            "formula":  "Not applicable (non-CBAM product)"
        }

    # -------------------------
    # RISK EXPLANATION
    # -------------------------
    if not cbam_status:
        risk_level   = "LOW"
        risk_reasons = ["Product not covered under CBAM"]

    else:
        risk_score   = 0
        risk_reasons = []

        # Check emission intensity
        if emission > 8:
            risk_score += 3
            risk_reasons.append("Extremely high emission intensity (>8 tCO₂/ton)")
        elif emission > 2:
            risk_score += 2
            risk_reasons.append("High emission intensity (>2 tCO₂/ton)")

        # Check volume
        if quantity >= 10000:
            risk_score += 1
            risk_reasons.append("Large import volume (≥10,000 tonnes)")
        elif quantity >= 500:
            risk_score += 1
            risk_reasons.append("Moderate-to-large shipment volume (≥500 tonnes)")

        # Check country — use .lower() to avoid case mismatch
        if country.lower() in HIGH_RISK_COUNTRIES:
            risk_score += 2
            risk_reasons.append(f"Country risk: {country} (high carbon intensity region)")

        # Final risk level
        if risk_score >= 4:
            risk_level = "HIGH"
        elif risk_score >= 2:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

    # -------------------------
    # AI INSIGHT
    # Sector-specific, not hardcoded to aluminium
    # -------------------------
    if cbam_status:

        # Find which sector this CN code belongs to
        sector_name = None
        sector_tip  = None

        for prefix in SECTOR_MAP:
            if hs_code.startswith(prefix):
                sector_name, sector_tip = SECTOR_MAP[prefix]
                break

        # Build insight based on sector
        if sector_name and sector_tip:
            ai_insight = (
                f"This {sector_name} shipment of {int(quantity)} tonnes "
                f"with emission intensity {emission} tCO₂/ton "
                f"creates a CBAM exposure of ~€{int(total_cost):,}. "
                f"Consider sourcing from {sector_tip} to reduce costs."
            )
        else:
            # Fallback for unknown sector
            ai_insight = (
                f"This shipment of {int(quantity)} tonnes "
                f"with emission intensity {emission} tCO₂/ton "
                f"creates a CBAM exposure of ~€{int(total_cost):,}. "
                f"Review supplier emission certificates to verify carbon intensity."
            )
    else:
        ai_insight = "No CBAM impact for this product."

    # -------------------------
    # CONFIDENCE
    # -------------------------
    if cbam_status:
        if emission > 0 and quantity > 0:
            confidence = "high"
        else:
            confidence = "medium"
    else:
        confidence = "low"

    # -------------------------
    # FINAL OUTPUT
    # -------------------------
    return {
        "cbam": {
            "status": cbam_status,
            "reason": cbam_reason
        },
        "cost": cost_data,
        "risk": {
            "level":   risk_level,
            "reasons": risk_reasons
        },
        "ai_insight": ai_insight,
        "confidence": confidence
    }