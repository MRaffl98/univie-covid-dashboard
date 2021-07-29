# replace negative values with zeros
clean_negative_values <- function(data, variables) {

  data <- data %>% mutate_at(variables, function(x) if_else(x < 0, 0, x))
  return(data)

}

# replace implausible values for sudan (see: eda)
clean_sudan <- function(data) {

  data[data$location == "Sudan" & data$date == "2020-03-12", ]$new_cases_smoothed_per_million <- 0
  data[data$location == "Sudan" & data$date == "2020-03-12", ]$new_deaths_smoothed_per_million <- 0

  return(data)

}

# replace missing values in infection variables
clean_infection_variables <- function(data, variables) {

  data <- data %>% mutate_at(variables, function(x) replace_na(x, 0))
  return(data)

}

# replace missing values in vaccination variables (interpolation where possible)
clean_vaccination_variables <- function(data) {

  data <- data %>%
    arrange(location, date) %>%
    group_by(location) %>%
    fill(new_vaccinations_smoothed_per_million) %>%
    mutate(new_vaccinations_smoothed_per_million = replace_na(new_vaccinations_smoothed_per_million, 0)) %>%
    mutate(cumulative_vaccinations = cumsum(new_vaccinations_smoothed_per_million)) %>%
    mutate(total_vaccinations_per_hundred = if_else(is.na(total_vaccinations_per_hundred),
                                                    cumulative_vaccinations/10000,
                                                    total_vaccinations_per_hundred)) %>%
    select(-cumulative_vaccinations) %>%
    ungroup()

  return(data)

}

# replace missing values in death variables
clean_death_variables <- function(data, variables) {

  data <- data %>% mutate_at(variables, function(x) replace_na(x, 0))
  return(data)

}

# replace missing values in risk factor variables
clean_risk_factor_variables <- function(data, variables) {

  data <- data %>% mutate_at(variables, function(x) replace_na(x, 0))
  return(data)

}

# clean the constant variables for the fact fields
clean_fact_variables <- function(data, variables) {

  # create variable area from population and population density
  data$area <- data$population / (1000 * data$population_density)
  data$area <- round(data$area)

  # round gdp
  data$gdp_per_capita <- round(data$gdp_per_capita)

  # filter variables
  variables <- c(variables, "area")

  # numbers to strings and replace missing values by "unknown"
  data <- data %>%
    mutate_at(variables, as.character) %>%
    mutate_at(variables, function(x) replace_na(x, "unknown"))

  return(data)

}
