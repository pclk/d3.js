# actionable script
**1. Introduction (0:00 - 0:45):**

> "Hi, I'm Wei Heng. This dashboard visualizes Singapore commercial property trends using D3, HTML, TailwindCSS, and Typescript.

(hover the Sales Date filter)

> You can filter by time from October 2019 to 2024,

(hover the price filter)

> price ranging from $120 thousand to $1.28 billion SGD,

(hover the area filter)

> and area from 5 to 61 thousand square meters.

(Audience needs a quick view of all items. Then return back to heatmap)

> The slider ticks show data distribution, indicating right-skewed distributions for price and area. Configurable axes and a 'Group By' filter further increases flexibility in our analysis. We'll analyze a heat map, time series graph, distribution chart, and stacked bar chart. Let's start with the heat map."

**2. Heat Map Analysis (0:45 - 1:45):**

> "The heat map visualizes average transaction prices by district and property type. 

(Hover Pasir Panjang office area)

> Offices in Pasir Panjang are a clear hotspot, averaging $53 million.

(Hover Jurong > Choa Chu Kang)

> Retails in Jurong and Choa Chu Kang also show high prices, averaging $32 to $45 million. 

(Change Group by to 'Average Area'. Hover Pasir Panjang)

> The ‘Average Area’ configuration reveals that Pasir Panjang also has large office areas, 

(Change Group by to 'Price per SQM'. Hover Raffles Place Shop Houses)

> possibly indicating large transactions that may be skewing the average. The ‘Price per SQM’ configuration shows that Raffles Place has high price per area for Shop Houses, 

(Hover Pasir Panjang Offices)

> possibly due to the central location. Surprisingly, Pasir Panjang also shows a low price per area, indicating that the large office purchase previously discussed may be a good deal. 

(Briefly hover Shop Houses in Choa Chu Kang, Kranji, and Pasir Panjang Offices, Prepare for transition to the time series chart.)

> Therefore, investors seeking good value per area, can consider Shop Houses in Choa Chu Kang, Kranji, and Pasir Panjang Offices. Let's move to the time series graph."

**3. Time Series Analysis (1:45 - 2:45):**

(Transition to the time series chart, with Log scale of Price as the selected option)

> "The time series chart tracks *Log scale of Price* over time,

(hover the gentle dip in mid-2020)

> revealing a relatively consistent market with a gentle dip in mid-2020 due to the pandemic, followed by a slow recovery.

(Change axis to "Area (log)". Hover on the line)

> The time series of the Log scale of Area also shows similar results,

(Change axis to 'Price over Area'. Hover around the trend)

> and the ‘Price over Area’ scatter plot configuration demonstrates that larger areas tend to fetch higher prices.

(hover the current price then hover the 2022 peak)

> Given that the current prices are lower than the 2022 peaks, this may be a good time to buy, and especially due to the stable price over time, this can mean minimal risk, but slower growth than other investment options. 

(Prepare to move to the Distribution chart)

**4. Distribution Chart Analysis (2:45 - 3:45):**

(Transition to the distribution chart)

> "The distribution chart visualizes price spreads by different factors.

(Hover on the office distribution > Retail distribution > Shop Houses distribution)

> Price over Property Type shows that Office spaces have the widest distribution, concentrated around 1 million, and Retail spaces show a slightly more balanced distribution. Shop Houses however, shows a more concentrated distribution around 10 million.

(Change X axis to "Type of Area". Hover on Strata properties > Landed properties)

> Price over Type of Area shows Strata properties have a wider price distribution, concentrating at 1 million, while landed properties have a more concentrated distribution around 10 million, indicating more predictable pricing than strata.

(Hover the Shop Houses and Landed Properties)

> Investors looking for stability should consider Shop Houses and Landed properties.

(Hover Offices and Strata outliers in Raffles Place, Golden Mile, and Tanjong Pagar, before proceeding to the bar chart)

> For higher risk/high reward options, consider Offices and Strata properties in districts such as Raffles Place, Golden Mile, and Tanjong Pagar, which have notable outliers."

**5. Bar Chart Analysis (3:45 - 4:30):**

(Transition to the stacked bar chart)

> "The stacked bar chart visualizes transaction volumes.

