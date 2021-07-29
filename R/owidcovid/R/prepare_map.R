prepare_map <- function(data, variables) {
  
  dataset <- data %>% select(location, date, all_of(variables))
  return(dataset)
  
}