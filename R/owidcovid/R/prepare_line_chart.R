prepare_line_chart <- function(data, time_variables) {

  # initialize list
  outputs <- list()

  # transpose data variable by variable
  for (variable in time_variables) {

    data_filtered <- data %>%
      select(location, date, variable) %>%
      arrange(date) %>%
      mutate(variable = as.character(variable))

    output <- data_filtered %>%
      pivot_wider(id_cols = all_of(c("location", "variable")), names_from = date, values_from = eval(variable))

    outputs[[length(outputs) + 1]] <- output

  }

  # reduce to final dataset
  dataset <- reduce(outputs, rbind)

  return(dataset)

}