(Hover on Raffles Place's Retail bar)

> The default view, Count of District Name grouped by Property Type, shows Raffles Place has very high transaction volumes for Retail, suggesting potential large malls or clusters.

(Hover on Pasir Panjang's retail)

> Pasir Panjang also has high percentage of transaction volumes for Retail, but with a very low overall transaction volume of only 36, supporting the claim that Pasir Panjang achieved high average price due to a large purchase.

(Change Xaxis to "Type of Area". Hover on Strata > Land volumes)

> The ‘Count of Type of Area grouped by Property Type’ view shows Strata properties have substantially higher transaction volumes than Land, indicating the Singapore commercial property market preference for Strata properties.

(Change Xaxis to 'District Name' and Group by to 'Tenure Type'. Hover on Leasehold properties)

> Count of District Name grouped by Tenure Type shows most transactions are for Leasehold properties.

(Change Group by to 'Type of Area'. Hover on Strata properties)

> Count of District Name grouped by Type of Area shows similar trends, with Strata dominating.

(Hover Raffles Place’s Leasehold Strata properties)

> Investors looking for high-volume retail transactions can target Raffles Place’s Leasehold Strata properties.

(Prepare to conclude)

> Pasir Panjang has very low transaction activity, but may be interesting for those wanting to target less popular districts, with the overall preference for Strata properties."

(Refresh page)

**6. Conclusion (4:30 - 5:00):**

(Hover Pasir Panjang and Raffles place on heatmap)

> "This dashboard identifies Pasir Panjang, and Raffles Place as key investment locations.

(Hover Pasir Panjang Offices and Shop Houses on heatmap)

> If you prioritize high-value properties (based on *Price per SQM*), consider Pasir Panjang Offices and other Shop Houses.

(Hover office spaces and landed properties)

> For more stable investments with predictable returns, explore office spaces and landed properties.

(Hover Raffles's Leasehold Strata Retail properties)

> If you are seeking higher transaction volumes, explore Raffles's Leasehold Strata Retail properties.

(Hover global controls, to encourage further exploration)

> Through this dashboard, you can delve deeper into these observations and explore other investment opportunities and insights. I encourage you to use the interactive features to customize your views and further refine your analysis. Thank you."

# concise

1.  **Introduction (0:00 - 0:45):**

> "Hi, I'm Wei Heng. This dashboard visualizes Singapore commercial property trends using D3, HTML, TailwindCSS, and Typescript. You can filter by time from October 2019 to 2024, price ranging from $120 thousand to $1.28 billion SGD, and area from 5 to 61 thousand square meters. The slider ticks show data distribution, indicating right-skewed distributions for price and area. Configurable axes and a 'Group By' filter further increases flexibility in our analysis. We'll analyze a heat map, time series graph, distribution chart, and stacked bar chart. Let's start with the heat map."

2.  **Heat Map Analysis (0:45 - 1:45):**

> "The heat map visualizes average transaction prices by district and property type. Offices in Pasir Panjang are a clear hotspot, averaging $53 million. Retails in Jurong and Choa Chu Kang also show high prices, averaging $32 to $45 million. The ‘Average Area’ configuration reveals that Pasir Panjang also has large office areas, possibly indicating large transactions that may be skewing the average. 

The ‘Price per SQM’ configuration shows that Raffles Place has high price per area for Shop Houses, possibly due to the central location. Surprisingly, Pasir Panjang also shows a low price per area, indicating that the large office purchase previously discussed may be a good deal. Therefore, investors seeking good value per area, can consider Shop Houses in Choa Chu Kang, Kranji, and Pasir Panjang Offices. Let's move to the time series graph."

3.  **Time Series Analysis (1:45 - 2:45):**

> "The time series chart tracks *Log scale of Price* over time, revealing a relatively consistent market with a gentle dip in mid-2020 due to the pandemic, followed by a slow recovery. The time series of the Log scale of Area also shows similar results, and the ‘Price over Area’ scatter plot configuration demonstrates that larger areas tend to fetch higher prices. 
Given that the current prices are lower than the 2022 peaks, this may be a good time to buy, and especially due to the stable price over time, this can mean minimal risk, but slower growth than other investment options”

4.  **Distribution Chart Analysis (2:45 - 3:45):**

The distribution chart visualizes price spreads by different factors. Price over Property Type shows that Office spaces have the widest distribution, concentrated around 1 million, and Retail spaces show a slightly more balanced distribution. Shop Houses however, shows a more concentrated distribution around 10 million.

Price over Type of Area shows Strata properties have a wider price distribution, concentrating at 1 million, while landed properties have a more concentrated distribution around 10 million, indicating more predictable pricing than strata. Investors looking for stability should consider Shop Houses and Landed properties. For higher risk/high reward options, consider Offices and Strata properties in districts such as Raffles Place, Golden Mile, and Tanjong Pagar, which have notable outliers.

5.  **Bar Chart Analysis (3:45 - 4:30):**

The stacked bar chart visualizes transaction volumes. The default view, Count of District Name grouped by Property Type, shows Raffles Place has very high transaction volumes for Retail, suggesting potential large malls or clusters. Pasir Panjang also has high percentage of transaction volumes for Retail, but with a very low overall transaction volume of only 36, supporting the claim that Pasir Panjang achieved high average price due to a large purchase. The ‘Count of Type of Area grouped by Property Type’ view shows Strata properties have substantially higher transaction volumes than Land, indicating the Singapore commercial property market preference for Strata properties. 

Count of District Name grouped by Tenure Type shows most transactions are for Leasehold properties. Count of District Name grouped by Type of Area shows similar trends, with Strata dominating. Investors looking for high-volume retail transactions can target Raffles Place’s Leasehold Strata properties. Pasir Panjang has very low transaction activity, but may be interesting for those wanting to target less popular districts, with the overall preference for Strata properties."

6.  **Conclusion (4:30 - 5:00):**

> "This dashboard identifies Pasir Panjang, and Raffles Place as key investment locations. If you prioritize high-value properties (based on *Price per SQM*), consider Pasir Panjang Offices and other Shop Houses. 

For more stable investments with predictable returns, explore office spaces and landed properties. If you are seeking higher transaction volumes, explore Raffles's Leasehold Strata Retail properties.  

Through this dashboard, you can delve deeper into these observations and explore other investment opportunities and insights. I encourage you to use the interactive features to customize your views and further refine your analysis. Thank you.

# full
1.  **Introduction (0:00 - 0:45):**

Hello, I'm Wei Heng, and today, we're taking a look at our Singapore Commercial Property Transaction dashboard, This interactive tool visualizes market trends from October 1st, 2019, to October 1st, 2024, and was built using D3.js for visualizations, combined with HTML, CSS, and JavaScript for interactivity and structure. The aim was to create a dynamic and informative tool for exploring commercial real estate data.

You can filter the data using a time selector, a price range from $120,000 to $1.28 billion, and area sizes between 5 and 61,511 square units, and the ticks within the sliders represent the actual distribution of the slider values, from which we know that our rangeable variables here are heavily right skewed. Additionally, the X and Y axes of each graph can be controlled for alternative views, and a 'Group By' filter is available for further analysis.

The dashboard is composed of four key visualizations: a heat map of average prices by district and property type, a time series graph showing price trends over the five-year period, a distribution chart displaying the spread of prices across different property types, and finally a bar chart showcasing transaction volumes by district and property type.

With that overview, let's begin by examining the insights from the heat map


2.  **Heat Map Analysis and Rubric Alignment (0:45 - 1:45):**
The heatmap displays the average transaction price for each district and property type. We can configure this view to focus on a variety of factors including price, price per sqm, area, and various category types. This allows us to find pockets of opportunity for investment.

Looking at the default view, which shows price, we see a clear hotspot in Pasir Panjang, with an average transaction value of 53 million for Office properties. Close behind are Jurong and Hillview in Choa Chu Kang, showing average values between 32 and 45 million for Retail. However, the rest of the chart displays relatively lower values, appearing predominantly purple. For investors seeking high-value transactions, I can suggest focusing on Offices in Pasir Panjang, or Retail in Jurong and Choa Chu Kang if those are the priorities.

Now, shifting to the Average Area configuration, the colors remain largely consistent, but it appears that Pasir Panjang has the largest average area for Office spaces. This, combined with the high average transaction value, suggests a potential outlier—perhaps a large organization acquiring a sizable office space significantly impacting the average.


This is further nuanced when we explore the Average Price Per SQM configuration. Here, we see a different trend: Shop Houses in Raffles Place command a high price per unit area, which is expected given the location's prestige. Surprisingly, Pasir Panjang also exhibits a good price-to-area ratio despite its high average transaction value. This tells us that the large organization in Pasir Panjang likely secured a good deal in terms of area. For investors interested in a great price-to-area ratio, I can suggest considering Shop Houses in Choa Chu Kang, Woodgrove in Kranji, and, surprisingly, Offices in Pasir Panjang due to its great value per unit area and good returns.

Based on these findings, particularly the Average Price Per SQM ratio and the large transaction in offices, Pasir Panjang emerges as an attractive investment option, especially for those focusing on value per unit area. Now, let's take a look at our time series chart.

3.  **Time Series Analysis and Rubric Alignment (1:45 - 2:45):**
Now, let's examine the time series graph, which tracks transaction prices over time from January 2020 to January 2024. This view allows us to identify trends and patterns that could inform our investment strategies.

On the default configuration, where the chart displays Price per SQM over Sale Date, we observe relative consistency in transaction prices, with a gentle dip around mid-2020, likely due to initial effects of the pandemic. 

What's also clear is that there is a relatively consistent band of values from the lowest price range to about $50k per SQM, with a small amount of outliers. The trend line is relatively flat, indicating the overall value per SQM is relatively constant over time for mid-tier values. 

Switching to the price over area configuration using a scatter plot shows us a general trend where large areas generally command higher prices, but this is not always a 1-to-1 correlation.

Based on these findings, particularly the relative consistency of value in the default view, and the trends in the price to area correlation, we can see that the market conditions for commercial real estate remains relatively constant. However, if we take into consideration the findings from the previous view, now may still be a good time to buy as overall transaction prices are relatively low, but investors should note that the value per unit area is relatively constant and the risk and returns in this market is relatively predictable.

4.  **Distribution Chart Analysis and Rubric Alignment (2:45 - 3:45):**

Let's move to the distribution chart, which visualizes the spread of transaction prices. This chart can be configured to show price distributions across different factors.

In the default view, which shows Price over Property Type, we can see that prices for office spaces tend to be concentrated around 1 million, and offices appear to have the widest distribution of values, with several outliers reaching beyond 1 billion. Retail spaces have a more spread-out distribution compared to office spaces, but less outliers than shop houses.

Looking at Price over Type of Area, we can see that the distribution of prices for Strata properties, which are similar to high rise building is quite wide, with high outliers reaching the maximum recorded value, while prices for landed property has a much more concentrated distribution.

Based on this, if an investor is looking for stable and predictable prices, focusing on office spaces or land seems like a safe option. On the other hand, investors seeking high-risk, high-reward options may find Shop Houses, Strata properties, or locations such as Pasir Panjang, Serangoon Garden, and Tanjong Pagar more appealing, given the presence of both high-value outliers and lower-priced options within these segments.


5.  **Bar Chart Analysis and Rubric Alignment (3:45 - 4:30):**

Finally, let's examine the bar chart, which shows the count of transactions grouped by various categories. This chart provides insights into market activity and concentration.

In its default view, where we examine the Count of District Name grouped by Property Type, it is immediately apparent that Serangoon Garden has significantly higher transaction volumes than other districts. Furthermore, we can see that the vast majority of activity in Serangoon Garden is for Retail. This suggests that the area has high market activity for retail spaces, and might be driven by a large mall or several retail clusters in the region. Other districts like Pasir Panjang, also have high overall transaction activity, but more evenly spread among the three property types.

When we look at the Count of Type of Area grouped by Property Type, it's evident that the transaction volume for Strata properties is substantially higher than Land properties. Within the Strata properties, retail and offices are the dominating property type, with a smaller volume of shop houses. This further reinforces the notion that the Singapore market favors strata property types.

Shifting our focus to Count of District Name grouped by Tenure Type, we can observe that the majority of transactions are Leasehold, with certain districts such as Serangoon Garden showing far more Leasehold transactions than Freehold. This might indicate that there are many new developments in that region that are of Leasehold status. Looking at Count of District Name grouped by Type of Area, we can see that the majority of transactions are Strata as well, with certain districts, such as Serangoon Garden having more Strata transactions than Land.

Based on these observations, if an investor seeks high-volume areas with a strong focus on retail, Serangoon Garden would be a good location, especially for investors focused on Leasehold or Strata properties. However, Pasir Panjang remains a good secondary option for investors seeking more diversified activity among the different property types. Investors who want to focus their investments on the most dominant type of property should focus on Strata, as it constitutes most of the transaction volumes.

6.  **Overall Dashboard Assessment & Conclusion (4:30 - 5:00):**

In summary, this dashboard provides a powerful tool for exploring Singapore's commercial property market. We've seen that areas like Pasir Panjang, Serangoon Garden, and Raffles Place are important areas to watch, and there are several nuances to consider depending on the specific configurations of the charts.

Based on our analysis, if you are seeking high value properties, then focusing on Pasir Panjang and Serangoon Garden for Offices and Shop Houses appears to be the most suitable, when looking at Average Price per SQM. However, if you are looking for a more stable investment that is not subject to as much fluctuation, then focusing on Offices or Land may be a good strategy. In addition, for investors seeking a high volume of transactions then focusing on Serangoon Garden is ideal for Leasehold Strata Retail properties.

Through this dashboard, you can delve deeper into these observations and explore other investment opportunities and insights. I encourage you to use the interactive features to customize your views and further refine your analysis. This data is designed to empower you to make informed decisions in this market. Feel free to contact me if you have any questions or require further assistance.
