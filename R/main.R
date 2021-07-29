source("config.R")
load_all("owidcovid")

# ===== READ IN DATA ===== #
data <- read_csv(paste0(data_path, rawdata_file))
geodata <- fromJSON(file = paste0(data_path, geodata_file))

# ===== CLEAN DATA ===== #
data <- data %>% select(all_variables)
data <- clean_country_names(data, geodata, country_dict_vec)
data <- clean_negative_values(data, c("new_cases_smoothed_per_million", "new_deaths_smoothed_per_million"))
data <- clean_sudan(data)
data <- clean_infection_variables(data, infection_variables)
data <- clean_vaccination_variables(data)
data <- clean_death_variables(data, death_variables)
# data <- clean_test_variables(data)
data <- clean_risk_factor_variables(data, risk_factor_variables)
data <- clean_fact_variables(data, fact_variables)

# ===== CREATE DATASETS ===== #
linedata <- prepare_line_chart(data, c(infection_variables,
                                       vaccination_variables,
                                       death_variables,
                                       risk_factor_variables))
mapdata <- prepare_map(data, c(infection_variables,
                               vaccination_variables,
                               death_variables,
                               risk_factor_variables))
factdata <- prepare_fact_fields(data, c(fact_variables, "area"))

# ===== EXPORT DATASETS ===== #
write.csv(linedata, paste0(data_path, linedata_file), na = "0",       row.names = FALSE)
write.csv(mapdata,  paste0(data_path, mapdata_file),  na = "0",       row.names = FALSE)
write.csv(factdata, paste0(data_path, factdata_file), na = "unknown", row.names = FALSE)
