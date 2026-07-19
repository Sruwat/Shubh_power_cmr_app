from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.app.services.stations import import_station_csv


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    source = root.parent / "station-research" / "google-maps-verified" / "ALL_STATIONS_GOOGLE_MAPS_VERIFIED.csv"
    count = import_station_csv(source)
    print(f"Imported {count} station rows from {source}")
