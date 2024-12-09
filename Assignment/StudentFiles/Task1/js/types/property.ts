export interface PropertyTransaction {
  "Project Name": string | null;
  "Street Name": string;
  "Property Type": string;
  "Transacted Price ($)": number;
  "Sale Date": Date; // or Date if you convert it
  "Type of Area": string;
  "Area (SQM)": number;
  "Unit Price ($ PSM)": number;
  "Postal District": number;
  "District Name": string;
  "Tenure Type": string;
  "Lease Years": number | null;
  "Floor Min": number | null; // convert negative to positive and add B
  "Floor Max": number | null; // convert negative to positive and add B
  "Floor Category": string;
  "Transaction Year": number;
  "Transaction Month": number;
}

export interface ProcessedPropertyTransaction extends PropertyTransaction {
  priceRange: string;
  areaRange: string;
}
