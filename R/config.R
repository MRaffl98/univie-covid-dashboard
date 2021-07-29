# ===== LOAD PACKAGES ===== #
library(readr)
library(dplyr)
library(tidyr)
library(purrr)
library(devtools)
library(rjson)


# ===== PATHS ===== #
# folder
data_path <- "../data/"
# input
rawdata_file <- "owid-covid-data.csv"
geodata_file <- "world_countries.json"
# output
linedata_file <- "line_chart_data.csv"
mapdata_file <- "map_data.csv"
factdata_file <- "fact_fields_data.csv"


# ===== DEFINE ANALYSIS VARIABLES ===== #
identifier_variables <- c("location", "date")

infection_variables <- c("new_cases_smoothed_per_million",
                         "total_cases_per_million")

vaccination_variables <- c("new_vaccinations_smoothed_per_million",
                           "total_vaccinations_per_hundred")

death_variables <- c("new_deaths_smoothed_per_million",
                     "total_deaths_per_million")

#test_variables <- c("new_tests_smoothed_per_thousand",
#                    "total_tests_per_thousand")

risk_factor_variables <- c("hospital_beds_per_thousand",
                           "diabetes_prevalence",
                           "male_smokers",
                           "handwashing_facilities",
                           "cardiovasc_death_rate",
                           "female_smokers")

fact_variables <- c("population",
                    "gdp_per_capita",
                    "median_age",
                    "life_expectancy")

helper_variables <- c("population_density")

all_variables <- c(identifier_variables,
                   infection_variables,
                   vaccination_variables,
                   death_variables,
                   #test_variables,
                   risk_factor_variables,
                   fact_variables,
                   helper_variables)


# ===== COUNTRY MAPPING ===== #
country_dict <- list(
  # Antarctica,
  # French Southern and Antarctic Lands,
  "Bahamas" = "The Bahamas",
  "Cote d'Ivoire" = "Ivory Coast",
  "Democratic Republic of Congo" = "Democratic Republic of the Congo",
  "Congo" = "Republic of the Congo",
  "Czechia" = "Czech Republic",
  # "United Kingdom" = "England",
  "Guinea-Bissau" = "Guinea Bissau",
  "North Macedonia" = "Macedonia",
  # Puerto Rico,
  # North Korea,
  # Western Sahara,
  # Somaliland,
  "Serbia" = "Republic of Serbia",
  # Swaziland,
  # East Timor,
  "Tanzania" = "United Republic of Tanzania",
  "United States" = "USA"
  # "Palestine" = "West Bank"
)

country_dict_vec <- as.character(country_dict)
names(country_dict_vec) <- names(country_dict)

