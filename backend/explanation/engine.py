def generate_explanation(state):
    hs_code = state.get("cn_code", "")
    emission = state.get("emission_factor", 0) or 0
    quantity = state.get("volume", 0) or 0
    country = state.get("country", "")
    cbam_status = state.get("cbam_covered", False)
    carbon_price = state.get("ets_price", 85) or 85

    # -------------------------
    # CBAM EXPLANATION
    # -------------------------
    if cbam_status:
        if hs_code.startswith("76"):
            cbam_reason = f"CN Code {hs_code} is classified under Aluminium (CBAM Annex I)"
        elif hs_code.startswith(("72", "73")):
            cbam_reason = f"CN Code {hs_code} is classified under Iron & Steel (CBAM Annex I)"
        elif hs_code.startswith("25"):
            cbam_reason = f"CN Code {hs_code} is classified under Cement (CBAM Annex I)"
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
            "price": carbon_price,
            "total": total_cost,
            "formula": f"{emission} × {quantity} × {carbon_price}"
        }
    else:
        total_cost = 0
        cost_data = {
            "emission": emission,
            "quantity": quantity,
            "price": carbon_price,
            "total": 0,
            "formula": "Not applicable (non-CBAM product)"
        }

    # -------------------------
    # RISK EXPLANATION
    # -------------------------
    if not cbam_status:
        risk_level = "LOW"
        risk_reasons = ["Product not covered under CBAM"]
    else:
        risk_score = 0
        risk_reasons = []

        if emission > 8:
            risk_score += 3
            risk_reasons.append("Extremely high emission intensity (>8 tCO₂/ton)")
        elif emission > 2:
            risk_score += 2
            risk_reasons.append("High emission intensity (>2 tCO₂/ton)")

        if quantity >= 10000:
            risk_score += 1
            risk_reasons.append("Large import volume")
        elif quantity >= 500:
            risk_reasons.append("Moderate-to-large shipment volume")

        if country in ["Russia", "China"]:
            risk_score += 2
            risk_reasons.append(f"Country risk: {country}")

        if risk_score >= 4:
            risk_level = "HIGH"
        elif risk_score >= 2:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

    # -------------------------
    # AI INSIGHT
    # -------------------------
    if cbam_status:
        ai_insight = (
            f"This shipment of {int(quantity)} tonnes with emission intensity {emission} tCO₂/ton "
            f"creates a CBAM cost exposure (~€{int(total_cost):,}). "
            "Aluminium production is highly carbon-intensive. Sourcing from low-carbon regions (e.g., hydro-powered producers) could significantly reduce CBAM costs."
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
            "level": risk_level,
            "reasons": risk_reasons
        },
        "ai_insight": ai_insight,
        "confidence": confidence
    }