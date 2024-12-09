r"""°°°
# Commercial Property Transactions Data Cleaning and Transformation
°°°"""

# |%%--%%| <UtGnzfab3R|N8l0iHykbG>

# Imports
import pandas as pd
import re
from ydata_profiling import ProfileReport


# |%%--%%| <N8l0iHykbG|3AkMOwRoCi>

# Configuration
pd.set_option("display.max_columns", None)  # Show all columns
pd.set_option("display.width", 1000)  # Increase display width
pd.set_option(
    "display.float_format",
    lambda x: "{:,.0f}".format(x) if isinstance(x, (int, float)) else str(x),
)


# |%%--%%| <3AkMOwRoCi|GmKXbkT3WP>

filepath = "./public/data/CommercialTrans_201910 to 202410.csv"
df = pd.read_csv(filepath)

# |%%--%%| <GmKXbkT3WP|erUh7DZuvx>

profile = ProfileReport(df, title="Profiling Report")
profile.to_file("before.html")

# |%%--%%| <erUh7DZuvx|zFfwmBk5pS>
r"""°°°
Known issues:
- Dataset has 41 (1.2%) duplicate rows
- Need to convert Transacted Price ($) to int
- Need to convert Unit Price ($) to int
- Remove Area (SQFT) and Unit Price ($ PSF) as we measure in meters
- Need to convert Sale Date to date. current format is (month-year): (oct-21)
  - May include Uppercase characters.
- Area (SQM) to float
- Cast Unit Price ($ PSM) to int
- Tenure needs their info extracted. Example: "99 yrs lease commencing from 1997" and "Freehold"
- Floor level needs their info extracted. Example: "01 to 05"
- Project name includes string "n.a"

Notes:
In Type of Area, Strata refers to Condo, HDB, Shops and other apartment.
In Type of Area, Land refers to landed properties.
Should put a tooltip during visualization about this.
Within visual, convert -5 and -1 in floor levels to B5 and B1
°°°"""
# |%%--%%| <zFfwmBk5pS|QBQg7uP0Zv>

print(f"Before removing duplicates: {len(df)}")
df = df.drop_duplicates()
print(f"After removing duplicates: {len(df)}")

# |%%--%%| <QBQg7uP0Zv|Bd07CYJowS>

# Drop redundant columns
columns_to_drop = ["Area (SQFT)", "Unit Price ($ PSF)"]
df = df.drop(columns=columns_to_drop)

# |%%--%%| <Bd07CYJowS|kh7bq9mtYp>

# Casting:

# convert price columns
df["Transacted Price ($)"] = (
    df["Transacted Price ($)"].str.replace("$", "").str.replace(",", "").astype(int)
)
df["Unit Price ($ PSM)"] = (
    df["Unit Price ($ PSM)"].str.replace("$", "").str.replace(",", "").astype(int)
)
# convert area
df["Area (SQM)"] = df["Area (SQM)"].str.replace(",", "").astype(float)

# convert dates
df["Sale Date"] = pd.to_datetime(df["Sale Date"].str.lower(), format="%b-%y")

# |%%--%%| <kh7bq9mtYp|MoKosJ0UBC>


def extract_tenure_info(tenure):
    if pd.isna(tenure):
        return "Unknown", None
    elif "freehold" in tenure.lower():
        return "Freehold", None
    else:
        years = int(tenure.split()[0])
        return "Leasehold", years


df[["Tenure Type", "Lease Years"]] = df["Tenure"].apply(
    lambda x: pd.Series(extract_tenure_info(x))
)

# |%%--%%| <MoKosJ0UBC|wtBG8uKwla>


def extract_floor_levels(floor_str):
    if pd.isna(floor_str) or floor_str == "-":
        return pd.NA, pd.NA
    elif floor_str.startswith("B"):
        nums = re.findall(r"B(\d+)\s+to\s+B(\d+)", floor_str)
        if nums:
            return -int(nums[0][0]), -int(nums[0][1])
        return pd.NA, pd.NA
    else:
        nums = re.findall(r"(\d+)\s+to\s+(\d+)", floor_str)
        if nums:
            return int(nums[0][0]), int(nums[0][1])
        return pd.NA, pd.NA


df[["Floor Min", "Floor Max"]] = df["Floor Level"].apply(
    lambda x: pd.Series(extract_floor_levels(x))
)

# |%%--%%| <wtBG8uKwla|lTfYqwTvmo>


def assign_floor_category(row):
    if pd.isna(row["Floor Min"]):
        return "Unknown"
    elif row["Floor Min"] < 0:
        return "Basement"
    elif row["Floor Min"] <= 5:
        return "01-05"
    elif row["Floor Min"] <= 10:
        return "06-10"
    elif row["Floor Min"] <= 15:
        return "11-15"
    elif row["Floor Min"] <= 20:
        return "16-20"
    else:
        return "21+"


df["Floor Category"] = df.apply(assign_floor_category, axis=1)

# |%%--%%| <lTfYqwTvmo|iVjdoilDpM>

columns_to_drop = ["Floor Level", "Tenure"]
df = df.drop(columns=columns_to_drop)

# |%%--%%| <iVjdoilDpM|6LgyKsmo9S>

# Add transaction year and month columns
df["Transaction Year"] = df["Sale Date"].dt.year
df["Transaction Month"] = df["Sale Date"].dt.month

# |%%--%%| <6LgyKsmo9S|DTtc1AwbRm>

# Convert string "n.a" to actual NA.
df.loc[df["Project Name"].str.lower().str.contains("n.a"), "Project Name"] = pd.NA

# |%%--%%| <DTtc1AwbRm|IuQyHRUcKx>

from ydata_profiling import ProfileReport

profile = ProfileReport(df, title="Profiling Report")
profile.to_file("after.html")

# |%%--%%| <IuQyHRUcKx|G4KW1JQQiM>

# Save cleaned dataset
output_filepath = "./public/data/clean_property.csv"
df.to_csv(output_filepath, index=False)
print(f"Cleaned dataset saved to: {output_filepath}")
print(f"Number of rows: {len(df)}")
print(f"Number of columns: {len(df.columns)}")

# |%%--%%| <G4KW1JQQiM|uZYOJzRrRX>


output_filepath = "./public/data/clean_property.csv"
df = pd.read_csv(output_filepath)
df.info()

# |%%--%%| <uZYOJzRrRX|pB7ZJkm65t>
