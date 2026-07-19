from pathlib import Path
import csv


REQUIRED = {"station_id", "station_name", "brand", "latitude", "longitude", "operational_status", "maps_url_type"}


def validate(path: Path) -> list[str]:
    issues: list[str] = []
    warnings: list[str] = []
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        missing = REQUIRED - set(reader.fieldnames or [])
        if missing:
            issues.append(f"Missing required columns: {sorted(missing)}")
        for index, row in enumerate(reader, start=2):
            try:
                lat = float(row.get("latitude") or "")
                lon = float(row.get("longitude") or "")
                if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                    warnings.append(f"Row {index}: invalid coordinate range; importer will skip")
            except ValueError:
                warnings.append(f"Row {index}: latitude/longitude not numeric; importer will skip")
            if (row.get("operational_status") or "").lower() == "available now":
                issues.append(f"Row {index}: research station cannot claim available now")
    return issues + warnings


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    source = root.parent / "station-research" / "google-maps-verified" / "ALL_STATIONS_GOOGLE_MAPS_VERIFIED.csv"
    problems = validate(source)
    hard_errors = [problem for problem in problems if "Missing required columns" in problem or "available now" in problem]
    if problems:
        print("\n".join(problems[:100]))
    if hard_errors:
        raise SystemExit(1)
    print(f"Validated station data: {source}")
