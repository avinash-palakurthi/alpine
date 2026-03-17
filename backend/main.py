from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pipeline import app_graph, AgentState
from explanation.engine import generate_explanation
from agents.pdf_report import generate_pdf
import pandas as pd
import asyncio
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store last report in memory
last_report = {}

@app.get("/")
def home():
    return {"message": "AlpineScope AI Engine is running"}

def generate_report(results: list) -> dict:

    covered     = [r for r in results if r.get("cbam_covered")]
    not_covered = [r for r in results if not r.get("cbam_covered")]
    skipped     = [r for r in results if r.get("status") == "skipped"]

    total_cost      = round(sum(r.get("estimated_cost", 0) for r in covered), 2)
    total_emissions = round(sum(r.get("total_emissions", 0) for r in covered), 2)

    total_rows = len(results)
    readiness  = round((len(not_covered) / total_rows) * 100, 1) if total_rows > 0 else 0.0

    category_costs = {}
    for r in covered:
        category = r.get("category", "unknown")
        cost     = r.get("estimated_cost", 0)
        category_costs[category] = round(
            category_costs.get(category, 0) + cost, 2
        )

    top_imports = sorted(
        covered,
        key=lambda x: x.get("estimated_cost", 0),
        reverse=True
    )[:5]

    risk_summary = {
        "high":   len([r for r in covered if r.get("risk_flag") == "high"]),
        "medium": len([r for r in covered if r.get("risk_flag") == "medium"]),
        "low":    len([r for r in covered if r.get("risk_flag") == "low"])
    }

    return {
        "total_rows":        total_rows,
        "total_covered":     len(covered),
        "total_not_covered": len(not_covered),
        "total_skipped":     len(skipped),
        "total_cost":        total_cost,
        "total_emissions":   total_emissions,
        "cbam_readiness":    readiness,
        "category_costs":    category_costs,
        "top_imports":       top_imports,
        "risk_summary":      risk_summary,
        "results":           results
    }

async def process_single_row(row: dict) -> dict:

    def find_value(data, columns):
        for col in columns:
            if col in data and data[col]:
                return data[col]
        return None

    product_columns  = ["product_description", "product", "description", "item", "goods", "importer", "shipment_id"]
    volume_columns   = ["volume_tonnes", "volume", "weight", "quantity", "tonnes", "weight_tonnes"]
    country_columns  = ["country_of_origin", "country", "origin", "exporting_country", "supplier_country"]
    supplier_columns = ["supplier", "supplier_name", "vendor", "manufacturer", "importer"]
    cn_code_columns  = ["cn_code", "hs_code", "commodity_code"]

    product  = find_value(row, product_columns) or ""
    volume   = find_value(row, volume_columns)  or 0
    country  = find_value(row, country_columns) or "unknown"
    supplier = find_value(row, supplier_columns) or "unknown"
    cn_code  = find_value(row, cn_code_columns)

    state = AgentState(
        product         = str(product),
        volume          = float(volume),
        country         = str(country),
        supplier        = str(supplier),
        cn_code         = str(cn_code) if cn_code else None,
        confidence      = "low",
        category        = "unknown",
        cbam_covered    = False,
        emission_factor = None,
        emission_source = "not found",
        ets_price       = 85.0,
        ets_source      = "static",
        total_emissions = 0.0,
        estimated_cost  = 0.0,
        risk_flag       = "unknown",
        status          = "process",
        reason          = ""
    )

    result = await app_graph.ainvoke(state)

    if isinstance(result, dict):
        return result
    return result.dict()

@app.post("/process")
async def process_file(file: UploadFile = File(...)):
    global last_report

    contents = await file.read()

    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(contents))
    else:
        df = pd.read_excel(io.BytesIO(contents))

    df.columns = df.columns.str.lower().str.strip()
    rows = df.to_dict(orient="records")

    print(f"Total rows: {len(rows)}")

    batches = []
    for i in range(0, len(rows), 50):
        batches.append(rows[i:i+50])

    all_results = []

    for batch_num, batch in enumerate(batches):
        print(f"Batch {batch_num + 1}/{len(batches)}")

        batch_results = await asyncio.gather(
            *[process_single_row(row) for row in batch],
            return_exceptions=True
        )

        for i, result in enumerate(batch_results):
            if isinstance(result, Exception):
                batch_results[i] = {
                    "product":        str(batch[i]),
                    "status":         "error",
                    "reason":         str(result),
                    "cbam_covered":   False,
                    "estimated_cost": 0.0
                }

        all_results.extend(batch_results)

        if batch_num < len(batches) - 1:
            await asyncio.sleep(1)

    # Generate and save report
    last_report = generate_report(all_results)

    return last_report

@app.get("/report/pdf")
async def download_pdf():
    if not last_report:
        return {"error": "No report generated yet. Upload a file first."}

    pdf_bytes = generate_pdf(last_report)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=cbam_report.pdf"}
    )

# Explanation
@app.get("/explain/{index}")
def explain(index: int):
    if not last_report:
        return {"error": "No report available. Upload a file first."}

    results = last_report.get("results", [])

    if index < 0 or index >= len(results):
        return {"error": "Invalid index"}

    state = results[index]

    explanation = generate_explanation(state)

    return {
        "data": state,
        "explanation": explanation
    }