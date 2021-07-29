# returns the owidcovid data with harmonized/filtered country names
clean_country_names <- function(data, geodata, country_dict) {

  # only geodata countries are allowed at all
  allowed_countries <- get_countries_from_geodata(geodata)

  data <- data %>%
    # rename countries with different naming
    mutate(location = recode(location, !!!country_dict)) %>%
    # filter countries which are not contained in the geodata
    filter(location %in% c(allowed_countries, "World"))

  return(data)

}

# returns all country names from the owidcovid file
get_countries_from_data <- function(data) {

  return(unique(data$location))

}

# returns all country names from the geodata (json file)
get_countries_from_geodata <- function(geodata) {

  countries <- sapply(geodata[[2]], function(x) unname(x[[2]][[1]]))
  return(countries)

}
