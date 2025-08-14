import csv
import io

def clean_csv(file_buffer):
    """
    Cleans a raw CSV file and returns a Pandas-compatible buffer.
    Strips whitespace, removes empty columns, skips incomplete rows.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    file_buffer.seek(0)
    reader = csv.reader(io.StringIO(file_buffer.read().decode("utf-8", errors="ignore")))

    for row in reader:
        cleaned_row = [cell.strip() for cell in row if cell.strip()]
        if len(cleaned_row) < 4:
            continue
        writer.writerow(cleaned_row)

    output.seek(0)
    return output
